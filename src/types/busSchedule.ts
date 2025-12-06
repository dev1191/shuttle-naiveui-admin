import type { Option } from ".";


export interface BusSchedule {
    ids: string;
    every: [string]
    routeId: string
    busId: string
    stops: [object]
    status: boolean
    start_date: string
    end_date: string
}

export interface BusScheduleListData {
    items: BusSchedule[];
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

export interface BusScheduleStatus {
    status: boolean
}



export interface BusScheduleList {
    totalCount: number;
    items: Option[]
}
export interface StopDTO {
    stopId: string
    id: string
    stop_name: string
    departure_time?: number | null
    arrival_time?: number | null
}


export interface CreateBusScheduleDTO {
    every: [string]
    routeId: string
    busId: string
    stops: [StopDTO]
    status: boolean
    start_date: string
    end_date: string
}

export interface UpdateBusScheduleDTO {
    every: [string]
    routeId: string
    busId: string
    stops: [StopDTO]
    status: boolean
    start_date: string
    end_date: string
}
