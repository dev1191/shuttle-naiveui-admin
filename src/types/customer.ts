export interface Customer {
    ids: string
    picture: string
    fullname: string
    firstName: string
    lastName: string
    email: string
    country_code: string
    phone: string
    dateOfBirth: number | null
    address: string
    city: string
    state: string
    zipCode: string
    licenseNumber: string
    licenseExpiry: number | null
    licenseClass: string
    vehicleType: string
    status: CustomerStatus
    createdAt?: string
    updatedAt?: string
}

export enum CustomerStatus {
    Active = true,
    Inactive = false,
}

export interface CreateCustomerDTO {
    firstName: string
    lastName: string
    email: string
    phone: string
    dateOfBirth: number | null
    address: string
    city: string
    state: string
    zipCode: string
    licenseNumber: string
    licenseExpiry: number | null
    licenseClass: string
    vehicleType: string
}

export interface UpdateCustomerDTO {
    firstName?: string
    lastName?: string
    email?: string
    phone?: string
    dateOfBirth?: number | null
    address?: string
    city?: string
    state?: string
    zipCode?: string
    licenseNumber?: string
    licenseExpiry?: number | null
    licenseClass?: string
    vehicleType?: string
    status?: 'active' | 'inactive' | 'suspended'
}
