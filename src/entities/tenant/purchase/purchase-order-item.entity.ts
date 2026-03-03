import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PurchaseOrder } from './purchase-order.entity';
import { Product } from '../inventory/product.entity';
import { ProductVariant } from '../inventory/product-variant.entity';
import { UnitOfMeasure } from '../inventory/unit-of-measure.entity';
import { TaxCategory } from '../inventory/tax-category.entity';

@Entity('purchase_order_items')
export class PurchaseOrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'purchase_order_id' })
  purchaseOrderId: string;

  @Column({ name: 'product_id' })
  productId: string;

  @Column({ name: 'variant_id', nullable: true })
  variantId: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    name: 'quantity_ordered',
    type: 'decimal',
    precision: 18,
    scale: 4,
  })
  quantityOrdered: number;

  @Column({
    name: 'quantity_received',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  quantityReceived: number;

  @Column({
    name: 'quantity_rejected',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  quantityRejected: number;

  @Column({ name: 'uom_id' })
  uomId: string;

  @Column({
    name: 'unit_price',
    type: 'decimal',
    precision: 18,
    scale: 4,
  })
  unitPrice: number;

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

  @Column({ name: 'expected_date', type: 'date', nullable: true })
  expectedDate: Date;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => PurchaseOrder, (po) => po.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'purchase_order_id' })
  purchaseOrder: PurchaseOrder;

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
    return this.quantityOrdered - this.quantityReceived - this.quantityRejected;
  }
}
