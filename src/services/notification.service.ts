
import { createApiService } from './base.service'
import type { Notification, CreateNotificationDTO, UpdateNotificationDTO } from '@/types/notification'

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

// Create the base notifications API service
const notificationsApiService = createApiService<Notification, CreateNotificationDTO, UpdateNotificationDTO>('/notifications')


/**
 * Extended Drivers API with custom methods
 */
export const notificationsApi = {
    // Base CRUD methods
    getAll: notificationsApiService.getAll.bind(notificationsApiService),
    getById: notificationsApiService.getById.bind(notificationsApiService),
    create: notificationsApiService.create.bind(notificationsApiService),
    update: notificationsApiService.update.bind(notificationsApiService),
    patch: notificationsApiService.patch.bind(notificationsApiService),
    delete: notificationsApiService.delete.bind(notificationsApiService),


}