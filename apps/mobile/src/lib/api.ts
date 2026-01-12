import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import Constants from 'expo-constants';
import { getTokens, saveTokens, clearTokens } from './secureStorage';

// API base URL - configure in app.json extra field or use default
const API_BASE_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3001';

/**
 * Axios instance for API communication
 */
export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 10000,
});

// Track if we're currently refreshing to prevent infinite loops
let isRefreshing = false;
let refreshPromise: Promise<string | null> | null = null;

/**
 * Request interceptor - attach access token
 */
api.interceptors.request.use(
    async (config: InternalAxiosRequestConfig) => {
        const tokens = await getTokens();
        if (tokens?.accessToken) {
            config.headers.Authorization = `Bearer ${tokens.accessToken}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

/**
 * Response interceptor - handle 401 and token refresh
 */
api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config;

        // Only handle 401 errors
        if (error.response?.status !== 401 || !originalRequest) {
            return Promise.reject(error);
        }

        // Prevent infinite retry loops
        if ((originalRequest as any)._retry) {
            return Promise.reject(error);
        }

        // Mark request as retried
        (originalRequest as any)._retry = true;

        try {
            // If already refreshing, wait for that to complete
            if (isRefreshing) {
                const newToken = await refreshPromise;
                if (newToken) {
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                    return api(originalRequest);
                }
                return Promise.reject(error);
            }

            // Start refresh process
            isRefreshing = true;
            refreshPromise = refreshAccessToken();

            const newAccessToken = await refreshPromise;

            if (newAccessToken) {
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(originalRequest);
            }

            // Refresh failed - clear everything
            await handleAuthFailure();
            return Promise.reject(error);
        } catch (refreshError) {
            await handleAuthFailure();
            return Promise.reject(refreshError);
        } finally {
            isRefreshing = false;
            refreshPromise = null;
        }
    }
);

/**
 * Attempt to refresh the access token
 * Returns new access token or null on failure
 */
async function refreshAccessToken(): Promise<string | null> {
    try {
        const tokens = await getTokens();
        if (!tokens?.refreshToken) {
            return null;
        }

        // Use a fresh axios instance to avoid interceptors
        const response = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {
            refreshToken: tokens.refreshToken,
        });

        if (response.data.success && response.data.data?.tokens) {
            const { accessToken, refreshToken } = response.data.data.tokens;
            await saveTokens(accessToken, refreshToken);
            return accessToken;
        }

        return null;
    } catch {
        return null;
    }
}

/**
 * Handle unrecoverable auth failure
 * Clears tokens - store reset handled by auth store
 */
async function handleAuthFailure(): Promise<void> {
    await clearTokens();
    // Auth store will detect this on next operation
}

// Store reference for auth failure callback
let onAuthFailureCallback: (() => void) | null = null;

/**
 * Set callback for auth failure (called by auth store)
 */
export function setOnAuthFailure(callback: () => void): void {
    onAuthFailureCallback = callback;
}

export default api;
