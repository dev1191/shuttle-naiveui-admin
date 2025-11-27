import { createApiService } from './base.service'
import type { Customer, CreateCustomerDTO, UpdateCustomerDTO } from '@/types/customer'

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

// Create the base customers API service
const customersApiService = createApiService<Customer, CreateCustomerDTO, UpdateCustomerDTO>('/users')

const walletApiService = createApiService<any>('/wallets')
/**
 * Extended Customers API with custom methods
 */
export const customersApi = {
    // Base CRUD methods
    getAll: customersApiService.getAll.bind(customersApiService),
    getById: customersApiService.getById.bind(customersApiService),
    create: customersApiService.create.bind(customersApiService),
    update: customersApiService.update.bind(customersApiService),
    patch: customersApiService.patch.bind(customersApiService),
    delete: customersApiService.delete.bind(customersApiService),
    bulkDelete: customersApiService.bulkDelete.bind(customersApiService),

    walletHistory: async (customerId: string, params?: any) => {
        const walletHistoryService = createApiService<any>(`/users/${customerId}/wallet-histories`)
        return walletHistoryService.getAll(params)
    },
    rechargeWallet: walletApiService.create.bind(walletApiService),
}
