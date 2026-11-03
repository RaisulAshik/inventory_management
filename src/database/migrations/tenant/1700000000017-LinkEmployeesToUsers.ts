import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Makes every user an employee, and joins the two records properly.
 *
 * Until now `hr_employees` and `users` were deliberately unrelated: the only
 * thing they shared was an email address, matched as a string. That made the
 * link silently breakable — editing an employee's email detached them from
 * their own login — and allowed logins with no HR record at all.
 *
 * Three steps:
 *  1. `hr_employees.user_id`, a real FK to `users`, unique so one login maps
 *     to at most one employee. ON DELETE SET NULL: removing a login leaves
 *     the HR record standing, which is what ex-staff should look like.
 *  2. Backfill it by the email match that used to be implicit, so existing
 *     pairs survive the change.
 *  3. Give every remaining user an employee record. `hire_date` is taken
 *     from when the account was created — the only honest date available —
 *     and employment status is ACTIVE since they hold a working login.
 *
 * Employee codes come from `sequence_numbers`, the same counter the
 * application uses, so codes minted here cannot collide with later ones.
 */
export class LinkEmployeesToUsers1700000000017 implements MigrationInterface {
  name = 'LinkEmployeesToUsers1700000000017';

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

  private async hasTable(qr: QueryRunner, table: string): Promise<boolean> {
    const rows = await qr.query(
      `SELECT COUNT(*) AS n FROM information_schema.TABLES
       WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ?`,
      [table],
    );
    return Number(rows[0].n) > 0;
  }

  private async hasIndex(
    qr: QueryRunner,
    table: string,
    index: string,
  ): Promise<boolean> {
    const rows = await qr.query(
      `SELECT COUNT(*) AS n FROM information_schema.STATISTICS
       WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND INDEX_NAME = ?`,
      [table, index],
    );
    return Number(rows[0].n) > 0;
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Both tables are created by earlier migrations, but a tenant can be at
    // any point in the sequence; without them there is nothing to link.
    if (
      !(await this.hasTable(queryRunner, 'hr_employees')) ||
      !(await this.hasTable(queryRunner, 'users'))
    ) {
      return;
    }

    // ── 1. the column ─────────────────────────────────────────────────────
    if (!(await this.hasColumn(queryRunner, 'hr_employees', 'user_id'))) {
      await queryRunner.query(
        `ALTER TABLE \`hr_employees\` ADD COLUMN \`user_id\` CHAR(36) NULL AFTER \`email\``,
      );
    }

    // ── 2. backfill from the email match that used to be implicit ─────────
    // Lower-cased on both sides: users.email is stored lower-cased by
    // UsersService, employee emails were never normalised.
    await queryRunner.query(`
      UPDATE \`hr_employees\` e
        JOIN \`users\` u
          ON LOWER(u.\`email\`) = LOWER(e.\`email\`)
         AND u.\`deleted_at\` IS NULL
      SET e.\`user_id\` = u.\`id\`
      WHERE e.\`email\` IS NOT NULL
        AND e.\`user_id\` IS NULL
        AND e.\`deleted_at\` IS NULL
    `);

    // A duplicate would make the unique index below fail. It can only happen
    // if two employee rows share one address, which the application forbids;
    // keep the oldest and detach the rest rather than abort the migration.
    await queryRunner.query(`
      UPDATE \`hr_employees\` e
        JOIN (
          SELECT \`user_id\`, MIN(\`created_at\`) AS keep_at
          FROM \`hr_employees\`
          WHERE \`user_id\` IS NOT NULL
          GROUP BY \`user_id\`
          HAVING COUNT(*) > 1
        ) dup ON dup.\`user_id\` = e.\`user_id\`
      SET e.\`user_id\` = NULL
      WHERE e.\`created_at\` > dup.keep_at
    `);

    // ── 3. an employee record for every remaining user ────────────────────
    const orphans: Array<{
      id: string;
      email: string;
      firstName: string;
      lastName: string | null;
      phone: string | null;
      isActive: number;
      createdAt: Date;
    }> = await queryRunner.query(`
      SELECT u.\`id\`         AS id,
             u.\`email\`      AS email,
             u.\`first_name\` AS firstName,
             u.\`last_name\`  AS lastName,
             u.\`phone\`      AS phone,
             u.\`is_active\`  AS isActive,
             u.\`created_at\` AS createdAt
      FROM \`users\` u
      LEFT JOIN \`hr_employees\` e
        ON e.\`user_id\` = u.\`id\` AND e.\`deleted_at\` IS NULL
      WHERE u.\`deleted_at\` IS NULL
        AND e.\`id\` IS NULL
      ORDER BY u.\`created_at\`
    `);

    for (const user of orphans) {
      const employeeCode = await this.nextEmployeeCode(queryRunner);
      await queryRunner.query(
        `INSERT INTO \`hr_employees\`
           (\`id\`, \`employee_code\`, \`first_name\`, \`last_name\`, \`email\`,
            \`user_id\`, \`phone\`, \`hire_date\`, \`employment_type\`,
            \`employment_status\`, \`salary_basis\`, \`basic_salary\`,
            \`is_active\`, \`created_at\`, \`updated_at\`)
         VALUES (UUID(), ?, ?, ?, ?, ?, ?, DATE(?), 'FULL_TIME',
                 ?, 'MONTHLY', 0, ?, NOW(6), NOW(6))`,
        [
          employeeCode,
          user.firstName,
          user.lastName,
          user.email,
          user.id,
          user.phone,
          user.createdAt,
          user.isActive ? 'ACTIVE' : 'INACTIVE',
          user.isActive,
        ],
      );
      // Keep the user's own copy of the code in step, as UsersService does.
      await queryRunner.query(
        `UPDATE \`users\` SET \`employee_code\` = ? WHERE \`id\` = ? AND \`employee_code\` IS NULL`,
        [employeeCode, user.id],
      );
    }

    // ── 4. constraints, once the data satisfies them ──────────────────────
    if (!(await this.hasIndex(queryRunner, 'hr_employees', 'uk_emp_user'))) {
      await queryRunner.query(
        `ALTER TABLE \`hr_employees\` ADD UNIQUE KEY \`uk_emp_user\` (\`user_id\`)`,
      );
    }
    if (!(await this.hasIndex(queryRunner, 'hr_employees', 'fk_emp_user'))) {
      await queryRunner.query(`
        ALTER TABLE \`hr_employees\`
          ADD CONSTRAINT \`fk_emp_user\` FOREIGN KEY (\`user_id\`)
          REFERENCES \`users\` (\`id\`) ON DELETE SET NULL ON UPDATE CASCADE
      `);
    }
  }

  /**
   * The next EMPLOYEE code, from the shared counter.
   *
   * Mirrors getNextSequence (common/utils/sequence.util.ts): DAILY reset,
   * prefix EMP, 4-digit padding, so the format matches codes the running
   * application mints. LAST_INSERT_ID carries the value back on this same
   * connection, which is how that helper stays race-free.
   */
  private async nextEmployeeCode(qr: QueryRunner): Promise<string> {
    await qr.query(
      `INSERT IGNORE INTO \`sequence_numbers\`
         (id, sequence_type, prefix, current_number, padding_length,
          reset_period, last_reset_at, created_at, updated_at)
       VALUES (UUID(), 'EMPLOYEE', 'EMP', 0, 4, 'DAILY', '1970-01-01', NOW(), NOW())`,
    );
    await qr.query(`
      UPDATE \`sequence_numbers\`
      SET current_number = IF(
            COALESCE(last_reset_at, '1970-01-01') < CURDATE(),
            LAST_INSERT_ID(1),
            LAST_INSERT_ID(current_number + 1)
          ),
          last_reset_at = IF(
            COALESCE(last_reset_at, '1970-01-01') < CURDATE(),
            CURDATE(),
            last_reset_at
          ),
          updated_at = NOW()
      WHERE sequence_type = 'EMPLOYEE'
    `);
    const [row] = await qr.query(
      `SELECT LAST_INSERT_ID() AS n, padding_length AS pad
       FROM \`sequence_numbers\` WHERE sequence_type = 'EMPLOYEE'`,
    );
    const now = new Date();
    const datePart =
      String(now.getFullYear()).slice(-2) +
      String(now.getMonth() + 1).padStart(2, '0') +
      String(now.getDate()).padStart(2, '0');
    return `EMP${datePart}${String(row.n).padStart(Number(row.pad) || 4, '0')}`;
  }

  /**
   * Only the link is removed. Employee records created above are left in
   * place: by the time this runs they may carry attendance, leave and
   * payroll rows, and dropping them would take that history with them.
   */
  public async down(queryRunner: QueryRunner): Promise<void> {
    if (!(await this.hasTable(queryRunner, 'hr_employees'))) return;
    if (await this.hasIndex(queryRunner, 'hr_employees', 'fk_emp_user')) {
      await queryRunner.query(
        `ALTER TABLE \`hr_employees\` DROP FOREIGN KEY \`fk_emp_user\``,
      );
    }
    if (await this.hasIndex(queryRunner, 'hr_employees', 'uk_emp_user')) {
      await queryRunner.query(
        `ALTER TABLE \`hr_employees\` DROP INDEX \`uk_emp_user\``,
      );
    }
    if (await this.hasColumn(queryRunner, 'hr_employees', 'user_id')) {
      await queryRunner.query(
        `ALTER TABLE \`hr_employees\` DROP COLUMN \`user_id\``,
      );
    }
  }
}
