import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { tenantUsersTableDdl } from '@database/tenant-users-table';

/**
 * Applies additive schema changes to every provisioned tenant, on startup.
 *
 * The running code maps these tables and columns, so a tenant without them
 * fails at query time — `Table '<tenant>.users' doesn't exist`, `Unknown
 * column`. Applying them here means deploying the build is enough; no tenant
 * is left waiting on a hand-run script. Everything here is idempotent and
 * only ever adds:
 *
 *  - the `users` table, and a copy of any master user of the tenant who has
 *    no row yet. It never re-keys an existing row — a tenant still holding
 *    its original pre-013 `users` table needs migration 015 for that;
 *  - `sales_orders.customer_po_number`;
 *  - `hr_employees.user_id`, the link from a person to their login, with
 *    existing pairs matched on email. Only the column: the unique index,
 *    the foreign key and an employee record for every user come from
 *    migration 017, which is the complete change.
 *
 * Runs over the master connection: the tenant schemas are on the same server,
 * and this is the connection provisioning already uses to build them. Each
 * change is tried on its own; a failure is logged and skipped, and never stops
 * the application starting.
 */
@Injectable()
export class TenantSchemaBootstrap implements OnApplicationBootstrap {
  private readonly logger = new Logger(TenantSchemaBootstrap.name);

  constructor(
    @InjectDataSource('master')
    private readonly masterDataSource: DataSource,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    let tenants: Array<{ tenantId: string; databaseName: string }>;
    try {
      tenants = await this.masterDataSource.query(
        `SELECT \`tenant_id\` AS tenantId, \`database_name\` AS databaseName
         FROM \`tenant_databases\`
         WHERE \`is_provisioned\` = 1`,
      );
    } catch (error) {
      this.logger.warn(
        `Skipped tenant schema check, could not list tenants: ${(error as Error).message}`,
      );
      return;
    }

    for (const { tenantId, databaseName } of tenants) {
      await this.attempt(databaseName, 'the users table', () =>
        this.ensureUsersTable(tenantId, databaseName),
      );
      await this.attempt(databaseName, 'sales_orders.customer_po_number', () =>
        this.ensureColumn(
          databaseName,
          'sales_orders',
          'customer_po_number',
          'VARCHAR(100) NULL',
        ),
      );
      await this.attempt(databaseName, 'hr_employees.user_id', () =>
        this.ensureEmployeeUserLink(databaseName),
      );
    }
  }

  private async attempt(
    databaseName: string,
    what: string,
    change: () => Promise<void>,
  ): Promise<void> {
    try {
      await change();
    } catch (error) {
      this.logger.warn(
        `${databaseName}: could not ensure ${what}: ${(error as Error).message}`,
      );
    }
  }

  private async ensureUsersTable(
    tenantId: string,
    databaseName: string,
  ): Promise<void> {
    const masterDb = this.masterDataSource.options.database as string;

    await this.masterDataSource.query(tenantUsersTableDdl(databaseName));

    // IGNORE: another instance starting at the same moment may insert the
    // same rows first.
    const result = await this.masterDataSource.query(
      `INSERT IGNORE INTO \`${databaseName}\`.\`users\`
         (\`id\`, \`employee_code\`, \`email\`, \`password_hash\`, \`first_name\`,
          \`last_name\`, \`phone\`, \`is_active\`, \`created_by\`, \`deleted_at\`)
       SELECT m.\`id\`, m.\`employee_code\`, m.\`email\`, m.\`password_hash\`,
              m.\`first_name\`, m.\`last_name\`, m.\`phone\`, m.\`is_active\`,
              m.\`created_by\`, m.\`deleted_at\`
       FROM \`${masterDb}\`.\`tenant_users\` m
       WHERE m.\`tenant_id\` = ?
         AND NOT EXISTS (
           SELECT 1 FROM \`${databaseName}\`.\`users\` u
           WHERE u.\`id\` = m.\`id\` OR u.\`email\` = m.\`email\`
         )`,
      [tenantId],
    );

    const copied = Number(result?.affectedRows ?? 0);
    if (copied > 0) {
      this.logger.log(`${databaseName}: copied ${copied} user(s) into users`);
    }
  }

  /**
   * The employee-to-login column, and the pairs it can already resolve.
   *
   * Without it every HR employee query fails: the entity maps `userId`, so
   * TypeORM puts it in the SELECT list. The backfill repeats what the old
   * implicit email match used to do at read time, so nobody loses their
   * roles between this running and migration 017.
   */
  private async ensureEmployeeUserLink(databaseName: string): Promise<void> {
    await this.ensureColumn(databaseName, 'hr_employees', 'user_id', 'CHAR(36) NULL');

    // Only ever fills blanks, so it is safe to repeat on every startup.
    await this.masterDataSource.query(
      `UPDATE \`${databaseName}\`.\`hr_employees\` e
         JOIN \`${databaseName}\`.\`users\` u
           ON LOWER(u.\`email\`) = LOWER(e.\`email\`)
          AND u.\`deleted_at\` IS NULL
       SET e.\`user_id\` = u.\`id\`
       WHERE e.\`email\` IS NOT NULL
         AND e.\`user_id\` IS NULL
         AND e.\`deleted_at\` IS NULL`,
    );
  }

  /**
   * Adds a column if it is missing. Appended at the end of the table, which
   * MySQL 8 can do in place without copying the table.
   */
  private async ensureColumn(
    databaseName: string,
    table: string,
    column: string,
    definition: string,
  ): Promise<void> {
    const [{ n }] = await this.masterDataSource.query(
      `SELECT COUNT(*) AS n FROM information_schema.COLUMNS
       WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
      [databaseName, table, column],
    );
    if (Number(n) > 0) return;

    await this.masterDataSource.query(
      `ALTER TABLE \`${databaseName}\`.\`${table}\` ADD COLUMN \`${column}\` ${definition}`,
    );
    this.logger.log(`${databaseName}: added ${table}.${column}`);
  }
}
