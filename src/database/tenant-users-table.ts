/**
 * DDL for a tenant's `users` table: the copy of master `tenant_users` that the
 * User entity maps, keyed by the same id.
 *
 * Shared by provisioning and TenantSchemaBootstrap so the two cannot
 * drift. Migration 015 and scripts/production-upgrade/05-tenant-users.sql keep
 * their own copies, as migrations and hand-run scripts do.
 *
 * The columns are the subset of the original tenant `users` table that the
 * entity maps, so a tenant still holding that table needs no change.
 *
 * @param schema Qualifies the table with this database, for running the
 *   statement over a connection to a different schema.
 */
export function tenantUsersTableDdl(schema?: string): string {
  const table = schema ? `\`${schema}\`.\`users\`` : '`users`';
  return `
    CREATE TABLE IF NOT EXISTS ${table} (
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
  `;
}
