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
  const limit = paginationDto.limit || paginationDto.pageSize || 20;
  const skip = (page - 1) * limit;

  // Apply sorting
  if (paginationDto.sortBy) {
    // `sortBy` is interpolated straight into the ORDER BY clause, so it has to
    // be a plain identifier. Anything else is ignored rather than passed to
    // the database. Supports the `field:DIRECTION` form some clients send.
    const [rawField, inlineOrder] = paginationDto.sortBy.split(':');
    const field = rawField?.trim() ?? '';

    const sortOrder =
      (inlineOrder ?? paginationDto.sortOrder)?.trim().toUpperCase() === 'DESC'
        ? 'DESC'
        : 'ASC';

    // letters, digits and underscores, optionally one dot for a joined alias
    if (/^[A-Za-z_][A-Za-z0-9_]*(\.[A-Za-z_][A-Za-z0-9_]*)?$/.test(field)) {
      // Handle nested sorting (e.g., 'product.productName')
      const target = field.includes('.')
        ? field
        : `${queryBuilder.alias}.${field}`;
      queryBuilder.orderBy(target, sortOrder);
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
