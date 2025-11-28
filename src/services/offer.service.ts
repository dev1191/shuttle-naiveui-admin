
import { createApiService } from './base.service'
import type { Offer, CreateOfferDTO, UpdateOfferDTO } from '@/types/offer'

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

// Create the base offers API service
const offersApiService = createApiService<Offer, CreateOfferDTO, UpdateOfferDTO>('/offers')


/**
 * Extended Drivers API with custom methods
 */
export const offersApi = {
    // Base CRUD methods
    getAll: offersApiService.getAll.bind(offersApiService),
    getById: offersApiService.getById.bind(offersApiService),
    create: offersApiService.create.bind(offersApiService),
    update: offersApiService.update.bind(offersApiService),
    patch: offersApiService.patch.bind(offersApiService),
    delete: offersApiService.delete.bind(offersApiService),


}