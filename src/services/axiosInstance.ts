import axios from "axios";
import { env } from "../config/env";

const isDevelopment = import.meta.env.DEV;

// In production, use /api if VITE_API_BASE_URL is not set (Vercel deployment with rewrites)
// Otherwise use the configured API base URL
const baseURL = isDevelopment
    ? "/api"
    : env.VITE_API_BASE_URL && env.VITE_API_BASE_URL !== "http://localhost:8000/api"
        ? (env.VITE_API_BASE_URL.endsWith("/api")
            ? env.VITE_API_BASE_URL
            : `${env.VITE_API_BASE_URL}/api`)
        : "/api"; // Use /api for Vercel deployment (handled by rewrites)

export const axiosInstance = axios.create({
    baseURL,
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 30000,
});

axiosInstance.interceptors.request.use(
    (config) => {
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
        if (error.response) {
            return Promise.reject(
                new Error(
                    error.response.data?.message ||
                    error.response.statusText ||
                    "Request failed"
                )
            );
        } else if (error.request) {
            return Promise.reject(new Error("Network error. Please check your connection."));
        } else {
            return Promise.reject(error);
        }
    }
);

