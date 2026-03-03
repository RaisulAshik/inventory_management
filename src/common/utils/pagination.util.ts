import { ObjectLiteral, SelectQueryBuilder } from 'typeorm';
import { PaginationDto } from '@common/dto/pagination.dto';
import { PaginatedResult, PaginationMeta } from '@common/interfaces';

/**
 * Apply pagination to a TypeORM query builder
 */
export async function paginate<T extends ObjectLiteral>(
  queryBuilder: SelectQueryBuilder<T>,
  paginationDto: PaginationDto,
): Promise<PaginatedResult<T>> {
  const page = paginationDto.page || 1;
  const limit = paginationDto.limit || 20;
  const skip = (page - 1) * limit;

  // Apply sorting
  if (paginationDto.sortBy) {
    const sortOrder =
      paginationDto.sortOrder?.toUpperCase() === 'DESC' ? 'DESC' : 'ASC';

    // Handle nested sorting (e.g., 'product.productName')
    if (paginationDto.sortBy.includes('.')) {
      queryBuilder.orderBy(paginationDto.sortBy, sortOrder);
    } else {
      const alias = queryBuilder.alias;
      queryBuilder.orderBy(`${alias}.${paginationDto.sortBy}`, sortOrder);
    }
  }

  // Get total count
  const total = await queryBuilder.getCount();

  // Apply pagination
  queryBuilder.skip(skip).take(limit);

  // Get data
  const data = await queryBuilder.getMany();

  // Calculate pagination meta
  const totalPages = Math.ceil(total / limit);
  const hasNextPage = page < totalPages;
  const hasPreviousPage = page > 1;

  const meta: PaginationMeta = {
    page,
    limit,
    total,
    totalPages,
    hasNextPage,
    hasPreviousPage,
  };

  return { data, meta };
}

/**
 * Create pagination meta from array
 */
export function createPaginationMeta(
  total: number,
  page: number,
  limit: number,
): PaginationMeta {
  const totalPages = Math.ceil(total / limit);

  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
}

/**
 * Paginate an array
 */
export function paginateArray<T>(
  array: T[],
  page: number,
  limit: number,
): PaginatedResult<T> {
  const total = array.length;
  const skip = (page - 1) * limit;
  const data = array.slice(skip, skip + limit);
  const meta = createPaginationMeta(total, page, limit);

  return { data, meta };
}
