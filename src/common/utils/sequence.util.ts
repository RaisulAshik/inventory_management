import { DataSource } from 'typeorm';
import {
  SequenceNumber,
  ResetPeriod,
} from '@entities/tenant/user/sequence-number.entity';

function getDatePart(now: Date): string {
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const dd = String(now.getDate()).padStart(2, '0');
  return `${yy}${mm}${dd}`;
}

function shouldReset(sequence: SequenceNumber, now: Date): boolean {
  if (!sequence.lastResetAt) return true;
  const last = new Date(sequence.lastResetAt);
  return (
    last.getFullYear() !== now.getFullYear() ||
    last.getMonth() !== now.getMonth() ||
    last.getDate() !== now.getDate()
  );
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
  const queryRunner = dataSource.createQueryRunner();
  await queryRunner.connect();
  await queryRunner.startTransaction();

  try {
    const sequenceRepo = queryRunner.manager.getRepository(SequenceNumber);
    const now = new Date();

    let sequence = await sequenceRepo.findOne({
      where: { sequenceType },
      lock: { mode: 'pessimistic_write' },
    });

    if (!sequence) {
      sequence = sequenceRepo.create({
        sequenceType,
        prefix: getDefaultPrefix(sequenceType),
        currentNumber: 0,
        paddingLength: 4,
        resetPeriod: ResetPeriod.DAILY,
      });
    }

    if (shouldReset(sequence, now)) {
      sequence.currentNumber = 0;
      sequence.lastResetAt = now;
    }

    sequence.currentNumber = Number(sequence.currentNumber) + 1;
    await sequenceRepo.save(sequence);
    await queryRunner.commitTransaction();

    const datePart = getDatePart(now);
    const paddedNumber = String(sequence.currentNumber).padStart(
      sequence.paddingLength,
      '0',
    );

    // e.g. "INV2604050001", "PO2604050002"
    return `${sequence.prefix ?? ''}${datePart}${paddedNumber}`;
  } catch (error) {
    await queryRunner.rollbackTransaction();
    throw error;
  } finally {
    await queryRunner.release();
  }
}
