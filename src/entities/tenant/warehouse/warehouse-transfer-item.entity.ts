import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { WarehouseTransfer } from './warehouse-transfer.entity';
import { WarehouseLocation } from './warehouse-location.entity';
import { InventoryBatch } from './inventory-batch.entity';
import { Product } from '../inventory/product.entity';
import { ProductVariant } from '../inventory/product-variant.entity';
import { UnitOfMeasure } from '../inventory/unit-of-measure.entity';

@Entity('warehouse_transfer_items')
export class WarehouseTransferItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'warehouse_transfer_id' })
  warehouseTransferId: string;

  @Column({ name: 'product_id' })
  productId: string;

  @Column({ name: 'variant_id', nullable: true })
  variantId: string;

  @Column({ name: 'from_location_id', nullable: true })
  fromLocationId: string;

  @Column({ name: 'to_location_id', nullable: true })
  toLocationId: string;

  @Column({ name: 'batch_id', nullable: true })
  batchId: string;

  @Column({
    name: 'quantity_requested',
    type: 'decimal',
    precision: 18,
    scale: 4,
  })
  quantityRequested: number;

  @Column({
    name: 'quantity_shipped',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  quantityShipped: number;

  @Column({
    name: 'quantity_received',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  quantityReceived: number;

  @Column({
    name: 'quantity_damaged',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  quantityDamaged: number;

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
    name: 'line_value',
    type: 'decimal',
    precision: 18,
    scale: 4,
    nullable: true,
  })
  lineValue: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => WarehouseTransfer, (transfer) => transfer.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'warehouse_transfer_id' })
  warehouseTransfer: WarehouseTransfer;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => ProductVariant)
  @JoinColumn({ name: 'variant_id' })
  variant: ProductVariant;

  @ManyToOne(() => WarehouseLocation)
  @JoinColumn({ name: 'from_location_id' })
  fromLocation: WarehouseLocation;

  @ManyToOne(() => WarehouseLocation)
  @JoinColumn({ name: 'to_location_id' })
  toLocation: WarehouseLocation;

  @ManyToOne(() => InventoryBatch)
  @JoinColumn({ name: 'batch_id' })
  batch: InventoryBatch;

  @ManyToOne(() => UnitOfMeasure)
  @JoinColumn({ name: 'uom_id' })
  uom: UnitOfMeasure;

  // Computed
  get quantityPending(): number {
    return this.quantityRequested - this.quantityShipped;
  }

  get quantityShortage(): number {
    return this.quantityShipped - this.quantityReceived - this.quantityDamaged;
  }
}
