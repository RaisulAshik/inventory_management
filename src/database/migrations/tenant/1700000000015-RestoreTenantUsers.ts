import { MigrationInterface, QueryRunner } from 'typeorm';

/**
 * Brings back the tenant `users` table, as a mirror of master `tenant_users`.
 *
 * Earlier builds of migration 013 retired it. Users are now copied into the
 * tenant again under the SAME id as their master row, so `user_roles.user_id`
 * resolves inside the tenant database. Master remains the authority;
 * UsersService keeps the copy in step. This is now the only migration that
 * re-keys tenant user ids.
 *
 * Handles three starting points:
 *  - no `users` table (013 ran, or a fresh tenant): it is created;
 *  - the original `users` table, still keyed by tenant-local ids (013 never
 *    ran): foreign keys pointing at it are dropped, then user_roles,
 *    user_sessions and users itself are re-keyed to the master id, matched
 *    on email;
 *  - a `users` table already mirroring master: nothing to re-key.
 * Then every master user of this tenant that has no tenant row is copied in,
 * and existing rows are refreshed from master.
 *
 * Cross-database statements: tenant and master share a MySQL server, as in
 * migration 013. `users_retired_backup`, if present, is left untouched.
 */
export class RestoreTenantUsers1700000000015 implements MigrationInterface {
  name = 'RestoreTenantUsers1700000000015';

  public async up(queryRunner: QueryRunner): Promise<void> {
    const masterDb = process.env.MASTER_DB_NAME || 'erp_master';

    // ── 1. the table ──────────────────────────────────────────────────────
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS \`users\` (
        \`id\` CHAR(36) NOT NULL,
        \`employee_code\` VARCHAR(50) NULL,
        \`email\` VARCHAR(255) NOT NULL,
        \`password_hash\` VARCHAR(255) NOT NULL,
        \`first_name\` VARCHAR(100) NOT NULL,
        \`last_name\` VARCHAR(100) NULL,
        \`phone\` VARCHAR(50) NULL,
        \`is_active\` TINYINT(1) NOT NULL DEFAULT 1,
        \`created_by\` CHAR(36) NULL,
        \`created_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
        \`updated_at\` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
        \`deleted_at\` DATETIME(6) NULL,
        PRIMARY KEY (\`id\`),
        UNIQUE KEY \`uk_user_email\` (\`email\`),
        INDEX \`idx_user_active\` (\`is_active\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    const [tenant] = await queryRunner.query(
      `SELECT \`tenant_id\` AS tenantId FROM \`${masterDb}\`.\`tenant_databases\`
       WHERE \`database_name\` = DATABASE()`,
    );
    if (!tenant) return; // not registered in master; nothing to mirror
    const tenantId: string = tenant.tenantId;

    // ── 2. re-key a pre-013 table to master ids ───────────────────────────
    // Foreign keys into `users` would block re-keying, and the application
    // no longer relies on them: drop them.
    const fks: Array<{ tableName: string; name: string }> =
      await queryRunner.query(
        `SELECT DISTINCT TABLE_NAME AS tableName, CONSTRAINT_NAME AS name
         FROM information_schema.KEY_COLUMN_USAGE
         WHERE TABLE_SCHEMA = DATABASE()
           AND REFERENCED_TABLE_SCHEMA = DATABASE()
           AND REFERENCED_TABLE_NAME = 'users'`,
      );
    for (const fk of fks) {
      await queryRunner.query(
        `ALTER TABLE \`${fk.tableName}\` DROP FOREIGN KEY \`${fk.name}\``,
      );
    }

    for (const table of ['user_roles', 'user_sessions']) {
      // Tenants built by the old CreateCoreTables migration have no
      // user_sessions table.
      if (!(await queryRunner.hasTable(table))) continue;
      await queryRunner.query(
        `UPDATE \`${table}\` t
         JOIN \`users\` u ON u.\`id\` = t.\`user_id\`
         JOIN \`${masterDb}\`.\`tenant_users\` m
           ON m.\`email\` = u.\`email\` AND m.\`tenant_id\` = ?
         SET t.\`user_id\` = m.\`id\`
         WHERE u.\`id\` <> m.\`id\``,
        [tenantId],
      );
    }

    await queryRunner.query(
      `UPDATE \`users\` u
       JOIN \`${masterDb}\`.\`tenant_users\` m
         ON m.\`email\` = u.\`email\` AND m.\`tenant_id\` = ?
       SET u.\`id\` = m.\`id\`
       WHERE u.\`id\` <> m.\`id\``,
      [tenantId],
    );

    // ── 3. refresh existing copies, then add the missing ones ─────────────
    await queryRunner.query(
      `UPDATE \`users\` u
       JOIN \`${masterDb}\`.\`tenant_users\` m ON m.\`id\` = u.\`id\`
       SET u.\`email\`         = m.\`email\`,
           u.\`password_hash\` = m.\`password_hash\`,
           u.\`first_name\`    = m.\`first_name\`,
           u.\`last_name\`     = m.\`last_name\`,
           u.\`phone\`         = m.\`phone\`,
           u.\`employee_code\` = m.\`employee_code\`,
           u.\`is_active\`     = m.\`is_active\`,
           u.\`deleted_at\`    = m.\`deleted_at\``,
    );

    await queryRunner.query(
      `INSERT INTO \`users\`
         (\`id\`, \`employee_code\`, \`email\`, \`password_hash\`, \`first_name\`,
          \`last_name\`, \`phone\`, \`is_active\`, \`created_by\`, \`deleted_at\`)
       SELECT m.\`id\`, m.\`employee_code\`, m.\`email\`, m.\`password_hash\`,
              m.\`first_name\`, m.\`last_name\`, m.\`phone\`, m.\`is_active\`,
              m.\`created_by\`, m.\`deleted_at\`
       FROM \`${masterDb}\`.\`tenant_users\` m
       WHERE m.\`tenant_id\` = ?
         AND NOT EXISTS (
           SELECT 1 FROM \`users\` u
           WHERE u.\`id\` = m.\`id\` OR u.\`email\` = m.\`email\`
         )`,
      [tenantId],
    );
  }

  public down(): Promise<void> {
    // Re-keying cannot be traced back. The table itself is harmless to keep.
    return Promise.reject(
      new Error(
        'RestoreTenantUsers cannot be reverted. Restore the tenant database from a backup.',
      ),
    );
  }
}
