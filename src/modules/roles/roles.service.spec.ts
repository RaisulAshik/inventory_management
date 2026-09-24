import {
  BadRequestException,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { RolesService } from './roles.service';

/**
 * The rule these pin down: permissions the application ships are read-only,
 * and "built-in" is decided by membership of the static catalogue rather than
 * a database column, so it cannot drift from what the code enforces.
 */

type Stub = Record<string, any>;

function makeService(opts: { existing?: any; byCode?: any } = {}) {
  const saved: any[] = [];
  const removed: any[] = [];
  const deleted: any[] = [];

  const repo: Stub = {
    find: jest.fn().mockResolvedValue(opts.existing ? [opts.existing] : []),
    findOne: jest.fn(({ where }: any) =>
      Promise.resolve(
        where?.permissionCode ? (opts.byCode ?? null) : (opts.existing ?? null),
      ),
    ),
    create: (v: any) => ({ id: 'perm-new', ...v }),
    save: jest.fn((v: any) => {
      saved.push(v);
      return Promise.resolve(v);
    }),
    remove: jest.fn((v: any) => {
      removed.push(v);
      return Promise.resolve();
    }),
    delete: jest.fn((v: any) => {
      deleted.push(v);
      return Promise.resolve();
    }),
    // Mimics "every id given exists": getCount reports however many distinct
    // ids the query asked about, so the service's own de-duplication is what
    // the assertion actually exercises.
    createQueryBuilder: () => {
      let asked = 0;
      const qb: Stub = {
        where: jest.fn((_sql: string, params?: { ids?: string[] }) => {
          asked = params?.ids?.length ?? 0;
          return qb;
        }),
        getCount: jest.fn(() => Promise.resolve(asked)),
      };
      return qb;
    },
  };

  const dataSource: Stub = {
    getRepository: () => repo,
    transaction: (fn: any) => fn({ getRepository: () => repo }),
  };

  const service = new RolesService({
    getDataSource: () => Promise.resolve(dataSource),
  } as any);

  return { service, saved, removed, deleted, repo };
}

// A real code from the shipped catalogue, and one that is not.
const BUILT_IN = 'products.read';
const CUSTOM = 'reports.margin-analysis';

describe('RolesService custom permissions', () => {
  it('creates a permission with a code the application does not know', async () => {
    const { service, saved } = makeService();
    const result = await service.createPermission({
      permissionCode: CUSTOM,
      permissionName: 'View Margin Analysis',
      module: 'reports',
    });

    expect(saved).toHaveLength(1);
    expect(result.isSystem).toBe(false);
    expect(result.permissionCode).toBe(CUSTOM);
  });

  it('refuses to shadow a built-in code', async () => {
    const { service, saved } = makeService();
    await expect(
      service.createPermission({
        permissionCode: BUILT_IN,
        permissionName: 'Anything',
        module: 'products',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
    expect(saved).toHaveLength(0);
  });

  it('refuses a code that already exists in this tenant', async () => {
    const { service } = makeService({ byCode: { id: 'other' } });
    await expect(
      service.createPermission({
        permissionCode: CUSTOM,
        permissionName: 'Duplicate',
        module: 'reports',
      }),
    ).rejects.toThrow(/already exists/);
  });

  it('refuses to edit a built-in permission', async () => {
    const { service } = makeService({
      existing: { id: 'p1', permissionCode: BUILT_IN },
    });
    await expect(
      service.updatePermission('p1', { permissionName: 'Renamed' }),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('edits a custom permission', async () => {
    const { service, saved } = makeService({
      existing: {
        id: 'p1',
        permissionCode: CUSTOM,
        permissionName: 'Old',
        module: 'reports',
      },
    });
    const result = await service.updatePermission('p1', {
      permissionName: 'New',
    });
    expect(saved[0].permissionName).toBe('New');
    expect(result.isSystem).toBe(false);
  });

  it('refuses to delete a built-in permission', async () => {
    const { service, removed } = makeService({
      existing: { id: 'p1', permissionCode: BUILT_IN },
    });
    await expect(service.deletePermission('p1')).rejects.toThrow(
      /cannot be deleted/,
    );
    expect(removed).toHaveLength(0);
  });

  it('deletes a custom permission', async () => {
    const { service, removed } = makeService({
      existing: { id: 'p1', permissionCode: CUSTOM },
    });
    await service.deletePermission('p1');
    expect(removed).toHaveLength(1);
  });

  it('404s on a permission that is not there', async () => {
    const { service } = makeService();
    await expect(service.deletePermission('nope')).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });

  it('flags built-in vs custom when listing', async () => {
    const { service, repo } = makeService();
    repo.find = jest.fn().mockResolvedValue([
      { id: 'p1', permissionCode: BUILT_IN, module: 'products' },
      { id: 'p2', permissionCode: CUSTOM, module: 'reports' },
    ]);

    const grouped = await service.findAllPermissions();
    expect(grouped.products[0].isSystem).toBe(true);
    expect(grouped.reports[0].isSystem).toBe(false);
  });
});

describe('RolesService.assignPermissions', () => {
  it('de-duplicates repeated permission ids', async () => {
    const { service, saved, repo } = makeService({
      existing: { id: 'role-1', rolePermissions: [] },
    });
    await service.assignPermissions('role-1', {
      permissionIds: ['p1', 'p1', 'p2'],
    });

    // one save call, carrying two rows rather than three
    expect(repo.delete).toHaveBeenCalled();
    const rows = saved[saved.length - 1];
    expect(rows).toHaveLength(2);
  });
});
