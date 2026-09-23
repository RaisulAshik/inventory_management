# Production upgrade runbook

Brings a production database from "provisioned by TenantProvisioningService"
up to the current schema: the login fix, the permission catalogue sync, the
user consolidation into master, and the HR tables.

**Headline advice: do not hand-write SQL for this.** Only two of the changes
are plain DDL. The other two carry real logic — conditional column and
constraint checks, and a cross-database id remapping — and reimplementing
them by hand is how production databases get damaged. Run the migrations and
use the SQL here only for diagnosis and for the one thing migrations cannot
know (that the schema predates migration tracking).

---

## Preconditions

1. **Master and tenant must be on the same MySQL server.** Migration 013 runs

   ```sql
   UPDATE user_roles t
     JOIN users u ON u.id = t.user_id
     JOIN `${MASTER_DB_NAME}`.tenant_users m ON m.email = u.email
     SET t.user_id = m.id
   ```

   If production splits them across servers or accounts, this statement fails
   and 013 must be reworked before you go any further. Check 1 in
   `00-diagnose.sql` confirms it.

2. **`MASTER_DB_NAME` must be set** in the production environment. The
   migration falls back to `erp_master`; if production names it anything else
   and the variable is unset, 013 will point at the wrong schema.

3. **Take a maintenance window.** 013 renames the tenant `users` table and
   rewrites `user_roles.user_id` / `user_sessions.user_id`. Sessions in flight
   will break.

4. **Deploy the matching backend build.** These migrations bring the database
   up to code that is already running in dev. Applying them under an older
   build will fail the other way round.

---

## Step 0 — back up. Not optional.

```bash
mysqldump -h <host> -u <user> -p --single-transaction --routines --triggers \
  <master_db> > master_$(date +%F_%H%M).sql

mysqldump -h <host> -u <user> -p --single-transaction --routines --triggers \
  <tenant_db> > tenant_$(date +%F_%H%M).sql
```

Then **restore both into scratch schemas and rehearse the whole runbook there
first.** Migration 013's own author says so in its header: *"rewrites keys.
Run against a copy of a real tenant database first."* That rehearsal is the
single most valuable step on this page.

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
| 6 — `users=1 retired=0` | Migration 013 has not run yet |
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

## Step 4 — tenant migrations 010–014

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
| 013 FixEmployeeSchema… | Creates `hr_employees`, **renames `users` → `users_retired_backup`**, remaps user ids | **high** |
| 014 CreateMissingHrTables | The other seven HR tables, `IF NOT EXISTS` | none |

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

Equivalent to migration 012: 271 catalogue rows, the full set to ADMIN, the
defaults to the other four system roles. Additive and idempotent, wrapped in
a transaction, and it prints the catalogue size and per-role grant counts at
the end so you can check it landed.

It is **generated** from `src/common/constants/permissions.ts`, not written by
hand, so it cannot drift from what the application enforces. Regenerate it
rather than editing it. Then record it:

```sql
INSERT INTO `migrations` (`timestamp`, `name`)
VALUES (1700000000012, 'SyncPermissionCatalogue1700000000012');
```

**There is no hand-SQL substitute for 013.** It branches on
`information_schema` — which columns exist, which constraints exist, whether
`hr_employees` is present at all — and performs a cross-database id remap
whose correctness depends on those branches. Run it through the migration
runner.

---

## Step 6 — verify

Re-run `00-diagnose.sql` and confirm:

- check 2 returns no rows
- check 5 lists all 8 `hr_*` tables
- check 6 shows `users=0 retired=1`
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
- **013** — the destructive one. `users` is renamed rather than dropped, so the
  rows survive as `users_retired_backup`. Recovering from a bad run still means
  restoring the Step 0 dump, because the id remapping is not reversible by
  inspection.
- Drop `users_retired_backup` by hand only once you have confirmed logins,
  role assignments and sessions all behave.

---

## Afterwards

The frontend gates on the codes the backend's `@Permissions()` guards actually
check. **66** of the 271 catalogue codes are not checked by any controller:
orphaned duplicates from a rename (`sales_orders.*` → `orders.*`,
`stock_transfers.*` → `transfers.*`, `warehouse_locations.*` → `locations.*`,
`inventory.*` → `stock.*`, and the underscore forms of `price_lists` /
`purchase_orders` / `purchase_returns`), plus forward-looking codes for
features with no endpoint yet (`reports.*`, `dashboard.analytics`,
`quotations.send`, the `*.import` / `*.export` pairs). When building roles,
grant the enforced spelling.

The SALES seed gap is **fixed**: that role held `payments.create` (orphaned)
but not `orders.payment` (enforced), so it could not record order payments.
`orders.payment` has been added, which is why SALES now has 21 grants rather
than 20. Tenants already upgraded should re-run 012 or `03-permissions.sql` to
pick it up — both are additive, so re-running is safe.
