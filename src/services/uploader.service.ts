import httpClient from '@/common/api/http-client'
import axios, { type AxiosResponse } from 'axios'

/**
 * Response from file upload
 */
export interface UploadResponse {
    url: string
    filename: string
    size: number
    mimetype: string
}

/**
 * Response from multiple file uploads
 */
export interface MultipleUploadResponse {
    files: UploadResponse[]
}

/**
 * Uploader API Service
 * Handles file uploads to the server
 */
export const uploaderApi = {
    /**
     * Upload a single file
     * @param file - File to upload
     * @param folder - Optional folder path (e.g., 'profiles', 'stops', 'buses')
     * @returns Upload response with file URL
     */
    async uploadSingle(file: File, folder?: string): Promise<UploadResponse> {
        const formData = new FormData()
        formData.append('file', file)

        if (folder) {
            formData.append('folder', folder)
        }

        const response: AxiosResponse<UploadResponse> = await httpClient.post(
            '/uploader',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        )
        return response.data
    },

    /**
     * Upload multiple files
     * @param files - Array of files to upload
     * @param folder - Optional folder path
     * @returns Array of upload responses
     */
    async uploadMultiple(files: File[], folder?: string): Promise<MultipleUploadResponse> {
        const formData = new FormData()

        files.forEach(file => {
            formData.append('files', file)
        })

        if (folder) {
            formData.append('folder', folder)
        }

        const response: AxiosResponse<MultipleUploadResponse> = await httpClient.post(
            '/uploader',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        )
        return response.data
    },

    /**
     * Upload an image with optional resizing
     * @param file - Image file to upload
     * @param options - Upload options
     * @returns Upload response with file URL
     */
    async uploadImage(
        file: File,
        options?: {
            folder?: string
            maxWidth?: number
            maxHeight?: number
            quality?: number
        }
    ): Promise<UploadResponse> {
        const formData = new FormData()
        formData.append('file', file)

        if (options?.folder) {
            formData.append('folder', options.folder)
        }
        if (options?.maxWidth) {
            formData.append('maxWidth', options.maxWidth.toString())
        }
        if (options?.maxHeight) {
            formData.append('maxHeight', options.maxHeight.toString())
        }
        if (options?.quality) {
            formData.append('quality', options.quality.toString())
        }

        const response: AxiosResponse<UploadResponse> = await httpClient.post(
            '/uploader',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        )
        return response.data
    },

    /**
     * Delete a file by URL
     * @param url - File URL to delete
     */
    async deleteFile(url: string): Promise<void> {
        await httpClient.delete('/uploader/file', {
            data: { url }
        })
    },

    /**
     * Delete multiple files by URLs
     * @param urls - Array of file URLs to delete
     */
    async deleteFiles(urls: string[]): Promise<void> {
        await httpClient.delete('/uploader/files', {
            data: { urls }
        })
    },

    /**
     * Get file info by URL
     * @param url - File URL
     * @returns File information
     */
    async getFileInfo(url: string): Promise<UploadResponse> {
        const response: AxiosResponse<UploadResponse> = await httpClient.get('/uploader/info', {
            params: { url }
        })
        return response.data
    }
}
