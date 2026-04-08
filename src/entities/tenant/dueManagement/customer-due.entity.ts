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
import { Customer } from '../eCommerce/customer.entity';

export enum CustomerDueReferenceType {
  SALES_ORDER = 'SALES_ORDER',
  INVOICE = 'INVOICE',
  DEBIT_NOTE = 'DEBIT_NOTE',
  OPENING_BALANCE = 'OPENING_BALANCE',
  OTHER = 'OTHER',
}

@Entity('customer_dues')
export class CustomerDue {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'customer_id' })
  customerId: string;

  @Column({
    name: 'reference_type',
    type: 'enum',
    enum: CustomerDueReferenceType,
  })
  referenceType: CustomerDueReferenceType;

  @Column({ name: 'sales_order_id', nullable: true })
  salesOrderId: string;

  @Column({ name: 'reference_id', nullable: true })
  referenceId: string;

  @Column({ name: 'reference_number', length: 50, nullable: true })
  referenceNumber: string;

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
    name: 'written_off_amount',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  writtenOffAmount: number;

  @Column({
    type: 'enum',
    enum: DueStatus,
    default: DueStatus.PENDING,
  })
  status: DueStatus;

  @Column({ name: 'last_reminder_date', type: 'date', nullable: true })
  lastReminderDate: Date;

  @Column({ name: 'reminder_count', type: 'int', default: 0 })
  reminderCount: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Customer)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  // Computed
  get balanceAmount(): number {
    return (
      this.originalAmount -
      this.paidAmount -
      this.adjustedAmount -
      this.writtenOffAmount
    );
  }

  get overdueDays(): number {
    if (this.balanceAmount <= 0) return 0;
    const today = new Date();
    const due = new Date(this.dueDate);
    const diff = today.getTime() - due.getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  }

  get isOverdue(): boolean {
    return this.overdueDays > 0 && this.balanceAmount > 0;
  }
}
