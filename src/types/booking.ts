
export interface Booking {
    id: string;
    pnr_no: string;
    customer_name: string;
    customer_email: string;
    customer_avatar: string;
    route_name: string;
    travel_status: 'SCHEDULED' | 'ONBOARDED' | 'COMPLETED' | 'CANCELED' | 'EXPIRED';
    drop_date: string;
    drop_time: string;
    seat_nos: string;
    sub_total: string;
    tax: string;
    final_total_fare: number;
    payment_status: 'Pending' |
    'Completed' |
    'Processing' |
    'Failed' |
    'Refunded' |
    'Cancelled';
    boarding_point: string;
    dropping_point: string;
    createdAt: string;
}

export interface BookingListData {
    items: Booking[];
    totalRecords: number;
    limit: number;
    page: number;
    totalPages: number;
}

export interface CreateBookingDTO {
    route_id: string;
    customer_id: string;
    travel_date: string;
    seats: string[];
}

export interface UpdateBookingDTO {
    status?: string;
}
