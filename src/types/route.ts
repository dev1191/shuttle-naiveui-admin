import type { Option } from ".";


export interface Stop {
    ids: string;
    title: string
    stops: [CreateStopDTO]
    status: boolean
}

export interface StopListData {
    items: Stop[];
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

export interface StopStatus {
    status: boolean
}



export interface StopList {
    totalCount: number;
    items: Option[]
}

export interface CreateStopDTO {
    title: string
    stops: [CreateStopDTO]
    status: boolean
}

export interface UpdateStopDTO {
    title: string
    stops: [CreateStopDTO]
    status: boolean
}
