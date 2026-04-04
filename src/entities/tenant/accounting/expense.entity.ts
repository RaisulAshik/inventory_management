import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ChartOfAccounts } from './chart-of-accounts.entity';
import { JournalEntry } from './journal-entry.entity';

export enum ExpenseStatus {
  POSTED = 'POSTED',
  CANCELLED = 'CANCELLED',
}

@Entity('expenses')
export class Expense {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'expense_number', length: 50, unique: true })
  expenseNumber: string;

  @Column({ name: 'expense_date', type: 'date' })
  expenseDate: Date;

  @Column({ name: 'expense_account_id' })
  expenseAccountId: string;

  @Column({ name: 'paid_from_account_id' })
  paidFromAccountId: string;

  @Column({ type: 'decimal', precision: 18, scale: 4 })
  amount: number;

  @Column({
    name: 'tax_amount',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  taxAmount: number;

  @Column({ name: 'total_amount', type: 'decimal', precision: 18, scale: 4 })
  totalAmount: number;

  @Column({ type: 'text' })
  description: string;

  @Column({ name: 'reference_number', length: 100, nullable: true })
  referenceNumber: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ length: 100, nullable: true })
  category: string;

  @Column({
    type: 'enum',
    enum: ExpenseStatus,
    default: ExpenseStatus.POSTED,
  })
  status: ExpenseStatus;

  @Column({ name: 'journal_entry_id', nullable: true })
  journalEntryId: string;

  @Column({ name: 'created_by' })
  createdBy: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => ChartOfAccounts, { eager: false })
  @JoinColumn({ name: 'expense_account_id' })
  expenseAccount: ChartOfAccounts;

  @ManyToOne(() => ChartOfAccounts, { eager: false })
  @JoinColumn({ name: 'paid_from_account_id' })
  paidFromAccount: ChartOfAccounts;

  @ManyToOne(() => JournalEntry, { eager: false, nullable: true })
  @JoinColumn({ name: 'journal_entry_id' })
  journalEntry: JournalEntry;
}
