import { MigrationInterface, QueryRunner } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import {
  PERMISSIONS,
  ROLE_PERMISSIONS,
} from '../../../common/constants/permissions';

/**
 * Brings an already-provisioned tenant up to the current permission catalogue.
 *
 * Tenants created before this migration hold only the codes that existed at
 * their provisioning time. Every route guarded by a newer code returned 403
 * for all of their users, ADMIN included, because PermissionsGuard requires
 * the user to hold the code and ADMIN is granted exactly the rows present in
 * the `permissions` table.
 *
 * The migration is additive and idempotent: it never revokes a grant, so any
 * permissions an operator has customised on a role survive it.
 */
export class SyncPermissionCatalogue1700000000012 implements MigrationInterface {
  name = 'SyncPermissionCatalogue1700000000012';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Upsert the catalogue. `permission_code` is unique, so re-running this
    //    only refreshes the display name and module grouping.
    for (const perm of PERMISSIONS) {
      await queryRunner.query(
        `INSERT INTO \`permissions\` (\`id\`, \`permission_code\`, \`permission_name\`, \`module\`, \`description\`)
         VALUES (?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
           \`permission_name\` = VALUES(\`permission_name\`),
           \`module\` = VALUES(\`module\`)`,
        [uuidv4(), perm.code, perm.name, perm.module, perm.name],
      );
    }

    // 2. ADMIN holds the whole catalogue. The unique key on
    //    (role_id, permission_id) makes INSERT IGNORE the additive operation.
    await queryRunner.query(
      `INSERT IGNORE INTO \`role_permissions\` (\`id\`, \`role_id\`, \`permission_id\`)
       SELECT UUID(), r.\`id\`, p.\`id\`
       FROM \`roles\` r
       CROSS JOIN \`permissions\` p
       WHERE r.\`role_code\` = 'ADMIN'`,
    );

    // 3. Top up the other system roles with their default grants. Roles a
    //    tenant created themselves are left alone.
    for (const [roleCode, codes] of Object.entries(ROLE_PERMISSIONS)) {
      if (codes.length === 0) continue;

      const placeholders = codes.map(() => '?').join(', ');
      await queryRunner.query(
        `INSERT IGNORE INTO \`role_permissions\` (\`id\`, \`role_id\`, \`permission_id\`)
         SELECT UUID(), r.\`id\`, p.\`id\`
         FROM \`roles\` r
         JOIN \`permissions\` p ON p.\`permission_code\` IN (${placeholders})
         WHERE r.\`role_code\` = ?`,
        [...codes, roleCode],
      );
    }
  }

  public async down(): Promise<void> {
    // Deliberately a no-op. Deleting these permissions would cascade through
    // role_permissions and silently drop grants an operator added by hand,
    // which is a far worse outcome than leaving extra catalogue rows behind.
  }
}
