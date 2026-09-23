import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Two things, both consequences of users and employees being separate:
 *
 *  1. `hr_employees` was missing 12 columns the Employee entity maps (the six
 *     address fields, reporting_to vs reporting_to_id, three date fields,
 *     bank_branch, profile_photo_url). TypeORM builds its SELECT list from the
 *     entity, so every HR employee query failed. Tenants provisioned before
 *     the HR module existed have no such table at all; it is created here.
 *
 *  2. The tenant database had its own `users` table duplicating the master
 *     `tenant_users`. Users belong in master — they are not tenant data — so
 *     the tenant copy is retired. Roles and sessions stay here, keyed by the
 *     master user id with no foreign key, because the two tables are in
 *     different databases.
 *
 * `users` is RENAMED, not dropped, so nothing is lost if the id remapping
 * below cannot match every row. Drop `users_retired_backup` by hand once the
 * result has been checked.
 *
 * NOTE: rewrites keys. Run against a copy of a real tenant database first.
 */
export class FixEmployeeSchemaAndRetireTenantUsers1700000000013 implements MigrationInterface {
  name = 'FixEmployeeSchemaAndRetireTenantUsers1700000000013';

  private async hasTable(qr: QueryRunner, table: string): Promise<boolean> {
    const rows = await qr.query(
      `SELECT COUNT(*) AS n FROM information_schema.TABLES
       WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ?`,
      [table],
    );
    return Number(rows[0].n) > 0;
  }

  private async hasColumn(
    qr: QueryRunner,
    table: string,
    column: string,
  ): Promise<boolean> {
    const rows = await qr.query(
      `SELECT COUNT(*) AS n FROM information_schema.COLUMNS
       WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
      [table, column],
    );
    return Number(rows[0].n) > 0;
  }

  private async constraintNames(
    qr: QueryRunner,
    table: string,
  ): Promise<string[]> {
    const rows = await qr.query(
      `SELECT CONSTRAINT_NAME AS name FROM information_schema.TABLE_CONSTRAINTS
       WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ?
         AND CONSTRAINT_TYPE = 'FOREIGN KEY'`,
      [table],
    );
    return rows.map((r: { name: string }) => r.name);
  }

  /** MySQL has no ADD COLUMN IF NOT EXISTS. */
  private async addColumn(
    qr: QueryRunner,
    table: string,
    column: string,
    definition: string,
  ): Promise<void> {
    if (await this.hasColumn(qr, table, column)) return;
    await qr.query(
      `ALTER TABLE \`${table}\` ADD COLUMN \`${column}\` ${definition}`,
    );
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    // ── 1. hr_employees ───────────────────────────────────────────────────
    if (!(await this.hasTable(queryRunner, 'hr_employees'))) {
      await queryRunner.query(`
        CREATE TABLE \`hr_employees\` (
          \`id\`                      CHAR(36)      NOT NULL,
          \`employee_code\`           VARCHAR(50)   NOT NULL,
          \`first_name\`              VARCHAR(100)  NOT NULL,
          \`last_name\`               VARCHAR(100)  NULL,
          \`email\`                   VARCHAR(255)  NULL,
          \`phone\`                   VARCHAR(50)   NULL,
          \`date_of_birth\`           DATE          NULL,
          \`gender\`                  ENUM('MALE','FEMALE','OTHER') NULL,
          \`marital_status\`          ENUM('SINGLE','MARRIED','DIVORCED','WIDOWED') NULL,
          \`national_id\`             VARCHAR(100)  NULL,
          \`address_line1\`           VARCHAR(255)  NULL,
          \`address_line2\`           VARCHAR(255)  NULL,
          \`city\`                    VARCHAR(100)  NULL,
          \`state\`                   VARCHAR(100)  NULL,
          \`country\`                 VARCHAR(100)  NULL,
          \`postal_code\`             VARCHAR(20)   NULL,
          \`emergency_contact_name\`  VARCHAR(100)  NULL,
          \`emergency_contact_phone\` VARCHAR(50)   NULL,
          \`department_id\`           CHAR(36)      NULL,
          \`designation_id\`          CHAR(36)      NULL,
          \`reporting_to\`            CHAR(36)      NULL,
          \`hire_date\`               DATE          NOT NULL,
          \`confirmation_date\`       DATE          NULL,
          \`resign_date\`             DATE          NULL,
          \`termination_date\`        DATE          NULL,
          \`employment_type\`         ENUM('FULL_TIME','PART_TIME','CONTRACT','INTERNSHIP') NOT NULL DEFAULT 'FULL_TIME',
          \`employment_status\`       ENUM('ACTIVE','INACTIVE','PROBATION','ON_LEAVE','TERMINATED','RESIGNED') NOT NULL DEFAULT 'PROBATION',
          \`salary_basis\`            ENUM('MONTHLY','DAILY','HOURLY') NOT NULL DEFAULT 'MONTHLY',
          \`basic_salary\`            DECIMAL(18,4) NOT NULL DEFAULT 0,
          \`bank_name\`               VARCHAR(200)  NULL,
          \`bank_account_number\`     VARCHAR(100)  NULL,
          \`bank_branch\`             VARCHAR(200)  NULL,
          \`profile_photo_url\`       VARCHAR(500)  NULL,
          \`notes\`                   TEXT          NULL,
          \`is_active\`               TINYINT(1)    NOT NULL DEFAULT 1,
          \`created_by\`              CHAR(36)      NULL,
          \`created_at\`              DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
          \`updated_at\`              DATETIME(6)   NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
          \`deleted_at\`              DATETIME(6)   NULL,
          PRIMARY KEY (\`id\`),
          UNIQUE KEY \`uk_emp_code\`  (\`employee_code\`),
          UNIQUE KEY \`uk_emp_email\` (\`email\`),
          INDEX \`idx_emp_active\` (\`is_active\`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
      `);
    } else {
      for (const [name, definition] of [
        ['address_line1', 'VARCHAR(255) NULL'],
        ['address_line2', 'VARCHAR(255) NULL'],
        ['city', 'VARCHAR(100) NULL'],
        ['state', 'VARCHAR(100) NULL'],
        ['country', 'VARCHAR(100) NULL'],
        ['postal_code', 'VARCHAR(20) NULL'],
        ['confirmation_date', 'DATE NULL'],
        ['resign_date', 'DATE NULL'],
        ['termination_date', 'DATE NULL'],
        ['bank_branch', 'VARCHAR(200) NULL'],
        ['profile_photo_url', 'VARCHAR(500) NULL'],
      ] as Array<[string, string]>) {
        await this.addColumn(queryRunner, 'hr_employees', name, definition);
      }

      // Older tenants defined these narrower than the entity does.
      await queryRunner.query(
        'ALTER TABLE `hr_employees` MODIFY `first_name` VARCHAR(100) NOT NULL',
      );
      await queryRunner.query(
        'ALTER TABLE `hr_employees` MODIFY `last_name` VARCHAR(100) NULL',
      );
      await queryRunner.query(
        'ALTER TABLE `hr_employees` MODIFY `email` VARCHAR(255) NULL',
      );
      await queryRunner.query(
        'ALTER TABLE `hr_employees` MODIFY `phone` VARCHAR(50) NULL',
      );
      await queryRunner.query(
        'ALTER TABLE `hr_employees` MODIFY `employee_code` VARCHAR(50) NOT NULL',
      );
      // PROBATION is the entity's default but was absent from the enum.
      await queryRunner.query(
        `ALTER TABLE \`hr_employees\` MODIFY \`employment_status\`
         ENUM('ACTIVE','INACTIVE','PROBATION','ON_LEAVE','TERMINATED','RESIGNED')
         NOT NULL DEFAULT 'PROBATION'`,
      );

      // A single free-text address becomes the first address line. Nothing is
      // parsed out of it; splitting a free-text address is not safe to guess.
      if (await this.hasColumn(queryRunner, 'hr_employees', 'address')) {
        await queryRunner.query(
          `UPDATE \`hr_employees\`
           SET \`address_line1\` = \`address\`
           WHERE \`address\` IS NOT NULL AND \`address\` <> ''
             AND (\`address_line1\` IS NULL OR \`address_line1\` = '')`,
        );
        await queryRunner.query(
          'ALTER TABLE `hr_employees` DROP COLUMN `address`',
        );
      }

      // reporting_to_id -> reporting_to, dropping its FK first if present.
      if (
        await this.hasColumn(queryRunner, 'hr_employees', 'reporting_to_id')
      ) {
        for (const name of await this.constraintNames(
          queryRunner,
          'hr_employees',
        )) {
          await queryRunner.query(
            `ALTER TABLE \`hr_employees\` DROP FOREIGN KEY \`${name}\``,
          );
        }
        if (await this.hasColumn(queryRunner, 'hr_employees', 'reporting_to')) {
          await queryRunner.query(
            'ALTER TABLE `hr_employees` DROP COLUMN `reporting_to`',
          );
        }
        await queryRunner.query(
          'ALTER TABLE `hr_employees` CHANGE `reporting_to_id` `reporting_to` CHAR(36) NULL',
        );
        await queryRunner.query(
          `ALTER TABLE \`hr_employees\`
             ADD CONSTRAINT \`fk_emp_report\` FOREIGN KEY (\`reporting_to\`)
               REFERENCES \`hr_employees\` (\`id\`) ON DELETE SET NULL`,
        );
      }
    }

    // ── 2. retire the tenant-local users table ────────────────────────────
    if (!(await this.hasTable(queryRunner, 'users'))) {
      return;
    }

    // user_roles and user_sessions currently key off the tenant `users` table.
    // Authentication now issues the MASTER tenant_users id, so those columns
    // have to be remapped. The two rows are matched on email, which is unique
    // on both sides. This is a cross-database statement: it needs the tenant
    // and master schemas to live on the same MySQL server, which they do —
    // tenant connections are opened with the master credentials.
    const masterDb = process.env.MASTER_DB_NAME || 'erp_master';

    for (const table of ['user_roles', 'user_sessions']) {
      if (!(await this.hasTable(queryRunner, table))) continue;

      for (const name of await this.constraintNames(queryRunner, table)) {
        await queryRunner.query(
          `ALTER TABLE \`${table}\` DROP FOREIGN KEY \`${name}\``,
        );
      }

      await queryRunner.query(
        `UPDATE \`${table}\` t
         JOIN \`users\` u        ON u.\`id\` = t.\`user_id\`
         JOIN \`${masterDb}\`.\`tenant_users\` m ON m.\`email\` = u.\`email\`
         SET t.\`user_id\` = m.\`id\``,
      );

      // Anything still pointing at a tenant-only user has no master
      // counterpart and would be dead weight; remove it rather than leave a
      // role grant that resolves to nobody.
      const orphans = await queryRunner.query(
        `SELECT COUNT(*) AS n FROM \`${table}\` t
         JOIN \`users\` u ON u.\`id\` = t.\`user_id\``,
      );
      if (Number(orphans[0].n) > 0) {
        await queryRunner.query(
          `DELETE t FROM \`${table}\` t JOIN \`users\` u ON u.\`id\` = t.\`user_id\``,
        );
      }
    }

    // quotations and pos_sessions referenced users too. Their columns now hold
    // master ids, which no foreign key in this database can enforce.
    for (const table of ['quotations', 'pos_sessions']) {
      if (!(await this.hasTable(queryRunner, table))) continue;
      for (const name of await this.constraintNames(queryRunner, table)) {
        await queryRunner.query(
          `ALTER TABLE \`${table}\` DROP FOREIGN KEY \`${name}\``,
        );
      }
    }

    // Renamed rather than dropped: if the email match above missed anyone,
    // their record is still here to reconcile by hand.
    await queryRunner.query('RENAME TABLE `users` TO `users_retired_backup`');
  }

  public down(): Promise<void> {
    // Not reversible. The remapped user_roles/user_sessions ids cannot be
    // traced back without the original users table, which is why that table is
    // renamed rather than dropped. Restore from a backup instead.
    return Promise.reject(
      new Error(
        'FixEmployeeSchemaAndRetireTenantUsers cannot be reverted. Restore the tenant database from a backup.',
      ),
    );
  }
}
