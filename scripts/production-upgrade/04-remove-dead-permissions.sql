-- scripts/production-upgrade/04-remove-dead-permissions.sql
--
-- OPTIONAL CLEANUP. Nothing breaks if you never run this.
--
-- Three permission namespaces existed twice, once hyphenated and once with
-- underscores:
--
--     price-lists.*       price_lists.*
--     purchase-orders.*   purchase_orders.*
--     purchase-returns.*  purchase_returns.*
--
-- Only the hyphenated form is enforced: every @Permissions() decorator in the
-- application uses it. The 16 underscore codes are checked by nothing, so a
-- role granted them gains no access. They are listed in the roles screen
-- alongside the real ones, under near-identical module names, which makes the
-- permission editor misleading - an operator can grant "Approve Purchase
-- Orders" from the wrong group and see no effect.
--
-- They have been removed from the application catalogue, so new tenants never
-- receive them and 03-permissions.sql no longer seeds them. This script is for
-- tenants provisioned earlier, which still hold the rows. 03 is additive by
-- design and never revokes, so it cannot clean them up on its own.
--
-- Safety:
--   * Deletes only these 16 codes, named one by one. No pattern matching, so
--     a real permission cannot be caught by accident.
--   * Grants are deleted explicitly before the permissions. The tenant schema
--     declares ON DELETE CASCADE on role_permissions.permission_id, but older
--     tenants were not all built from that DDL, so this does not rely on it.
--   * Wrapped in a transaction. Review step 1, and ROLLBACK instead of COMMIT
--     if the numbers look wrong.
--
-- Run against ONE TENANT schema. Repeat per tenant.
--   mysql -h <host> -u <user> -p <tenant_db> < 04-remove-dead-permissions.sql

START TRANSACTION;

-- 1. Look before deleting: which roles currently hold these, if any.
--    An empty result means nobody was granted them and the cleanup is purely
--    cosmetic. Rows here are grants that were never doing anything.
SELECT r.`role_code`,
       p.`permission_code`,
       p.`module`
  FROM `permissions` p
  JOIN `role_permissions` rp ON rp.`permission_id` = p.`id`
  JOIN `roles` r             ON r.`id` = rp.`role_id`
 WHERE p.`permission_code` IN (
    'price_lists.create',
    'price_lists.delete',
    'price_lists.read',
    'price_lists.update',
    'purchase_orders.approve',
    'purchase_orders.create',
    'purchase_orders.delete',
    'purchase_orders.read',
    'purchase_orders.receive',
    'purchase_orders.reject',
    'purchase_orders.send',
    'purchase_orders.update',
    'purchase_returns.approve',
    'purchase_returns.create',
    'purchase_returns.read',
    'purchase_returns.update'
 )
 ORDER BY r.`role_code`, p.`permission_code`;

-- 2. Drop the grants.
DELETE rp
  FROM `role_permissions` rp
  JOIN `permissions` p ON p.`id` = rp.`permission_id`
 WHERE p.`permission_code` IN (
    'price_lists.create',
    'price_lists.delete',
    'price_lists.read',
    'price_lists.update',
    'purchase_orders.approve',
    'purchase_orders.create',
    'purchase_orders.delete',
    'purchase_orders.read',
    'purchase_orders.receive',
    'purchase_orders.reject',
    'purchase_orders.send',
    'purchase_orders.update',
    'purchase_returns.approve',
    'purchase_returns.create',
    'purchase_returns.read',
    'purchase_returns.update'
 );

-- 3. Drop the permissions themselves.
DELETE FROM `permissions`
 WHERE `permission_code` IN (
    'price_lists.create',
    'price_lists.delete',
    'price_lists.read',
    'price_lists.update',
    'purchase_orders.approve',
    'purchase_orders.create',
    'purchase_orders.delete',
    'purchase_orders.read',
    'purchase_orders.receive',
    'purchase_orders.reject',
    'purchase_orders.send',
    'purchase_orders.update',
    'purchase_returns.approve',
    'purchase_returns.create',
    'purchase_returns.read',
    'purchase_returns.update'
 );

COMMIT;

-- 4. Verify.
--    dead_codes_remaining should be 0.
--    The hyphenated namespaces should be untouched: 4 price-lists,
--    5 purchase-orders, 5 purchase-returns.
SELECT COUNT(*) AS dead_codes_remaining
  FROM `permissions`
 WHERE `permission_code` LIKE 'price\_lists.%'
    OR `permission_code` LIKE 'purchase\_orders.%'
    OR `permission_code` LIKE 'purchase\_returns.%';

SELECT `module`, COUNT(*) AS codes
  FROM `permissions`
 WHERE `module` IN ('price-lists', 'purchase-orders', 'purchase-returns')
 GROUP BY `module`
 ORDER BY `module`;
