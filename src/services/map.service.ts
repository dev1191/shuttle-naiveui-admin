

import { createApiService } from './base.service'



// Create the base languagess API service
const mapsApiService = createApiService<any>('/maps')


/**
 * Extended Maps API with custom methods
 */
export const mapsApi = {

    async getDriverData(search: string, duty_status: string) {
        return mapsApiService.customGet<any>(`/data`, {
            search, duty_status
        })
    },

}