import { createApiService } from './base.service';
import type { Operator, CreateOperatorDTO, UpdateOperatorDTO } from '@/types';



/**
 * operator-specific query params
 */
export interface operatorQueryParams {
    page?: number;
    pageSize?: number;
    search?: string;
    role?: string;
    sortBy?: 'name' | 'email' | 'createdAt';
    sortOrder?: 'asc' | 'desc';
}

// Create the base operators API service
const operatorsApiService = createApiService<Operator, CreateOperatorDTO, UpdateOperatorDTO>('/operators');

/**
 * Extended operators API with custom methods
 */
export const operatorsApi = {
    // Inherit all CRUD methods
    getAll: operatorsApiService.getAll.bind(operatorsApiService),
    getById: operatorsApiService.getById.bind(operatorsApiService),
    create: operatorsApiService.create.bind(operatorsApiService),
    update: operatorsApiService.update.bind(operatorsApiService),
    patch: operatorsApiService.patch.bind(operatorsApiService),
    delete: operatorsApiService.delete.bind(operatorsApiService),
    bulkDelete: operatorsApiService.bulkDelete.bind(operatorsApiService),



    /**
     * Change operator password
     */
    async changePassword(operatorId: string | number, oldPassword: string, newPassword: string) {
        return operatorsApiService.customPost(`${operatorId}/change-password`, {
            oldPassword,
            newPassword,
        });
    },

    /**
     * Reset operator password (admin only)
     */
    async resetPassword(operatorId: string | number) {
        return operatorsApiService.customPost(`${operatorId}/reset-password`);
    },

    /**
     * Toggle operator active status
     */
    async toggleStatus(operatorId: string | number) {
        return operatorsApiService.customPost(`${operatorId}/toggle-status`);
    },

    /**
     * Get operator statistics
     */
    async getStatistics() {
        return operatorsApiService.customGet('statistics');
    },
};
