import { BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '@entities/tenant/user/user.entity';
import { UserRole } from '@entities/tenant/user/user-role.entity';

/**
 * create() writes master first, then the tenant `users` copy and role grants
 * together. These pin that the tenant side is written under the master id,
 * and that a tenant failure does not leave a master-only login behind.
 */
function makeService(opts: { rolesFound?: number; tenantFails?: Error } = {}) {
  const masterRows: any[] = [];
  const masterDeleted: string[] = [];
  const tenantUsers: any[] = [];
  const grants: any[] = [];

  const masterRepo = {
    findOne: jest.fn().mockResolvedValue(null),
    create: (v: any) => v,
    save: jest.fn((v: any) => {
      masterRows.push(v);
      return Promise.resolve(v);
    }),
    delete: jest.fn((id: string) => {
      masterDeleted.push(id);
      return Promise.resolve();
    }),
  };

  const manager = {
    getRepository: (entity: unknown) => {
      if (entity === User) {
        return {
          upsert: jest.fn((v: any) => {
            if (opts.tenantFails) return Promise.reject(opts.tenantFails);
            tenantUsers.push(v);
            return Promise.resolve();
          }),
        };
      }
      if (entity === UserRole) {
        return {
          delete: jest.fn().mockResolvedValue(undefined),
          create: (v: any) => v,
          save: jest.fn((v: any[]) => {
            grants.push(...v);
            return Promise.resolve(v);
          }),
        };
      }
      throw new Error('unexpected repository');
    },
  };

  const dataSource = {
    getRepository: () => ({
      createQueryBuilder: () => ({
        where: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockResolvedValue(opts.rolesFound ?? 1),
      }),
    }),
    transaction: (fn: (m: any) => Promise<unknown>) => fn(manager),
  };

  const service = new UsersService(
    {
      getDataSource: () => Promise.resolve(dataSource),
      getTenantId: () => 'tenant-1',
    } as any,
    masterRepo as any,
  );

  return { service, masterRows, masterDeleted, tenantUsers, grants };
}

const dto = {
  email: 'New.Starter@example.com',
  password: 'Password123!',
  firstName: 'New',
  lastName: 'Starter',
  roleIds: ['role-1'],
};

describe('UsersService.create', () => {
  it('mirrors the user into the tenant under the master id', async () => {
    const { service, masterRows, tenantUsers } = makeService();
    const user = await service.create('tenant-1', dto);

    expect(masterRows).toHaveLength(1);
    expect(tenantUsers).toHaveLength(1);
    expect(tenantUsers[0]).toMatchObject({
      id: user.id,
      email: 'new.starter@example.com',
      firstName: 'New',
      isActive: true,
    });
  });

  it('grants the roles against the master id', async () => {
    const { service, grants } = makeService();
    const user = await service.create('tenant-1', dto);

    expect(grants).toEqual([
      expect.objectContaining({ userId: user.id, roleId: 'role-1' }),
    ]);
  });

  it('removes the master row when the tenant side fails', async () => {
    const { service, masterRows, masterDeleted } = makeService({
      tenantFails: new Error('FK violation'),
    });

    await expect(service.create('tenant-1', dto)).rejects.toThrow(
      'FK violation',
    );
    expect(masterDeleted).toEqual([masterRows[0].id]);
  });

  it('rejects unknown roles before writing anything', async () => {
    const { service, masterRows } = makeService({ rolesFound: 0 });

    await expect(service.create('tenant-1', dto)).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(masterRows).toHaveLength(0);
  });
});
