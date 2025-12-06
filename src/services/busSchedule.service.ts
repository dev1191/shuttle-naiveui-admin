import { createApiService } from './base.service'
import type { BusSchedule, CreateBusScheduleDTO, UpdateBusScheduleDTO } from '@/types/busSchedule'


/**
 * BusSchedule-specific query params
 */
export interface BusScheduleQueryParams {
    page?: number
    pageSize?: number
    search?: string
    status?: 'active' | 'inactive'
    sortBy?: 'title' | 'createdAt'
    sortOrder?: 'asc' | 'desc'
}

// Create the base busSchedules API service
const busSchedulesApiService = createApiService<BusSchedule, CreateBusScheduleDTO, UpdateBusScheduleDTO>('/bus-schedules')

/**
 * Extended BusSchedules API with custom methods
 */
export const busSchedulesApi = {
    // Base CRUD methods
    getAll: busSchedulesApiService.getAll.bind(busSchedulesApiService),
    getById: busSchedulesApiService.getById.bind(busSchedulesApiService),
    create: busSchedulesApiService.create.bind(busSchedulesApiService),
    update: busSchedulesApiService.update.bind(busSchedulesApiService),
    patch: busSchedulesApiService.patch.bind(busSchedulesApiService),
    delete: busSchedulesApiService.delete.bind(busSchedulesApiService),
    bulkDelete: busSchedulesApiService.bulkDelete.bind(busSchedulesApiService),
    customGet: busSchedulesApiService.customGet.bind(busSchedulesApiService),
    customPost: busSchedulesApiService.customPost.bind(busSchedulesApiService),


    /**
     * Toggle busSchedule status
     */
    async toggleStatus(busScheduleId: string | number, status: boolean) {
        return busSchedulesApiService.patch(`${busScheduleId}/status`, { status })
    },
}
