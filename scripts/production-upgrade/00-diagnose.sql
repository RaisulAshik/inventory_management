-- ===========================================================================
-- 00-diagnose.sql   READ-ONLY. Run this first and keep the output.
--
-- Nothing here writes. It tells you which later steps production actually
-- needs, because production may sit at a different schema version than dev.
--
-- Set the two variables below, then run the whole file.
-- Section B at the bottom needs the tenant name typed literally — MySQL will
-- not take a variable for a schema name — so edit those two lines too.
-- ===========================================================================

SET @master_db = 'erp_master';
SET @tenant_db = 'erp_tenant_heavytracksolutions';


-- ======================= SECTION A — information_schema ====================

-- 1. Are master and tenant on THIS server?
--    Migration 013 runs a cross-database UPDATE ... JOIN between them.
--    Expect BOTH rows. If either is missing, 013 cannot run here.
SELECT '1. schemas on this server' AS check_name, SCHEMA_NAME AS result
FROM information_schema.SCHEMATA
WHERE SCHEMA_NAME IN (@master_db, @tenant_db);

-- 2. Is the login fix (master migration 003) still needed?
--    Each row returned is a column that is MISSING.
--    No rows = master 003 already applied. Rows = login is broken until it is.
SELECT '2. master tenant_users MISSING column' AS check_name, needed.col AS result
FROM (
  SELECT 'phone' AS col UNION ALL SELECT 'avatar_url' UNION ALL
  SELECT 'employee_code' UNION ALL SELECT 'is_email_verified' UNION ALL
  SELECT 'email_verified_at' UNION ALL SELECT 'last_login_ip' UNION ALL
  SELECT 'password_changed_at' UNION ALL SELECT 'created_by' UNION ALL
  SELECT 'deleted_at'
) AS needed
LEFT JOIN information_schema.COLUMNS c
  ON c.TABLE_SCHEMA = @master_db
 AND c.TABLE_NAME   = 'tenant_users'
 AND c.COLUMN_NAME  = needed.col
WHERE c.COLUMN_NAME IS NULL;

-- 3. Does the tenant have migration history?
--    0 = built by TenantProvisioningService -> you need 01-baseline-tenant.sql
--    1 = already migration-managed         -> SKIP the baseline
SELECT '3. tenant migrations table exists' AS check_name, COUNT(*) AS result
FROM information_schema.TABLES
WHERE TABLE_SCHEMA = @tenant_db AND TABLE_NAME = 'migrations';

-- 4. How much schema is already there?
--    ~100+ tables alongside a 0 in check 3 confirms provisioning-service origin.
SELECT '4. tenant table count' AS check_name, COUNT(*) AS result
FROM information_schema.TABLES
WHERE TABLE_SCHEMA = @tenant_db;

-- 5. HR tables present. Expect 8 when complete:
--    hr_employees, hr_departments, hr_designations, hr_attendance,
--    hr_leave_types, hr_leave_requests, hr_payrolls, hr_payroll_components
SELECT '5. hr tables' AS check_name,
       IFNULL(GROUP_CONCAT(TABLE_NAME ORDER BY TABLE_NAME SEPARATOR ', '), 'NONE') AS result
FROM information_schema.TABLES
WHERE TABLE_SCHEMA = @tenant_db AND TABLE_NAME LIKE 'hr\_%';

-- 6. Does the tenant have its `users` table (the mirror of master users)?
--    users=0   -> 015 has not run; every user create/edit fails until it does
--    users=1   -> present (the mirror, or an original table 015 will re-key)
--    retired=1 -> an earlier build of 013 ran here; see README "Rollback"
SELECT '6. users / users_retired_backup' AS check_name,
       CONCAT('users=',    IFNULL(SUM(TABLE_NAME = 'users'), 0),
              ' retired=', IFNULL(SUM(TABLE_NAME = 'users_retired_backup'), 0)) AS result
FROM information_schema.TABLES
WHERE TABLE_SCHEMA = @tenant_db
  AND TABLE_NAME IN ('users', 'users_retired_backup');


-- ======================= SECTION B — edit the schema name ==================
-- MySQL cannot take a variable for a schema name. Replace the tenant name on
-- both lines below, then run them.

-- 7. Which migrations have already run? (errors if check 3 returned 0 — fine)
SELECT '7. applied' AS check_name, `name` AS result
FROM `erp_tenant_heavytracksolutions`.`migrations` ORDER BY `timestamp`;

-- 8. Permission catalogue size. 271 = synced (012 done). Lower = 012 pending.
SELECT '8. permission rows' AS check_name, COUNT(*) AS result
FROM `erp_tenant_heavytracksolutions`.`permissions`;
