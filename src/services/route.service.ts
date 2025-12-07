import { createApiService } from './base.service'
import type { Route, CreateRouteDTO, UpdateRouteDTO, RouteList } from '@/types/route'


/**
 * Route-specific query params
 */
export interface RouteQueryParams {
    page?: number
    pageSize?: number
    search?: string
    status?: 'active' | 'inactive'
    sortBy?: 'title' | 'createdAt'
    sortOrder?: 'asc' | 'desc'
}

// Create the base routes API service
const routesApiService = createApiService<Route, CreateRouteDTO, UpdateRouteDTO>('/routes')

/**
 * Extended Routes API with custom methods
 */
export const routesApi = {
    // Base CRUD methods
    getAll: routesApiService.getAll.bind(routesApiService),
    getById: routesApiService.getById.bind(routesApiService),
    create: routesApiService.create.bind(routesApiService),
    update: routesApiService.update.bind(routesApiService),
    patch: routesApiService.patch.bind(routesApiService),
    delete: routesApiService.delete.bind(routesApiService),
    bulkDelete: routesApiService.bulkDelete.bind(routesApiService),
    customGet: routesApiService.customGet.bind(routesApiService),
    customPost: routesApiService.customPost.bind(routesApiService),


    /**
     * Toggle route status
     */
    async toggleStatus(routeId: string | number, status: boolean) {
        return routesApiService.patch(`${routeId}/status`, { status })
    },

    /**
        * Get route list for dropdown
        */
    async routeLists(search: string) {
        return routesApiService.customGet<RouteList>(`load`, { search })
    },
}
