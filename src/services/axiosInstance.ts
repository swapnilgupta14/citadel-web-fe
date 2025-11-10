import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { auth } from "../lib/storage/auth";
import { env } from "../config/env";

const isDevelopment = import.meta.env.DEV;

const getBaseURL = (): string => {
    if (isDevelopment && env.VITE_API_BASE_URL) {
        const url = env.VITE_API_BASE_URL.endsWith('/api')
            ? env.VITE_API_BASE_URL
            : `${env.VITE_API_BASE_URL}/api`;
        return url;
    }
    return "/api";
};

const baseURL = getBaseURL();

export const axiosInstance = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 30000,
});

axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = auth.getAccessToken();
        if (accessToken && config.headers) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

let isRefreshing = false;
let failedRequestsQueue: Array<{
    resolve: (value: string | null) => void;
    reject: (reason: unknown) => void;
}> = [];

const processQueue = (error: unknown = null, token: string | null = null) => {
    failedRequestsQueue.forEach(({ resolve, reject }) => {
        if (error) {
            reject(error);
        } else {
            resolve(token);
        }
    });
    failedRequestsQueue = [];
};

export const handleLogout = () => {
    console.log("Session expired. Logging out...");
    
    if (window.location.pathname !== "/connect") {
        auth.logout();
    }
};

const refreshAccessToken = async (): Promise<string | null> => {
    try {
        const response = await axios.post(
            `${baseURL}/v1/auth/refresh`,
            {},
            {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        if (response.data?.success && response.data?.tokens?.accessToken) {
            const newAccessToken = response.data.tokens.accessToken;
            const refreshToken = response.data.tokens.refreshToken || auth.getRefreshToken();

            if (refreshToken) {
                auth.setTokens(newAccessToken, refreshToken);
            }

            return newAccessToken;
        }

        return null;
    } catch (error) {
        console.error("Token refresh failed:", error);
        return null;
    }
};

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        if (!error.response && error.request) {
            const isCorsError = error.code === 'ERR_NETWORK' ||
                error.message?.includes('CORS') ||
                error.message?.includes('Network Error');

            if (isCorsError) {
                console.error('CORS or Network Error:', {
                    message: error.message,
                    code: error.code,
                    url: error.config?.url,
                    baseURL: error.config?.baseURL,
                });
                return Promise.reject(
                    new Error(
                        "CORS error: Unable to connect to the API. " +
                        "If using direct backend URL, ensure CORS is configured on the backend. " +
                        "Consider using Vercel rewrites (remove VITE_API_BASE_URL env var) to avoid CORS issues."
                    )
                );
            }
            console.error('Request Error:', {
                message: error.message,
                code: error.code,
                url: error.config?.url,
                baseURL: error.config?.baseURL,
            });
            return Promise.reject(new Error("Network error. Please check your connection."));
        }

        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            if (originalRequest?.url?.includes('/auth/refresh')) {
                handleLogout();
                return Promise.reject(error);
            }

            if (originalRequest._retry) {
                handleLogout();
                return Promise.reject(error);
            }

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedRequestsQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        if (originalRequest.headers) {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                        }
                        return axiosInstance(originalRequest);
                    })
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const newToken = await refreshAccessToken();

                if (newToken) {
                    if (originalRequest.headers) {
                        originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    }

                    processQueue(null, newToken);
                    return axiosInstance(originalRequest);
                } else {
                    processQueue(new Error("Token refresh failed"), null);
                    handleLogout();
                    return Promise.reject(new Error("Session expired. Please login again."));
                }
            } catch (refreshError) {
                processQueue(refreshError, null);
                handleLogout();
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        if (error.response) {
            const errorData = error.response.data as { message?: string } | undefined;
            return Promise.reject(
                new Error(
                    errorData?.message ||
                    error.response.statusText ||
                    "Request failed"
                )
            );
        }

        return Promise.reject(error);
    }
);

