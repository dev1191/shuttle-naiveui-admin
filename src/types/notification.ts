export type Notification = {
    ids: string
    to: string
    user_type: string
    message_type: string
    title: string
    content: string
    user: [User]
    schedule: string
    time: Date
    days: [string]
    picture: string
    status: boolean
    send_total:{
        failed_count: number,
        success_count: number,
    }
}

type User = {
    id: string
    fullname: string
    country_code: string
    phone: string
}
export type updateStatus = {
    ids: string
    status: boolean
}



export interface CreateNotificationDTO {
    name: string;
    code: string;
    discount: number;
    start_date: Date
    end_date: Date
    terms: string
    picture: string
    attempt: number
    status: boolean;
    routeId?: string
    type: boolean
}

export interface UpdateNotificationDTO {
    ids: string
    name: string;
    code: string;
    discount: number;
    start_date: Date
    end_date: Date
    terms: string
    picture: string
    attempt: number
    status: boolean;
    routeId?: string
    type: boolean
}
