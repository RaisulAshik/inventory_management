import { paginate } from './pagination.util';
import { PaginationDto } from '@common/dto/pagination.dto';

/**
 * `sortBy` is interpolated into the ORDER BY clause rather than parameterised,
 * so these pin down exactly what reaches the database.
 */
function makeQueryBuilder() {
  const calls: Array<[string, string]> = [];
  const qb: any = {
    alias: 'user',
    orderBy: (field: string, order: string) => {
      calls.push([field, order]);
      return qb;
    },
    getCount: () => Promise.resolve(0),
    skip: () => qb,
    take: () => qb,
    getMany: () => Promise.resolve([]),
  };
  return { qb, calls };
}

async function sortWith(sortBy?: string, sortOrder?: 'ASC' | 'DESC') {
  const { qb, calls } = makeQueryBuilder();
  const dto = new PaginationDto();
  dto.sortBy = sortBy;
  if (sortOrder) dto.sortOrder = sortOrder;
  await paginate(qb, dto);
  return calls;
}

describe('paginate sorting', () => {
  it('qualifies a bare field with the query alias', async () => {
    expect(await sortWith('firstName')).toEqual([['user.firstName', 'ASC']]);
  });

  it('accepts the field:DIRECTION form some clients send', async () => {
    expect(await sortWith('firstName:DESC')).toEqual([
      ['user.firstName', 'DESC'],
    ]);
  });

  it('lets an inline direction win over sortOrder', async () => {
    expect(await sortWith('firstName:ASC', 'DESC')).toEqual([
      ['user.firstName', 'ASC'],
    ]);
  });

  it('passes a joined alias through untouched', async () => {
    expect(await sortWith('product.productName')).toEqual([
      ['product.productName', 'ASC'],
    ]);
  });

  it.each([
    'id; DROP TABLE users',
    'id, (SELECT 1)',
    "id' OR '1'='1",
    'a.b.c',
    '(case when 1=1 then id end)',
    '',
  ])('ignores %p rather than sending it to the database', async (bad) => {
    expect(await sortWith(bad)).toEqual([]);
  });
});

describe('PaginationDto search/keyword', () => {
  it('keeps search when both are supplied', () => {
    const dto = Object.assign(new PaginationDto(), {
      search: 'abc',
      keyword: 'xyz',
    });
    expect(dto.search).toBe('abc');
  });
});
