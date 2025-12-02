import type { Permission } from "./role";

export interface Admin {
    ids: string
    fullname?: string;
    firstname: string
    lastname: string
    email: string
    phone: string
    role: string
    country_code: string;
    password?: string;
    confirmPassword?: string;
    permissions?: Permission[]
    picture?: string
    address_1?: string | null
    address_2?: string | null
    city?: string | null
    contact_no?: string | null
    pincode?: string | null
    company?: string
    commission?: number
    document_gst_certificate?: string
    document_pan_card?: string
    is_active: boolean
    createdAt?: string
    updatedAt?: string
}

export enum AdminStatus {
    Active = true,
    Inactive = false,
}

export interface CreateAdminDTO {
    fullname?: string;
    firstname: string
    lastname: string
    email: string
    phone: string
    role: string
    country_code: string;
    password?: string;
    confirmPassword?: string;
    permissions?: Permission[]
    picture?: string
    address_1?: string | null
    address_2?: string | null
    city?: string | null
    contact_no?: string | null
    pincode?: string | null
    company?: string
    commission?: number
    document_gst_certificate?: string
    document_pan_card?: string
    is_active?: string | boolean
}

export interface UpdateAdminDTO {
    fullname?: string;
    firstname: string
    lastname: string
    email: string
    phone: string
    role: string
    country_code: string;
    password?: string;
    confirmPassword?: string;
    permissions?: Permission[]
    picture?: string
    address_1?: string | null
    address_2?: string | null
    city?: string | null
    contact_no?: string | null
    pincode?: string | null
    company?: string
    commission?: number
    document_gst_certificate?: string
    document_pan_card?: string
    is_active?: string | boolean
}
