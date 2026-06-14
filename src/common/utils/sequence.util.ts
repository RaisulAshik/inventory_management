import { DataSource } from 'typeorm';

function getDatePart(now: Date): string {
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yy}${mm}${dd}`;
}

function getDefaultPrefix(sequenceType: string): string {
  const prefixes: Record<string, string> = {
    SALES_ORDER: 'SO',
    PURCHASE_ORDER: 'PO',
    INVOICE: 'INV',
    GRN: 'GRN',
    WORK_ORDER: 'WO',
    TRANSFER: 'TR',
    ADJUSTMENT: 'ADJ',
    CUSTOMER: 'CUST',
    SUPPLIER: 'SUPP',
    PRODUCT: 'PRD',
    EXPENSE: 'EXP',
    STOCK_MOVEMENT: 'STM',
    EMPLOYEE: 'EMP',
    LEAVE_REQUEST: 'LR',
    PAYROLL: 'PAY',
  };
  return prefixes[sequenceType] ?? sequenceType.substring(0, 3).toUpperCase();
}

export async function getNextSequence(
  dataSource: DataSource,
  sequenceType: string,
): Promise<string> {
  const prefix = getDefaultPrefix(sequenceType);
  const now = new Date();

  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();

  try {
    // 1. Ensure the row exists. INSERT IGNORE is atomic — if two connections
    //    race here, exactly one inserts and the other is silently skipped.
    await queryRunner.query(
      `INSERT IGNORE INTO sequence_numbers
         (id, sequence_type, prefix, current_number, padding_length,
          reset_period, last_reset_at, created_at, updated_at)
       VALUES (UUID(), ?, ?, 0, 4, 'DAILY', '1970-01-01', NOW(), NOW())`,
      [sequenceType, prefix],
    );

    // 2. Atomically reset (new day) and increment in one statement.
    //    COALESCE handles existing rows where last_reset_at IS NULL — treats
    //    them as '1970-01-01' so they always reset on first use of the day.
    //    LAST_INSERT_ID(expr) stores the result in the per-connection slot,
    //    invisible to any other session, so no two callers can get the same number.
    await queryRunner.query(
      `UPDATE sequence_numbers
       SET
         current_number = IF(
           COALESCE(last_reset_at, '1970-01-01') < CURDATE(),
           LAST_INSERT_ID(1),
           LAST_INSERT_ID(current_number + 1)
         ),
         last_reset_at = IF(
           COALESCE(last_reset_at, '1970-01-01') < CURDATE(),
           CURDATE(),
           last_reset_at
         ),
         updated_at = NOW()
       WHERE sequence_type = ?`,
      [sequenceType],
    );

    // 3. Read back the value THIS connection just set.
    //    LAST_INSERT_ID() is per-connection — no race between step 2 and 3.
    const [row] = await queryRunner.query(
      `SELECT LAST_INSERT_ID() AS current_number,
              prefix,
              padding_length
       FROM sequence_numbers
       WHERE sequence_type = ?`,
      [sequenceType],
    );

    const datePart = getDatePart(now);
    const paddedNumber = String(Number(row.current_number)).padStart(
      Number(row.padding_length) || 4,
      '0',
    );
    return `${(row.prefix as string) ?? prefix}${datePart}${paddedNumber}`;
  } finally {
    await queryRunner.release();
  }
}
