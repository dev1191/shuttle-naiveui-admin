export interface Driver {
    id: string | number
    fullname: string
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
    status: 'active' | 'inactive' | 'suspended'
    createdAt?: string
    updatedAt?: string
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
