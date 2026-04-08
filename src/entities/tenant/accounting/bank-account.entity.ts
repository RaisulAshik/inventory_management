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

export enum BankAccountType {
  SAVINGS = 'SAVINGS',
  CURRENT = 'CURRENT',
  CASH_CREDIT = 'CASH_CREDIT',
  OVERDRAFT = 'OVERDRAFT',
  FIXED_DEPOSIT = 'FIXED_DEPOSIT',
  OTHER = 'OTHER',
}

@Entity('bank_accounts')
export class BankAccount {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'account_code', length: 50, unique: true })
  accountCode: string;

  @Column({ name: 'account_name', length: 200 })
  accountName: string;

  @Column({
    name: 'account_type',
    type: 'enum',
    enum: BankAccountType,
    default: BankAccountType.CURRENT,
  })
  accountType: BankAccountType;

  @Column({ name: 'bank_name', length: 200 })
  bankName: string;

  @Column({ name: 'branch_name', length: 200, nullable: true })
  branchName: string;

  @Column({ name: 'account_number', length: 50 })
  accountNumber: string;

  @Column({ name: 'ifsc_code', length: 20, nullable: true })
  ifscCode: string;

  @Column({ name: 'swift_code', length: 20, nullable: true })
  swiftCode: string;

  @Column({ name: 'micr_code', length: 20, nullable: true })
  micrCode: string;

  @Column({ length: 3, default: 'BDT' })
  currency: string;

  @Column({ name: 'gl_account_id', nullable: true })
  glAccountId: string;

  @Column({
    name: 'opening_balance',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  openingBalance: number;

  @Column({
    name: 'current_balance',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  currentBalance: number;

  @Column({
    name: 'overdraft_limit',
    type: 'decimal',
    precision: 18,
    scale: 4,
    nullable: true,
  })
  overdraftLimit: number;

  @Column({
    name: 'interest_rate',
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
  })
  interestRate: number;

  @Column({ name: 'contact_person', length: 200, nullable: true })
  contactPerson: string;

  @Column({ name: 'contact_phone', length: 50, nullable: true })
  contactPhone: string;

  @Column({ name: 'contact_email', length: 255, nullable: true })
  contactEmail: string;

  @Column({ type: 'text', nullable: true })
  address: string;

  @Column({ name: 'is_primary', type: 'tinyint', default: 0 })
  isPrimary: boolean;

  @Column({ name: 'is_active', type: 'tinyint', default: 1 })
  isActive: boolean;

  @Column({ name: 'last_reconciled_date', type: 'date', nullable: true })
  lastReconciledDate: Date;

  @Column({
    name: 'last_reconciled_balance',
    type: 'decimal',
    precision: 18,
    scale: 4,
    nullable: true,
  })
  lastReconciledBalance: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => ChartOfAccounts)
  @JoinColumn({ name: 'gl_account_id' })
  glAccount: ChartOfAccounts;

  // Helper
  get availableBalance(): number {
    if (this.overdraftLimit) {
      return this.currentBalance + this.overdraftLimit;
    }
    return this.currentBalance;
  }
}
