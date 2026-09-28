---
title: "I Wrote About 5 Distributed Systems Patterns. Then I Went Looking for Them in My Own Codebase."
published: false
description: "I found four I didn't know I'd written, one I was missing, and a bug that made fixing it pointless."
tags: backend, nestjs, architecture, mysql
---

# I Wrote About 5 Distributed Systems Patterns. Then I Went Looking for Them in My Own Codebase.

I found four I didn't know I'd written, one that was genuinely missing, and a bug that would have made fixing it pointless.

---

Last week I published an article about five distributed systems patterns — write-ahead log, leader and followers, idempotent receiver, lease, circuit breaker. Clean diagrams. Confident tone. The usual.

Then a thought arrived that I didn't enjoy: *do I actually use any of these?*

The project I spend most of my time in is a multi-tenant ERP. NestJS, TypeScript, MySQL, TypeORM. One master database, one database per tenant. It is a monolith. It runs as a single process. By any reasonable definition it is not a distributed system, and I half expected the audit to end in one line: "none of them, this is a monolith, go home."

That is not what happened.

## The write-ahead log I didn't write

I started with the WAL, because it's the one I was most sure I'd find nothing for.

I grep'd for anything log-shaped and landed on `stock_movements`. Every inventory change writes a row there: movement type, quantities, source and destination warehouse, cost, who did it, when. I checked the entity for an `updated_at` or a `deleted_at` column out of habit.

There isn't one. It is append-only. Nothing in the codebase ever modifies a movement row after it's written.

For about thirty seconds I was pleased with myself. I had a write-ahead log.

I didn't. Look at the order of operations:

```
reserveStock()
  ├─ read  inventory_stock     ← the source of truth
  ├─ write inventory_stock     ← updated in place
  └─ write stock_movements     ← the journal, written alongside
```

A WAL's defining property is that **the log is written first and the log is authoritative**. On restart you replay it and recover. Mine is the opposite: `inventory_stock.quantity_on_hand` is the truth, and the movement row is a record of what happened to it. If I deleted every row in `stock_movements` tonight, the system would keep working perfectly. Delete a real WAL and you've lost the database.

So it has the *shape* of a WAL and does a different *job*. It's an audit trail. Useful, but not the pattern.

Here's the part worth keeping, though. The two writes happen inside one `dataSource.transaction(...)`, which means they cannot disagree. And the reason they cannot disagree is that InnoDB is running a write-ahead log underneath both of them — its redo log, doing exactly what the pattern describes, on every transaction I've ever written without once thinking about it.

**I hadn't implemented the pattern. I had been depending on it the entire time.**

That reframed the whole exercise. I stopped asking "where did I implement these" and started asking "where are these happening whether I implemented them or not."

## The lease I didn't write either

Next: lease. Ownership with an expiry, so a dead holder releases automatically.

I grep'd for locks and found six of them, in stock, in sales orders, in purchase orders. They all look like this:

```ts
await dataSource.transaction(async (manager) => {
  const stock = await stockRepo.findOne({
    where: { productId, warehouseId },
    lock: { mode: 'pessimistic_write' },   // SELECT ... FOR UPDATE
  });

  const available = stock.quantityOnHand - stock.quantityReserved;
  if (available < quantity) {
    throw new BadRequestException(`Insufficient stock. Available: ${available}`);
  }

  stock.quantityReserved = Number(stock.quantityReserved) + Number(quantity);
  await stockRepo.save(stock);
});
```

That is a lock, not a lease. Locks are what the lease pattern exists to *replace*, because a process that dies holding one holds it forever.

Except this one can't. Two things are true about that lock that aren't true about a lock in your application code:

1. It expires. `innodb_lock_wait_timeout` defaults to 50 seconds, and a waiter that hits it gets an error instead of waiting forever.
2. It dies with the connection. If my Node process is OOM-killed mid-transaction, MySQL notices the socket close, rolls the transaction back, and drops the lock.

Automatic expiry and automatic release on holder death are the two properties that make a lease a lease. I'd been getting them from the database this whole time. The only thing I hadn't gotten was the vocabulary.

The same shape shows up in `user_sessions.expires_at` — ownership of an authenticated identity, granted with a deadline, renewed by refresh. Nobody on the team calls it a lease. It is one.

Two patterns in, and the pattern was becoming clear: **a monolith on a real database isn't pattern-free. It's pattern-implicit. Somebody else implemented them and you inherited them.**

## The one I built on purpose, without knowing its name

Then I opened the sequence generator, which I *did* write deliberately, and which I'd always thought of as "the thing that makes order numbers."

Every document in the system needs a human-readable identifier — `SO2609260042` for a sales order, `GRN...`, `INV...`, `EMP...`. Two users clicking Save at the same moment must not get the same one.

The naive version reads the counter, adds one, writes it back, and is wrong the moment two connections interleave. Here's what's actually in the file:

```sql
UPDATE sequence_numbers
   SET current_number = IF(
         COALESCE(last_reset_at, '1970-01-01') < CURDATE(),
         LAST_INSERT_ID(1),                    -- new day, reset to 1
         LAST_INSERT_ID(current_number + 1)    -- same day, increment
       ),
       last_reset_at = IF(
         COALESCE(last_reset_at, '1970-01-01') < CURDATE(),
         CURDATE(),
         last_reset_at
       )
 WHERE sequence_type = ?;

SELECT LAST_INSERT_ID();   -- reads back what THIS connection just set
```

The trick is `LAST_INSERT_ID(expr)`. Given an argument it stores that value in a slot that is **per-connection** and returns it. So the read-modify-write collapses into one atomic statement, and the read-back can't race with anyone else's write because nobody else can see my slot.

I wrote that to avoid duplicate invoice numbers. What I'd actually built is a **monotonically increasing counter with a single point of issuance** — which, if you squint, is the generation clock from my own article wearing a different hat. Raft calls it a term. Kafka calls it an epoch. My ERP calls it `SO2609260042` and prints it on a delivery note.

I want to be careful not to oversell this. It isn't a fencing token; nothing downstream validates monotonicity or rejects a stale number. But the machinery for issuing one is sitting right there, already correct under concurrency, and I hadn't recognised it.

## The saga I'd written by accident

One more before the bad news.

When HR creates an employee who also needs a login, two rows go into two different databases. The employee goes in the tenant database. The login goes in the master database, because users are global and employees are not.

Two databases. No distributed transaction. The exact situation everyone warns you about, sitting in an HR form nobody thinks about.

What I'd written, months ago, without a name for it:

```ts
const employee = await repo.save(
  repo.create({ ...employeeData, employeeCode, createdBy }),
);

if (!password) return employee;

try {
  await this.usersService.create(tenantId, { email, password, roleIds, ... });
} catch (error) {
  // The login could not be created, so undo the employee rather than
  // leave a record the caller did not ask for on its own.
  await repo.delete(employee.id);
  throw error;
}
```

That's a **saga** with a compensating transaction — a sixth pattern that wasn't even in my article. It's the standard answer when a transaction can't span the boundary: do the steps in order, and on failure apply the inverse of each completed step.

It isn't perfect, and it's worth saying why rather than pretending. If the process dies between the two writes, no compensation runs and the employee is orphaned. A rigorous implementation persists the saga's state so it can be resumed after a crash. Mine relies on the process staying alive long enough to run one `DELETE`. For this operation, at this scale, I'm fine with that — but "I chose the weak version knowingly" is a different sentence from "I didn't know there were two versions," and until this audit I'd have been saying the second one.

## Then the part that wasn't there

Four for four. I was enjoying myself. Then I went looking for idempotent receiver.

Nothing. No request ID, no idempotency key, no dedupe table. The only `correlationId` in the codebase is in the logging middleware, for tracing.

Think about what that means for `POST /sales/orders`. A user on hotel wifi submits an order. The request reaches the server, the order is created, stock is reserved — and the response never makes it back. The browser times out. The user, seeing nothing, clicks Save again.

Two orders. Two stock reservations. One customer.

And here is the part that actually made me put my coffee down. **The sequence generator I was so pleased with two sections ago is what makes this invisible.** The duplicate doesn't collide with anything. It gets handed its own fresh, correct, atomically-issued number. `SO2609260042` and `SO2609260043`, two seconds apart, identical contents, both perfectly valid as far as every constraint in the database is concerned.

I had built the thing that guarantees two duplicate orders will never look like duplicates.

Nobody would find that in a log. You'd find out from a customer asking why they were invoiced twice.

The fix isn't hard, and my architecture makes it easier than the general case: because the order and the dedupe record live in the same tenant database, the key can be written **in the same transaction as the order itself**. That closes the crash window between "did the work" and "recorded that I did the work" that makes this pattern tricky in the general case. A client-generated key, a unique index, one table.

## And then the twist

Last one: lease, for real this time.

There's a daily cron that marks overdue dues and sends payment reminders. Classic single-instance assumption. The moment this scales to two pods, every due gets marked twice and every customer gets two reminder rows. Textbook case for a lease — grab it with a TTL, and if the holder dies the next run picks it up.

I opened the file to add one.

```ts
@Injectable()
export class FinancialCronService {
  constructor(
    private readonly customerDuesService: CustomerDuesService,   // ← request-scoped
    ...
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async handleDailyFinancialTasks(): Promise<void> { ... }
}
```

`CustomerDuesService` injects my `TenantConnectionManager`, which is `@Injectable({ scope: Scope.REQUEST })` — it reads the tenant from the incoming request. Nest propagates scope **up** the dependency graph: anything that injects a request-scoped provider becomes request-scoped itself. So `FinancialCronService` is request-scoped.

I went and read `@nestjs/schedule`'s source to be sure:

```js
const processMethod = (name) =>
  wrapper.isDependencyTreeStatic()
    ? this.lookupSchedulers(instance, name)
    : this.warnForNonStaticProviders(wrapper, instance, name);
```

Request-scoped providers have no instance at bootstrap, so there's nothing to attach a timer to. The job is never registered. **The cron has never run. Not once.**

Which, when you think about it for a second, is obvious in hindsight: a cron has no request, so it could never have had a tenant to work on anyway. The scope bug and the design flaw are the same mistake wearing two hats.

And the framework told me. Every single boot, in the startup logs, among the dozens of green `[InstanceLoader]` lines everyone scrolls past:

```
[Scheduler] Cannot register cron job "FinancialCronService@handleDailyFinancialTasks"
            because it is defined in a non static provider.
```

I'd read past that line more times than I want to estimate.

I had been about thirty seconds from adding a distributed lease to a job that does not execute. It would have worked. The tests would have passed. I'd have written a commit message about preventing duplicate reminders at scale, and shipped a lock guarding nothing.

## What I'd take from this

**Your monolith is not pattern-free.** Transactions, row locks, atomic counters, connection cleanup — your database is running half of these patterns on your behalf, correctly, today. You're not choosing whether to use them. You're choosing whether to know that you are.

**Naming is the actual deliverable.** I didn't write any new code to find the duplicate-order hole. I acquired a name — "idempotent receiver" — and then noticed its absence. You cannot see a gap in something you don't have a word for. Every pattern you learn is a query you can now run against your own codebase.

**The gap is never where you predicted.** I went in expecting to find nothing and to feel silly. I found four patterns I'd written without naming, one hole that could bill a customer twice, and a scheduled job that has never executed. My prediction was wrong in both directions at once.

**Read your boot logs.** Really. The single most expensive thing in this entire audit was printed in yellow, on startup, every time, for months.

The most useful thing I did last week wasn't writing about five patterns. It was spending an afternoon afterwards asking whether I meant any of it.

Go grep your own repo. I'd genuinely like to know what you find.
