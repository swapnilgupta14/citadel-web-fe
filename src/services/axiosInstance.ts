import axios from "axios";
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

axiosInstance.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
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
        } else if (error.response) {
            return Promise.reject(
                new Error(
                    error.response.data?.message ||
                    error.response.statusText ||
                    "Request failed"
                )
            );
        } else {
            return Promise.reject(error);
        }
    }
);

