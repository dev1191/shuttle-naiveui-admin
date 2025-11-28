

export interface Offer {
    ids: string;
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

export interface OfferListData {
    items: Offer[];
    totalRecords: number;
    limit: number;
    page: number;
    totalPages: number;
    pagingCounter: number;
    hasPrevPage?: boolean;
    hasNextPage?: boolean;
    prevPage?: string;
    nextPage?: number

}

export interface OfferStatus {
    status: boolean
}

export interface CreateOfferDTO {
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

export interface UpdateOfferDTO {
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
