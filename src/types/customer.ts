export interface Customer {
    ids: string
    picture: string
    fullname: string
    firstname: string
    lastname: string
    email: string
    country_code: string
    phone: string
    wallet_balance: number | string
    address: string
    city: string
    state: string
    zipCode: string
    gender: string
    licenseExpiry: number | null
    licenseClass: string
    vehicleType: string
    status: CustomerStatus
    createdAt?: string
    updatedAt?: string
}

export enum CustomerStatus {
    Active = 'Active',
    Inactive = 'Inactive',
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
