
import { createApiService } from './../base.service'
import type { Bus, CreateBusDTO, UpdateBusDTO, BusList } from '@/types/buses/index'

/**
 * Bus-specific query params
 */
export interface BusQueryParams {
    page?: number
    pageSize?: number
    search?: string
    status?: boolean
    sortBy?: 'name' | 'code' | 'createdAt'
    sortOrder?: 'asc' | 'desc'
}

// Create the base buss API service
const bussApiService = createApiService<Bus, CreateBusDTO, UpdateBusDTO>('/buses')


/**
 * Extended Buss API with custom methods
 */
export const bussApi = {
    // Base CRUD methods
    getAll: bussApiService.getAll.bind(bussApiService),
    getById: bussApiService.getById.bind(bussApiService),
    create: bussApiService.create.bind(bussApiService),
    update: bussApiService.update.bind(bussApiService),
    patch: bussApiService.patch.bind(bussApiService),
    delete: bussApiService.delete.bind(bussApiService),

    /**
       * Get bus list for dropdown
       */
    async busLists(search: string) {
        return bussApiService.customGet<BusList>(`load`, { search })
    },

}