-- Why a non-admin (e.g. "Sales Manager") signs in but gets 403 and no menu.
--
-- The sidebar and every route gate are driven by PERMISSION CODES the browser
-- reads back after login. If the codes a role grants are not the codes the
-- frontend asks for, every check fails: no menu items, and `/` redirects to
-- /dashboard which is gated on `dashboard.view`, giving the 403 page.
--
-- Run against the TENANT database, e.g.:
--   mysql -u <user> -p <tenant_db> < diagnose-login-403.sql
--
-- Read the four results in order; the first one that looks wrong is the cause.

-- ── 1. Which migrations have run ──────────────────────────────────────────
-- 012 SyncPermissionCatalogue is the one that introduces the current code
-- names. Without it a role can only grant the OLD names, which the deployed
-- frontend no longer asks for.
SELECT 'migrations applied' AS check_name;
SELECT name FROM migrations ORDER BY timestamp;

-- ── 2. Does the role grant anything at all? ───────────────────────────────
-- A role created through the UI with no permissions ticked produces exactly
-- the reported symptom.
SELECT 'permissions per role' AS check_name;
SELECT r.role_code,
       r.role_name,
       r.is_active,
       COUNT(rp.permission_id) AS granted
FROM roles r
LEFT JOIN role_permissions rp ON rp.role_id = r.id
GROUP BY r.id, r.role_code, r.role_name, r.is_active
ORDER BY granted;

-- ── 3. The codes the frontend actually needs ──────────────────────────────
-- `dashboard.view` decides whether the landing page 403s. The rest decide
-- whether each top-level menu group appears at all. A role showing 0 for
-- dashboard_view will always land on the 403 page.
SELECT 'codes the sidebar needs, per role' AS check_name;
SELECT r.role_code,
       MAX(p.permission_code = 'dashboard.view')        AS dashboard_view,
       MAX(p.permission_code = 'orders.read')           AS orders_read,
       MAX(p.permission_code = 'customers.read')        AS customers_read,
       MAX(p.permission_code = 'products.read')         AS products_read,
       MAX(p.permission_code = 'purchase-orders.read')  AS purchase_orders_read,
       MAX(p.permission_code = 'suppliers.read')        AS suppliers_read,
       -- The superseded spelling. A role scoring 1 here and 0 on orders_read
       -- is granting codes the deployed frontend no longer asks for.
       MAX(p.permission_code = 'sales_orders.read')     AS old_sales_orders_read
FROM roles r
LEFT JOIN role_permissions rp ON rp.role_id = r.id
LEFT JOIN permissions p ON p.id = rp.permission_id
GROUP BY r.id, r.role_code;

-- ── 4. Who holds which role ───────────────────────────────────────────────
-- A user with no row here has a login but no role, so no permissions.
SELECT 'users and their roles' AS check_name;
SELECT u.email,
       COALESCE(GROUP_CONCAT(r.role_code ORDER BY r.role_code), '(none)') AS roles
FROM users u
LEFT JOIN user_roles ur ON ur.user_id = u.id
LEFT JOIN roles r ON r.id = ur.role_id
WHERE u.deleted_at IS NULL
GROUP BY u.id, u.email;
