// src/services/api.js — Centralized Axios client with interceptors.
// All API calls should use this client for automatic auth, error handling, and token refresh.

import axios from 'axios';
import { logout } from './authService';

const api = axios.create({
    baseURL: `${(import.meta.env.VITE_API_BASE_URL || '').trim().replace(/\/$/, '')}/api`,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
});

// ── Request Interceptor: auto-attach Bearer token ──
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// ── Response Interceptor: centralized error handling + token refresh ──
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(({ resolve, reject }) => {
        if (error) {
            reject(error);
        } else {
            resolve(token);
        }
    });
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If 401 and we haven't already retried this request
        if (error.response?.status === 401 && !originalRequest._retry) {
            // Don't try to refresh if the failing request IS the refresh or login call
            if (originalRequest.url?.includes('/v1/token/')) {
                return Promise.reject(error);
            }

            if (isRefreshing) {
                // Queue this request until the refresh completes
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then((token) => {
                    originalRequest.headers.Authorization = `Bearer ${token}`;
                    return api(originalRequest);
                });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshToken = localStorage.getItem('refresh_token');
                if (!refreshToken) {
                    throw new Error('No refresh token available');
                }

                // Call refresh endpoint directly with axios (not the api instance) to avoid interceptor loop
                const { data } = await axios.post(
                    `${api.defaults.baseURL}/v1/token/refresh/`,
                    { refresh: refreshToken },
                    { headers: { 'Content-Type': 'application/json' } }
                );

                const newAccessToken = data.access;
                localStorage.setItem('access_token', newAccessToken);

                // If backend also rotates the refresh token
                if (data.refresh) {
                    localStorage.setItem('refresh_token', data.refresh);
                }

                processQueue(null, newAccessToken);

                // Retry the original request with the new token
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                // Refresh failed — use shared logout to clear tokens and redirect
                logout();
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        // For all other errors, parse the backend message
        const message =
            error.response?.data?.message ||
            error.response?.data?.detail ||
            error.message ||
            'Something went wrong';

        return Promise.reject(new Error(message));
    }
);

export default api;
