

export interface BusLayout {
    ids: string;
    adminId?: string;
    name: string;              // e.g., "2x2 Standard Layout"
    status: boolean;
    max_seats: number;         // Changed from string
    rows: number;
    columns: number;
    steering: 'left' | 'right'; // Steering position
    seatLists: SeatList[];     // Changed from [SeatList] to SeatList[]
}

export interface SeatList {
    id: number;
    name: string;              // e.g., "A1", "B2"
    isFemale: boolean;         // Reserved for female passengers
    isSeat: boolean;           // true = seat, false = aisle/gap
    row?: number;              // Row position
    column?: number;           // Column position
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

export interface BusLayoutStatus {
    status: boolean;
}

export interface CreateBusLayoutDTO {
    adminId?: string;
    name: string;
    status: boolean;
    max_seats: number;
    rows: number;
    columns: number;
    steering: 'left' | 'right';
    seatLists: SeatList[];
}

export interface UpdateBusLayoutDTO {
    adminId?: string;
    name?: string;
    status?: boolean;
    max_seats?: number;
    rows?: number;
    columns?: number;
    steering?: 'left' | 'right';
    seatLists?: SeatList[];
}
