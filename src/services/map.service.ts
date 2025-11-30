
import { createApiService } from './base.service'
import { useAuthStore } from '@/stores/auth'

// Create the base maps API service
const mapsApiService = createApiService<any>('/maps')

/**
 * Extended Maps API with custom methods
 */
export const mapsApi = {
    /**
     * Get driver data via REST API
     */
    async getDriverData(duty_status: string, search: string) {
        return mapsApiService.customGet<any>(`data`, {
            search, duty_status
        })
    },

    /**
     * Get SSE stream URL for live tracking
     * Note: EventSource doesn't support custom headers, so we pass the token as a query parameter
     * @param duty_status - Driver duty status filter (ONLINE, TRACKING, OFFLINE)
     * @param search - Search query for driver name
     * @returns Full SSE endpoint URL with authentication token
     */
    getStreamUrl(search: string = ''): string {
        const baseUrl = import.meta.env.VITE_API_PROXY_URL || 'http://localhost:3000';
        const authStore = useAuthStore();

        const params = new URLSearchParams({
            ...(search && { search }),
            // Add auth token to query params since EventSource doesn't support headers
            ...(authStore.token && { token: authStore.token })
        });

        return `${baseUrl}/maps/stream?${params.toString()}`;
    },
}