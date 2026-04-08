import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { ChartOfAccounts } from './chart-of-accounts.entity';
import { FiscalYear } from './fiscal-year.entity';
import { FiscalPeriod } from './fiscal-period.entity';
import { CostCenter } from './cost-center.entity';
import { JournalEntry } from './journal-entry.entity';

@Entity('general_ledger')
@Index(['accountId', 'transactionDate'])
@Index(['fiscalYearId', 'fiscalPeriodId', 'accountId'])
export class GeneralLedger {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'account_id' })
  accountId: string;

  @Column({ name: 'fiscal_year_id' })
  fiscalYearId: string;

  @Column({ name: 'fiscal_period_id' })
  fiscalPeriodId: string;

  @Column({ name: 'transaction_date', type: 'date' })
  transactionDate: Date;

  @Column({ name: 'journal_entry_id' })
  journalEntryId: string;

  @Column({ name: 'journal_entry_line_id' })
  journalEntryLineId: string;

  @Column({ length: 500, nullable: true })
  description: string;

  @Column({
    name: 'debit_amount',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  debitAmount: number;

  @Column({
    name: 'credit_amount',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  creditAmount: number;

  @Column({
    name: 'running_balance',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  runningBalance: number;

  @Column({ length: 3, default: 'BDT' })
  currency: string;

  @Column({
    name: 'exchange_rate',
    type: 'decimal',
    precision: 12,
    scale: 6,
    default: 1,
  })
  exchangeRate: number;

  @Column({
    name: 'base_debit_amount',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  baseDebitAmount: number;

  @Column({
    name: 'base_credit_amount',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  baseCreditAmount: number;

  @Column({ name: 'cost_center_id', nullable: true })
  costCenterId: string;

  @Column({ name: 'reference_type', length: 50, nullable: true })
  referenceType: string;

  @Column({ name: 'reference_id', nullable: true })
  referenceId: string;

  @Column({ name: 'reference_number', length: 100, nullable: true })
  referenceNumber: string;

  @Column({ name: 'party_type', length: 50, nullable: true })
  partyType: string;

  @Column({ name: 'party_id', nullable: true })
  partyId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relations
  @ManyToOne(() => ChartOfAccounts)
  @JoinColumn({ name: 'account_id' })
  account: ChartOfAccounts;

  @ManyToOne(() => FiscalYear)
  @JoinColumn({ name: 'fiscal_year_id' })
  fiscalYear: FiscalYear;

  @ManyToOne(() => FiscalPeriod)
  @JoinColumn({ name: 'fiscal_period_id' })
  fiscalPeriod: FiscalPeriod;

  @ManyToOne(() => JournalEntry)
  @JoinColumn({ name: 'journal_entry_id' })
  journalEntry: JournalEntry;

  @ManyToOne(() => CostCenter)
  @JoinColumn({ name: 'cost_center_id' })
  costCenter: CostCenter;

  // Computed
  get netAmount(): number {
    return this.debitAmount - this.creditAmount;
  }
}
