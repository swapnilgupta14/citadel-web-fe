import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { auth } from "../lib/storage/auth";

const isDevelopment = import.meta.env.DEV;

const getBaseURL = (): string => {

    if (isDevelopment) {
        return "/api";
    }
    return "/api";
};

const baseURL = getBaseURL();

export const axiosInstance = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 15000,
});

axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = auth.getAccessToken();
        if (accessToken && config.headers) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        if (config.data instanceof FormData && config.headers) {
            delete config.headers["Content-Type"];
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
    if (window.location.pathname !== "/connect") {
        auth.logout();
        window.location.replace("/connect");
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
    } catch {
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
                return Promise.reject(
                    new Error(
                        "CORS error: Unable to connect to the API. " +
                        "If using direct backend URL, ensure CORS is configured on the backend. " +
                        "Consider using Vercel rewrites (remove VITE_API_BASE_URL env var) to avoid CORS issues."
                    )
                );
            }
            return Promise.reject(new Error("Timeout error. Please try again."));
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
            const errorData = error.response.data as {
                message?: string;
                errors?: Record<string, { message?: string; kind?: string }>;
            } | undefined;

            if (errorData?.errors) {
                const validationErrors = Object.entries(errorData.errors)
                    .map(([field, error]) => {
                        const errorMsg = error?.message || `${field} validation failed`;
                        return `${field}: ${errorMsg}`;
                    })
                    .join(", ");

                return Promise.reject(
                    new Error(
                        validationErrors ||
                        errorData?.message ||
                        error.response.statusText ||
                        "Validation failed"
                    )
                );
            }

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

