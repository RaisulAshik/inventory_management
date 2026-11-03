import { BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from '@entities/tenant/user/user.entity';
import { UserRole } from '@entities/tenant/user/user-role.entity';
import { Employee } from '@entities/tenant/hr/employee.entity';

/**
 * create() writes master first, then the tenant `users` copy, the employee
 * record and role grants together. These pin that the tenant side is written
 * under the master id, that a tenant failure does not leave a master-only
 * login behind, and that every login gets the employee record it must have.
 */
function makeService(opts: { rolesFound?: number; tenantFails?: Error } = {}) {
  const masterRows: any[] = [];
  const masterDeleted: string[] = [];
  const tenantUsers: any[] = [];
  const grants: any[] = [];
  const employees: any[] = [];

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
      if (entity === Employee) {
        return {
          findOne: jest.fn().mockResolvedValue(null),
          create: (v: any) => v,
          save: jest.fn((v: any) => {
            employees.push(v);
            return Promise.resolve(v);
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
    // getNextSequence mints the shared employee code on its own connection.
    createQueryRunner: () => ({
      connect: jest.fn().mockResolvedValue(undefined),
      release: jest.fn().mockResolvedValue(undefined),
      query: jest.fn().mockResolvedValue([
        { current_number: 7, prefix: 'EMP', padding_length: 4 },
      ]),
    }),
  };

  const service = new UsersService(
    {
      getDataSource: () => Promise.resolve(dataSource),
      getTenantId: () => 'tenant-1',
    } as any,
    masterRepo as any,
  );

  return { service, masterRows, masterDeleted, tenantUsers, grants, employees };
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

  // Every user is an employee: a login with no HR record is the state this
  // is here to make impossible.
  it('creates the employee record that every login must have', async () => {
    const { service, employees } = makeService();

    const user = await service.create('tenant-1', dto);

    expect(employees).toHaveLength(1);
    expect(employees[0]).toMatchObject({
      userId: user.id,
      email: 'new.starter@example.com',
      firstName: 'New',
    });
  });

  it('gives the user and the employee the same code', async () => {
    const { service, masterRows, employees } = makeService();

    await service.create('tenant-1', dto);

    expect(employees[0].employeeCode).toBe('EMP' + dateStamp() + '0007');
    expect(masterRows[0].employeeCode).toBe(employees[0].employeeCode);
  });

  // EmployeesService creates the employee first, then calls this to add the
  // login; without the flag that person would end up with two records.
  it('skips the employee when the caller has already made one', async () => {
    const { service, employees } = makeService();

    await service.create('tenant-1', dto, { skipEmployee: true });

    expect(employees).toHaveLength(0);
  });
});

/** The YYMMDD portion getNextSequence builds codes from. */
function dateStamp(): string {
  const now = new Date();
  return (
    String(now.getFullYear()).slice(-2) +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0')
  );
}
