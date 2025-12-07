export type PaymentGateway = {
    _id: string
    site_slug: string
    name: [paymentValue]
    is_enabled: boolean
}

export type paymentValue = {
    id: string
    name: string
    value: string
}