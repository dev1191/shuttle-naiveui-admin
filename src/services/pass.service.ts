
import { createApiService } from './base.service'
import type { Pass, CreatePassDTO, UpdatePassDTO } from '@/types/pass'

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

// Create the base passs API service
const passsApiService = createApiService<Pass, CreatePassDTO, UpdatePassDTO>('/passes')


/**
 * Extended Drivers API with custom methods
 */
export const passsApi = {
    // Base CRUD methods
    getAll: passsApiService.getAll.bind(passsApiService),
    getById: passsApiService.getById.bind(passsApiService),
    create: passsApiService.create.bind(passsApiService),
    update: passsApiService.update.bind(passsApiService),
    patch: passsApiService.patch.bind(passsApiService),
    delete: passsApiService.delete.bind(passsApiService),


}