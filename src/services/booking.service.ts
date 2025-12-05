import { createApiService } from './base.service'
import type { Booking, CreateBookingDTO, UpdateBookingDTO } from '@/types/booking'

export interface BookingQueryParams {
    page?: number
    pageSize?: number
    search?: string
    status?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
}

const bookingsApiService = createApiService<Booking, CreateBookingDTO, UpdateBookingDTO>('/bookings')

export const bookingsApi = {
    getAll: bookingsApiService.getAll.bind(bookingsApiService),
    getById: bookingsApiService.getById.bind(bookingsApiService),
    create: bookingsApiService.create.bind(bookingsApiService),
    update: bookingsApiService.update.bind(bookingsApiService),
    patch: bookingsApiService.patch.bind(bookingsApiService),
    delete: bookingsApiService.delete.bind(bookingsApiService),

    // Helper to get bookings by status
    getByStatus: (status: string, params: any) => {
        return bookingsApiService.getAll({ ...params, status })
    }
}
