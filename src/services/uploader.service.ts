import httpClient from '@/common/api/http-client'
import { type AxiosResponse } from 'axios'

/**
 * Response from file upload
 */
export interface UploadResponse {
    url: string
    filename?: string
    size?: number
    mimetype?: string
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

        const response = await httpClient.post(
            '/uploader',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        )
        // Map API response data (string, url) to UploadResponse
        const responseData = response.data as any
        return {
            url: responseData.data
        }
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
            onProgress?: (progress: number) => void
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

        const response = await httpClient.post(
            '/uploader',
            formData,
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                onUploadProgress: (progressEvent) => {
                    if (options?.onProgress && progressEvent.total) {
                        const progress = (progressEvent.loaded / progressEvent.total) * 100
                        options.onProgress(progress)
                    }
                }
            }
        )
        // Map API response data (string, url) to UploadResponse
        const responseData = response.data as any
        return {
            url: responseData.data
        }
    },

    /**
     * Delete a file by URL
     * @param url - File URL to delete
     */
    async deleteFile(url: string): Promise<void> {
        await httpClient.delete('/uploader', {
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
