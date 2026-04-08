import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Customer } from '../eCommerce/customer.entity';
import { SalesOrder } from '../eCommerce/sales-order.entity';
import { SalesReturn } from '../eCommerce/sales-return.entity';

export enum CreditNoteStatus {
  DRAFT = 'DRAFT',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  PARTIALLY_USED = 'PARTIALLY_USED',
  FULLY_USED = 'FULLY_USED',
  CANCELLED = 'CANCELLED',
  EXPIRED = 'EXPIRED',
}

export enum CreditNoteReason {
  SALES_RETURN = 'SALES_RETURN',
  PRICE_ADJUSTMENT = 'PRICE_ADJUSTMENT',
  QUALITY_ISSUE = 'QUALITY_ISSUE',
  BILLING_ERROR = 'BILLING_ERROR',
  GOODWILL = 'GOODWILL',
  DAMAGED_GOODS = 'DAMAGED_GOODS',
  SHORT_DELIVERY = 'SHORT_DELIVERY',
  OTHER = 'OTHER',
}

@Entity('credit_notes')
export class CreditNote {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'credit_note_number', length: 50, unique: true })
  creditNoteNumber: string;

  @Column({ name: 'credit_note_date', type: 'date' })
  creditNoteDate: Date;

  @Column({ name: 'customer_id' })
  customerId: string;

  @Column({ name: 'sales_order_id', nullable: true })
  salesOrderId: string;

  @Column({ name: 'sales_return_id', nullable: true })
  salesReturnId: string;

  @Column({
    type: 'enum',
    enum: CreditNoteReason,
  })
  reason: CreditNoteReason;

  @Column({ name: 'reason_details', type: 'text', nullable: true })
  reasonDetails: string;

  @Column({
    type: 'enum',
    enum: CreditNoteStatus,
    default: CreditNoteStatus.DRAFT,
  })
  status: CreditNoteStatus;

  @Column({ length: 3, default: 'BDT' })
  currency: string;

  @Column({
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  subtotal: number;

  @Column({
    name: 'tax_amount',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  taxAmount: number;

  @Column({
    name: 'total_amount',
    type: 'decimal',
    precision: 18,
    scale: 4,
  })
  totalAmount: number;

  @Column({
    name: 'used_amount',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  usedAmount: number;

  @Column({
    name: 'balance_amount',
    type: 'decimal',
    precision: 18,
    scale: 4,
  })
  balanceAmount: number;

  @Column({ name: 'valid_until', type: 'date', nullable: true })
  validUntil: Date;

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
  @ManyToOne(() => Customer)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @ManyToOne(() => SalesOrder)
  @JoinColumn({ name: 'sales_order_id' })
  salesOrder: SalesOrder;

  @ManyToOne(() => SalesReturn)
  @JoinColumn({ name: 'sales_return_id' })
  salesReturn: SalesReturn;

  // Computed
  get isExpired(): boolean {
    return this.validUntil && new Date(this.validUntil) < new Date();
  }

  get isUsable(): boolean {
    return (
      this.status === CreditNoteStatus.APPROVED &&
      this.balanceAmount > 0 &&
      !this.isExpired
    );
  }
}
