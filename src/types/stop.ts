import type { Option } from ".";


export interface Stop {
    ids: string;
    title: string
    landmark: string
    address: string
    lat: number
    lng: number
    status: boolean
    location_address: string
    files: [string]
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
    landmark: string
    lat: number
    lng: number
    type?: string
    status: boolean
    files: [string]
}


export interface StopList {
    items: Option[]
}

export interface UpdateStopDTO {
    title: string
    landmark: string
    lat: number
    lng: number
    type?: string
    status: boolean
    files: [string]
}
