import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Merges the `users` table into `hr_employees`, making one row per person.
 *
 * Two things are fixed at once, because authentication cannot be moved onto a
 * table whose shape is wrong:
 *
 *  1. `hr_employees` was missing 12 columns the Employee entity already maps
 *     (the six address fields, reporting_to vs reporting_to_id, three date
 *     fields, bank_branch, profile_photo_url). Every HR employee query failed
 *     against a provisioned tenant.
 *  2. `users` and `hr_employees` modelled the same person as two unrelated
 *     rows, so nothing could resolve a signed-in user to their HR record.
 *
 * Identity ids are preserved: a person keeps their `users.id`. That matters
 * because `created_by` columns all over the schema hold user ids with no
 * foreign key to enforce them, and rewriting every one of those is not
 * tractable. Where an employee already exists with the same email, it is that
 * employee's id which moves, and the three HR child tables are updated to
 * follow it.
 *
 * NOTE: this rewrites keys and drops a table. Run it against a copy of a real
 * tenant database before production.
 */
export class MergeUsersIntoEmployees1700000000013 implements MigrationInterface {
  name = 'MergeUsersIntoEmployees1700000000013';

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

  /** Adds a column only when it is absent; MySQL has no ADD COLUMN IF NOT EXISTS. */
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
    if (!(await this.hasTable(queryRunner, 'hr_employees'))) {
      // Tenants provisioned before the HR module existed have no hr_* tables
      // at all. Only hr_employees is created here, because that is the table
      // identity moves onto; the rest of the HR schema comes from
      // POST /master/tenants/:id/sync-schema, which adds whatever is missing.
      await queryRunner.query(`
        CREATE TABLE \`hr_employees\` (
          \`id\`                      CHAR(36)      NOT NULL,
          \`employee_code\`           VARCHAR(50)   NOT NULL,
          \`first_name\`              VARCHAR(100)  NOT NULL,
          \`last_name\`               VARCHAR(100)  NULL,
          \`email\`                   VARCHAR(255)  NULL,
          \`phone\`                   VARCHAR(50)   NULL,
          \`password_hash\`           VARCHAR(255)  NULL,
          \`is_email_verified\`       TINYINT(1)    NOT NULL DEFAULT 0,
          \`email_verified_at\`       TIMESTAMP     NULL,
          \`last_login_at\`           TIMESTAMP     NULL,
          \`last_login_ip\`           VARCHAR(45)   NULL,
          \`password_changed_at\`     TIMESTAMP     NULL,
          \`failed_login_attempts\`   INT           NOT NULL DEFAULT 0,
          \`locked_until\`            TIMESTAMP     NULL,
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
          \`hire_date\`               DATE          NULL,
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
    }

    // ── 1. Bring hr_employees up to the shape the entity expects ──────────
    const columns: Array<[string, string]> = [
      ['password_hash', 'VARCHAR(255) NULL'],
      ['is_email_verified', 'TINYINT(1) NOT NULL DEFAULT 0'],
      ['email_verified_at', 'TIMESTAMP NULL'],
      ['last_login_at', 'TIMESTAMP NULL'],
      ['last_login_ip', 'VARCHAR(45) NULL'],
      ['password_changed_at', 'TIMESTAMP NULL'],
      ['failed_login_attempts', 'INT NOT NULL DEFAULT 0'],
      ['locked_until', 'TIMESTAMP NULL'],
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
    ];
    for (const [name, definition] of columns) {
      await this.addColumn(queryRunner, 'hr_employees', name, definition);
    }

    // The entity widened these; older tenants have narrower definitions.
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
    // The tenant's first administrator has no meaningful hire date.
    await queryRunner.query(
      'ALTER TABLE `hr_employees` MODIFY `hire_date` DATE NULL',
    );
    // PROBATION is the entity's default but was absent from the enum.
    await queryRunner.query(
      `ALTER TABLE \`hr_employees\` MODIFY \`employment_status\`
       ENUM('ACTIVE','INACTIVE','PROBATION','ON_LEAVE','TERMINATED','RESIGNED')
       NOT NULL DEFAULT 'PROBATION'`,
    );

    // Single free-text address becomes the first address line. Nothing is
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
    if (await this.hasColumn(queryRunner, 'hr_employees', 'reporting_to_id')) {
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
    }

    if (!(await this.hasTable(queryRunner, 'users'))) {
      return; // schema already merged
    }

    // ── 2. Move the people across ─────────────────────────────────────────
    // Foreign keys are suspended for the id surgery below and re-validated
    // when the new constraints are added at the end.
    await queryRunner.query('SET FOREIGN_KEY_CHECKS = 0');

    try {
      // 2a. A user whose email already belongs to an employee: that employee
      //     takes the user's id, so every created_by reference stays valid.
      const collisions: Array<{ userId: string; employeeId: string }> =
        await queryRunner.query(
          `SELECT u.id AS userId, e.id AS employeeId
           FROM \`users\` u
           JOIN \`hr_employees\` e ON e.\`email\` = u.\`email\`
           WHERE u.\`email\` IS NOT NULL AND e.\`id\` <> u.\`id\``,
        );

      for (const { userId, employeeId } of collisions) {
        for (const [table, column] of [
          ['hr_attendance', 'employee_id'],
          ['hr_leave_requests', 'employee_id'],
          ['hr_payroll', 'employee_id'],
        ] as Array<[string, string]>) {
          if (!(await this.hasTable(queryRunner, table))) continue;
          await queryRunner.query(
            `UPDATE \`${table}\` SET \`${column}\` = ? WHERE \`${column}\` = ?`,
            [userId, employeeId],
          );
        }
        await queryRunner.query(
          'UPDATE `hr_employees` SET `id` = ? WHERE `id` = ?',
          [userId, employeeId],
        );
      }

      // 2b. Copy credentials onto the rows that now share the user's id.
      await queryRunner.query(
        `UPDATE \`hr_employees\` e
         JOIN \`users\` u ON u.\`id\` = e.\`id\`
         SET e.\`email\`                 = COALESCE(e.\`email\`, u.\`email\`),
             e.\`password_hash\`         = u.\`password_hash\`,
             e.\`is_email_verified\`     = u.\`is_email_verified\`,
             e.\`email_verified_at\`     = u.\`email_verified_at\`,
             e.\`last_login_at\`         = u.\`last_login_at\`,
             e.\`last_login_ip\`         = u.\`last_login_ip\`,
             e.\`password_changed_at\`   = u.\`password_changed_at\`,
             e.\`failed_login_attempts\` = u.\`failed_login_attempts\`,
             e.\`locked_until\`          = u.\`locked_until\`,
             e.\`profile_photo_url\`     = COALESCE(e.\`profile_photo_url\`, u.\`avatar_url\`),
             e.\`is_active\`             = u.\`is_active\`,
             e.\`deleted_at\`            = COALESCE(e.\`deleted_at\`, u.\`deleted_at\`)`,
      );

      // 2c. Users with no employee row become one, keeping their id. The
      //     employee_code falls back to a deterministic value derived from the
      //     id, since the column is unique and NOT NULL.
      await queryRunner.query(
        `INSERT INTO \`hr_employees\`
           (\`id\`, \`employee_code\`, \`first_name\`, \`last_name\`, \`email\`, \`phone\`,
            \`password_hash\`, \`is_email_verified\`, \`email_verified_at\`,
            \`last_login_at\`, \`last_login_ip\`, \`password_changed_at\`,
            \`failed_login_attempts\`, \`locked_until\`, \`profile_photo_url\`,
            \`employment_type\`, \`employment_status\`, \`salary_basis\`,
            \`basic_salary\`, \`is_active\`, \`created_by\`, \`created_at\`,
            \`updated_at\`, \`deleted_at\`)
         SELECT u.\`id\`,
                COALESCE(NULLIF(u.\`employee_code\`, ''), CONCAT('EMP-', UPPER(SUBSTRING(REPLACE(u.\`id\`, '-', ''), 1, 8)))),
                u.\`first_name\`, u.\`last_name\`, u.\`email\`, u.\`phone\`,
                u.\`password_hash\`, u.\`is_email_verified\`, u.\`email_verified_at\`,
                u.\`last_login_at\`, u.\`last_login_ip\`, u.\`password_changed_at\`,
                u.\`failed_login_attempts\`, u.\`locked_until\`, u.\`avatar_url\`,
                'FULL_TIME', 'ACTIVE', 'MONTHLY',
                0, u.\`is_active\`, u.\`created_by\`, u.\`created_at\`,
                u.\`updated_at\`, u.\`deleted_at\`
         FROM \`users\` u
         LEFT JOIN \`hr_employees\` e ON e.\`id\` = u.\`id\`
         WHERE e.\`id\` IS NULL`,
      );

      // ── 3. Repoint every foreign key that referenced `users` ────────────
      for (const table of [
        'user_sessions',
        'user_roles',
        'quotations',
        'pos_sessions',
      ]) {
        if (!(await this.hasTable(queryRunner, table))) continue;
        for (const name of await this.constraintNames(queryRunner, table)) {
          await queryRunner.query(
            `ALTER TABLE \`${table}\` DROP FOREIGN KEY \`${name}\``,
          );
        }
      }

      await queryRunner.query('DROP TABLE `users`');
    } finally {
      await queryRunner.query('SET FOREIGN_KEY_CHECKS = 1');
    }

    // ── 4. Re-establish the constraints against hr_employees ─────────────
    await queryRunner.query(
      `ALTER TABLE \`hr_employees\`
         ADD CONSTRAINT \`fk_emp_report\` FOREIGN KEY (\`reporting_to\`)
           REFERENCES \`hr_employees\` (\`id\`) ON DELETE SET NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_sessions\`
         ADD CONSTRAINT \`fk_session_user\` FOREIGN KEY (\`user_id\`)
           REFERENCES \`hr_employees\` (\`id\`) ON DELETE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE \`user_roles\`
         ADD CONSTRAINT \`fk_user_role_user\` FOREIGN KEY (\`user_id\`)
           REFERENCES \`hr_employees\` (\`id\`) ON DELETE CASCADE`,
    );

    if (await this.hasTable(queryRunner, 'hr_departments')) {
      await queryRunner.query(
        `ALTER TABLE \`hr_employees\`
           ADD CONSTRAINT \`fk_emp_dept\` FOREIGN KEY (\`department_id\`)
             REFERENCES \`hr_departments\` (\`id\`) ON DELETE SET NULL`,
      );
    }
    if (await this.hasTable(queryRunner, 'hr_designations')) {
      await queryRunner.query(
        `ALTER TABLE \`hr_employees\`
           ADD CONSTRAINT \`fk_emp_desig\` FOREIGN KEY (\`designation_id\`)
             REFERENCES \`hr_designations\` (\`id\`) ON DELETE SET NULL`,
      );
    }
  }

  public down(): Promise<void> {
    // Not reversible. Splitting the merged rows back into `users` and
    // `hr_employees` cannot distinguish a person who was only ever an
    // employee from one who was only ever a user, and the original employee
    // ids of any email collisions are gone. Restore from a backup instead.
    return Promise.reject(
      new Error(
        'MergeUsersIntoEmployees cannot be reverted. Restore the tenant database from a backup.',
      ),
    );
  }
}
