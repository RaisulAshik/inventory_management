import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { DueStatus } from '@common/enums';
import { Supplier } from '../inventory/supplier.entity';

export enum SupplierDueReferenceType {
  PURCHASE_ORDER = 'PURCHASE_ORDER',
  GRN = 'GRN',
  BILL = 'BILL',
  CREDIT_NOTE = 'CREDIT_NOTE',
  OPENING_BALANCE = 'OPENING_BALANCE',
  OTHER = 'OTHER',
}

@Entity('supplier_dues')
export class SupplierDue {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'supplier_id' })
  supplierId: string;

  @Column({
    name: 'reference_type',
    type: 'enum',
    enum: SupplierDueReferenceType,
  })
  referenceType: SupplierDueReferenceType;

  @Column({ name: 'reference_id', nullable: true })
  referenceId: string;

  @Column({ name: 'purchase_order_id', nullable: true })
  purchaseOrderId: string;

  @Column({ name: 'reference_number', length: 50, nullable: true })
  referenceNumber: string;

  @Column({ name: 'bill_number', length: 100, nullable: true })
  billNumber: string;

  @Column({ name: 'bill_date', type: 'date', nullable: true })
  billDate: Date;

  @Column({ name: 'due_date', type: 'date' })
  dueDate: Date;

  @Column({ length: 3, default: 'BDT' })
  currency: string;

  @Column({
    name: 'original_amount',
    type: 'decimal',
    precision: 18,
    scale: 4,
  })
  originalAmount: number;

  @Column({
    name: 'paid_amount',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  paidAmount: number;

  @Column({
    name: 'adjusted_amount',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  adjustedAmount: number;

  @Column({
    type: 'enum',
    enum: DueStatus,
    default: DueStatus.PENDING,
  })
  status: DueStatus;

  @Column({ name: 'payment_scheduled_date', type: 'date', nullable: true })
  paymentScheduledDate: Date;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Supplier)
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier;

  // Computed
  get balanceAmount(): number {
    return this.originalAmount - this.paidAmount - this.adjustedAmount;
  }

  get overdueDays(): number {
    if (this.balanceAmount <= 0) return 0;
    const today = new Date();
    const due = new Date(this.dueDate);
    const diff = today.getTime() - due.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }
}
