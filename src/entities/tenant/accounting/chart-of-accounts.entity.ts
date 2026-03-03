import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { AccountType, NormalBalance } from '@common/enums';
import { JournalEntryLine } from './journal-entry-line.entity';

@Entity('chart_of_accounts')
export class ChartOfAccounts {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'account_code', length: 50, unique: true })
  accountCode: string;

  @Column({ name: 'account_name', length: 200 })
  accountName: string;

  @Column({
    name: 'account_type',
    type: 'enum',
    enum: AccountType,
  })
  accountType: AccountType;

  @Column({ name: 'account_subtype', length: 50, nullable: true })
  accountSubtype: string;

  @Column({ name: 'parent_id', nullable: true })
  parentId: string;

  @Column({ type: 'int', default: 0 })
  level: number;

  @Column({ length: 500, nullable: true })
  path: string;

  @Column({
    name: 'normal_balance',
    type: 'enum',
    enum: NormalBalance,
  })
  normalBalance: NormalBalance;

  @Column({ name: 'is_header', type: 'tinyint', default: 0 })
  isHeader: boolean;

  @Column({ name: 'is_system', type: 'tinyint', default: 0 })
  isSystem: boolean;

  @Column({ name: 'is_active', type: 'tinyint', default: 1 })
  isActive: boolean;

  @Column({ name: 'is_bank_account', type: 'tinyint', default: 0 })
  isBankAccount: boolean;

  @Column({ name: 'is_cash_account', type: 'tinyint', default: 0 })
  isCashAccount: boolean;

  @Column({ name: 'is_receivable', type: 'tinyint', default: 0 })
  isReceivable: boolean;

  @Column({ name: 'is_payable', type: 'tinyint', default: 0 })
  isPayable: boolean;

  @Column({ length: 3, nullable: true })
  currency: string;

  @Column({
    name: 'opening_balance_debit',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  openingBalanceDebit: number;

  @Column({
    name: 'opening_balance_credit',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  openingBalanceCredit: number;

  @Column({
    name: 'current_balance',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  currentBalance: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => ChartOfAccounts, (account) => account.children)
  @JoinColumn({ name: 'parent_id' })
  parent: ChartOfAccounts;

  @OneToMany(() => ChartOfAccounts, (account) => account.parent)
  children: ChartOfAccounts[];

  @OneToMany(() => JournalEntryLine, (line) => line.account)
  journalEntryLines: JournalEntryLine[];

  // Helper
  get openingBalance(): number {
    return this.openingBalanceDebit - this.openingBalanceCredit;
  }

  get isDebitBalance(): boolean {
    return this.normalBalance === NormalBalance.DEBIT;
  }
}
