import httpClient from "@/common/api/http-client";
import type { AxiosResponse } from "axios";
import type { Customer } from "@/types/customer";

/**
 * Generic API response with pagination
 */
export interface PaginatedResponse<T> {
    items: T[];
    totalRecords: number;
    page: number;
    limit: number;
    totalPages: number;
    customer?: Customer;
}

/**
 * Query parameters for list/pagination
 */
export interface QueryParams {
    page?: number;
    limit?: number;
    search?: string;
    sortBy?: string;
    sortOrder?: "asc" | "desc";
    [key: string]: any;
}

/**
 * Generic CRUD API Service
 * @template T - The entity type
 * @template CreateDTO - Data transfer object for creating entity
 * @template UpdateDTO - Data transfer object for updating entity
 */
export class ApiService<T, CreateDTO = Partial<T>, UpdateDTO = Partial<T>> {
    private endpoint: string;

    constructor(endpoint: string) {
        this.endpoint = endpoint;
    }

    /**
     * Get all items with optional pagination and filters
     */
    async getAll(params?: QueryParams): Promise<PaginatedResponse<T>> {
        const response: AxiosResponse<PaginatedResponse<T>> = await httpClient.get(
            this.endpoint,
            { params }
        );
        return response.data;
    }

    /**
     * Get a single item by ID
     */
    async getById(id: string | number): Promise<T> {
        const response: AxiosResponse<T> = await httpClient.get(
            `${this.endpoint}/${id}`
        );
        return response.data;
    }

    /**
     * Create a new item
     */
    async create(data: CreateDTO): Promise<T> {
        const response: AxiosResponse<T> = await httpClient.post(
            this.endpoint,
            data
        );
        return response.data;
    }

    /**
     * Update an existing item
     */
    async update(id: string | number, data: UpdateDTO): Promise<T> {
        const response: AxiosResponse<T> = await httpClient.put(
            `${this.endpoint}/${id}`,
            data
        );
        return response.data;
    }

    /**
     * Partially update an existing item
     */
    async patch(id: string | number, data: Partial<UpdateDTO>): Promise<T> {
        const response: AxiosResponse<T> = await httpClient.patch(
            `${this.endpoint}/${id}`,
            data
        );
        return response.data;
    }

    /**
     * Delete an item
     */
    async delete(
        id: string | number
    ): Promise<{ status: boolean; message: string }> {
        const response: AxiosResponse<{ status: boolean; message: string }> =
            await httpClient.delete(`${this.endpoint}/${id}`);
        return response.data;
    }

    /**
     * Bulk delete items
     */
    async bulkDelete(ids: (string | number)[]): Promise<void> {
        await httpClient.post(`${this.endpoint}/bulk-delete`, { ids });
    }

    /**
     * Custom GET request to a specific path
     */
    async customGet<R = any>(path: string, params?: any): Promise<R> {
        const response: AxiosResponse<R> = await httpClient.get(
            `${this.endpoint}/${path}`,
            { params }
        );
        return response.data;
    }

    /**
     * Custom POST request to a specific path
     */
    async customPost<R = any>(path: string, data?: any): Promise<R> {
        const response: AxiosResponse<R> = await httpClient.post(
            `${this.endpoint}/${path}`,
            data
        );
        return response.data;
    }
}

/**
 * Factory function to create API service instances
 */
export function createApiService<
    T,
    CreateDTO = Partial<T>,
    UpdateDTO = Partial<T>
>(endpoint: string): ApiService<T, CreateDTO, UpdateDTO> {
    return new ApiService<T, CreateDTO, UpdateDTO>(endpoint);
}
