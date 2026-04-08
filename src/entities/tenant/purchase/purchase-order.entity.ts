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
import { PurchaseOrderStatus, PaymentStatus } from '@common/enums';
import { Supplier } from '../inventory/supplier.entity';
import { Warehouse } from '../warehouse/warehouse.entity';
import { PurchaseOrderItem } from './purchase-order-item.entity';

@Entity('purchase_orders')
export class PurchaseOrder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'po_number', length: 50, unique: true })
  poNumber: string;

  @Column({ name: 'supplier_id' })
  supplierId: string;

  @Column({ name: 'warehouse_id' })
  warehouseId: string;

  @Column({ name: 'po_date', type: 'date' })
  poDate: Date;

  @Column({ name: 'order_date', type: 'date' })
  orderDate: Date;

  @Column({ name: 'expected_date', type: 'date', nullable: true })
  expectedDate: Date;

  @Column({
    type: 'enum',
    enum: PurchaseOrderStatus,
    default: PurchaseOrderStatus.DRAFT,
  })
  status: PurchaseOrderStatus;

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
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  subtotal: number;

  @Column({
    name: 'discount_type',
    type: 'enum',
    enum: ['PERCENTAGE', 'FIXED'],
    nullable: true,
  })
  discountType: 'PERCENTAGE' | 'FIXED';

  @Column({
    name: 'discount_value',
    type: 'decimal',
    precision: 18,
    scale: 4,
    nullable: true,
  })
  discountValue: number;

  @Column({
    name: 'discount_amount',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  discountAmount: number;

  @Column({
    name: 'tax_amount',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  taxAmount: number;

  @Column({
    name: 'shipping_amount',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  shippingAmount: number;

  @Column({
    name: 'other_charges',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  otherCharges: number;

  @Column({
    name: 'total_amount',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  totalAmount: number;

  @Column({
    name: 'paid_amount',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  paidAmount: number;

  @Column({
    name: 'payment_status',
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.UNPAID,
  })
  paymentStatus: PaymentStatus;

  @Column({ name: 'payment_terms_days', type: 'int', nullable: true })
  paymentTermsDays: number;

  @Column({ name: 'payment_due_date', type: 'date', nullable: true })
  paymentDueDate: Date;

  // Billing Address
  @Column({ name: 'billing_address_line1', length: 255, nullable: true })
  billingAddressLine1: string;

  @Column({ name: 'billing_address_line2', length: 255, nullable: true })
  billingAddressLine2: string;

  @Column({ name: 'billing_city', length: 100, nullable: true })
  billingCity: string;

  @Column({ name: 'billing_state', length: 100, nullable: true })
  billingState: string;

  @Column({ name: 'billing_country', length: 100, nullable: true })
  billingCountry: string;

  @Column({ name: 'billing_postal_code', length: 20, nullable: true })
  billingPostalCode: string;

  // Shipping Address
  @Column({ name: 'shipping_address_line1', length: 255, nullable: true })
  shippingAddressLine1: string;

  @Column({ name: 'shipping_address_line2', length: 255, nullable: true })
  shippingAddressLine2: string;

  @Column({ name: 'shipping_city', length: 100, nullable: true })
  shippingCity: string;

  @Column({ name: 'shipping_state', length: 100, nullable: true })
  shippingState: string;

  @Column({ name: 'shipping_country', length: 100, nullable: true })
  shippingCountry: string;

  @Column({ name: 'shipping_postal_code', length: 20, nullable: true })
  shippingPostalCode: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ name: 'internal_notes', type: 'text', nullable: true })
  internalNotes: string;

  @Column({ name: 'terms_and_conditions', type: 'text', nullable: true })
  termsAndConditions: string;

  @Column({ name: 'approved_by', nullable: true })
  approvedBy: string;

  @Column({ name: 'approved_at', type: 'timestamp', nullable: true })
  approvedAt: Date;

  @Column({ name: 'acknowledged_at', type: 'timestamp', nullable: true })
  acknowledgedAt: Date;

  @Column({ name: 'supplier_reference_number', nullable: true })
  supplierReferenceNumber: string;

  @Column({ name: 'sent_at', type: 'timestamp', nullable: true })
  sentAt: Date;

  @Column({ name: 'sent_by', nullable: true })
  sentBy: string;

  @Column({ name: 'cancelled_at', type: 'timestamp', nullable: true })
  cancelledAt: Date;

  @Column({ name: 'cancelled_by', nullable: true })
  cancelledBy: string;

  @Column({ name: 'created_by', nullable: true })
  createdBy: string;

  @Column({ name: 'cancellation_reason', nullable: true })
  cancellationReason: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Supplier, (supplier) => supplier.purchaseOrders)
  @JoinColumn({ name: 'supplier_id' })
  supplier: Supplier;

  @ManyToOne(() => Warehouse)
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: Warehouse;

  @OneToMany(() => PurchaseOrderItem, (item) => item.purchaseOrder)
  items: PurchaseOrderItem[];

  // Computed
  get balanceAmount(): number {
    return this.totalAmount - this.paidAmount;
  }
}
