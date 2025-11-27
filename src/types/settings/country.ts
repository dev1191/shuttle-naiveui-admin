

export interface Country {
    ids: string;
    name: string;
    short_name: string;
    phone_code: string;
    status: boolean;
}

export interface CountryListData {
    items: Country[];
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

export interface CountryStatus {
    status: boolean
}

export interface CreateCountryDTO {
    name: string;
    short_name: string;
    phone_code: string;
    status: boolean;
}

export interface UpdateCountryDTO {
    name?: string;
    short_name?: string;
    phone_code?: string;
    status: boolean;
}
