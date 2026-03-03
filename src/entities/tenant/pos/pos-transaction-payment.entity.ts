import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PosTransaction } from './pos-transaction.entity';
import { PaymentMethod } from '../eCommerce/payment-method.entity';

export enum PosPaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
}

@Entity('pos_transaction_payments')
export class PosTransactionPayment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'transaction_id' })
  transactionId: string;

  @Column({ name: 'payment_method_id' })
  paymentMethodId: string;

  @Column({
    type: 'decimal',
    precision: 18,
    scale: 4,
  })
  amount: number;

  @Column({
    name: 'tendered_amount',
    type: 'decimal',
    precision: 18,
    scale: 4,
    nullable: true,
  })
  tenderedAmount: number;

  @Column({
    name: 'change_amount',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  changeAmount: number;

  @Column({ length: 3, default: 'INR' })
  currency: string;

  @Column({
    type: 'enum',
    enum: PosPaymentStatus,
    default: PosPaymentStatus.COMPLETED,
  })
  status: PosPaymentStatus;

  @Column({ name: 'reference_number', length: 100, nullable: true })
  referenceNumber: string;

  @Column({ name: 'card_last_four', length: 4, nullable: true })
  cardLastFour: string;

  @Column({ name: 'card_type', length: 50, nullable: true })
  cardType: string;

  @Column({ name: 'approval_code', length: 50, nullable: true })
  approvalCode: string;

  @Column({ name: 'terminal_response', type: 'json', nullable: true })
  terminalResponse: Record<string, any>;

  @Column({ name: 'is_refund', type: 'tinyint', default: 0 })
  isRefund: boolean;

  @Column({ name: 'refund_reason', type: 'text', nullable: true })
  refundReason: string;

  @Column({ name: 'original_payment_id', nullable: true })
  originalPaymentId: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relations
  @ManyToOne(() => PosTransaction, (transaction) => transaction.payments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'transaction_id' })
  transaction: PosTransaction;

  @ManyToOne(() => PaymentMethod)
  @JoinColumn({ name: 'payment_method_id' })
  paymentMethod: PaymentMethod;
}
