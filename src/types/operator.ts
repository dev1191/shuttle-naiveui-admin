export interface Operator {
    ids: string
    firstname: string
    lastname: string
    email: string
    phone: string
    country_code: string
    picture?: string
    operator_business_name: string
    operator_license_number: string
    operator_commission: number
    operator_status: "pending" | "active" | "suspended" | "rejected"
    operator_approved_by?: string
    operator_approved_at?: string
    operator_rejection_reason?: string
    operator_transport_license?: string
    operator_business_registration?: string
    is_active: boolean
    createdAt?: string
    updatedAt?: string
}

export enum OperatorStatus {
    Pending = "pending",
    Active = "active",
    Suspended = "suspended",
    Rejected = "rejected"
}

export interface CreateOperatorDTO {
    firstname: string
    lastname: string
    email: string
    phone: string
    country_code: string
    picture?: string
    operator_business_name: string
    operator_license_number: string
    operator_commission: number
    operator_status?: "pending" | "active" | "suspended" | "rejected"
    operator_transport_license?: string
    operator_business_registration?: string
    is_active?: boolean
}

export interface UpdateOperatorDTO {
    firstname?: string
    lastname?: string
    email?: string
    phone?: string
    country_code?: string
    picture?: string
    operator_business_name?: string
    operator_license_number?: string
    operator_commission?: number
    operator_status?: "pending" | "active" | "suspended" | "rejected"
    operator_approved_by?: string
    operator_approved_at?: string
    operator_rejection_reason?: string
    operator_transport_license?: string
    operator_business_registration?: string
    is_active?: boolean
}
