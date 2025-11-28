import { createApiService } from './base.service'
import type { Admin, CreateAdminDTO, UpdateAdminDTO } from '@/types/admin'

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
    create: adminsApiService.create.bind(adminsApiService),
    update: adminsApiService.update.bind(adminsApiService),
    patch: adminsApiService.patch.bind(adminsApiService),
    delete: adminsApiService.delete.bind(adminsApiService),
    bulkDelete: adminsApiService.bulkDelete.bind(adminsApiService),


}
