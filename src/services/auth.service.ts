import httpClient from '@/common/api/http-client';
import type { User } from '@/types';

export interface LoginRequest {
    email: string;
    password: string;
}

export interface LoginResponse {
    accessToken: string;
    refreshToken: string;
    user: User;
}

export const authApi = {
    /**
     * Login user with email and password
     */
    async login(credentials: LoginRequest): Promise<LoginResponse> {
        const response = await httpClient.post<LoginResponse>('/auth/login', credentials);
        return response.data;
    },

    /**
     * Logout user
     */
    async logout(): Promise<void> {
        await httpClient.post('/auth/logout');
    },

    /**
     * Refresh access token
     */
    async refreshToken(email: string, refreshToken: string): Promise<LoginResponse> {
        const response = await httpClient.post<LoginResponse>('/auth/refresh-token', {
            email,
            refreshToken,
        });
        return response.data;
    },

    async access() {
        const response = await httpClient.get('/auth/access');
        return response.data;
    }
};
