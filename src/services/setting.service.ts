import { createApiService } from './base.service'



// Create the base languagess API service
const settingsApiService = createApiService<any>('/settings')


/**
 * Extended Settings API with custom methods
 */
export const settingsApi = {

    getById: settingsApiService.getById.bind(settingsApiService),
}