

export interface Page {
    ids: string;
    title: string;
    slug: string;
    content: string;
    meta_title: string;
    meta_description: string;
    meta_keywords: string;
    status: boolean;
}

export interface PageListData {
    items: Page[];
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

export interface PageStatus {
    status: boolean
}

export interface CreatePageDTO {
    title: string;
    slug: string;
    content: string;
    meta_title: string;
    meta_description: string;
    meta_keywords: string;
    status: boolean;
}

export interface UpdatePageDTO {
    ids?: string
    title: string;
    slug: string;
    content: string;
    meta_title: string;
    meta_description: string;
    meta_keywords: string;
    status: boolean;
}
