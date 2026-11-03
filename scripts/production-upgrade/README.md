# Production upgrade runbook

Brings a production database from "provisioned by TenantProvisioningService"
up to the current schema: the login fix, the permission catalogue sync, the
HR tables, and the tenant `users` table that mirrors master `tenant_users`.

**Headline advice: do not hand-write SQL for this.** Only two of the changes
are plain DDL. The other two carry real logic — conditional column and
constraint checks, and a cross-database id remapping — and reimplementing
them by hand is how production databases get damaged. Run the migrations and
use the SQL here only for diagnosis and for the one thing migrations cannot
know (that the schema predates migration tracking).

---

## Preconditions

1. **Master and tenant must be on the same MySQL server.** Migration 015 runs
   cross-database statements such as

   ```sql
   INSERT INTO users (...)
   SELECT ... FROM `${MASTER_DB_NAME}`.tenant_users m WHERE m.tenant_id = ?
   ```

   If production splits them across servers or accounts, these fail and 015
   must be reworked before you go any further. Check 1 in `00-diagnose.sql`
   confirms it.

2. **`MASTER_DB_NAME` must be set** in the production environment. The
   migration falls back to `erp_master`; if production names it anything else
   and the variable is unset, 015 will point at the wrong schema.

3. **Take a maintenance window.** On a tenant that still has its original
   `users` table, 015 rewrites `users.id`, `user_roles.user_id` and
   `user_sessions.user_id`. Sessions in flight will break.

4. **Deploy the matching backend build.** These migrations bring the database
   up to code that is already running in dev. Applying them under an older
   build will fail the other way round. On startup the build applies its own
   additive tenant changes (`TenantSchemaBootstrap`), in every provisioned
   tenant: it creates the `users` table and copies the tenant's master users
   into it, and adds `sales_orders.customer_po_number`. Without them, user
   writes fail with `Table '<tenant_db>.users' doesn't exist` and sales order
   queries with `Unknown column`; the startup log names any tenant it could not
   fix. 015 is still needed to re-key a tenant that holds its original pre-013
   `users` table.

---

## Step 0 — back up. Not optional.

```bash
mysqldump -h <host> -u <user> -p --single-transaction --routines --triggers \
  <master_db> > master_$(date +%F_%H%M).sql

mysqldump -h <host> -u <user> -p --single-transaction --routines --triggers \
  <tenant_db> > tenant_$(date +%F_%H%M).sql
```

Then **restore both into scratch schemas and rehearse the whole runbook there
first.** Migration 015 rewrites user ids on tenants that still have their
original `users` table, and that cannot be undone by inspection. That
rehearsal is the single most valuable step on this page.

---

## Step 1 — diagnose (read-only)

```bash
mysql -h <host> -u <user> -p < 00-diagnose.sql
```

Read the output before doing anything else:

| Check | Meaning |
|---|---|
| 1 — two schemas listed | Precondition 1 satisfied |
| 2 — any rows | Login is broken until master migration 003 runs |
| 3 — `0` | No migration history → Step 3 baseline needed |
| 3 — `1` | Already migration-managed → **skip Step 3** |
| 5 — fewer than 8 tables | HR is broken until Step 5 |
| 6 — `users=0` | No tenant `users` table: user writes fail until 015 runs |
| 8 — below 271 | Permission catalogue not yet synced |

---

## Step 2 — master migration (fixes login)

```bash
npx ts-node -r tsconfig-paths/register src/database/run-migrations.ts master run
```

Adds nine nullable columns to `tenant_users`, each guarded by an
`information_schema` check, so it is safe to re-run. This is what fixes
`Unknown column 'TenantUser.avatar_url'`.

---

## Step 3 — baseline the tenant (only if check 3 returned `0`)

```bash
mysql -h <host> -u <user> -p < 01-baseline-tenant.sql   # edit the schema name first
```

Records migrations 001–009 as applied. Without this TypeORM treats them as
pending and re-runs `CREATE TABLE` against tables that already exist, failing
on the first statement. Creates nothing, changes no data, idempotent.

---

## Step 4 — tenant migrations 010–016

```bash
npx ts-node -r tsconfig-paths/register \
  src/database/run-migrations.ts tenant-db run <tenant_db>
```

Note `tenant-db` with the database name. The plain `tenant` target points at
`TENANT_DB_TEMPLATE`, which is the template schema, not your live tenant.

What runs:

| Migration | Effect | Risk |
|---|---|---|
| 010 CreateExpensesTable | `IF NOT EXISTS`, usually a no-op | none |
| 011 CreatePaymentTermsTable | `IF NOT EXISTS`, usually a no-op | none |
| 012 SyncPermissionCatalogue | Permission rows to 271; tops up roles. Additive, never revokes | low |
| 013 FixEmployeeSchema… | Creates or repairs `hr_employees`. No longer touches `users` (earlier builds retired it) | low |
| 014 CreateMissingHrTables | The other seven HR tables, `IF NOT EXISTS` | none |
| 015 RestoreTenantUsers | Creates `users` and fills it from master under the same ids. On a tenant with its original `users` table: drops foreign keys into it and **re-keys `users`, `user_roles`, `user_sessions` to master ids** | **high** on an original `users` table, otherwise low |
| 016 AddSalesOrderCustomerPoNumber | Adds `sales_orders.customer_po_number`; a no-op once startup has added it | none |

Run one at a time if you prefer; the runner applies them in order and records
each on success.

---

## Step 5 — HR tables without ts-node (alternative to 014 only)

If you cannot run ts-node in production:

```bash
mysql -h <host> -u <user> -p < 02-hr-tables.sql   # edit the schema name first
```

Eight `CREATE TABLE IF NOT EXISTS` statements, identical to migration 014.
Afterwards record it so the runner does not repeat the work:

```sql
INSERT INTO `migrations` (`timestamp`, `name`)
VALUES (1700000000014, 'CreateMissingHrTables1700000000014');
```

This substitutes for 014 **only**.

### 012 without ts-node

```bash
mysql -h <host> -u <user> -p <tenant_db> < 03-permissions.sql
```

Equivalent to migration 012: 259 catalogue rows, the full set to ADMIN, the
defaults to the other four system roles. Additive and idempotent, wrapped in
a transaction, and it prints the catalogue size and per-role grant counts at
the end so you can check it landed.

### Optional: clear the 16 retired codes

```bash
mysql -h <host> -u <user> -p <tenant_db> < 04-remove-dead-permissions.sql
```

Only for tenants provisioned before those codes were retired. It names all 16
explicitly — no pattern matching — deletes their grants before the
permissions, and runs in a transaction with a review query first, so you can
`ROLLBACK` if the numbers look wrong. Skipping it is harmless: the codes are
inert either way, they just keep cluttering the roles screen.

It is **generated** from `src/common/constants/permissions.ts`, not written by
hand, so it cannot drift from what the application enforces. Regenerate it
rather than editing it. Then record it:

```sql
INSERT INTO `migrations` (`timestamp`, `name`)
VALUES (1700000000012, 'SyncPermissionCatalogue1700000000012');
```

### 015 without ts-node

```bash
mysql -h <host> -u <user> -p < 05-tenant-users.sql   # edit the schema name first
```

Creates `users` if missing, re-keys an original `users` table to master ids,
then copies in every master user of the tenant. The application now does the
create-and-copy part itself on startup (Precondition 4), so this script is
needed only for the re-keying, or where the startup log reports a failure.

- It names the master schema `erp_master` directly; edit step 3 if production
  calls it something else.
- Step 2 only **prints** `DROP FOREIGN KEY` statements; run each one before
  continuing. On a tenant with no original `users` table it prints nothing.
- `SELECT @tenant_id` must not be `NULL`, and the last query,
  `missing_in_tenant`, must return `0`.

Then record it:

```sql
INSERT INTO `migrations` (`timestamp`, `name`)
VALUES (1700000000015, 'RestoreTenantUsers1700000000015');
```

**There is no hand-SQL substitute for 013.** It branches on
`information_schema` — which columns exist, which constraints exist, whether
`hr_employees` is present at all. Run it through the migration runner.

---

## Step 6 — verify

Re-run `00-diagnose.sql` and confirm:

- check 2 returns no rows
- check 5 lists all 8 `hr_*` tables
- check 6 shows `users=1`
- check 8 shows `271`

Then against the running API:

```bash
curl -s -X POST https://<api>/api/v1/admin/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"<admin>","password":"<password>"}'

curl -s -H "Authorization: Bearer <token>" https://<api>/api/v1/hr/employees
curl -s -H "Authorization: Bearer <token>" https://<api>/api/v1/users
curl -s -H "Authorization: Bearer <token>" https://<api>/api/v1/roles/catalogue/permissions
```

Expect 200s, and 271 codes across 47 modules from the last one.

---

## Rollback

- **012 / 014** — `down()` exists; 012 is additive so reverting is rarely wanted.
- **013** — `down()` refuses; its column changes fold data together. Restore
  the Step 0 dump.
- **015** — on a tenant that had its original `users` table, the id re-keying
  is not reversible by inspection: restore the Step 0 dump. Elsewhere it only
  created and filled `users`, which the running build needs; do not drop it.
- Tenants where an earlier build of 013 already ran also hold
  `users_retired_backup`. Drop it by hand only once you have confirmed logins,
  role assignments and sessions all behave.

---

## Afterwards

The frontend gates on the codes the backend's `@Permissions()` guards actually
check. **51** of the 259 catalogue codes are not checked by any controller:

- **Orphaned duplicates from a rename** — `sales_orders.*` → `orders.*`,
  `stock_transfers.*` → `transfers.*`, `stock_adjustments.*` →
  `adjustments.*`, `sales_returns.*` → `returns.*`, `warehouse_locations.*` →
  `locations.*`, `inventory.*` → `stock.*`, `payments.*` → `orders.payment`.
  Grantable but inert. Grant the enforced spelling.
- **Forward-looking** — `reports.*`, `dashboard.analytics`, `audit_logs.read`,
  `quotations.convert` / `.send`, `settings.company`, `tax.create` /
  `.update` / `.delete`, and the `*.import` / `*.export` pairs. No endpoint
  yet; the code is reserved so the front end can gate on it.
- **`approvals.self`** — enforced, but in handler code via `canSelfApprove()`
  rather than by a `@Permissions()` decorator, because it changes a business
  rule inside a handler instead of protecting the route. It will always look
  unguarded to a decorator scan. Do not remove it. Reserved to the ADMIN
  role: the API refuses to assign it elsewhere, `canSelfApprove()` also
  requires ADMIN, and this script strips it from any other role.

The underscore forms of `price_lists` / `purchase_orders` / `purchase_returns`
**have been removed** — 16 codes, which is why the catalogue went from 275 to
259. Only the hyphenated spelling was ever enforced, and having both listed
under near-identical module names made the roles screen misleading. New
tenants never receive them. For tenants provisioned earlier, the optional
`04-remove-dead-permissions.sql` clears the rows; `03-permissions.sql` is
additive by design and cannot.

`src/common/constants/permissions.spec.ts` now fails the build if a module
name is ever spelled two ways again.

The SALES seed gap is **fixed**: that role held `payments.create` (orphaned)
but not `orders.payment` (enforced), so it could not record order payments.
`orders.payment` has been added, which is why SALES now has 21 grants rather
than 20. Tenants already upgraded should re-run 012 or `03-permissions.sql` to
pick it up — both are additive, so re-running is safe.
