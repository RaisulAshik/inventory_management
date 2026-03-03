import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { SalesReturn } from './sales-return.entity';
import { SalesOrderItem } from './sales-order-item.entity';
import { Product } from '../inventory/product.entity';
import { ProductVariant } from '../inventory/product-variant.entity';
import { UnitOfMeasure } from '../inventory/unit-of-measure.entity';

export enum ReturnItemCondition {
  GOOD = 'GOOD',
  LIKE_NEW = 'LIKE_NEW',
  NEW = 'NEW',
  OPENED = 'OPENED',
  DAMAGED = 'DAMAGED',
  DEFECTIVE = 'DEFECTIVE',
  EXPIRED = 'EXPIRED',
}

export enum ReturnItemDisposition {
  RESTOCK = 'RESTOCK',
  SCRAP = 'SCRAP',
  REFURBISH = 'REFURBISH',
  RETURN_TO_VENDOR = 'RETURN_TO_VENDOR',
  PENDING = 'PENDING',
}

@Entity('sales_return_items')
export class SalesReturnItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'sales_return_id' })
  salesReturnId: string;

  @Column({ name: 'order_item_id', nullable: true })
  orderItemId: string;

  @Column({ name: 'product_id' })
  productId: string;

  @Column({ name: 'variant_id', nullable: true })
  variantId: string;

  @Column({
    name: 'quantity_returned',
    type: 'decimal',
    precision: 18,
    scale: 4,
  })
  quantityReturned: number;

  @Column({
    name: 'quantity_received',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  quantityReceived: number;

  @Column({
    name: 'quantity_restocked',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  quantityRestocked: number;

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
    name: 'refund_amount',
    type: 'decimal',
    precision: 18,
    scale: 4,
    nullable: true,
  })
  refundAmount: number;

  @Column({
    type: 'enum',
    enum: ReturnItemCondition,
    nullable: true,
  })
  condition: ReturnItemCondition;

  @Column({
    type: 'enum',
    enum: ReturnItemDisposition,
    default: ReturnItemDisposition.PENDING,
  })
  disposition: ReturnItemDisposition;

  @Column({ type: 'text', nullable: true })
  reason: string;

  @Column({ name: 'inspection_notes', type: 'text', nullable: true })
  inspectionNotes: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @Column({ name: 'is_restocked', type: 'tinyint', default: 0 })
  isRestocked: boolean;

  @Column({
    name: 'restocked_quantity',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  restockedQuantity: number;

  @Column({ name: 'sales_order_item_id', nullable: true })
  salesOrderItemId: string;

  @ManyToOne(() => SalesOrderItem)
  @JoinColumn({ name: 'sales_order_item_id' })
  salesOrderItem: SalesOrderItem;

  // Relations
  @ManyToOne(() => SalesReturn, (sr) => sr.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'sales_return_id' })
  salesReturn: SalesReturn;

  @ManyToOne(() => SalesOrderItem)
  @JoinColumn({ name: 'order_item_id' })
  orderItem: SalesOrderItem;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => ProductVariant)
  @JoinColumn({ name: 'variant_id' })
  variant: ProductVariant;

  @ManyToOne(() => UnitOfMeasure)
  @JoinColumn({ name: 'uom_id' })
  uom: UnitOfMeasure;
}
