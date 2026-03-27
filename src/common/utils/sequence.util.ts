import { DataSource } from 'typeorm';
import {
  SequenceNumber,
  ResetPeriod,
} from '@entities/tenant/user/sequence-number.entity';

export async function getNextSequence(
  dataSource: DataSource,
  sequenceType: string,
): Promise<string> {
  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const sequenceRepo = queryRunner.manager.getRepository(SequenceNumber);

    // Lock the row for update
    let sequence = await sequenceRepo.findOne({
      where: { sequenceType },
      lock: { mode: 'pessimistic_write' },
    });

    if (!sequence) {
      // Create new sequence
      sequence = sequenceRepo.create({
        sequenceType,
        prefix: getDefaultPrefix(sequenceType),
        currentNumber: 0,
        paddingLength: 6,
        resetPeriod: ResetPeriod.NEVER,
      });
    }

    // Check if reset is needed
    const now = new Date();
    if (shouldReset(sequence, now)) {
      sequence.currentNumber = 0;
      sequence.lastResetAt = now;
    }

    // Increment
    sequence.currentNumber += 1;

    // Save
    await sequenceRepo.save(sequence);

    await queryRunner.commitTransaction();

    // Format the number
    const paddedNumber = String(sequence.currentNumber).padStart(
      sequence.paddingLength,
      '0',
    );

    const datePart = getDatePart(sequence.resetPeriod, now);

    return `${sequence.prefix ?? ''}${datePart}${paddedNumber}${sequence.suffix ?? ''}`;
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
  }
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
  };

  return prefixes[sequenceType] ?? sequenceType.substring(0, 3).toUpperCase();
}

function shouldReset(sequence: SequenceNumber, now: Date): boolean {
  if (!sequence.lastResetAt || sequence.resetPeriod === ResetPeriod.NEVER) {
    return false;
  }

  const lastReset = new Date(sequence.lastResetAt);

  switch (sequence.resetPeriod) {
    case ResetPeriod.DAILY:
      return lastReset.toDateString() !== now.toDateString();
    case ResetPeriod.MONTHLY:
      return (
        lastReset.getMonth() !== now.getMonth() ||
        lastReset.getFullYear() !== now.getFullYear()
      );
    case ResetPeriod.YEARLY:
      return lastReset.getFullYear() !== now.getFullYear();
    default:
      return false;
  }
}

function getDatePart(resetPeriod: ResetPeriod, now: Date): string {
  const year = now.getFullYear().toString().slice(-2);
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  switch (resetPeriod) {
    case ResetPeriod.DAILY:
      return `${year}${month}${day}`;
    case ResetPeriod.MONTHLY:
      return `${year}${month}`;
    case ResetPeriod.YEARLY:
      return year;
    default:
      return '';
  }
}
