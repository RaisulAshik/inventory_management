-- ===========================================================================
-- 01-baseline-tenant.sql   WRITES. Read the guard condition first.
--
-- ONLY run this when 00-diagnose.sql showed BOTH of these:
--   * the tenant has NO `migrations` table (check 3 returned 0), and
--   * the tenant already has ~100+ tables (check 4).
--
-- That combination means the schema was built by TenantProvisioningService,
-- not by migrations. TypeORM would otherwise treat migrations 001-009 as
-- pending and re-run `CREATE TABLE` against tables that already exist, which
-- fails on the first statement.
--
-- This script records 001-009 as already applied so the runner starts at 010.
-- It creates no tables and changes no data.
--
-- If the tenant DOES have a migrations table, skip this file entirely.
-- ===========================================================================

USE `erp_tenant_heavytracksolutions`;   -- <-- change to the production tenant

CREATE TABLE IF NOT EXISTS `migrations` (
  `id`        int          NOT NULL AUTO_INCREMENT,
  `timestamp` bigint       NOT NULL,
  `name`      varchar(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Idempotent: re-running adds nothing, because each row is inserted only if
-- that migration name is not already recorded.
INSERT INTO `migrations` (`timestamp`, `name`)
SELECT * FROM (
  SELECT 1700000000001 AS t, 'CreateCoreTables1700000000001'             AS n UNION ALL
  SELECT 1700000000002,      'CreateInventoryTables1700000000002'           UNION ALL
  SELECT 1700000000003,      'CreateWarehouseTables1700000000003'           UNION ALL
  SELECT 1700000000004,      'CreatePricingTables1700000000004'             UNION ALL
  SELECT 1700000000005,      'CreateCustomerSupplierTables1700000000005'    UNION ALL
  SELECT 1700000000006,      'CreateSalesTables1700000000006'               UNION ALL
  SELECT 1700000000007,      'CreatePurchaseTables1700000000007'            UNION ALL
  SELECT 1700000000008,      'SeedTenantData1700000000008'                  UNION ALL
  SELECT 1700000000009,      'AddProductsFulltextIndex1700000000009'
) AS seed
WHERE NOT EXISTS (
  SELECT 1 FROM `migrations` m WHERE m.`name` = seed.n
);

-- Expect 9 rows.
SELECT `timestamp`, `name` FROM `migrations` ORDER BY `timestamp`;
