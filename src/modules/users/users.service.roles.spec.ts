import { UsersService } from './users.service';

/**
 * getRolesForUsers folds a flat (user, role, permission) join back into nested
 * roles. The folding is where this can go wrong, so it is pinned here.
 */
function makeService(rows: any[]) {
  const qb: Record<string, any> = {};
  for (const m of [
    'select',
    'addSelect',
    'from',
    'innerJoin',
    'leftJoin',
    'where',
    'orderBy',
  ]) {
    qb[m] = jest.fn(() => qb);
  }
  qb.getRawMany = jest.fn().mockResolvedValue(rows);

  const dataSource = { createQueryBuilder: () => qb };

  return new UsersService(
    {
      getDataSource: () => Promise.resolve(dataSource),
      getTenantId: () => 'tenant-1',
    } as any,
    {} as any,
  );
}

const row = (
  userId: string,
  roleId: string,
  roleCode: string,
  permissionCode: string | null,
) => ({
  userId,
  roleId,
  roleCode,
  roleName: roleCode + ' Role',
  permissionCode,
});

describe('UsersService.getRolesForUsers', () => {
  it('returns an empty map for no users without querying', async () => {
    const service = makeService([]);
    expect((await service.getRolesForUsers([])).size).toBe(0);
  });

  it('nests permissions under their role', async () => {
    const service = makeService([
      row('u1', 'r1', 'SALES', 'orders.create'),
      row('u1', 'r1', 'SALES', 'orders.read'),
    ]);

    const roles = (await service.getRolesForUsers(['u1'])).get('u1')!;
    expect(roles).toHaveLength(1);
    expect(roles[0]).toMatchObject({ id: 'r1', roleCode: 'SALES' });
    expect(roles[0].permissions).toEqual(['orders.create', 'orders.read']);
  });

  it('keeps two roles separate for the same user', async () => {
    const service = makeService([
      row('u1', 'r1', 'SALES', 'orders.read'),
      row('u1', 'r2', 'WAREHOUSE', 'stock.read'),
    ]);

    const roles = (await service.getRolesForUsers(['u1'])).get('u1')!;
    expect(roles.map((r) => r.roleCode)).toEqual(['SALES', 'WAREHOUSE']);
    expect(roles[1].permissions).toEqual(['stock.read']);
  });

  it('keeps users apart', async () => {
    const service = makeService([
      row('u1', 'r1', 'SALES', 'orders.read'),
      row('u2', 'r2', 'WAREHOUSE', 'stock.read'),
    ]);

    const byUser = await service.getRolesForUsers(['u1', 'u2']);
    expect(byUser.get('u1')![0].roleCode).toBe('SALES');
    expect(byUser.get('u2')![0].roleCode).toBe('WAREHOUSE');
  });

  it('includes a role that grants no permissions', async () => {
    // LEFT JOIN yields a null permission code for an empty role.
    const service = makeService([row('u1', 'r1', 'EMPTY', null)]);

    const roles = (await service.getRolesForUsers(['u1'])).get('u1')!;
    expect(roles).toHaveLength(1);
    expect(roles[0].permissions).toEqual([]);
  });

  it('does not repeat a permission granted twice', async () => {
    const service = makeService([
      row('u1', 'r1', 'SALES', 'orders.read'),
      row('u1', 'r1', 'SALES', 'orders.read'),
    ]);

    const roles = (await service.getRolesForUsers(['u1'])).get('u1')!;
    expect(roles[0].permissions).toEqual(['orders.read']);
  });

  it('getUserRolesDetailed returns [] for a user with no roles', async () => {
    const service = makeService([]);
    expect(await service.getUserRolesDetailed('nobody')).toEqual([]);
  });
});
