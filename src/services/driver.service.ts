import { createApiService } from './base.service'
import type { Driver, CreateDriverDTO, UpdateDriverDTO } from '@/types/driver'

/**
 * Driver-specific query params
 */
export interface DriverQueryParams {
    page?: number
    pageSize?: number
    search?: string
    status?: 'active' | 'inactive' | 'suspended'
    vehicleType?: string
    sortBy?: 'firstName' | 'lastName' | 'email' | 'createdAt'
    sortOrder?: 'asc' | 'desc'
}

// Create the base drivers API service
const driversApiService = createApiService<Driver, CreateDriverDTO, UpdateDriverDTO>('/drivers')

/**
 * Extended Drivers API with custom methods
 */
export const driversApi = {
    // Base CRUD methods
    getAll: driversApiService.getAll.bind(driversApiService),
    getById: driversApiService.getById.bind(driversApiService),
    create: driversApiService.create.bind(driversApiService),
    update: driversApiService.update.bind(driversApiService),
    patch: driversApiService.patch.bind(driversApiService),
    delete: driversApiService.delete.bind(driversApiService),
    bulkDelete: driversApiService.bulkDelete.bind(driversApiService),
    customGet: driversApiService.customGet.bind(driversApiService),
    customPost: driversApiService.customPost.bind(driversApiService),

    /**
     * Get drivers by status
     */
    async getDriversByStatus(status: 'active' | 'inactive' | 'suspended') {
        return driversApiService.customGet<Driver[]>(`status/${status}`)
    },

    /**
     * Get drivers by vehicle type
     */
    async getDriversByVehicleType(vehicleType: string) {
        return driversApiService.customGet<Driver[]>(`vehicle-type/${vehicleType}`)
    },

    /**
     * Toggle driver status
     */
    async toggleStatus(driverId: string | number) {
        return driversApiService.customPost(`${driverId}/toggle-status`)
    },

    /**
     * Suspend driver
     */
    async suspendDriver(driverId: string | number, reason: string) {
        return driversApiService.customPost(`${driverId}/suspend`, { reason })
    },

    /**
     * Activate driver
     */
    async activateDriver(driverId: string | number) {
        return driversApiService.customPost(`${driverId}/activate`)
    },

    /**
     * Get driver statistics
     */
    async getStatistics() {
        return driversApiService.customGet('statistics')
    },
}
