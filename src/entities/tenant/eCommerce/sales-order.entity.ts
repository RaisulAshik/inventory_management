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
import {
  SalesOrderStatus,
  PaymentStatus,
  FulfillmentStatus,
  OrderSource,
} from '@common/enums';
import { Customer } from './customer.entity';
import { SalesOrderItem } from './sales-order-item.entity';
import { Warehouse } from '../warehouse/warehouse.entity';
import { Coupon } from './coupon.entity';
import { OrderPayment } from './order-payment.entity';

@Entity('sales_orders')
export class SalesOrder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'order_number', length: 50, unique: true })
  orderNumber: string;

  @Column({ name: 'order_date', type: 'timestamp' })
  orderDate: Date;

  @Column({ name: 'created_by', nullable: true })
  createdBy: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'delivered_at', type: 'timestamp', nullable: true })
  deliveredAt?: Date;

  @Column({
    name: 'order_source',
    type: 'enum',
    enum: OrderSource,
    default: OrderSource.WEBSITE,
  })
  orderSource: OrderSource;

  @Column({ name: 'customer_id', nullable: true })
  customerId: string;

  @Column({ name: 'customer_name', length: 200, nullable: true })
  customerName: string;

  @Column({ name: 'customer_email', length: 255, nullable: true })
  customerEmail: string;

  @Column({ name: 'note', length: 255, nullable: true })
  notes: string;

  @Column({ name: 'customer_phone', length: 50, nullable: true })
  customerPhone: string;

  @Column({ name: 'warehouse_id' })
  warehouseId: string;

  @Column({ name: 'store_id', nullable: true })
  storeId: string;

  @Column({ name: 'shipped_at', type: 'timestamp', nullable: true })
  shippedAt: Date;

  @Column({ name: 'shipped_by', nullable: true })
  shippedBy: string;

  @Column({ name: 'tracking_number', length: 100, nullable: true })
  trackingNumber: string;

  @Column({ name: 'shipping_carrier', length: 100, nullable: true })
  shippingCarrier: string;

  @Column({
    type: 'enum',
    enum: SalesOrderStatus,
    default: SalesOrderStatus.PENDING,
  })
  status: SalesOrderStatus;

  @Column({
    name: 'payment_status',
    type: 'enum',
    enum: PaymentStatus,
    default: PaymentStatus.UNPAID,
  })
  paymentStatus: PaymentStatus;

  @Column({
    name: 'fulfillment_status',
    type: 'enum',
    enum: FulfillmentStatus,
    default: FulfillmentStatus.UNFULFILLED,
  })
  fulfillmentStatus: FulfillmentStatus;

  @Column({ length: 3, default: 'INR' })
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
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  discountPercentage: number;

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

  @Column({ name: 'coupon_id', nullable: true })
  couponId: string;

  @Column({ name: 'coupon_code', length: 50, nullable: true })
  couponCode: string;

  @Column({
    name: 'coupon_discount',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  couponDiscount: number;

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
    name: 'shipping_tax',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  shippingTax: number;

  @Column({
    name: 'other_charges',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  otherCharges: number;

  @Column({
    name: 'rounding_adjustment',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  roundingAdjustment: number;

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
    name: 'refunded_amount',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  refundedAmount: number;

  // Billing Address
  @Column({ name: 'billing_name', length: 200, nullable: true })
  billingName: string;

  @Column({ name: 'billing_phone', length: 50, nullable: true })
  billingPhone: string;

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
  @Column({ name: 'shipping_name', length: 200, nullable: true })
  shippingName: string;

  @Column({ name: 'shipping_phone', length: 50, nullable: true })
  shippingPhone: string;

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

  @Column({ name: 'shipping_method_id', nullable: true })
  shippingMethodId: string;

  @Column({ name: 'shipping_method_name', length: 200, nullable: true })
  shippingMethodName: string;

  @Column({ name: 'expected_delivery_date', type: 'date', nullable: true })
  expectedDeliveryDate: Date;

  @Column({ name: 'actual_delivery_date', type: 'date', nullable: true })
  actualDeliveryDate: Date;

  @Column({ name: 'customer_notes', type: 'text', nullable: true })
  customerNotes: string;

  @Column({ name: 'internal_notes', type: 'text', nullable: true })
  internalNotes: string;

  @Column({ name: 'cancellation_reason', type: 'text', nullable: true })
  cancellationReason: string;

  @Column({ name: 'cancelled_at', type: 'timestamp', nullable: true })
  cancelledAt: Date;

  @Column({ name: 'cancelled_by', nullable: true })
  cancelledBy: string;

  @Column({ name: 'confirmed_by', nullable: true })
  confirmedBy: string;

  @Column({ name: 'confirmed_at', type: 'timestamp', nullable: true })
  confirmedAt?: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @Column({ name: 'payment_terms_days', type: 'int', default: 0 })
  paymentTermsDays: number;
  // Relations
  @ManyToOne(() => Customer, (customer) => customer.orders)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @ManyToOne(() => Warehouse)
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: Warehouse;

  @ManyToOne(() => Coupon)
  @JoinColumn({ name: 'coupon_id' })
  coupon: Coupon;

  @OneToMany(() => SalesOrderItem, (item) => item.salesOrder)
  items: SalesOrderItem[];

  @OneToMany(() => OrderPayment, (payment) => payment.order)
  payments: OrderPayment[];

  // Computed
  get balanceAmount(): number {
    return this.totalAmount - this.paidAmount + this.refundedAmount;
  }

  get itemCount(): number {
    return this.items?.length || 0;
  }
}
