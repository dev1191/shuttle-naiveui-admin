
import { createApiService } from './base.service'
import type { Page, CreatePageDTO, UpdatePageDTO } from '@/types/settings/page'

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

// Create the base pages API service
const pagesApiService = createApiService<Page, CreatePageDTO, UpdatePageDTO>('/pages')


/**
 * Extended Drivers API with custom methods
 */
export const pagesApi = {
    // Base CRUD methods
    getAll: pagesApiService.getAll.bind(pagesApiService),
    getById: pagesApiService.getById.bind(pagesApiService),
    create: pagesApiService.create.bind(pagesApiService),
    update: pagesApiService.update.bind(pagesApiService),
    patch: pagesApiService.patch.bind(pagesApiService),
    delete: pagesApiService.delete.bind(pagesApiService),


}