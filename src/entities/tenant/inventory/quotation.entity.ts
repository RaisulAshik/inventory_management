// src/modules/quotations/entities/quotation.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { QuotationItem } from './quotation-item.entity';
import { Customer } from '../eCommerce/customer.entity';
import { Warehouse } from '../warehouse/warehouse.entity';

export enum QuotationStatus {
  DRAFT = 'DRAFT',
  SENT = 'SENT',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
  CONVERTED = 'CONVERTED', // Converted to Sales Order
  CANCELLED = 'CANCELLED',
}

@Entity('quotations')
export class Quotation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Index('idx_quotation_number', { unique: true })
  @Column({ name: 'quotation_number', type: 'varchar', length: 50 })
  quotationNumber: string;

  @Column({ name: 'customer_id', type: 'char', length: 36 })
  customerId: string;

  @ManyToOne(() => Customer)
  @JoinColumn({ name: 'customer_id' })
  customer: Customer;

  @Column({ name: 'warehouse_id', type: 'char', length: 36 })
  warehouseId: string;

  @ManyToOne(() => Warehouse)
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: Warehouse;

  @Column({ name: 'quotation_date', type: 'date' })
  quotationDate: Date;

  @Column({ name: 'valid_until', type: 'date', nullable: true })
  validUntil: Date;

  @Column({
    type: 'enum',
    enum: QuotationStatus,
    default: QuotationStatus.DRAFT,
  })
  status: QuotationStatus;

  // Pricing
  @Column({ type: 'char', length: 3, default: 'BDT' })
  currency: string;

  @Column({ type: 'decimal', precision: 15, scale: 4, default: 0 })
  subtotal: number;

  @Column({
    name: 'discount_type',
    type: 'enum',
    enum: ['PERCENTAGE', 'FIXED'],
    default: 'FIXED',
  })
  discountType: string;

  @Column({
    name: 'discount_value',
    type: 'decimal',
    precision: 15,
    scale: 4,
    default: 0,
  })
  discountValue: number;

  @Column({
    name: 'discount_amount',
    type: 'decimal',
    precision: 15,
    scale: 4,
    default: 0,
  })
  discountAmount: number;

  @Column({
    name: 'tax_amount',
    type: 'decimal',
    precision: 15,
    scale: 4,
    default: 0,
  })
  taxAmount: number;

  @Column({
    name: 'shipping_amount',
    type: 'decimal',
    precision: 15,
    scale: 4,
    default: 0,
  })
  shippingAmount: number;

  @Column({
    name: 'total_amount',
    type: 'decimal',
    precision: 15,
    scale: 4,
    default: 0,
  })
  totalAmount: number;

  // Addresses
  @Column({
    name: 'billing_address_id',
    type: 'char',
    length: 36,
    nullable: true,
  })
  billingAddressId: string;

  @Column({
    name: 'shipping_address_id',
    type: 'char',
    length: 36,
    nullable: true,
  })
  shippingAddressId: string;

  // References
  @Column({
    name: 'reference_number',
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  referenceNumber: string;

  @Column({ name: 'sales_person_id', type: 'char', length: 36, nullable: true })
  salesPersonId: string;

  @Column({
    name: 'payment_terms_id',
    type: 'char',
    length: 36,
    nullable: true,
  })
  paymentTermsId: string;

  // Sales Order Reference (set when converted)
  @Column({ name: 'sales_order_id', type: 'char', length: 36, nullable: true })
  salesOrderId: string;

  @Column({
    name: 'sales_order_number',
    type: 'varchar',
    length: 50,
    nullable: true,
  })
  salesOrderNumber: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ name: 'internal_notes', type: 'text', nullable: true })
  internalNotes: string;

  @Column({ name: 'terms_and_conditions', type: 'text', nullable: true })
  termsAndConditions: string;

  @Column({ name: 'rejection_reason', type: 'text', nullable: true })
  rejectionReason: string;

  @Column({ name: 'created_by', type: 'char', length: 36, nullable: true })
  createdBy: string;

  @Column({ name: 'updated_by', type: 'char', length: 36, nullable: true })
  updatedBy: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @OneToMany(() => QuotationItem, (item) => item.quotation, { cascade: true })
  items: QuotationItem[];

  // Computed
  get isExpired(): boolean {
    if (!this.validUntil) return false;
    return new Date() > new Date(this.validUntil);
  }

  get isConverted(): boolean {
    return this.status === QuotationStatus.CONVERTED && !!this.salesOrderId;
  }
}
