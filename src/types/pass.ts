export interface Pass {
    ids: string;
    no_of_rides: string;
    no_of_valid_days: string;
    price_per_km: string;
    discount: string;
    terms: string;
    description: string;
    status: boolean;
}

export interface PassListData {
    items: Pass[];
    totalRecords: number;
    limit: number;
    page: number;
    totalPages: number;
    pagingCounter: number;
    hasPrevPage?: boolean;
    hasNextPage?: boolean;
    prevPage?: string;
    nextPage?: number;
}

export interface PassStatus {
    status: boolean;
}

export interface CreatePassDTO {
    no_of_rides: string;
    no_of_valid_days: string;
    price_per_km: string;
    discount: string;
    terms: string;
    description: string;
    status: boolean;
}

export interface UpdatePassDTO {
    ids: string;
    no_of_rides: string;
    no_of_valid_days: string;
    price_per_km: string;
    discount: string;
    terms: string;
    description: string;
    status: boolean;
}
