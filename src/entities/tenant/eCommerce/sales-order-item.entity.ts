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
import { Product } from '../inventory/product.entity';
import { ProductVariant } from '../inventory/product-variant.entity';
import { UnitOfMeasure } from '../inventory/unit-of-measure.entity';
import { TaxCategory } from '../inventory/tax-category.entity';

@Entity('sales_order_items')
export class SalesOrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'sales_order_id' })
  salesOrderId: string;

  @Column({ name: 'product_id' })
  productId: string;

  @Column({ name: 'variant_id', nullable: true })
  variantId: string;

  @Column({ length: 100 })
  sku: string;

  @Column({ name: 'product_name', length: 300 })
  productName: string;

  @Column({ name: 'variant_name', length: 300, nullable: true })
  variantName: string;

  @Column({
    name: 'quantity_ordered',
    type: 'decimal',
    precision: 18,
    scale: 4,
  })
  quantityOrdered: number;

  @Column({
    name: 'quantity_allocated',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  quantityAllocated: number;

  @Column({
    name: 'quantity_shipped',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  quantityShipped: number;

  @Column({
    name: 'quantity_delivered',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  quantityDelivered: number;

  @Column({
    name: 'quantity_returned',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  quantityReturned: number;

  @Column({
    name: 'quantity_cancelled',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  quantityCancelled: number;

  @Column({ name: 'uom_id', nullable: true })
  uomId: string;

  @Column({
    name: 'unit_price',
    type: 'decimal',
    precision: 18,
    scale: 4,
  })
  unitPrice: number;

  @Column({
    name: 'original_price',
    type: 'decimal',
    precision: 18,
    scale: 4,
    nullable: true,
  })
  originalPrice: number;

  @Column({
    name: 'discount_percentage',
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: 0,
  })
  discountPercentage: number;

  @Column({
    name: 'discount_amount',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  discountAmount: number;

  @Column({ name: 'tax_category_id', nullable: true })
  taxCategoryId: string;

  @Column({
    name: 'tax_percentage',
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: 0,
  })
  taxPercentage: number;

  @Column({
    name: 'tax_amount',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  taxAmount: number;

  @Column({
    name: 'line_total',
    type: 'decimal',
    precision: 18,
    scale: 4,
  })
  lineTotal: number;

  @Column({
    name: 'cost_price',
    type: 'decimal',
    precision: 18,
    scale: 4,
    nullable: true,
  })
  costPrice: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => SalesOrder, (order) => order.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'sales_order_id' })
  salesOrder: SalesOrder;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => ProductVariant)
  @JoinColumn({ name: 'variant_id' })
  variant: ProductVariant;

  @ManyToOne(() => UnitOfMeasure)
  @JoinColumn({ name: 'uom_id' })
  uom: UnitOfMeasure;

  @ManyToOne(() => TaxCategory)
  @JoinColumn({ name: 'tax_category_id' })
  taxCategory: TaxCategory;

  // Computed
  get quantityPending(): number {
    return this.quantityOrdered - this.quantityShipped - this.quantityCancelled;
  }

  get profitMargin(): number | null {
    if (!this.costPrice || this.costPrice === 0) return null;
    return ((this.unitPrice - this.costPrice) / this.costPrice) * 100;
  }
}
