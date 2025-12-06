import { createApiService } from './base.service'
import type { Stop, CreateStopDTO, UpdateStopDTO, StopList } from '@/types/stop'


/**
 * Stop-specific query params
 */
export interface StopQueryParams {
    page?: number
    pageSize?: number
    search?: string
    status?: 'active' | 'inactive'
    sortBy?: 'title' | 'createdAt'
    sortOrder?: 'asc' | 'desc'
}

// Create the base stops API service
const stopsApiService = createApiService<Stop, CreateStopDTO, UpdateStopDTO>('/stops')

/**
 * Extended Stops API with custom methods
 */
export const stopsApi = {
    // Base CRUD methods
    getAll: stopsApiService.getAll.bind(stopsApiService),
    getById: stopsApiService.getById.bind(stopsApiService),
    create: stopsApiService.create.bind(stopsApiService),
    update: stopsApiService.update.bind(stopsApiService),
    patch: stopsApiService.patch.bind(stopsApiService),
    delete: stopsApiService.delete.bind(stopsApiService),
    bulkDelete: stopsApiService.bulkDelete.bind(stopsApiService),
    customGet: stopsApiService.customGet.bind(stopsApiService),
    customPost: stopsApiService.customPost.bind(stopsApiService),


    /**
     * Toggle stop status
     */
    async toggleStatus(stopId: string | number, status: boolean) {
        return stopsApiService.patch(`${stopId}/status`, { status })
    },

    /**
       * Get stop list for dropdown
       */
    async stopLists(search: string) {
        return stopsApiService.customGet<StopList>(`load`, { search })
    },
}
