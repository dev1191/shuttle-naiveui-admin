import { createApiService } from "./../base.service";
import type {
  BusLayout,
  CreateBusLayoutDTO,
  UpdateBusLayoutDTO,
  BusLayoutList,
} from "@/types/buses/busLayout";

/**
 * BusLayout-specific query params
 */
export interface BusLayoutQueryParams {
  page?: number;
  pageSize?: number;
  search?: string;
  status?: boolean;
  sortBy?: "name" | "code" | "createdAt";
  sortOrder?: "asc" | "desc";
}

// Create the base busLayouts API service
const busLayoutsApiService = createApiService<
  BusLayout,
  CreateBusLayoutDTO,
  UpdateBusLayoutDTO
>("/busLayouts");

/**
 * Extended busLayouts API with custom methods
 */
export const busLayoutsApi = {
  // Base CRUD methods
  getAll: busLayoutsApiService.getAll.bind(busLayoutsApiService),
  getById: busLayoutsApiService.getById.bind(busLayoutsApiService),
  create: busLayoutsApiService.create.bind(busLayoutsApiService),
  update: busLayoutsApiService.update.bind(busLayoutsApiService),
  patch: busLayoutsApiService.patch.bind(busLayoutsApiService),
  delete: busLayoutsApiService.delete.bind(busLayoutsApiService),

  /**
   * Get bus layout list for dropdown
   */
  async busLayoutLists(search: string) {
    return busLayoutsApiService.customGet<BusLayoutList>(`load`, { search });
  },
};
