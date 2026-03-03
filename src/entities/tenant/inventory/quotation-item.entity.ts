// src/modules/quotations/entities/quotation-item.entity.ts

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Quotation } from './quotation.entity';
import { Product } from './product.entity';

@Entity('quotation_items')
export class QuotationItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'quotation_id', type: 'char', length: 36 })
  quotationId: string;

  @ManyToOne(() => Quotation, (quotation) => quotation.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'quotation_id' })
  quotation: Quotation;

  @Column({ name: 'product_id', type: 'char', length: 36 })
  productId: string;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @Column({ name: 'variant_id', type: 'char', length: 36, nullable: true })
  variantId: string;

  @Column({ name: 'product_name', type: 'varchar', length: 300 })
  productName: string;

  @Column({ type: 'varchar', length: 100 })
  sku: string;

  @Column({ type: 'decimal', precision: 15, scale: 4 })
  quantity: number;

  @Column({ name: 'unit_price', type: 'decimal', precision: 15, scale: 4 })
  unitPrice: number;

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
    name: 'tax_rate',
    type: 'decimal',
    precision: 8,
    scale: 4,
    default: 0,
  })
  taxRate: number;

  @Column({
    name: 'tax_amount',
    type: 'decimal',
    precision: 15,
    scale: 4,
    default: 0,
  })
  taxAmount: number;

  @Column({ name: 'line_total', type: 'decimal', precision: 15, scale: 4 })
  lineTotal: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
  name: string | undefined;
}
