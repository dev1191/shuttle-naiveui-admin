
import { createApiService } from './../base.service'
import type { BusType, CreateBusTypeDTO, UpdateBusTypeDTO } from '@/types/buses/busType'

/**
 * BusType-specific query params
 */
export interface BusTypeQueryParams {
    page?: number
    pageSize?: number
    search?: string
    status?: boolean
    sortBy?: 'name' | 'code' | 'createdAt'
    sortOrder?: 'asc' | 'desc'
}

// Create the base bustypes API service
const bustypesApiService = createApiService<BusType, CreateBusTypeDTO, UpdateBusTypeDTO>('/bustypes')


/**
 * Extended BusTypes API with custom methods
 */
export const bustypesApi = {
    // Base CRUD methods
    getAll: bustypesApiService.getAll.bind(bustypesApiService),
    getById: bustypesApiService.getById.bind(bustypesApiService),
    create: bustypesApiService.create.bind(bustypesApiService),
    update: bustypesApiService.update.bind(bustypesApiService),
    patch: bustypesApiService.patch.bind(bustypesApiService),
    delete: bustypesApiService.delete.bind(bustypesApiService),


}