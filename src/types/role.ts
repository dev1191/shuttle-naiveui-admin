

export interface Role {
    ids: string;
    name: string;
    slug?: string;
    permissions: string[];
}

export interface RoleListData {
    items: Role[];
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

export interface RoleStatus {
    status: boolean
}

export interface CreateRoleDTO {
    name: string;
    slug?: string;
    permissions?: string[];
}

export interface UpdateRoleDTO {
    name?: string;
    slug?: string;
    permissions?: string[];
}
