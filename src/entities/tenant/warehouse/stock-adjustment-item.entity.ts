import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { StockAdjustment } from './stock-adjustment.entity';
import { WarehouseLocation } from './warehouse-location.entity';
import { InventoryBatch } from './inventory-batch.entity';
import { Product } from '../inventory/product.entity';
import { ProductVariant } from '../inventory/product-variant.entity';
import { UnitOfMeasure } from '../inventory/unit-of-measure.entity';

@Entity('stock_adjustment_items')
export class StockAdjustmentItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'stock_adjustment_id' })
  stockAdjustmentId: string;

  @Column({ name: 'product_id' })
  productId: string;

  @Column({ name: 'variant_id', nullable: true })
  variantId: string;

  @Column({ name: 'location_id', nullable: true })
  locationId: string;

  @Column({ name: 'batch_id', nullable: true })
  batchId: string;

  @Column({
    name: 'system_quantity',
    type: 'decimal',
    precision: 18,
    scale: 4,
  })
  systemQuantity: number;

  @Column({
    name: 'physical_quantity',
    type: 'decimal',
    precision: 18,
    scale: 4,
  })
  physicalQuantity: number;

  @Column({
    name: 'adjustment_quantity',
    type: 'decimal',
    precision: 18,
    scale: 4,
  })
  adjustmentQuantity: number;

  @Column({ name: 'uom_id' })
  uomId: string;

  @Column({
    name: 'unit_cost',
    type: 'decimal',
    precision: 18,
    scale: 4,
    nullable: true,
  })
  unitCost: number;

  @Column({
    name: 'value_impact',
    type: 'decimal',
    precision: 18,
    scale: 4,
    nullable: true,
  })
  valueImpact: number;

  @Column({ type: 'text', nullable: true })
  reason: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relations
  @ManyToOne(() => StockAdjustment, (adj) => adj.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'stock_adjustment_id' })
  stockAdjustment: StockAdjustment;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => ProductVariant)
  @JoinColumn({ name: 'variant_id' })
  variant: ProductVariant;

  @ManyToOne(() => WarehouseLocation)
  @JoinColumn({ name: 'location_id' })
  location: WarehouseLocation;

  @ManyToOne(() => InventoryBatch)
  @JoinColumn({ name: 'batch_id' })
  batch: InventoryBatch;

  @ManyToOne(() => UnitOfMeasure)
  @JoinColumn({ name: 'uom_id' })
  uom: UnitOfMeasure;

  // Computed
  get variancePercentage(): number {
    if (this.systemQuantity === 0) return this.physicalQuantity > 0 ? 100 : 0;
    return (
      ((this.physicalQuantity - this.systemQuantity) / this.systemQuantity) *
      100
    );
  }
}
