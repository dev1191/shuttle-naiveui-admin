import { createApiService } from './base.service'
import type { Customer, } from '@/types/customer'

/**
 * Customer-specific query params
 */
export interface CustomerQueryParams {
    page?: number
    pageSize?: number
    search?: string
    status?: 'active' | 'inactive' | 'suspended'
    sortBy?: 'firstName' | 'lastName' | 'email' | 'createdAt'
    sortOrder?: 'asc' | 'desc'
}

// Create the base referrals API service
const referralsApiService = createApiService<Customer>('/referrals')


/**
 * Extended Referrals API with custom methods
 */
export const referralsApi = {
    // Base CRUD methods
    getAll: referralsApiService.getAll.bind(referralsApiService),

}