import type { Option } from ".."


export interface BusLayout {
    ids: string
    name: string
    status: boolean
    max_seats: string
    seat_lists: SeatList[]
    rows: number
    columns: number
    steering: string
}

export interface SeatList {
    id: number
    name: string
    isFemale: boolean
    isSeat: boolean
    isGap?: boolean          // Column position
    deck?: number            // 1: Lower, 2: Upper
    row?: number
    col?: number
}

export interface BusLayoutListData {
    items: BusLayout[];
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

export interface BusLayoutList {
    totalCount: number;
    items: Option[]
}

export interface BusLayoutStatus {
    status: boolean;
}

export interface CreateBusLayoutDTO {
    name: string
    status: boolean
    max_seats: string
    seat_lists: SeatList[]
    rows: number
    columns: number
    steering: string
}

export interface UpdateBusLayoutDTO {
    name: string
    status: boolean
    max_seats: string
    seat_lists: SeatList[]
    rows: number
    columns: number
    steering: string
}
