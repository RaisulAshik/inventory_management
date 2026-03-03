import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { SalesOrder } from './sales-order.entity';
import { PaymentMethod } from './payment-method.entity';

export enum OrderPaymentStatus {
  PENDING = 'PENDING',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
  PARTIALLY_REFUNDED = 'PARTIALLY_REFUNDED',
}

@Entity('order_payments')
export class OrderPayment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'order_id' })
  orderId: string;

  @Column({ name: 'payment_method_id' })
  paymentMethodId: string;

  @Column({ name: 'payment_date', type: 'timestamp' })
  paymentDate: Date;

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
    enum: OrderPaymentStatus,
    default: OrderPaymentStatus.PENDING,
  })
  status: OrderPaymentStatus;

  @Column({ name: 'transaction_id', length: 255, nullable: true })
  transactionId: string;

  @Column({ name: 'gateway_transaction_id', length: 255, nullable: true })
  gatewayTransactionId: string;

  @Column({ name: 'gateway_response', type: 'json', nullable: true })
  gatewayResponse: Record<string, any>;

  @Column({ name: 'payment_reference', length: 255, nullable: true })
  paymentReference: string;

  @Column({
    name: 'refunded_amount',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  refundedAmount: number;

  @Column({ name: 'refund_reason', type: 'text', nullable: true })
  refundReason: string;

  @Column({ name: 'refunded_at', type: 'timestamp', nullable: true })
  refundedAt: Date;

  @Column({ name: 'failure_reason', type: 'text', nullable: true })
  failureReason: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ name: 'processed_by', nullable: true })
  processedBy: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => SalesOrder, (order) => order.payments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'order_id' })
  order: SalesOrder;

  @ManyToOne(() => PaymentMethod)
  @JoinColumn({ name: 'payment_method_id' })
  paymentMethod: PaymentMethod;

  // Helper
  get netAmount(): number {
    return this.amount - this.refundedAmount;
  }
}
