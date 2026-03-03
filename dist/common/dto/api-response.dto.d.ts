export declare class MetaDto {
    total?: number;
    page?: number;
    limit?: number;
    totalPages?: number;
    hasNextPage?: boolean;
    hasPrevPage?: boolean;
}
export declare class PaginatedResponseDto<T> {
    data?: T[];
    meta?: MetaDto;
}
export declare class ApiResponseDto<T> {
    success?: boolean;
    message?: string;
    data?: T;
    errors?: any[];
    timestamp?: string;
}
