import { createApiService } from './base.service'
import httpClient from '@/common/api/http-client'
import type { Role, CreateRoleDTO, UpdateRoleDTO } from '@/types/role'

/**
 * Role-specific query params
 */
export interface RoleQueryParams {
    page?: number
    pageSize?: number
    search?: string
    status?: boolean
    sortBy?: 'name' | 'code' | 'createdAt'
    sortOrder?: 'asc' | 'desc'
}

// Create the base roles API service
const rolesApiService = createApiService<Role, CreateRoleDTO, UpdateRoleDTO>('/roles')


/**
 * Extended Roles API with custom methods
 */
export const rolesApi = {
    // Base CRUD methods
    getAll: rolesApiService.getAll.bind(rolesApiService),
    getById: rolesApiService.getById.bind(rolesApiService),
    create: rolesApiService.create.bind(rolesApiService),
    update: rolesApiService.update.bind(rolesApiService),
    patch: rolesApiService.patch.bind(rolesApiService),
    delete: rolesApiService.delete.bind(rolesApiService),

    /**
     * Get all available permissions
     */
    async getPermissions() {
        const response = await httpClient.get<string[]>('/permissions')
        return response.data
    }
}