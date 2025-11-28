import { createApiService } from './base.service'
import type { Suggestion, } from '@/types/suggestion'

/**
 * Suggestion-specific query params
 */
export interface SuggestionQueryParams {
    page?: number
    pageSize?: number
    search?: string
    sortBy?: 'pickup_address' | 'drop_address' | 'createdAt'
    sortOrder?: 'asc' | 'desc'
}

// Create the base suggestions API service
const suggestionsApiService = createApiService<Suggestion>('/suggestions')


/**
 * Extended Suggestions API with custom methods
 */
export const suggestionsApi = {
    // Base CRUD methods
    getAll: suggestionsApiService.getAll.bind(suggestionsApiService),

}