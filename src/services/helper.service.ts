
import { createApiService } from './base.service'
import type { Helper, } from '@/types/helper'

/**
 * Driver-specific query params
 */
export interface DriverQueryParams {
    page?: number
    pageSize?: number
    search?: string
    status?: boolean
    sortBy?: 'name' | 'code' | 'createdAt'
    sortOrder?: 'asc' | 'desc'
}

// Create the base helpers API service
const helpersApiService = createApiService<Helper>('/helpers')


/**
 * Extended Drivers API with custom methods
 */
export const helpersApi = {
    // Base CRUD methods
    getAll: helpersApiService.getAll.bind(helpersApiService),
    getById: helpersApiService.getById.bind(helpersApiService),
    update: helpersApiService.update.bind(helpersApiService),
    patch: helpersApiService.patch.bind(helpersApiService),
    delete: helpersApiService.delete.bind(helpersApiService),


}