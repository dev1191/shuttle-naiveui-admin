import { createApiService } from './base.service'
import httpClient from '@/common/api/http-client'
import axios, { type AxiosResponse } from 'axios'



// Create the base settings API service
const settingsApiService = createApiService<any>('/settings')


/**
 * Extended Settings API with custom methods
 */
export const settingsApi = {

    getById: settingsApiService.getById.bind(settingsApiService),

    /**
     * Update settings with FormData support for file uploads
     * Uses Axios's built-in toFormData utility
     */
    async update(id: string, data: any): Promise<any> {
        const formData = axios.toFormData(data)
        const response: AxiosResponse<any> = await httpClient.put(
            `/settings/${id}`,
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        )
        return response.data
    },
}