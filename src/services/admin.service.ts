import { createApiService } from './base.service'
import type { Admin, CreateAdminDTO, UpdateAdminDTO } from '@/types/admin'
import httpClient from '@/common/api/http-client'
import axios, { type AxiosResponse } from 'axios'

/**
 * Admin-specific query params
 */
export interface AdminQueryParams {
    page?: number
    pageSize?: number
    search?: string
    status?: 'active' | 'inactive' | 'suspended'
    sortBy?: 'firstName' | 'lastName' | 'email' | 'createdAt'
    sortOrder?: 'asc' | 'desc'
}

// Create the base admins API service
const adminsApiService = createApiService<Admin, CreateAdminDTO, UpdateAdminDTO>('/admins')


/**
 * Extended Admins API with custom methods
 */
export const adminsApi = {
    // Base CRUD methods
    getAll: adminsApiService.getAll.bind(adminsApiService),
    getById: adminsApiService.getById.bind(adminsApiService),
    delete: adminsApiService.delete.bind(adminsApiService),
    bulkDelete: adminsApiService.bulkDelete.bind(adminsApiService),

    /**
     * Create a new admin with FormData support for file uploads
     * Uses Axios's built-in toFormData utility
     */
    async create(data: CreateAdminDTO): Promise<Admin> {
        const formData = axios.toFormData(data)
        const response: AxiosResponse<Admin> = await httpClient.post(
            '/admins',
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
     * Update an existing admin with FormData support for file uploads
     * Uses Axios's built-in toFormData utility
     */
    async update(id: string | number, data: UpdateAdminDTO): Promise<Admin> {
        const formData = axios.toFormData(data)
        const response: AxiosResponse<Admin> = await httpClient.put(
            `/admins/${id}`,
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
     * Partially update an admin with FormData support for file uploads
     * Uses Axios's built-in toFormData utility
     */
    async patch(id: string | number, data: Partial<UpdateAdminDTO>): Promise<Admin> {
        const formData = axios.toFormData(data)
        const response: AxiosResponse<Admin> = await httpClient.patch(
            `/admins/${id}`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        )
        return response.data
    }
}
