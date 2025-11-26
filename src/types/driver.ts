export interface Driver {
    _id: string
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
    status: DriverStatus
    createdAt?: string
    updatedAt?: string
}

export enum DriverStatus {
    Active = true,
    Inactive = false,
}

export interface CreateDriverDTO {
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

export interface UpdateDriverDTO {
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
