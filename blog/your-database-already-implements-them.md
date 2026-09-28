---
title: "Your Database Already Implements the Patterns You Think You're Missing"
published: false
description: "I audited a plain monolith for five distributed systems patterns. Four were already there. The fifth was missing in a way that could bill a customer twice."
tags: backend, architecture, databases, webdev
---

# Your Database Already Implements the Patterns You Think You're Missing

I audited a plain monolith for five distributed systems patterns. Four were already there. The fifth was missing in a way that could bill a customer twice.

---

Distributed systems patterns get filed under "things for other people." They belong to teams running Kafka clusters and Raft implementations and a service mesh. If you're shipping a monolith against one database, the whole topic reads like a conference talk you'll watch someday.

That was roughly my position when I decided to audit my own codebase against five of them, mostly expecting the exercise to end in one line: *none of these, it's a monolith, go home.*

The codebase is a multi-tenant ERP — inventory, sales, purchasing, HR, accounting. TypeScript on Node, MySQL underneath. One process. One database per customer. Nothing is replicated, nothing does consensus, no component elects a leader. By any honest definition it is not a distributed system.

I found four of the five already in there. I had written three of them without knowing they had names. And the one that was genuinely missing was missing in a way I'd never have spotted by reading the code, because a different part of the system was actively concealing it.

Here's the walk-through, in the order I did it.

## 1. The write-ahead log I didn't write

**The pattern:** before you modify your actual data structure, append a description of the change to a file and flush it to disk. If you crash halfway, you replay the log on restart and recover. Appending is a sequential write, which disks are fast at; updating a B-tree in place is random, which they aren't. Postgres calls it the WAL, MySQL the redo log, Redis the AOF, Kafka just calls it the log.

I started here because I was most confident I'd find nothing.

Then I remembered `stock_movements`. Every inventory change in the system writes a row: movement type, quantity, source and destination warehouse, unit cost, who did it, when. I opened the entity to check for an `updated_at` column out of habit.

There isn't one. No `deleted_at` either. Nothing in the codebase ever modifies a movement row after it's written. It is strictly append-only.

For about thirty seconds I was pleased with myself. Then I looked at the order of operations:

```
reserveStock()
  ├─ read  inventory_stock     ← the source of truth
  ├─ write inventory_stock     ← updated in place
  └─ write stock_movements     ← the journal, written alongside
```

That's not a write-ahead log. A WAL's defining property is that **the log goes first and the log is authoritative**. Mine is the reverse: `quantity_on_hand` is the truth, and the movement row describes what happened to it. If I truncated `stock_movements` tonight, the system would run perfectly tomorrow. Truncate a real WAL and you've lost the database.

Same shape. Different job. What I had was an audit trail.

But here's the part that reframed the entire audit. Those two writes happen inside one transaction, so they can't disagree — and the reason they can't disagree is that InnoDB is running a write-ahead log underneath both of them. Its redo log. Doing precisely what the pattern describes, on every transaction I have ever written, without my once thinking about it.

**I hadn't implemented the pattern. I'd been depending on it the whole time.**

So I stopped asking *"where did I implement these"* and started asking *"where are these happening whether I implemented them or not."* Different question. Much better answers.

## 2. The lease I didn't write either

**The pattern:** a lock held by a process that dies is held forever. So instead of granting ownership indefinitely, grant it with an expiry the holder must keep renewing. If the holder dies, the grant lapses by itself. No cleanup, no stuck lock, no 3 a.m. page to clear it by hand.

I grep'd for locks and found six, in stock, sales orders, and purchase orders. They look like this:

```ts
await dataSource.transaction(async (manager) => {
  const stock = await stockRepo.findOne({
    where: { productId, warehouseId },
    lock: { mode: 'pessimistic_write' },   // SELECT ... FOR UPDATE
  });

  const available = stock.quantityOnHand - stock.quantityReserved;
  if (available < quantity) {
    throw new Error(`Insufficient stock. Available: ${available}`);
  }

  stock.quantityReserved += quantity;
  await stockRepo.save(stock);
});
```

That's a lock — the exact thing the lease pattern exists to replace. Except two things are true about this lock that would not be true about one implemented in application code:

1. **It expires.** `innodb_lock_wait_timeout` defaults to 50 seconds. A waiter that exceeds it gets an error rather than waiting forever.
2. **It dies with its holder.** If my Node process is OOM-killed mid-transaction, MySQL sees the connection drop, rolls the transaction back, and releases the lock.

Automatic expiry and automatic release on holder death are the two properties that make a lease a lease. I'd had both since the day I wrote the line. What I hadn't had was the word.

The same shape turned up again in session handling: `expires_at` on a session row is ownership of an authenticated identity, granted with a deadline, renewed by refresh. Nobody calls it a lease. It is one.

Two patterns in, and the thesis was forming: **a monolith on a mature database is not pattern-free. It's pattern-implicit.** Somebody implemented these, very carefully, and you inherited them by typing `BEGIN`.

## 3. The counter I built on purpose, without knowing its name

Now one I wrote deliberately, and had always thought of as just "the thing that makes order numbers."

Every document needs a human-readable identifier — `SO2609260042` for a sales order, and equivalents for invoices, goods receipts, employees. Two users clicking Save in the same second must never get the same one.

The naive version reads the counter, adds one, writes it back, and is wrong the instant two connections interleave: both read 41, both write 42, two documents share a number. Here's what's actually in the file:

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

The trick is `LAST_INSERT_ID(expr)`. Handed an argument, MySQL stores that value in a slot that is **per-connection** and returns it. So the read-modify-write collapses into a single atomic statement, and the read-back afterwards can't race anybody, because nobody else can see my slot.

I built that to stop duplicate invoice numbers. What it actually is: a **monotonically increasing counter with a single point of issuance**. That's the same primitive distributed systems use to fence off stale actors — Raft calls it a term, Kafka calls it an epoch, Paxos calls it a ballot number. Mine is called `SO2609260042` and gets printed on a delivery note.

I don't want to oversell it. It isn't a fencing token; nothing downstream checks monotonicity or rejects a stale number. But the hard part — issuing one correctly under concurrency — was already built, and I hadn't recognised what I was holding.

## 4. The saga I'd written by accident

One more piece of good news before the bad.

When HR creates an employee who also needs a login, two rows go into **two different databases**. The employee record goes to the customer's tenant database. The login goes to a shared master database, because users are global and employees aren't.

Two databases, no transaction that can span them. The textbook hard case, sitting inside an HR form nobody thinks about twice.

What I'd written, months earlier, without a name for it:

```ts
const employee = await repo.save(repo.create({ ...employeeData, employeeCode }));

if (!password) return employee;

try {
  await this.usersService.create(tenantId, { email, password, roleIds });
} catch (error) {
  // The login could not be created, so undo the employee rather than
  // leave a record the caller did not ask for on its own.
  await repo.delete(employee.id);
  throw error;
}
```

That's a **saga with a compensating transaction**: when you can't have atomicity across a boundary, perform the steps in order and, on failure, apply the inverse of every step that already succeeded.

It's the weak version, and it's worth saying why instead of pretending otherwise. If the process dies *between* the two writes, no compensation runs and the employee is orphaned. A rigorous implementation persists the saga's state so a crashed one can be resumed. Mine trusts the process to stay alive long enough to run one `DELETE`.

For this operation, at this volume, that's a trade I'm happy with. But *"I picked the weak version knowingly"* is a very different sentence from *"I didn't know there were two versions"* — and until the audit, I'd have been saying the second one.

## 5. Then the part that wasn't there

Four for four. I was enjoying myself. Then I went looking for the idempotent receiver.

**The pattern:** the client sends a request. The network times out. The client retries. Neither side knows whether the first one landed. So the client attaches a unique ID to the request, the server records which IDs it has already processed along with what it answered, and a repeat gets the stored response instead of a second execution.

This isn't exotic. At-least-once delivery is the *default* condition of every network call anyone makes.

I found nothing. No request ID, no idempotency key, no dedupe table. The only correlation ID in the codebase is in logging middleware, for tracing.

Consider what that means for `POST /sales/orders`. A user on hotel wifi submits an order. The request arrives, the order is created, stock is reserved — and the response never gets back. The browser times out. The user, seeing nothing happen, clicks Save again.

Two orders. Two stock reservations. One customer.

And here's the part that made me put my coffee down. **The counter I was so pleased with in section 3 is exactly what makes this invisible.** The duplicate doesn't collide with anything. It is handed its own fresh, correct, atomically-issued number. `SO2609260042` and `SO2609260043`, two seconds apart, identical contents, both entirely valid as far as every constraint in the database is concerned.

I had built the thing that guarantees two duplicate orders will never *look* like duplicates.

You would not find that in a log. You'd find out from a customer asking why they were invoiced twice.

The fix is not hard, and single-database architecture makes it easier than the general case: because the order and the dedupe record live in the same database, the key can be written **in the same transaction as the order**. That closes the gap between "did the work" and "recorded that I did the work" — the gap that makes this pattern genuinely tricky when the two live in different systems. A client-generated key, a unique index, one small table.

## 6. And then the twist

Last one. The fifth pattern was the **lease**, for real this time.

There's a daily job that marks overdue invoices and sends payment reminders. Classic single-instance assumption baked in. The moment it scales to two instances, every invoice gets marked twice and every customer gets two reminders. Exactly what a lease is for: grab it with a TTL, and if the holder dies the next run picks it up.

I opened the file to add one.

```ts
@Injectable()
export class FinancialCronService {
  constructor(
    private readonly customerDuesService: CustomerDuesService,  // ← request-scoped
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_9AM)
  async handleDailyFinancialTasks(): Promise<void> { ... }
}
```

That service depends on my tenant connection manager, which is *request-scoped* — it reads which customer's database to use from the incoming HTTP request. And dependency injection propagates scope **upward**: anything that depends on a request-scoped thing becomes request-scoped itself. So the cron service is request-scoped too.

I went and read the scheduler library's source rather than trust my memory:

```js
const processMethod = (name) =>
  wrapper.isDependencyTreeStatic()
    ? this.lookupSchedulers(instance, name)       // register the timer
    : this.warnForNonStaticProviders(...);        // log a warning, do nothing
```

Request-scoped providers have no instance at startup — they're constructed per request — so there is nothing to attach a timer to. The job was never registered. **It has never run. Not once.**

Which is obvious in hindsight: a scheduled job has no HTTP request, so it could never have had a customer database to work on anyway. The wiring bug and the design flaw are the same mistake wearing two hats.

And the framework had been telling me. Every boot, among the dozens of cheerful green startup lines everyone scrolls past:

```
[Scheduler] Cannot register cron job "FinancialCronService@handleDailyFinancialTasks"
            because it is defined in a non static provider.
```

I had read past that line more times than I care to estimate.

I was about thirty seconds from adding a distributed lease to a job that does not execute. It would have worked. The tests would have passed. I'd have written a commit message about preventing duplicate reminders at scale, and shipped a lock guarding nothing.

## Run this audit on your own code

It took an afternoon. It needs no new dependencies. Five greps, roughly:

1. **Append-only tables.** Anything with no `UPDATE` path — movements, ledgers, event tables. Ask which is authoritative: the table, or the thing it describes? If it's the *other* thing, you have an audit trail, not a log. Useful, but don't mistake it for recoverability.
2. **`FOR UPDATE` / `SELECT ... LOCK`.** These are safe largely because your database expires them and drops them when a connection dies. Now ask where you hold a lock your *database* doesn't know about — a flag column, a Redis key, a boolean in memory. Those are the ones that get stuck, and those are the ones that need a real TTL.
3. **Counters and number generators.** Is the increment one statement, or a read followed by a write? If it's two, you have a lost-update race waiting for your second concurrent user.
4. **Any write that touches two systems** — two databases, or a database and a queue, or a database and a payment API. Every one of these is a saga whether you've named it or not. The only question is whether a failure halfway leaves a mess, and whether a crash halfway leaves a bigger one.
5. **Every `POST` that creates something a customer pays for.** If a retried request creates a second row, and nothing detects it, you have the hole I had. Check whether anything in your stack would even make the duplicate *visible*.

And then, separately: **read your startup logs**. All of them. Once.

## What I'd actually take from this

**Your monolith isn't pattern-free, it's pattern-implicit.** Transactions, row locks, atomic counters, cleanup on disconnect — your database is running half these patterns for you, correctly, today. You aren't choosing whether to use them. You're only choosing whether to know that you are.

**The deliverable is the vocabulary, not the code.** I wrote nothing new to find that duplicate-order hole. I acquired a name — "idempotent receiver" — and then noticed its absence. You cannot see a gap in something you have no word for. Every pattern you learn is a query you can run against code you already shipped.

**The gap is never where you predicted.** I went in expecting to find nothing and feel a bit silly. I found four patterns I'd written without naming, one hole that could double-bill a customer, and a scheduled job that has never executed. My prediction was wrong in both directions simultaneously.

**And the expensive finding was free the whole time.** It was printed in yellow, on startup, every single time, for months.

Go grep your own repo. I'd genuinely like to know what you find.
