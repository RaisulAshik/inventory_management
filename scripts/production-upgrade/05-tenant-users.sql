-- ===========================================================================
-- 05-tenant-users.sql   WRITES (re-keys user ids on pre-013 tenants).
--
-- Hand-run equivalent of tenant migration 1700000000015-RestoreTenantUsers.
-- Restores the tenant `users` table as a mirror of master `tenant_users`,
-- under the same id, so user_roles resolves inside the tenant database.
--
-- Safe to re-run. Take a backup first: on a tenant that still has its
-- original `users` table (00-diagnose check 6 says users=1 retired=0) this
-- drops the foreign keys pointing at it and re-keys users, user_roles and
-- user_sessions to the master ids, matched on email.
--
-- Run against ONE TENANT schema; edit the USE line below, and `erp_master`
-- in step 3 if the master DB is named otherwise. Repeat per tenant.
-- Afterwards, record it so the migration runner does not repeat it:
--   INSERT INTO `migrations` (`timestamp`,`name`)
--   VALUES (1700000000015,'RestoreTenantUsers1700000000015');
-- ===========================================================================

USE `erp_tenant_heavytracksolutions`;   -- <-- change to the production tenant

-- 1. the table -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS `users` (
  `id` CHAR(36) NOT NULL,
  `employee_code` VARCHAR(50) NULL,
  `email` VARCHAR(255) NOT NULL,
  `password_hash` VARCHAR(255) NOT NULL,
  `first_name` VARCHAR(100) NOT NULL,
  `last_name` VARCHAR(100) NULL,
  `phone` VARCHAR(50) NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `created_by` CHAR(36) NULL,
  `created_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
  `updated_at` DATETIME(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
  `deleted_at` DATETIME(6) NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_user_email` (`email`),
  INDEX `idx_user_active` (`is_active`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. drop foreign keys into `users` (pre-013 tenants only) ------------------
-- Prints one ALTER per constraint. Run each printed statement, then go on.
-- No rows means there is nothing to drop.
SELECT CONCAT('ALTER TABLE `', TABLE_NAME, '` DROP FOREIGN KEY `',
              CONSTRAINT_NAME, '`;') AS run_this
FROM information_schema.KEY_COLUMN_USAGE
WHERE TABLE_SCHEMA = DATABASE()
  AND REFERENCED_TABLE_SCHEMA = DATABASE()
  AND REFERENCED_TABLE_NAME = 'users'
GROUP BY TABLE_NAME, CONSTRAINT_NAME;

-- 3. re-key, refresh, backfill ----------------------------------------------
-- Cross-database names cannot come from a variable, so these use
-- `erp_master` directly. Edit them too if the master DB is named otherwise.
SET @tenant_id = (SELECT `tenant_id` FROM `erp_master`.`tenant_databases`
                  WHERE `database_name` = DATABASE());
SELECT @tenant_id AS tenant_id;   -- must not be NULL; stop here if it is

START TRANSACTION;

UPDATE `user_roles` t
  JOIN `users` u ON u.`id` = t.`user_id`
  JOIN `erp_master`.`tenant_users` m
    ON m.`email` = u.`email` AND m.`tenant_id` = @tenant_id
   SET t.`user_id` = m.`id`
 WHERE u.`id` <> m.`id`;

-- Skip this statement if the tenant has no `user_sessions` table.
UPDATE `user_sessions` t
  JOIN `users` u ON u.`id` = t.`user_id`
  JOIN `erp_master`.`tenant_users` m
    ON m.`email` = u.`email` AND m.`tenant_id` = @tenant_id
   SET t.`user_id` = m.`id`
 WHERE u.`id` <> m.`id`;

UPDATE `users` u
  JOIN `erp_master`.`tenant_users` m
    ON m.`email` = u.`email` AND m.`tenant_id` = @tenant_id
   SET u.`id` = m.`id`
 WHERE u.`id` <> m.`id`;

UPDATE `users` u
  JOIN `erp_master`.`tenant_users` m ON m.`id` = u.`id`
   SET u.`email`         = m.`email`,
       u.`password_hash` = m.`password_hash`,
       u.`first_name`    = m.`first_name`,
       u.`last_name`     = m.`last_name`,
       u.`phone`         = m.`phone`,
       u.`employee_code` = m.`employee_code`,
       u.`is_active`     = m.`is_active`,
       u.`deleted_at`    = m.`deleted_at`;

INSERT INTO `users`
  (`id`, `employee_code`, `email`, `password_hash`, `first_name`,
   `last_name`, `phone`, `is_active`, `created_by`, `deleted_at`)
SELECT m.`id`, m.`employee_code`, m.`email`, m.`password_hash`,
       m.`first_name`, m.`last_name`, m.`phone`, m.`is_active`,
       m.`created_by`, m.`deleted_at`
  FROM `erp_master`.`tenant_users` m
 WHERE m.`tenant_id` = @tenant_id
   AND NOT EXISTS (SELECT 1 FROM `users` u
                    WHERE u.`id` = m.`id` OR u.`email` = m.`email`);

COMMIT;

-- Verify: every master user of this tenant has a tenant copy (expect 0).
SELECT COUNT(*) AS missing_in_tenant
  FROM `erp_master`.`tenant_users` m
 WHERE m.`tenant_id` = @tenant_id
   AND NOT EXISTS (SELECT 1 FROM `users` u WHERE u.`id` = m.`id`);
