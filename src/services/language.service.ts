
import { createApiService } from './base.service'
import type { Language, CreateLanguageDTO, UpdateLanguageDTO } from '@/types/settings/language'

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

// Create the base languagess API service
const languagesApiService = createApiService<Language, CreateLanguageDTO, UpdateLanguageDTO>('/languages')


/**
 * Extended Drivers API with custom methods
 */
export const languagesApi = {
    // Base CRUD methods
    getAll: languagesApiService.getAll.bind(languagesApiService),
    getById: languagesApiService.getById.bind(languagesApiService),
    create: languagesApiService.create.bind(languagesApiService),
    update: languagesApiService.update.bind(languagesApiService),
    patch: languagesApiService.patch.bind(languagesApiService),
    delete: languagesApiService.delete.bind(languagesApiService),


}