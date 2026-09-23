import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Adds the columns `tenant_users` needs now that it is the only user table.
 *
 * The tenant databases each had their own `users` table carrying these
 * fields; with users consolidated into master, they move here. `phone` in
 * particular was already being written by UsersService through a DeepPartial
 * cast, which silently discarded it because the column did not exist.
 *
 * `employee_code` is a free-text reference only. Employees live in the tenant
 * databases and have no relation to users, so no foreign key is possible and
 * nothing joins on it.
 */
export class ExtendTenantUsers1700000000003 implements MigrationInterface {
  name = 'ExtendTenantUsers1700000000003';

  private readonly columns: Array<[string, string]> = [
    ['phone', 'VARCHAR(50) NULL'],
    ['avatar_url', 'VARCHAR(500) NULL'],
    ['employee_code', 'VARCHAR(50) NULL'],
    ['is_email_verified', 'TINYINT(1) NOT NULL DEFAULT 0'],
    ['email_verified_at', 'TIMESTAMP NULL'],
    ['last_login_ip', 'VARCHAR(45) NULL'],
    ['password_changed_at', 'TIMESTAMP NULL'],
    ['created_by', 'CHAR(36) NULL'],
    ['deleted_at', 'DATETIME(6) NULL'],
  ];

  private async hasColumn(qr: QueryRunner, column: string): Promise<boolean> {
    const rows = await qr.query(
      `SELECT COUNT(*) AS n FROM information_schema.COLUMNS
       WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'tenant_users'
         AND COLUMN_NAME = ?`,
      [column],
    );
    return Number(rows[0].n) > 0;
  }

  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const [column, definition] of this.columns) {
      if (await this.hasColumn(queryRunner, column)) continue;
      await queryRunner.query(
        `ALTER TABLE \`tenant_users\` ADD COLUMN \`${column}\` ${definition}`,
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    for (const [column] of this.columns) {
      if (!(await this.hasColumn(queryRunner, column))) continue;
      await queryRunner.query(
        `ALTER TABLE \`tenant_users\` DROP COLUMN \`${column}\``,
      );
    }
  }
}
