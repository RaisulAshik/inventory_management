---
title: "Three Distributed Systems Patterns You Need in a Monolith (and Two You Don't)"
published: false
description: "Every pattern has a trigger condition. Know it, and you can tell which ones are your problem today and which ones you're allowed to ignore."
tags: backend, architecture, databases, webdev
---

# Three Distributed Systems Patterns You Need in a Monolith (and Two You Don't)

Every pattern has a trigger condition. Know it, and you can tell which ones are your problem today — and which ones you're allowed to ignore.

---

Articles about distributed systems patterns have a failure mode: they present five or ten patterns as a checklist, and you come away vaguely guilty about all of them.

That's backwards. A pattern isn't good practice in the abstract. It's a defence against a specific condition. If the condition doesn't exist in your system, the pattern is dead weight — code to maintain, a failure mode to reason about, and a false sense that you've handled something.

So here's a different treatment of the canonical five, aimed at the ordinary case: one application process, one database, no consensus, no replication. A monolith.

Three of them are already your problem. One of them you already have without writing any code. Two of them are not your problem yet, and I'll tell you exactly what has to change before they are.

---

## 1. Idempotent Receiver — yes, and you're probably missing it

**The pattern.** The client sends a request. The network times out. The client retries. Neither side knows whether the first one landed. So the client attaches a unique ID to the request; the server records which IDs it has processed and what it answered; a repeat gets the stored answer instead of a second execution.

**The trigger condition: you have a network.** That's it. That's the whole bar.

This is the one people skip because it doesn't feel like a distributed systems problem. It feels like a mobile-signal problem. It is both. At-least-once delivery is the default state of every HTTP request ever made — you only get better than that by building it.

Picture a user on bad wifi submitting an order. The request arrives, the order is created, stock is reserved, and the response never makes it back. The browser times out. The user, seeing nothing happen, clicks Save again.

Two orders. Two stock reservations. One customer.

### The part that makes this genuinely dangerous

Most systems have something that assigns each new record a human-readable identifier — `SO-2026-0042` for a sales order, an invoice number, a reference code. Usually it's a counter, and usually someone was careful to make it collision-proof under concurrency.

Now think about what that does to the duplicate. It doesn't collide with anything. It gets handed its own fresh, correct, perfectly valid number. Two orders, two seconds apart, identical contents, and every constraint in your database is satisfied.

**The mechanism you built to guarantee uniqueness is what guarantees the duplicate won't look like one.**

You will not find that in a log. You'll find out when a customer asks why they were invoiced twice.

### The fix, and why a monolith has it easy

```ts
async submitOrder(dto: OrderDto, idempotencyKey: string) {
  return db.transaction(async (tx) => {
    const seen = await tx.findOne(IdempotencyRecord, { key: idempotencyKey });
    if (seen) return seen.response;          // replay, don't re-execute

    const order = await this.createOrder(tx, dto);
    await tx.save(IdempotencyRecord, { key: idempotencyKey, response: order });
    return order;
  });
}
```

The hard part of this pattern, in the general case, is the gap between *doing the work* and *recording that you did it*. Crash in between and the retry executes twice anyway.

In a monolith that gap closes for free, because the order and the record live in the same database and go in the same transaction. This is one of the rare cases where the simple architecture gets the strong guarantee and the distributed one has to work for it.

Three details decide whether it actually works:

- **The client generates the key, and keeps it stable across retries.** A server-generated ID is useless; the retry would get a new one. Front end generates a UUID per submit *action*, not per request.
- **Put a unique index on the key.** Two concurrent retries can both miss the `findOne`. The index is what actually enforces this; the lookup is just the fast path.
- **Decide on retention.** Too short and a client retrying after a long outage double-submits. Too long and the table grows forever. Pick a window longer than your longest plausible retry and expire on it.

Apply it to every endpoint that creates something a customer pays for, and nowhere else. It has a cost; spend it where a duplicate is expensive.

---

## 2. Lease — yes, the moment you run a second instance

**The pattern.** A lock held by a process that dies is held forever. So grant ownership with an expiry the holder must keep renewing. If the holder dies, the grant lapses on its own.

**The trigger condition: more than one copy of your app runs at once.** Two pods, a blue-green deploy overlap, a rolling restart, even a single instance you scaled to two "just for a bit" during a busy week.

The place this bites in almost every monolith I've seen is the **scheduled job**. Every codebase has one:

```ts
@Cron('0 9 * * *')
async markOverdueInvoices() { ... }
```

Written with a single instance in the author's head. Run two, and every invoice gets marked twice and every customer gets two reminder emails. And you'll discover it during a deploy, because a rolling restart briefly runs both the old and new instance at the same time — which is exactly when two pods happen to exist, and exactly when nobody's watching the job.

The shape of the fix:

```
t=0    instance-a acquires lease, TTL 60s
t=20   instance-a renews  → expires t=80
t=40   instance-a renews  → expires t=100
t=45   instance-a is OOM-killed mid-job
t=100  lease expires on its own. instance-b picks it up.
```

You don't need etcd for this. A single row with an `owner` and an `expires_at`, claimed with a conditional update, is enough:

```sql
UPDATE job_leases
   SET owner = ?, expires_at = NOW() + INTERVAL 60 SECOND
 WHERE job_name = ?
   AND (owner IS NULL OR expires_at < NOW());
-- affected rows = 1 → you hold it. 0 → someone else does. Skip this run.
```

The atomicity is doing the work. Two instances run that statement; the database serialises them; exactly one sees one affected row.

One subtlety worth internalising: **renew early and treat the lease as dead well before its nominal deadline.** Clocks drift. If the database expires you at `t=100` and you believe you hold it until `t=100`, there's a window where the new holder and you both think you own the job.

### The locks you already have are fine

While you're auditing this, notice what you *don't* need to change. If you've written this:

```ts
const stock = await repo.findOne({
  where: { productId },
  lock: { mode: 'pessimistic_write' },   // SELECT ... FOR UPDATE
});
```

…that's a lock, not a lease — but it's safe, for two reasons that wouldn't hold if you'd built it yourself. It expires (`innodb_lock_wait_timeout`, 50 seconds by default), and it dies with its holder: if your process is killed mid-transaction, the database sees the connection drop, rolls back, and releases it.

Automatic expiry plus release-on-death are the two properties that define a lease. Your database grants them.

**So the real audit question is: where do you hold a lock your database doesn't know about?** A `status = 'PROCESSING'` flag. A Redis key with no TTL. A boolean in module scope. Those are the ones that get stuck, because nothing is watching for the holder to die. Those need a real expiry.

---

## 3. Write-Ahead Log — you already have it, and your audit table isn't one

**The pattern.** Before modifying your data structure, append a description of the change to a log and flush it. On restart, replay the log to recover. Appending is sequential, which disks are fast at; updating a B-tree in place is random, which they aren't.

**The trigger condition for implementing one yourself: you keep authoritative state in memory that must survive a restart.** In a normal CRUD application, you don't. Your state is in the database, and the database's own WAL — Postgres's WAL, InnoDB's redo log, SQLite's journal — is already doing this on every transaction you write.

So this pattern is on the list not to build, but to recognise. And there's one specific confusion worth clearing up, because a lot of us have made it.

Most mature codebases have an append-only table. Stock movements, a ledger, an audit log — rows go in, nothing ever updates them. It looks like a WAL. It is not one, and the difference is which record is authoritative:

```
             WAL                          audit trail
   ┌──────────────────────┐      ┌────────────────────────────┐
   │ 1. append to log     │      │ 1. update the row          │
   │ 2. update the state  │      │ 2. append a movement row   │
   │                      │      │                            │
   │ log is the truth     │      │ the row is the truth       │
   │ state is a cache     │      │ the log describes it       │
   └──────────────────────┘      └────────────────────────────┘
```

Truncate your movements table tonight and the system runs fine tomorrow. Truncate a real WAL and you've lost the database.

That's not a criticism of audit tables — they're valuable, and because both writes go in one transaction they can't drift apart. Just don't file it under "we have durability covered." **Your durability comes from the transaction, not from the journal beside it.**

---

## Bonus: the one that isn't on the list, and bites monoliths hardest

**Saga with compensating transactions.** When a single logical operation writes to two systems that can't share a transaction — two databases, or a database and a payment API, or a database and a message queue — do the steps in order, and on failure apply the inverse of every step that already succeeded.

```ts
const record = await primaryDb.save(entity);

try {
  await otherSystem.create(...);
} catch (error) {
  await primaryDb.delete(record.id);   // compensate
  throw error;
}
```

**The trigger condition: any single operation that writes to two places.** Almost every monolith has at least one — a signup that writes a user and calls Stripe, an order that writes a row and pushes to a queue, an admin action that spans two schemas. People write this code without noticing they've crossed a boundary that transactions can't.

Know the weakness of the version above: if the process dies *between* the two calls, no compensation runs and you're left with a half-completed operation. The rigorous version persists the saga's state so it can be resumed after a crash. The simple version is often the right trade — but "I chose the weak version knowingly" is a very different position from "I didn't know there were two."

---

## 4. Leader and Followers — no

**The pattern.** Keep several copies of the data; make one of them the leader; all writes go through it; followers replicate its log in order. Supported by majority quorum, a generation clock, and a high-water mark.

**The trigger condition: more than one node can accept a write.**

In a single-database application, nothing can. There is one writer, by construction. Two clients writing conflicting values to different replicas is not a situation your architecture is capable of producing.

Skip it — but know what it's for, because the day you add a read replica, its vocabulary becomes your vocabulary. Replication lag is the high-water mark problem in a different costume: data your primary has committed, your replica hasn't got yet, and a user who writes then immediately reads sees their own change vanish. That's when you need to care.

Until then: not your problem. It's fine for it to not be your problem.

---

## 5. Circuit Breaker — not yet, and here's the exact moment

**The pattern.** Wrap calls to an external dependency. Count failures. Past a threshold, stop calling and fail instantly. After a cooling-off period, let exactly one probe through; success closes the circuit, failure re-opens it.

**The trigger condition: your code makes its first outbound network call to something you don't control.**

If your app talks only to its own database, there's nothing to break, and adding a breaker is ceremony. Plenty of internal business applications live here for years.

But the transition is sharper than people expect, so know it's coming. The first time you add an email provider, an SMS gateway, a payment API, a government e-invoicing endpoint — that day, this pattern becomes load-bearing.

And the danger isn't the dependency going down. **A slow dependency is worse than a dead one.** Dead fails fast. Slow means calls that took 200ms now take 30 seconds before timing out, each holding a connection and a slot in your pool. New requests queue behind them. The pool exhausts. Now requests that have *nothing to do with that dependency* start failing, because there's no capacity left.

Two things that decide whether your breaker is real or decorative:

- **A breaker without a timeout is decoration.** With no deadline on the underlying call, the breaker never observes a failure to count — it just accumulates hung promises like everything else. Aggressive timeout first, breaker on top.
- **Not every error is a health signal.** A 400 because you sent a malformed payload is your bug. Trip on that and one bad record takes the integration down for everyone. Count timeouts, connection refused, 5xx, 429. Don't count validation failures, business-rule rejections, auth errors. The test: *would retrying this identical request plausibly succeed?* If no, it's not a health signal.

The worst place to make this mistake is inside a scheduled job that loops over an unbounded set of records and calls out once per record. If you're planning to add notifications to a nightly job, that's the loop — put the timeout in before you put the feature in.

---

## The summary worth keeping

| Pattern | Applies to a monolith? | Trigger condition |
|---|---|---|
| Idempotent Receiver | **Yes, today** | You have a network |
| Lease | **Yes, at 2 instances** | A second copy of the app runs |
| Write-Ahead Log | **Already have it** | Only build one if authoritative state lives in memory |
| Saga | **Yes, today** | One operation writes to two systems |
| Leader and Followers | No | More than one node accepts writes |
| Circuit Breaker | Not yet | First outbound call you don't control |

The useful move isn't adopting patterns. It's learning the trigger conditions, then grepping your own code for them — because the condition is usually already there, in a file somebody wrote without thinking about it, and the pattern is just the name that lets you see it.

Two of these are not your problem. Say so out loud, write down what would change that, and spend the attention on the ones that are.
