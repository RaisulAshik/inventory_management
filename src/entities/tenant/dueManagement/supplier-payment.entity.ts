import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BankAccount } from '../accounting/bank-account.entity';
import { PaymentMethod } from '../eCommerce/payment-method.entity';
import { Supplier } from '../inventory/supplier.entity';
import { User } from '../user/user.entity';

export enum SupplierPaymentStatus {
  DRAFT = 'DRAFT',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  FAILED = 'FAILED',
}

@Entity('supplier_payments')
export class SupplierPayment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'payment_number', length: 50, unique: true })
  paymentNumber: string;

  @Column({ name: 'payment_date', type: 'date' })
  paymentDate: Date;

  @Column({ name: 'supplier_id' })
  supplierId: string;

  @Column({ name: 'payment_method_id' })
  paymentMethodId: string;

  @Column({ name: 'bank_account_id', nullable: true })
  bankAccountId: string;

  @Column({
    type: 'decimal',
    precision: 18,
    scale: 4,
  })
  amount: number;

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
    type: 'enum',
    enum: SupplierPaymentStatus,
    default: SupplierPaymentStatus.DRAFT,
  })
  status: SupplierPaymentStatus;

  @Column({ name: 'reference_number', length: 100, nullable: true })
  referenceNumber: string;

  @Column({ name: 'cheque_number', length: 50, nullable: true })
  chequeNumber: string;

  @Column({ name: 'cheque_date', type: 'date', nullable: true })
  chequeDate: Date;

  @Column({ name: 'bank_reference', length: 100, nullable: true })
  bankReference: string;

  @Column({ name: 'transaction_id', length: 255, nullable: true })
  transactionId: string;

  @Column({
    name: 'allocated_amount',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  allocatedAmount: number;

  @Column({
    name: 'unallocated_amount',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  unallocatedAmount: number;

  @Column({
    name: 'tds_amount',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  tdsAmount: number;

  @Column({
    name: 'tds_percentage',
    type: 'decimal',
    precision: 5,
    scale: 2,
    nullable: true,
  })
  tdsPercentage: number;

  @Column({ name: 'journal_entry_id', nullable: true })
  journalEntryId: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ name: 'approved_by', nullable: true })
  approvedBy: string;

  @Column({ name: 'approved_at', type: 'timestamp', nullable: true })
  approvedAt: Date;

  @Column({ name: 'created_by', nullable: true })
  createdBy: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Supplier)
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier;

  @ManyToOne(() => PaymentMethod)
  @JoinColumn({ name: 'payment_method_id' })
  paymentMethod: PaymentMethod;

  @ManyToOne(() => BankAccount)
  @JoinColumn({ name: 'bank_account_id' })
  bankAccount: BankAccount;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'approved_by' })
  approvedByUser: User;

  // Computed
  get netPaymentAmount(): number {
    return this.amount - this.tdsAmount;
  }

  get isFullyAllocated(): boolean {
    return Math.abs(this.amount - this.allocatedAmount) < 0.01;
  }
}
