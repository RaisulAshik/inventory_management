import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { StockMovementType } from '@common/enums';
import { InventoryBatch } from './inventory-batch.entity';
import { Warehouse } from './warehouse.entity';
import { Product } from '../inventory/product.entity';
import { ProductVariant } from '../inventory/product-variant.entity';
import { UnitOfMeasure } from '../inventory/unit-of-measure.entity';

@Entity('stock_movements')
export class StockMovement {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'movement_number', length: 50, unique: true })
  movementNumber: string;

  @Column({
    name: 'movement_type',
    type: 'enum',
    enum: StockMovementType,
  })
  movementType: StockMovementType;

  @Column({ name: 'movement_date', type: 'timestamp' })
  movementDate: Date;

  @Column({ name: 'product_id' })
  productId: string;

  @Column({ name: 'variant_id', nullable: true })
  variantId: string;

  @Column({ name: 'batch_id', nullable: true })
  batchId: string;

  @Column({ name: 'from_warehouse_id', nullable: true })
  fromWarehouseId: string;

  @Column({ name: 'to_warehouse_id', nullable: true })
  toWarehouseId: string;

  @Column({ name: 'from_location_id', nullable: true })
  fromLocationId: string;

  @Column({ name: 'to_location_id', nullable: true })
  toLocationId: string;

  @Column({
    type: 'decimal',
    precision: 18,
    scale: 4,
  })
  quantity: number;

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
    name: 'total_cost',
    type: 'decimal',
    precision: 18,
    scale: 4,
    nullable: true,
  })
  totalCost: number;

  @Column({ name: 'reference_type', length: 50, nullable: true })
  referenceType: string;

  @Column({ name: 'reference_id', nullable: true })
  referenceId: string;

  @Column({ name: 'reference_number', length: 50, nullable: true })
  referenceNumber: string;

  @Column({ type: 'text', nullable: true })
  reason: string;

  @Column({ name: 'created_by', nullable: true })
  createdBy: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relations
  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => ProductVariant)
  @JoinColumn({ name: 'variant_id' })
  variant: ProductVariant;

  @ManyToOne(() => InventoryBatch)
  @JoinColumn({ name: 'batch_id' })
  batch: InventoryBatch;

  @ManyToOne(() => Warehouse)
  @JoinColumn({ name: 'from_warehouse_id' })
  fromWarehouse: Warehouse;

  @ManyToOne(() => Warehouse)
  @JoinColumn({ name: 'to_warehouse_id' })
  toWarehouse: Warehouse;

  @ManyToOne(() => UnitOfMeasure)
  @JoinColumn({ name: 'uom_id' })
  uom: UnitOfMeasure;
}
