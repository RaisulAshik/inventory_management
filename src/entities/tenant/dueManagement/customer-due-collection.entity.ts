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
import { Customer } from '../eCommerce/customer.entity';
import { PaymentMethod } from '../eCommerce/payment-method.entity';
import { User } from '../user/user.entity';

export enum CollectionStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  DEPOSITED = 'DEPOSITED',
  BOUNCED = 'BOUNCED',
  CANCELLED = 'CANCELLED',
}

@Entity('customer_due_collections')
export class CustomerDueCollection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'collection_number', length: 50, unique: true })
  collectionNumber: string;

  @Column({ name: 'collection_date', type: 'date' })
  collectionDate: Date;

  @Column({ name: 'customer_id' })
  customerId: string;

  @Column({ name: 'payment_method_id' })
  paymentMethodId: string;

  @Column({
    type: 'decimal',
    precision: 18,
    scale: 4,
  })
  amount: number;

  @Column({ length: 3, default: 'INR' })
  currency: string;

  @Column({
    type: 'enum',
    enum: CollectionStatus,
    default: CollectionStatus.DRAFT,
  })
  status: CollectionStatus;

  @Column({ name: 'reference_number', length: 100, nullable: true })
  referenceNumber: string;

  @Column({ name: 'cheque_number', length: 50, nullable: true })
  chequeNumber: string;

  @Column({ name: 'cheque_date', type: 'date', nullable: true })
  chequeDate: Date;

  @Column({ name: 'cheque_bank', length: 200, nullable: true })
  chequeBank: string;

  @Column({ name: 'bank_account_id', nullable: true })
  bankAccountId: string;

  @Column({ name: 'deposit_date', type: 'date', nullable: true })
  depositDate: Date;

  @Column({ name: 'clearance_date', type: 'date', nullable: true })
  clearanceDate: Date;

  @Column({ name: 'bounce_date', type: 'date', nullable: true })
  bounceDate: Date;

  @Column({ name: 'bounce_reason', type: 'text', nullable: true })
  bounceReason: string;

  @Column({
    name: 'bounce_charges',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  bounceCharges: number;

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

  @Column({ name: 'journal_entry_id', nullable: true })
  journalEntryId: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ name: 'received_by', nullable: true })
  receivedBy: string;

  @Column({ name: 'created_by', nullable: true })
  createdBy: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Customer)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @ManyToOne(() => PaymentMethod)
  @JoinColumn({ name: 'payment_method_id' })
  paymentMethod: PaymentMethod;

  @ManyToOne(() => BankAccount)
  @JoinColumn({ name: 'bank_account_id' })
  bankAccount: BankAccount;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'received_by' })
  receivedByUser: User;

  // Helper
  get isFullyAllocated(): boolean {
    return Math.abs(this.amount - this.allocatedAmount) < 0.01;
  }
}
