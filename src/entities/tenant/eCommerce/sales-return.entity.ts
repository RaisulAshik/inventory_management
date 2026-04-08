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
import { SalesOrder } from './sales-order.entity';
import { Customer } from './customer.entity';
import { Warehouse } from '../warehouse/warehouse.entity';
import { SalesReturnItem } from './sales-return-item.entity';

export enum SalesReturnStatus {
  REQUESTED = 'REQUESTED',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  RECEIVED = 'RECEIVED',
  INSPECTING = 'INSPECTING',
  REFUND_PENDING = 'REFUND_PENDING',
  REFUNDED = 'REFUNDED',
  EXCHANGED = 'EXCHANGED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum SalesReturnReason {
  DEFECTIVE = 'DEFECTIVE',
  WRONG_ITEM = 'WRONG_ITEM',
  NOT_AS_DESCRIBED = 'NOT_AS_DESCRIBED',
  CHANGED_MIND = 'CHANGED_MIND',
  SIZE_FIT_ISSUE = 'SIZE_FIT_ISSUE',
  DAMAGED_IN_TRANSIT = 'DAMAGED_IN_TRANSIT',
  LATE_DELIVERY = 'LATE_DELIVERY',
  DUPLICATE_ORDER = 'DUPLICATE_ORDER',
  OTHER = 'OTHER',
}

export enum RefundType {
  ORIGINAL_PAYMENT = 'ORIGINAL_PAYMENT',
  STORE_CREDIT = 'STORE_CREDIT',
  BANK_TRANSFER = 'BANK_TRANSFER',
  EXCHANGE = 'EXCHANGE',
}

@Entity('sales_returns')
export class SalesReturn {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'return_number', length: 50, unique: true })
  returnNumber: string;

  @Column({ name: 'return_date', type: 'date' })
  returnDate: Date;

  @Column({ name: 'sales_order_id' })
  salesOrderId: string;

  @Column({ name: 'customer_id' })
  customerId: string;

  @Column({ name: 'warehouse_id' })
  warehouseId: string;

  @Column({
    type: 'enum',
    enum: SalesReturnStatus,
    default: SalesReturnStatus.REQUESTED,
  })
  status: SalesReturnStatus;

  @Column({
    name: 'return_reason',
    type: 'enum',
    enum: SalesReturnReason,
  })
  returnReason: SalesReturnReason;

  @Column({ name: 'reason_details', type: 'text', nullable: true })
  reasonDetails: string;

  @Column({
    name: 'refund_type',
    type: 'enum',
    enum: RefundType,
    nullable: true,
  })
  refundType: RefundType;

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
    name: 'restocking_fee',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  restockingFee: number;

  @Column({
    name: 'shipping_fee_deduction',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  shippingFeeDeduction: number;

  @Column({
    name: 'total_amount',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  totalAmount: number;

  @Column({
    name: 'refund_amount',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  refundAmount: number;

  @Column({ name: 'is_pickup_required', type: 'tinyint', default: 0 })
  isPickupRequired: boolean;

  @Column({ name: 'pickup_address', type: 'text', nullable: true })
  pickupAddress: string;

  @Column({ name: 'pickup_date', type: 'date', nullable: true })
  pickupDate: Date;

  @Column({ name: 'tracking_number', length: 100, nullable: true })
  trackingNumber: string;

  @Column({ name: 'received_date', type: 'date', nullable: true })
  receivedDate: Date;

  @Column({ name: 'inspection_notes', type: 'text', nullable: true })
  inspectionNotes: string;

  @Column({ name: 'customer_notes', type: 'text', nullable: true })
  customerNotes: string;

  @Column({ name: 'internal_notes', type: 'text', nullable: true })
  internalNotes: string;

  @Column({ name: 'refund_transaction_id', length: 255, nullable: true })
  refundTransactionId: string;

  @Column({ name: 'refunded_at', type: 'timestamp', nullable: true })
  refundedAt: Date;

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
  @ManyToOne(() => SalesOrder)
  @JoinColumn({ name: 'sales_order_id' })
  salesOrder: SalesOrder;

  @ManyToOne(() => Customer)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @ManyToOne(() => Warehouse)
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: Warehouse;
  @OneToMany(() => SalesReturnItem, (item) => item.salesReturn)
  items: SalesReturnItem[];
}
