import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BankAccount } from './bank-account.entity';
import { JournalEntry } from './journal-entry.entity';

export enum BankTransactionType {
  DEPOSIT = 'DEPOSIT',
  WITHDRAWAL = 'WITHDRAWAL',
  TRANSFER_IN = 'TRANSFER_IN',
  TRANSFER_OUT = 'TRANSFER_OUT',
  INTEREST_CREDIT = 'INTEREST_CREDIT',
  BANK_CHARGES = 'BANK_CHARGES',
  CHEQUE_DEPOSIT = 'CHEQUE_DEPOSIT',
  CHEQUE_ISSUED = 'CHEQUE_ISSUED',
  LOAN_DISBURSEMENT = 'LOAN_DISBURSEMENT',
  LOAN_REPAYMENT = 'LOAN_REPAYMENT',
  OTHER = 'OTHER',
}

export enum BankTransactionStatus {
  PENDING = 'PENDING',
  CLEARED = 'CLEARED',
  BOUNCED = 'BOUNCED',
  CANCELLED = 'CANCELLED',
  RECONCILED = 'RECONCILED',
}

@Entity('bank_transactions')
export class BankTransaction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'transaction_number', length: 50, unique: true })
  transactionNumber: string;

  @Column({ name: 'bank_account_id' })
  bankAccountId: string;

  @Column({ name: 'transaction_date', type: 'date' })
  transactionDate: Date;

  @Column({ name: 'value_date', type: 'date', nullable: true })
  valueDate: Date;

  @Column({
    name: 'transaction_type',
    type: 'enum',
    enum: BankTransactionType,
  })
  transactionType: BankTransactionType;

  @Column({
    type: 'enum',
    enum: BankTransactionStatus,
    default: BankTransactionStatus.PENDING,
  })
  status: BankTransactionStatus;

  @Column({
    type: 'decimal',
    precision: 18,
    scale: 4,
  })
  amount: number;

  @Column({ length: 3, default: 'INR' })
  currency: string;

  @Column({
    name: 'running_balance',
    type: 'decimal',
    precision: 18,
    scale: 4,
    nullable: true,
  })
  runningBalance: number;

  @Column({ type: 'text' })
  description: string;

  @Column({ name: 'reference_number', length: 100, nullable: true })
  referenceNumber: string;

  @Column({ name: 'cheque_number', length: 50, nullable: true })
  chequeNumber: string;

  @Column({ name: 'cheque_date', type: 'date', nullable: true })
  chequeDate: Date;

  @Column({ name: 'payee_payer_name', length: 200, nullable: true })
  payeePayerName: string;

  @Column({ name: 'bank_reference', length: 100, nullable: true })
  bankReference: string;

  @Column({ name: 'journal_entry_id', nullable: true })
  journalEntryId: string;

  @Column({ name: 'is_reconciled', type: 'tinyint', default: 0 })
  isReconciled: boolean;

  @Column({ name: 'reconciled_date', type: 'date', nullable: true })
  reconciledDate: Date;

  @Column({ name: 'reconciliation_id', nullable: true })
  reconciliationId: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ name: 'created_by', nullable: true })
  createdBy: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => BankAccount)
  @JoinColumn({ name: 'bank_account_id' })
  bankAccount: BankAccount;

  @ManyToOne(() => JournalEntry)
  @JoinColumn({ name: 'journal_entry_id' })
  journalEntry: JournalEntry;

  // Helper
  get isDebit(): boolean {
    return [
      BankTransactionType.DEPOSIT,
      BankTransactionType.TRANSFER_IN,
      BankTransactionType.INTEREST_CREDIT,
      BankTransactionType.CHEQUE_DEPOSIT,
      BankTransactionType.LOAN_DISBURSEMENT,
    ].includes(this.transactionType);
  }

  get isCredit(): boolean {
    return [
      BankTransactionType.WITHDRAWAL,
      BankTransactionType.TRANSFER_OUT,
      BankTransactionType.BANK_CHARGES,
      BankTransactionType.CHEQUE_ISSUED,
      BankTransactionType.LOAN_REPAYMENT,
    ].includes(this.transactionType);
  }
}
