
import { createApiService } from './base.service'
import type { EmailTemplate } from '@/types/settings/emailTemplate'

/**
 * EmailTemplate-specific query params
 */
export interface EmailTemplateQueryParams {
    page?: number
    pageSize?: number
    search?: string
    is_active?: boolean
    recipient_type?: string
    sortBy?: 'name' | 'slug' | 'createdAt'
    sortOrder?: 'asc' | 'desc'
}

// Create the base emailTemplates API service
const emailTemplatesApiService = createApiService<EmailTemplate>('/email-templates')


/**
 * Extended EmailTemplates API with custom methods
 */
export const emailTemplatesApi = {
    // Base CRUD methods
    getAll: emailTemplatesApiService.getAll.bind(emailTemplatesApiService),
    getById: emailTemplatesApiService.getById.bind(emailTemplatesApiService),
    create: emailTemplatesApiService.create.bind(emailTemplatesApiService),
    update: emailTemplatesApiService.update.bind(emailTemplatesApiService),
    patch: emailTemplatesApiService.patch.bind(emailTemplatesApiService),
    delete: emailTemplatesApiService.delete.bind(emailTemplatesApiService),
}
