import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource, QueryRunner } from 'typeorm';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import { tenantUsersTableDdl } from '@database/tenant-users-table';
import { LinkEmployeesToUsers1700000000017 } from '@database/migrations/tenant/1700000000017-LinkEmployeesToUsers';

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
 *  - migration 017 in full: `hr_employees.user_id` linking each person to
 *    their login (existing pairs matched on email), an employee record for
 *    every login that has none, and the one-employee-per-login keys. Every
 *    user is an employee, and User Management edits people through that
 *    record, so a login without one cannot be edited at all.
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
      await this.attempt(databaseName, 'an employee record for every user', () =>
        this.linkEmployeesToUsers(databaseName),
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
   * Migration 017, applied in place.
   *
   * Its `up()` checks before every step — column, links, missing records,
   * keys — so running it on each startup is safe, and once a tenant is
   * complete it only reads. It works against the current database, so it
   * gets a connection opened on the tenant with the master credentials, as
   * provisioning does.
   */
  private async linkEmployeesToUsers(databaseName: string): Promise<void> {
    const master = this.masterDataSource.options as MysqlConnectionOptions;
    const tenant = new DataSource({
      type: 'mysql',
      host: master.host,
      port: master.port,
      username: master.username,
      password: master.password,
      database: databaseName,
      timezone: master.timezone,
      charset: master.charset,
    });
    await tenant.initialize();
    const runner = tenant.createQueryRunner();
    try {
      const before = await this.countEmployees(runner);
      await new LinkEmployeesToUsers1700000000017().up(runner);
      const created = (await this.countEmployees(runner)) - before;
      if (created > 0) {
        this.logger.log(
          `${databaseName}: created ${created} employee record(s) for users who had none`,
        );
      }
    } finally {
      await runner.release();
      await tenant.destroy();
    }
  }

  private async countEmployees(runner: QueryRunner): Promise<number> {
    if (!(await runner.hasTable('hr_employees'))) return 0;
    const [{ n }] = await runner.query(
      'SELECT COUNT(*) AS n FROM `hr_employees`',
    );
    return Number(n);
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
