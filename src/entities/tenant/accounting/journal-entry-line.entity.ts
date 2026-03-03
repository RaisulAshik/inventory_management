import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { JournalEntry } from './journal-entry.entity';
import { ChartOfAccounts } from './chart-of-accounts.entity';
import { TaxCategory } from '../inventory/tax-category.entity';
import { CostCenter } from './cost-center.entity';

export enum PartyType {
  CUSTOMER = 'CUSTOMER',
  SUPPLIER = 'SUPPLIER',
  EMPLOYEE = 'EMPLOYEE',
  OTHER = 'OTHER',
}

@Entity('journal_entry_lines')
export class JournalEntryLine {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'journal_entry_id' })
  journalEntryId: string;

  @Column({ name: 'line_number', type: 'int' })
  lineNumber: number;

  @Column({ name: 'account_id' })
  accountId: string;

  @Column({ name: 'cost_center_id', nullable: true })
  costCenterId: string;

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

  @Column({ length: 3, default: 'INR' })
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

  @Column({
    name: 'party_type',
    type: 'enum',
    enum: PartyType,
    nullable: true,
  })
  partyType: PartyType;

  @Column({ name: 'party_id', nullable: true })
  partyId: string;

  @Column({ name: 'tax_category_id', nullable: true })
  taxCategoryId: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relations
  @ManyToOne(() => JournalEntry, (entry) => entry.lines, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'journal_entry_id' })
  journalEntry: JournalEntry;

  @ManyToOne(() => ChartOfAccounts, (account) => account.journalEntryLines)
  @JoinColumn({ name: 'account_id' })
  account: ChartOfAccounts;

  @ManyToOne(() => CostCenter)
  @JoinColumn({ name: 'cost_center_id' })
  costCenter: CostCenter;

  @ManyToOne(() => TaxCategory)
  @JoinColumn({ name: 'tax_category_id' })
  taxCategory: TaxCategory;
}
