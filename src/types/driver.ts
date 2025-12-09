export interface Driver {
    _id: string
    operatorId?: string
    firstname: string
    lastname: string
    short_name: string
    email: string
    country_code: string
    phone: string
    national_id: string
    picture: string
    type: string
    status: DriverStatus
    duty_status: string
    document_licence: string
    document_national_icard: string
    document_police_vertification: string
    location?: [number, number] // [longitude, latitude] for map tracking
    createdAt?: string
    updatedAt?: string
}


export enum DriverStatus {
    Active = 'Active',
    Inactive = 'Inactive',
    OnRoute = 'OnRoute',
    Breakdown = 'Breakdown',
    Idle = 'Idle',
    Maintenance = 'Maintenance',
}

export interface CreateDriverDTO {
    operatorId?: string
    firstname: string
    lastname: string
    short_name: string
    email: string
    country_code: string
    phone: string
    national_id: string
    picture: string
    type: string
    status: DriverStatus
    duty_status: string
    document_licence: string
    document_national_icard: string
    document_police_vertification: string
}

export interface UpdateDriverDTO {
    operatorId?: string
    firstname: string
    lastname: string
    short_name: string
    email: string
    country_code: string
    phone: string
    national_id: string
    picture: string
    type: string
    status: DriverStatus
    duty_status: string
    document_licence: string
    document_national_icard: string
    document_police_vertification: string
}
