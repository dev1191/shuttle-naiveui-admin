

export interface BusType {
    ids: string;
    name: string;              // e.g., "Mini Bus", "Standard Coach", "Luxury Bus"
    capacity_range?: string;   // e.g., "15-25 seats"
    description?: string;      // e.g., "Compact shuttle for city routes"
    status: boolean;
}

export interface BusTypeListData {
    items: BusType[];
    totalRecords: number;
    limit: number;
    page: number;
    totalPages: number;
    pagingCounter: number;
    hasPrevPage?: boolean;
    hasNextPage?: boolean;
    prevPage?: string;
    nextPage?: number

}

export interface BusTypeList {
    totalCount: number;
    items: Option[]
}

export interface BusTypeStatus {
    status: boolean
}

export interface CreateBusTypeDTO {
    name: string;
    capacity_range?: string;
    description?: string;
    status: boolean;
}

export interface UpdateBusTypeDTO {
    name?: string;
    capacity_range?: string;
    description?: string;
    status?: boolean;
}
