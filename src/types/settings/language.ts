
export interface LanguageOption {
    name: string
    code: string
    flag?: string
}



export interface Language {
    ids?: string;
    label: string;
    code: string;
    countryId: string;
    country_name: string;
    status: boolean;
    is_deleted?: boolean;
}


export interface LanguageListData {
    items: Language[];
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

export interface LanguageStatus {
    status: boolean;
}


export interface LanguageStatus {
    status: boolean
}

export interface CreateLanguageDTO {
    label: string;
    code: string;
    countryId: string;
    country_name: string;
    status: boolean;
    is_deleted?: boolean;
}

export interface UpdateLanguageDTO {
    ids?: string;
    label: string;
    code: string;
    countryId: string;
    country_name: string;
    status: boolean;
    is_deleted?: boolean;
}   