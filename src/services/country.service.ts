import { createApiService } from './base.service'
import type { Country, CreateCountryDTO, UpdateCountryDTO, CountryList } from '@/types/settings/country'

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

// Create the base countries API service
const countriesApiService = createApiService<Country, CreateCountryDTO, UpdateCountryDTO>('/countries')


/**
 * Extended Drivers API with custom methods
 */
export const countriesApi = {
    // Base CRUD methods
    getAll: countriesApiService.getAll.bind(countriesApiService),
    getById: countriesApiService.getById.bind(countriesApiService),
    create: countriesApiService.create.bind(countriesApiService),
    update: countriesApiService.update.bind(countriesApiService),
    patch: countriesApiService.patch.bind(countriesApiService),
    delete: countriesApiService.delete.bind(countriesApiService),

    /**
     * Get country list for dropdown
     */
    async countryLists(search: string) {
        return countriesApiService.customGet<CountryList>(`load`, { search })
    },
}