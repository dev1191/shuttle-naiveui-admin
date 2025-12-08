
export interface EmailTemplate {
    _id: string;
    name: string;
    slug: string;
    subject: string;
    body: string;
    description: string
    is_active: boolean;
    recipient_type: string;
    variables: string[];
}


export interface EmailTemplateListData {
    items: EmailTemplate[];
    totalRecords: number;
    limit: number;
    page: number;
    totalPages: number;
    pagingCounter: number;
    hasPrevPage?: boolean;
    hasNextPage?: boolean;
    prevPage?: string;
    nextPage?: number;

}