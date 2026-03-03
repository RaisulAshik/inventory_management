import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { InventoryStatus } from '@common/enums';
import { Warehouse } from './warehouse.entity';
import { WarehouseLocation } from './warehouse-location.entity';
import { InventoryBatch } from './inventory-batch.entity';
import { Product } from '../inventory/product.entity';
import { ProductVariant } from '../inventory/product-variant.entity';

@Entity('location_inventory')
export class LocationInventory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'product_id' })
  productId: string;

  @Column({ name: 'variant_id', nullable: true })
  variantId: string;

  @Column({ name: 'warehouse_id' })
  warehouseId: string;

  @Column({ name: 'location_id' })
  locationId: string;

  @Column({ name: 'batch_id', nullable: true })
  batchId: string;

  @Column({
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  quantity: number;

  @Column({
    name: 'quantity_reserved',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  quantityReserved: number;

  @Column({
    type: 'enum',
    enum: InventoryStatus,
    default: InventoryStatus.AVAILABLE,
  })
  status: InventoryStatus;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Product, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => ProductVariant, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'variant_id' })
  variant: ProductVariant;

  @ManyToOne(() => Warehouse, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: Warehouse;

  @ManyToOne(() => WarehouseLocation, (location) => location.inventory, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'location_id' })
  location: WarehouseLocation;

  @ManyToOne(() => InventoryBatch)
  @JoinColumn({ name: 'batch_id' })
  batch: InventoryBatch;

  // Computed
  get quantityAvailable(): number {
    return this.quantity - this.quantityReserved;
  }
}
