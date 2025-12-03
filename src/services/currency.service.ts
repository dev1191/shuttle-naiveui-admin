
import { createApiService } from './base.service'
import type { Currency, CreateCurrencyDTO, UpdateCurrencyDTO } from '@/types/settings/currency'

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

// Create the base currenciess API service
const currenciesApiService = createApiService<Currency, CreateCurrencyDTO, UpdateCurrencyDTO>('/currencies')


/**
 * Extended Drivers API with custom methods
 */
export const currenciesApi = {
    // Base CRUD methods
    getAll: currenciesApiService.getAll.bind(currenciesApiService),
    getById: currenciesApiService.getById.bind(currenciesApiService),
    create: currenciesApiService.create.bind(currenciesApiService),
    update: currenciesApiService.update.bind(currenciesApiService),
    patch: currenciesApiService.patch.bind(currenciesApiService),
    delete: currenciesApiService.delete.bind(currenciesApiService),


    /**
     * Get currency list for dropdown
     */
    async currencyLists(search: string) {
        return currenciesApiService.customGet<CurrencyList>(`load`, { search })
    },

}