import { TenantSchemaBootstrap } from './tenant-schema.bootstrap';

/**
 * The startup check must never stop the application starting, and neither
 * one bad tenant nor one failed change may stop the rest being applied.
 */
function makeBootstrap(opts: {
  tenants: Array<{ tenantId: string; databaseName: string }> | Error;
  columnExists?: boolean;
  failUsersFor?: string[];
}) {
  const statements: string[] = [];
  const query = jest.fn((sql: string) => {
    statements.push(sql);
    if (sql.includes('FROM `tenant_databases`')) {
      return opts.tenants instanceof Error
        ? Promise.reject(opts.tenants)
        : Promise.resolve(opts.tenants);
    }
    if (sql.includes('information_schema.COLUMNS')) {
      return Promise.resolve([{ n: opts.columnExists ? 1 : 0 }]);
    }
    if (
      (opts.failUsersFor ?? []).some((db) => sql.includes(`\`${db}\`.\`users\``))
    ) {
      return Promise.reject(new Error('users failed'));
    }
    return Promise.resolve({ affectedRows: 1 });
  });

  const bootstrap = new TenantSchemaBootstrap({
    query,
    options: { database: 'erp_master' },
  } as any);

  return { bootstrap, statements };
}

const tenant = (n: number) => ({
  tenantId: `t-${n}`,
  databaseName: `erp_tenant_${n}`,
});

const has = (statements: string[], ...parts: string[]) =>
  statements.some((s) => parts.every((p) => s.includes(p)));

describe('TenantSchemaBootstrap', () => {
  it('creates and fills the users table in every tenant', async () => {
    const { bootstrap, statements } = makeBootstrap({
      tenants: [tenant(1), tenant(2)],
    });
    await bootstrap.onApplicationBootstrap();

    for (const db of ['erp_tenant_1', 'erp_tenant_2']) {
      expect(
        has(statements, 'CREATE TABLE IF NOT EXISTS', `\`${db}\`.\`users\``),
      ).toBe(true);
      expect(
        has(
          statements,
          `INSERT IGNORE INTO \`${db}\`.\`users\``,
          '`erp_master`.`tenant_users`',
        ),
      ).toBe(true);
    }
  });

  it('adds sales_orders.customer_po_number when it is missing', async () => {
    const { bootstrap, statements } = makeBootstrap({ tenants: [tenant(1)] });
    await bootstrap.onApplicationBootstrap();

    expect(
      has(
        statements,
        'ALTER TABLE `erp_tenant_1`.`sales_orders`',
        'ADD COLUMN `customer_po_number`',
      ),
    ).toBe(true);
  });

  it('leaves the column alone when it is already there', async () => {
    const { bootstrap, statements } = makeBootstrap({
      tenants: [tenant(1)],
      columnExists: true,
    });
    await bootstrap.onApplicationBootstrap();

    expect(has(statements, 'ALTER TABLE')).toBe(false);
  });

  it('carries on past a failure, to the next change and the next tenant', async () => {
    const { bootstrap, statements } = makeBootstrap({
      tenants: [tenant(1), tenant(2)],
      failUsersFor: ['erp_tenant_1'],
    });
    await expect(bootstrap.onApplicationBootstrap()).resolves.toBeUndefined();

    expect(has(statements, 'ALTER TABLE `erp_tenant_1`.`sales_orders`')).toBe(
      true,
    );
    expect(has(statements, 'INSERT IGNORE INTO `erp_tenant_2`')).toBe(true);
  });

  it('does not throw when the tenant list cannot be read', async () => {
    const { bootstrap } = makeBootstrap({
      tenants: new Error('master unreachable'),
    });
    await expect(bootstrap.onApplicationBootstrap()).resolves.toBeUndefined();
  });
});
