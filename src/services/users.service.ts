import { createApiService } from './base.service';
import type { User } from '@/types';

/**
 * User creation DTO
 */
export interface CreateUserDTO {
    name: string;
    email: string;
    password: string;
    role: string;
    roleId: string;
}

/**
 * User update DTO
 */
export interface UpdateUserDTO {
    name?: string;
    email?: string;
    role?: string;
    roleId?: string;
    password?: string;
}

/**
 * User-specific query params
 */
export interface UserQueryParams {
    page?: number;
    pageSize?: number;
    search?: string;
    role?: string;
    sortBy?: 'name' | 'email' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
}

// Create the base users API service
const usersApiService = createApiService<User, CreateUserDTO, UpdateUserDTO>('/users');

/**
 * Extended Users API with custom methods
 */
export const usersApi = {
    // Inherit all CRUD methods
    ...usersApiService,

    /**
     * Get users by role
     */
    async getUsersByRole(role: string) {
        return usersApiService.customGet<User[]>(`role/${role}`);
    },

    /**
     * Change user password
     */
    async changePassword(userId: string | number, oldPassword: string, newPassword: string) {
        return usersApiService.customPost(`${userId}/change-password`, {
            oldPassword,
            newPassword,
        });
    },

    /**
     * Reset user password (admin only)
     */
    async resetPassword(userId: string | number) {
        return usersApiService.customPost(`${userId}/reset-password`);
    },

    /**
     * Toggle user active status
     */
    async toggleStatus(userId: string | number) {
        return usersApiService.customPost(`${userId}/toggle-status`);
    },

    /**
     * Get user statistics
     */
    async getStatistics() {
        return usersApiService.customGet('statistics');
    },
};
