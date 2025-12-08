import type { Option } from "..";


export interface Bus {
    ids: string;
    adminId?: string;
    vendor_name?: string;
    name: string;
    reg_no: string;
    brand: string;
    model_no: string;
    chassis_no: string;
    bustypeId: string;
    buslayoutId: string;
    amenities: string[];           // Fixed array syntax
    status: 'Active' | 'OnRoute' | 'Idle' | 'Maintance' | 'Breakdown' | 'Inactive';
    picture: string[];             // Fixed array syntax
    max_seats?: number;            // Added for convenience
    certificate_registration: string;
    certificate_pollution: string;
    certificate_insurance: string;
    certificate_fitness: string;
    certificate_permit: string;
}

export type BusDocument = {
    ids: string;
    picture: string[];
    certificate_registration: string;
    certificate_pollution: string;
    certificate_insurance: string;
    certificate_fitness: string;
    certificate_permit: string;
}

export interface BusListData {
    items: Bus[];
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

export interface BusStatus {
    status: 'Active' | 'OnRoute' | 'Idle' | 'Maintance' | 'Breakdown' | 'Inactive';
}

export interface BusList {
    totalCount: number;
    items: Option[]
}

export interface CreateBusDTO {
    adminId?: string;
    vendor_name?: string;
    name: string;
    reg_no: string;
    brand: string;
    model_no: string;
    chassis_no: string;
    bustypeId: string;
    buslayoutId: string;
    amenities: string[];
    status: 'Active' | 'OnRoute' | 'Idle' | 'Maintance' | 'Breakdown' | 'Inactive';
    picture: string[];
    max_seats?: number;
    certificate_registration: string;
    certificate_pollution: string;
    certificate_insurance: string;
    certificate_fitness: string;
    certificate_permit: string;
}

export interface UpdateBusDTO {
    adminId?: string;
    vendor_name?: string;
    name?: string;
    reg_no?: string;
    brand?: string;
    model_no?: string;
    chassis_no?: string;
    bustypeId?: string;
    buslayoutId?: string;
    amenities?: string[];
    status?: 'Active' | 'OnRoute' | 'Idle' | 'Maintance' | 'Breakdown' | 'Inactive';
    picture?: string[];
    max_seats?: number;
    certificate_registration?: string;
    certificate_pollution?: string;
    certificate_insurance?: string;
    certificate_fitness?: string;
    certificate_permit?: string;
}
