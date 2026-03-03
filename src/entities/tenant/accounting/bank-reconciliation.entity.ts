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
import { User } from '../user/user.entity';

export enum ReconciliationStatus {
  DRAFT = 'DRAFT',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

@Entity('bank_reconciliations')
export class BankReconciliation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'reconciliation_number', length: 50, unique: true })
  reconciliationNumber: string;

  @Column({ name: 'bank_account_id' })
  bankAccountId: string;

  @Column({ name: 'statement_date', type: 'date' })
  statementDate: Date;

  @Column({ name: 'statement_start_date', type: 'date' })
  statementStartDate: Date;

  @Column({ name: 'statement_end_date', type: 'date' })
  statementEndDate: Date;

  @Column({
    type: 'enum',
    enum: ReconciliationStatus,
    default: ReconciliationStatus.DRAFT,
  })
  status: ReconciliationStatus;

  @Column({
    name: 'opening_balance_book',
    type: 'decimal',
    precision: 18,
    scale: 4,
  })
  openingBalanceBook: number;

  @Column({
    name: 'closing_balance_book',
    type: 'decimal',
    precision: 18,
    scale: 4,
  })
  closingBalanceBook: number;

  @Column({
    name: 'opening_balance_bank',
    type: 'decimal',
    precision: 18,
    scale: 4,
  })
  openingBalanceBank: number;

  @Column({
    name: 'closing_balance_bank',
    type: 'decimal',
    precision: 18,
    scale: 4,
  })
  closingBalanceBank: number;

  @Column({
    name: 'total_deposits_book',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  totalDepositsBook: number;

  @Column({
    name: 'total_withdrawals_book',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  totalWithdrawalsBook: number;

  @Column({
    name: 'total_deposits_bank',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  totalDepositsBank: number;

  @Column({
    name: 'total_withdrawals_bank',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  totalWithdrawalsBank: number;

  @Column({
    name: 'deposits_in_transit',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  depositsInTransit: number;

  @Column({
    name: 'outstanding_cheques',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  outstandingCheques: number;

  @Column({
    name: 'bank_errors',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  bankErrors: number;

  @Column({
    name: 'book_errors',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  bookErrors: number;

  @Column({
    name: 'adjusted_balance_book',
    type: 'decimal',
    precision: 18,
    scale: 4,
    nullable: true,
  })
  adjustedBalanceBook: number;

  @Column({
    name: 'adjusted_balance_bank',
    type: 'decimal',
    precision: 18,
    scale: 4,
    nullable: true,
  })
  adjustedBalanceBank: number;

  @Column({
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  difference: number;

  @Column({ name: 'is_reconciled', type: 'tinyint', default: 0 })
  isReconciled: boolean;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ name: 'reconciled_by', nullable: true })
  reconciledBy: string;

  @Column({ name: 'reconciled_at', type: 'timestamp', nullable: true })
  reconciledAt: Date;

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

  @ManyToOne(() => User)
  @JoinColumn({ name: 'reconciled_by' })
  reconciledByUser: User;
}
