import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * `hr_employees` was missing 12 columns the Employee entity maps (the six
 * address fields, reporting_to vs reporting_to_id, three date fields,
 * bank_branch, profile_photo_url). TypeORM builds its SELECT list from the
 * entity, so every HR employee query failed. Tenants provisioned before the
 * HR module existed have no such table at all; it is created here.
 *
 * This migration used to also retire the tenant `users` table (re-keying
 * user_roles / user_sessions to master ids, deleting grants that still
 * matched a tenant user, then renaming `users` to `users_retired_backup`).
 * That step is gone: the tenant `users` table is back, as a mirror of master
 * under the same ids, and migration 015 does the re-keying. Left in place,
 * the old step would have read every mirrored user's grants as orphans and
 * deleted them on any tenant where this migration was still pending.
 * Tenants that already ran it keep `users_retired_backup`; 015 recreates
 * `users` beside it.
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
  }

  public down(): Promise<void> {
    // Not reversible: the column changes above fold and rename data (address
    // into address_line1, reporting_to_id into reporting_to). Restore from a
    // backup instead.
    return Promise.reject(
      new Error(
        'FixEmployeeSchemaAndRetireTenantUsers cannot be reverted. Restore the tenant database from a backup.',
      ),
    );
  }
}
