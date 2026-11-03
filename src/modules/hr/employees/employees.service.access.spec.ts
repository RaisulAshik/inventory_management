import { BadRequestException, NotFoundException } from '@nestjs/common';
import { EmployeesService } from './employees.service';

/**
 * setSystemAccess is the only way a login is granted now that every user is
 * an employee — there is no standalone create-user path. These pin the two
 * halves of it: giving access to an employee who has none, and changing the
 * access of one who already has it.
 */
type Stub = Record<string, any>;

function makeService(
  employee: Stub | null,
  opts: { emailTaken?: boolean; rolesFound?: number } = {},
) {
  const updates: any[] = [];
  const createdUsers: any[] = [];
  const assigned: any[] = [];
  const activations: any[] = [];

  const repo: Stub = {
    // Both the bare lookup and the one findOne() makes with relations.
    findOne: jest.fn().mockImplementation(() => Promise.resolve(employee)),
    update: jest.fn((id: string, patch: any) => {
      updates.push({ id, ...patch });
      if (employee) Object.assign(employee, patch);
      return Promise.resolve();
    }),
  };

  const dataSource: Stub = {
    getRepository: () => ({
      createQueryBuilder: () => ({
        where: jest.fn().mockReturnThis(),
        getCount: jest.fn().mockResolvedValue(opts.rolesFound ?? 1),
      }),
    }),
  };

  const usersService: Stub = {
    findByEmail: jest
      .fn()
      .mockResolvedValue(opts.emailTaken ? { id: 'u-other' } : null),
    create: jest.fn((tenantId: string, dto: any) => {
      createdUsers.push({ tenantId, ...dto });
      return Promise.resolve({ id: 'user-new' });
    }),
    assignRoles: jest.fn((userId: string, roleIds: string[]) => {
      assigned.push({ userId, roleIds });
      return Promise.resolve();
    }),
    activate: jest.fn((id: string) => {
      activations.push({ id, active: true });
      return Promise.resolve({});
    }),
    deactivate: jest.fn((id: string) => {
      activations.push({ id, active: false });
      return Promise.resolve({});
    }),
    getRolesForUsers: jest.fn().mockResolvedValue(new Map()),
    findByIds: jest.fn().mockResolvedValue([]),
  };

  const service = new EmployeesService(
    {
      getDataSource: () => Promise.resolve(dataSource),
      getRepository: () => Promise.resolve(repo),
      getTenantId: () => 'tenant-1',
    } as any,
    usersService as any,
  );

  return { service, updates, createdUsers, assigned, activations, usersService };
}

const withoutLogin = () => ({
  id: 'emp-1',
  employeeCode: 'EMP2611040001',
  firstName: 'Paula',
  lastName: 'Mahzabeen',
  email: 'paula@example.com',
  phone: null,
  userId: null,
  roles: [],
});

const withLogin = () => ({ ...withoutLogin(), userId: 'user-1' });

describe('EmployeesService.setSystemAccess — employee with no login', () => {
  it('creates the login and records the link', async () => {
    const { service, createdUsers, updates } = makeService(withoutLogin());

    await service.setSystemAccess(
      'emp-1',
      { password: 'Password123!', roleIds: ['role-1'] },
      'admin-1',
    );

    expect(createdUsers).toHaveLength(1);
    expect(createdUsers[0]).toMatchObject({
      tenantId: 'tenant-1',
      email: 'paula@example.com',
      employeeCode: 'EMP2611040001',
      roleIds: ['role-1'],
      createdBy: 'admin-1',
    });
    // Without this the two records would be strangers again.
    expect(updates).toContainEqual({ id: 'emp-1', userId: 'user-new' });
  });

  // The employee record already exists; a second one would split the person.
  it('tells the user service not to create another employee', async () => {
    const { service, usersService } = makeService(withoutLogin());

    await service.setSystemAccess('emp-1', { password: 'Password123!' });

    expect(usersService.create).toHaveBeenCalledWith(
      'tenant-1',
      expect.anything(),
      { skipEmployee: true },
    );
  });

  it('refuses without a password', async () => {
    const { service, createdUsers } = makeService(withoutLogin());

    await expect(
      service.setSystemAccess('emp-1', { roleIds: ['role-1'] }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(createdUsers).toHaveLength(0);
  });

  it('refuses when the employee has no email to log in with', async () => {
    const { service } = makeService({ ...withoutLogin(), email: null });

    await expect(
      service.setSystemAccess('emp-1', { password: 'Password123!' }),
    ).rejects.toThrow(/email address is required/i);
  });

  it('refuses when the address already belongs to someone', async () => {
    const { service, createdUsers } = makeService(withoutLogin(), {
      emailTaken: true,
    });

    await expect(
      service.setSystemAccess('emp-1', { password: 'Password123!' }),
    ).rejects.toThrow(/already belongs to a user account/i);
    expect(createdUsers).toHaveLength(0);
  });

  // Suspending access only means something once there is access to suspend.
  it('refuses to suspend an employee who has no login', async () => {
    const { service } = makeService(withoutLogin());

    await expect(
      service.setSystemAccess('emp-1', { isActive: false }),
    ).rejects.toThrow(/no login to suspend/i);
  });

  it('rejects an unknown role before writing anything', async () => {
    const { service, createdUsers } = makeService(withoutLogin(), {
      rolesFound: 0,
    });

    await expect(
      service.setSystemAccess('emp-1', {
        password: 'Password123!',
        roleIds: ['nope'],
      }),
    ).rejects.toBeInstanceOf(BadRequestException);
    expect(createdUsers).toHaveLength(0);
  });
});

describe('EmployeesService.setSystemAccess — employee who already has one', () => {
  it('replaces their roles without creating a second login', async () => {
    const { service, assigned, createdUsers } = makeService(withLogin());

    await service.setSystemAccess('emp-1', { roleIds: ['role-2'] }, 'admin-1');

    expect(assigned).toEqual([{ userId: 'user-1', roleIds: ['role-2'] }]);
    expect(createdUsers).toHaveLength(0);
  });

  // An empty array is a real instruction — strip every role — not a no-op.
  it('strips every role when given an empty list', async () => {
    const { service, assigned } = makeService(withLogin());

    await service.setSystemAccess('emp-1', { roleIds: [] });

    expect(assigned).toEqual([{ userId: 'user-1', roleIds: [] }]);
  });

  it('suspends and restores access', async () => {
    const suspended = makeService(withLogin());
    await suspended.service.setSystemAccess('emp-1', { isActive: false });
    expect(suspended.activations).toEqual([{ id: 'user-1', active: false }]);

    const restored = makeService(withLogin());
    await restored.service.setSystemAccess('emp-1', { isActive: true });
    expect(restored.activations).toEqual([{ id: 'user-1', active: true }]);
  });

  // A password here would silently do nothing, so it must not look like a
  // password reset: roles change, the existing credential is untouched.
  it('leaves the existing password alone', async () => {
    const { service, createdUsers } = makeService(withLogin());

    await service.setSystemAccess('emp-1', { password: 'Password123!' });

    expect(createdUsers).toHaveLength(0);
  });
});

describe('EmployeesService.setSystemAccess — missing employee', () => {
  it('reports the employee as not found', async () => {
    const { service } = makeService(null);

    await expect(
      service.setSystemAccess('nope', { password: 'Password123!' }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });
});
