export interface PaginatedResponse<T> {
    items: T[];
    pageNumber: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
}

export interface ProductQueryParams {
    pageNumber?: number;
    pageSize?: number;
    orderBy?: string;
    nokkelhull?: boolean;
    searchTerm?: string;
}