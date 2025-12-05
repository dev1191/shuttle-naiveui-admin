import { createApiService } from './base.service'
import type { Stop, CreateStopDTO, UpdateStopDTO } from '@/types/stop'
import httpClient from '@/common/api/http-client'
import axios, { type AxiosResponse } from 'axios'

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
    delete: stopsApiService.delete.bind(stopsApiService),
    bulkDelete: stopsApiService.bulkDelete.bind(stopsApiService),
    customGet: stopsApiService.customGet.bind(stopsApiService),
    customPost: stopsApiService.customPost.bind(stopsApiService),

    /**
     * Create a new stop with FormData support for file uploads
     * Uses Axios's built-in toFormData utility
     */
    async create(data: CreateStopDTO): Promise<Stop> {
        const formData = axios.toFormData(data)
        const response: AxiosResponse<Stop> = await httpClient.post(
            '/stops',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        )
        return response.data
    },

    /**
     * Update an existing stop with FormData support for file uploads
     * Uses Axios's built-in toFormData utility
     */
    async update(id: string | number, data: UpdateStopDTO): Promise<Stop> {
        const formData = axios.toFormData(data)
        const response: AxiosResponse<Stop> = await httpClient.put(
            `/stops/${id}`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        )
        return response.data
    },

    /**
     * Partially update a stop with FormData support for file uploads
     * Uses Axios's built-in toFormData utility
     */
    async patch(id: string | number, data: Partial<UpdateStopDTO>): Promise<Stop> {
        const formData = axios.toFormData(data)
        const response: AxiosResponse<Stop> = await httpClient.patch(
            `/stops/${id}`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        )
        return response.data
    },

    /**
     * Toggle stop status
     */
    async toggleStatus(stopId: string | number) {
        return stopsApiService.customPost(`${stopId}/toggle-status`)
    },
}
