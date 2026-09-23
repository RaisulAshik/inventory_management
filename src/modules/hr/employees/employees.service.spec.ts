import { BadRequestException } from '@nestjs/common';
import { EmployeesService } from './employees.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';

jest.mock('@common/utils/sequence.util', () => ({
  getNextSequence: jest.fn().mockResolvedValue('EMP-000007'),
}));

type Stub = Record<string, any>;

function makeService(
  opts: {
    employeeEmailTaken?: boolean;
    userEmailTaken?: boolean;
    rolesFound?: number;
    userCreateFails?: Error;
  } = {},
) {
  const saved: any[] = [];
  const deleted: string[] = [];
  const createdUsers: any[] = [];

  const repo: Stub = {
    findOne: jest
      .fn()
      .mockResolvedValue(opts.employeeEmailTaken ? { id: 'other' } : null),
    createQueryBuilder: () => ({
      where: jest.fn().mockReturnThis(),
      getCount: jest.fn().mockResolvedValue(opts.rolesFound ?? 1),
    }),
    create: (v: any) => ({ id: 'emp-new', ...v }),
    save: jest.fn((v: any) => {
      saved.push(v);
      return Promise.resolve(v);
    }),
    delete: jest.fn((id: string) => {
      deleted.push(id);
      return Promise.resolve();
    }),
  };

  const dataSource: Stub = { getRepository: () => repo };

  const usersService: Stub = {
    findByEmail: jest
      .fn()
      .mockResolvedValue(opts.userEmailTaken ? { id: 'u-other' } : null),
    create: jest.fn((tenantId: string, dto: any) => {
      if (opts.userCreateFails) return Promise.reject(opts.userCreateFails);
      createdUsers.push({ tenantId, ...dto });
      return Promise.resolve({ id: 'user-new' });
    }),
  };

  const service = new EmployeesService(
    {
      getDataSource: () => Promise.resolve(dataSource),
      getRepository: () => Promise.resolve(repo),
      getTenantId: () => 'tenant-1',
    } as any,
    usersService as any,
  );

  return { service, saved, deleted, createdUsers };
}

const base = {
  firstName: 'Raisul',
  lastName: 'Islam',
  email: 'raisulislam4997@gmail.com',
  hireDate: '2026-09-24',
} as CreateEmployeeDto;

describe('EmployeesService.create', () => {
  it('creates the employee alone when no password is given', async () => {
    const { service, saved, createdUsers } = makeService();
    await service.create(base);
    expect(saved).toHaveLength(1);
    expect(createdUsers).toHaveLength(0);
  });

  it('creates a login alongside the employee when a password is given', async () => {
    const { service, saved, createdUsers } = makeService();
    await service.create(
      { ...base, password: 'Password123!', roleIds: ['role-1'] },
      'admin-1',
    );

    expect(saved).toHaveLength(1);
    expect(createdUsers).toHaveLength(1);
    expect(createdUsers[0]).toMatchObject({
      tenantId: 'tenant-1',
      email: base.email,
      roleIds: ['role-1'],
      employeeCode: 'EMP-000007',
      createdBy: 'admin-1',
    });
  });

  it('does not persist password or roleIds onto the employee row', async () => {
    const { service, saved } = makeService();
    await service.create({ ...base, password: 'Password123!' });
    expect(saved[0]).not.toHaveProperty('password');
    expect(saved[0]).not.toHaveProperty('roleIds');
  });

  it('rejects a password with no email to attach it to', async () => {
    const { service } = makeService();
    await expect(
      service.create({ ...base, email: undefined, password: 'Password123!' }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('rejects roles without a password', async () => {
    const { service } = makeService();
    await expect(
      service.create({ ...base, roleIds: ['role-1'] }),
    ).rejects.toThrow(/only be granted alongside a login/);
  });

  it('rejects an email already belonging to a user account', async () => {
    const { service, saved } = makeService({ userEmailTaken: true });
    await expect(
      service.create({ ...base, password: 'Password123!' }),
    ).rejects.toThrow(/already belongs to a user account/);
    // nothing written
    expect(saved).toHaveLength(0);
  });

  it('rejects invalid role ids before writing anything', async () => {
    const { service, saved } = makeService({ rolesFound: 0 });
    await expect(
      service.create({ ...base, password: 'Password123!', roleIds: ['bad'] }),
    ).rejects.toThrow(/role IDs are invalid/);
    expect(saved).toHaveLength(0);
  });

  it('removes the employee again if creating the login fails', async () => {
    // The two records are in different databases, so there is no transaction
    // spanning them; the compensating delete is what keeps them consistent.
    const boom = new Error('master database unreachable');
    const { service, saved, deleted } = makeService({ userCreateFails: boom });

    await expect(
      service.create({ ...base, password: 'Password123!' }),
    ).rejects.toThrow('master database unreachable');

    expect(saved).toHaveLength(1);
    expect(deleted).toEqual(['emp-new']);
  });
});
