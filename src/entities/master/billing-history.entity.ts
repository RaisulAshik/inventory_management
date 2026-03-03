import {
  Entity,
  PrimaryColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Tenant } from './tenant.entity';
import { Subscription } from './subscription.entity';

export enum BillingStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED',
  CANCELLED = 'CANCELLED',
}

@Entity('billing_history')
@Index(['tenantId', 'invoiceDate'])
@Index(['invoiceNumber'], { unique: true })
@Index(['status'])
export class BillingHistory {
  @PrimaryColumn('char', { length: 36 })
  id: string;

  @Column('char', { name: 'tenant_id', length: 36 })
  tenantId: string;

  @Column('char', { name: 'subscription_id', length: 36, nullable: true })
  subscriptionId: string;

  @Column('varchar', { name: 'invoice_number', length: 50 })
  invoiceNumber: string;

  @Column('decimal', { precision: 15, scale: 2 })
  amount: number;

  @Column('decimal', {
    name: 'tax_amount',
    precision: 15,
    scale: 2,
    default: 0,
  })
  taxAmount: number;

  @Column('decimal', { name: 'total_amount', precision: 15, scale: 2 })
  totalAmount: number;

  @Column('char', { length: 3, default: 'INR' })
  currency: string;

  @Column({
    type: 'enum',
    enum: BillingStatus,
    default: BillingStatus.PENDING,
  })
  status: BillingStatus;

  @Column('text', { nullable: true })
  description: string;

  @Column('date', { name: 'period_start', nullable: true })
  periodStart: Date;

  @Column('date', { name: 'period_end', nullable: true })
  periodEnd: Date;

  @Column('date', { name: 'invoice_date' })
  invoiceDate: Date;

  @Column('date', { name: 'due_date' })
  dueDate: Date;

  @Column('date', { name: 'paid_date', nullable: true })
  paidDate: Date;

  // Payment details
  @Column('varchar', { name: 'payment_method', length: 50, nullable: true })
  paymentMethod: string;

  @Column('varchar', { name: 'payment_reference', length: 255, nullable: true })
  paymentReference: string;

  @Column('varchar', { name: 'transaction_id', length: 255, nullable: true })
  transactionId: string;

  @Column('text', { name: 'payment_gateway_response', nullable: true })
  paymentGatewayResponse: string;

  // Refund details
  @Column('decimal', {
    name: 'refund_amount',
    precision: 15,
    scale: 2,
    nullable: true,
  })
  refundAmount: number;

  @Column('date', { name: 'refund_date', nullable: true })
  refundDate: Date;

  @Column('varchar', { name: 'refund_reason', length: 500, nullable: true })
  refundReason: string;

  // Invoice PDF
  @Column('varchar', { name: 'invoice_url', length: 500, nullable: true })
  invoiceUrl: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Tenant)
  @JoinColumn({ name: 'tenant_id' })
  tenant: Tenant;

  @ManyToOne(() => Subscription, (sub) => sub.billingHistory)
  @JoinColumn({ name: 'subscription_id' })
  subscription: Subscription;

  // Computed
  get isPaid(): boolean {
    return this.status === BillingStatus.PAID;
  }

  get isOverdue(): boolean {
    return (
      this.status === BillingStatus.PENDING &&
      new Date() > new Date(this.dueDate)
    );
  }
}
