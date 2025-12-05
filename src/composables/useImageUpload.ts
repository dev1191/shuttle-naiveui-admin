import { ref } from 'vue'
import type { UploadFileInfo } from 'naive-ui'
import { uploaderApi } from '@/services/uploader.service'
import { useMessage } from 'naive-ui'

/**
 * Composable for handling image uploads in forms
 * Manages file list state and provides utilities for form submission
 */
export function useImageUpload(options?: {
    folder?: string
    maxWidth?: number
    maxHeight?: number
    quality?: number
    autoUpload?: boolean
}) {
    const fileList = ref<UploadFileInfo[]>([])
    const uploading = ref(false)
    const message = useMessage()

    /**
     * Handle upload change event
     */
    const handleUploadChange = (data: { fileList: UploadFileInfo[] }) => {
        fileList.value = data.fileList

        // Auto upload if enabled
        if (options?.autoUpload) {
            const newFiles = data.fileList.filter(f => f.file && f.status === 'pending')
            if (newFiles.length > 0) {
                uploadFiles(newFiles.map(f => f.file!))
            }
        }
    }

    /**
     * Upload files to server
     * @param files - Files to upload
     * @returns Array of uploaded file URLs
     */
    const uploadFiles = async (files: File[]): Promise<string[]> => {
        if (files.length === 0) return []

        uploading.value = true
        try {
            const uploadedUrls: string[] = []

            for (const file of files) {
                try {
                    const response = await uploaderApi.uploadImage(file, {
                        folder: options?.folder,
                        maxWidth: options?.maxWidth,
                        maxHeight: options?.maxHeight,
                        quality: options?.quality
                    })
                    uploadedUrls.push(response.url)

                    // Update file list with uploaded URL
                    const fileIndex = fileList.value.findIndex(f => f.file === file)
                    if (fileIndex !== -1) {
                        fileList.value[fileIndex] = {
                            ...fileList.value[fileIndex],
                            status: 'finished',
                            url: response.url
                        }
                    }
                } catch (error) {
                    console.error('Failed to upload file:', error)
                    message.error(`Failed to upload ${file.name}`)

                    // Mark file as error
                    const fileIndex = fileList.value.findIndex(f => f.file === file)
                    if (fileIndex !== -1) {
                        fileList.value[fileIndex] = {
                            ...fileList.value[fileIndex],
                            status: 'error'
                        }
                    }
                }
            }

            if (uploadedUrls.length > 0) {
                message.success(`Successfully uploaded ${uploadedUrls.length} file(s)`)
            }

            return uploadedUrls
        } finally {
            uploading.value = false
        }
    }

    /**
     * Load existing files from URLs (for edit mode)
     * @param urls - Array of image URLs
     */
    const loadExistingFiles = (urls: string[] | undefined) => {
        if (!urls || !Array.isArray(urls)) {
            fileList.value = []
            return
        }

        fileList.value = urls.map((url: string, index: number) => ({
            id: String(index),
            name: `Image ${index + 1}`,
            status: 'finished' as const,
            url: url
        }))
    }

    /**
     * Get files for form submission
     * Returns File objects for new uploads and URLs for existing files
     * @param isUpdate - Whether this is an update operation
     * @returns Array of File objects or URLs
     */
    const getFilesForSubmit = (isUpdate: boolean = false): (File | string)[] => {
        // Get new files (File objects)
        const newFiles = fileList.value
            .filter(f => f.file)
            .map(f => f.file as File)

        if (!isUpdate) {
            // For create, only return new files
            return newFiles
        }

        // For update, return new files + existing URLs
        if (newFiles.length > 0) {
            return newFiles
        }

        // If no new files, return existing URLs
        if (fileList.value.length === 0) {
            return []
        }

        return fileList.value
            .map(f => f.url)
            .filter(Boolean) as string[]
    }

    /**
     * Get only uploaded URLs (finished files)
     * @returns Array of URLs
     */
    const getUploadedUrls = (): string[] => {
        return fileList.value
            .filter(f => f.status === 'finished' && f.url)
            .map(f => f.url!)
    }

    /**
     * Delete a file from server and remove from list
     * @param url - File URL to delete
     */
    const deleteFile = async (url: string) => {
        try {
            await uploaderApi.deleteFile(url)
            fileList.value = fileList.value.filter(f => f.url !== url)
            message.success('File deleted successfully')
        } catch (error) {
            console.error('Failed to delete file:', error)
            message.error('Failed to delete file')
        }
    }

    /**
     * Clear all files
     */
    const clearFiles = () => {
        fileList.value = []
    }

    /**
     * Check if there are any files
     */
    const hasFiles = () => {
        return fileList.value.length > 0
    }

    /**
     * Get count of files
     */
    const getFileCount = () => {
        return fileList.value.length
    }

    /**
     * Check if currently uploading
     */
    const isUploading = () => {
        return uploading.value
    }

    return {
        fileList,
        uploading,
        handleUploadChange,
        uploadFiles,
        loadExistingFiles,
        getFilesForSubmit,
        getUploadedUrls,
        deleteFile,
        clearFiles,
        hasFiles,
        getFileCount,
        isUploading
    }
}
