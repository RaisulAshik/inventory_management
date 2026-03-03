import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PosTransaction } from './pos-transaction.entity';
import { Product } from '../inventory/product.entity';
import { ProductVariant } from '../inventory/product-variant.entity';
import { UnitOfMeasure } from '../inventory/unit-of-measure.entity';

@Entity('pos_transaction_items')
export class PosTransactionItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'transaction_id' })
  transactionId: string;

  @Column({ name: 'product_id' })
  productId: string;

  @Column({ name: 'variant_id', nullable: true })
  variantId: string;

  @Column({ length: 100 })
  sku: string;

  @Column({ name: 'product_name', length: 300 })
  productName: string;

  @Column({
    type: 'decimal',
    precision: 18,
    scale: 4,
  })
  quantity: number;

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

  @Column({ name: 'serial_number', length: 100, nullable: true })
  serialNumber: string;

  @Column({ name: 'batch_number', length: 100, nullable: true })
  batchNumber: string;

  @Column({ name: 'is_return_item', type: 'tinyint', default: 0 })
  isReturnItem: boolean;

  @Column({ name: 'return_reason', type: 'text', nullable: true })
  returnReason: string;

  @Column({ name: 'original_transaction_item_id', nullable: true })
  originalTransactionItemId: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relations
  @ManyToOne(() => PosTransaction, (transaction) => transaction.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'transaction_id' })
  transaction: PosTransaction;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => ProductVariant)
  @JoinColumn({ name: 'variant_id' })
  variant: ProductVariant;

  @ManyToOne(() => UnitOfMeasure)
  @JoinColumn({ name: 'uom_id' })
  uom: UnitOfMeasure;

  // Computed
  get profitMargin(): number | null {
    if (!this.costPrice || this.costPrice === 0) return null;
    return ((this.unitPrice - this.costPrice) / this.costPrice) * 100;
  }

  get grossProfit(): number | null {
    if (!this.costPrice) return null;
    return (this.unitPrice - this.costPrice) * this.quantity;
  }
}
