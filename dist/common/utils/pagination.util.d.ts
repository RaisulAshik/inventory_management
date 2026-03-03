import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import { PaginationDto } from '@common/dto/pagination.dto';
import { PaginatedResult, PaginationMeta } from '@common/interfaces';
export declare function paginate<T extends ObjectLiteral>(queryBuilder: SelectQueryBuilder<T>, paginationDto: PaginationDto): Promise<PaginatedResult<T>>;
export declare function createPaginationMeta(total: number, page: number, limit: number): PaginationMeta;
export declare function paginateArray<T>(array: T[], page: number, limit: number): PaginatedResult<T>;
