
export interface Booking {
    id: string;
    booking_id: string;
    customer_name: string;
    route_name: string;
    status: 'Scheduled' | 'OnBoarded' | 'Completed' | 'Canceled' | 'Expired';
    travel_date: string;
    seat_identifier: string;
    price: number;
    payment_status: string;
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
