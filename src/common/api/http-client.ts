import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse, type AxiosError } from 'axios';
import { useAuthStore } from '@/stores/auth';
import { createDiscreteApi } from 'naive-ui';

const { message } = createDiscreteApi(['message']);

// Define the structure of the refresh token response
interface RefreshTokenResponse {
    accessToken: string;
    refreshToken: string;
}

// Create Axios instance
const baseURL = import.meta.env.VITE_API_BASE_URL || '/api';

const httpClient: AxiosInstance = axios.create({
    baseURL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Flag to prevent multiple refresh token requests
let isRefreshing = false;
// Queue to store requests while token is refreshing
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
    failedQueue.forEach((prom) => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

// Request Interceptor
httpClient.interceptors.request.use(
    (config) => {
        const authStore = useAuthStore();
        const token = authStore.token;

        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor
httpClient.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
        const authStore = useAuthStore();

        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise(function (resolve, reject) {
                    failedQueue.push({ resolve, reject });
                })
                    .then((token) => {
                        if (originalRequest.headers) {
                            originalRequest.headers.Authorization = `Bearer ${token}`;
                        }
                        return httpClient(originalRequest);
                    })
                    .catch((err) => {
                        return Promise.reject(err);
                    });
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const refreshToken = authStore.refreshToken;
                const userEmail = authStore.user?.email;

                if (!refreshToken || !userEmail) {
                    throw new Error('No refresh token or email available');
                }

                // Call your refresh token API endpoint
                // Adjust the URL and payload structure as per your backend requirements
                const response = await axios.post<RefreshTokenResponse>(
                    `${baseURL}/auth/refresh-token`,
                    {
                        email: userEmail,
                        refreshToken: refreshToken
                    }
                );

                const { accessToken, refreshToken: newRefreshToken } = response.data;

                // Update store with new tokens
                authStore.setAuth({
                    token: accessToken,
                    refreshToken: newRefreshToken,
                    user: authStore.user! // Keep existing user data
                });

                // Process queue with new token
                processQueue(null, accessToken);

                // Retry original request
                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                }
                return httpClient(originalRequest);

            } catch (refreshError) {
                processQueue(refreshError, null);
                authStore.clearAuth();
                message.error('Session expired. Please login again.');
                // Optional: Redirect to login page
                // window.location.href = '/auth/sign-in'; 
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default httpClient;
