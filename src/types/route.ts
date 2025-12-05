import type { Option } from ".";


export interface Route {
    ids: string;
    title: string
    stops: [CreateRouteDTO]
    status: boolean
    createdAt?: string
}

export interface RouteListData {
    items: Route[];
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

export interface RouteStatus {
    status: boolean
}



export interface RouteList {
    totalCount: number;
    items: Option[]
}


export interface CreateStopDTO {
    stopId: string
    id: string
    order: number
    stop_name: string
    address: string
    coordinates: [number, number]
    minimum_fare_pickup: number
    minimum_fare_drop: number
    price_per_km_drop: number;
    price_per_km_pickup: number
}
export interface CreateRouteDTO {
    title: string
    stops: [CreateStopDTO]
    status: boolean
}

export interface UpdateRouteDTO {
    title: string
    stops: [CreateStopDTO]
    status: boolean
}
