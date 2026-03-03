import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Warehouse } from './warehouse.entity';
import { WarehouseLocation } from './warehouse-location.entity';
import { InventoryBatch } from './inventory-batch.entity';
import { Product } from '../inventory/product.entity';
import { ProductVariant } from '../inventory/product-variant.entity';

export enum SerialNumberStatus {
  AVAILABLE = 'AVAILABLE',
  RESERVED = 'RESERVED',
  SOLD = 'SOLD',
  IN_TRANSIT = 'IN_TRANSIT',
  RETURNED = 'RETURNED',
  DAMAGED = 'DAMAGED',
  SCRAPPED = 'SCRAPPED',
}

@Entity('inventory_serial_numbers')
export class InventorySerialNumber {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'serial_number', length: 100 })
  serialNumber: string;

  @Column({ name: 'product_id' })
  productId: string;

  @Column({ name: 'variant_id', nullable: true })
  variantId: string;

  @Column({ name: 'batch_id', nullable: true })
  batchId: string;

  @Column({ name: 'warehouse_id', nullable: true })
  warehouseId: string;

  @Column({ name: 'location_id', nullable: true })
  locationId: string;

  @Column({
    type: 'enum',
    enum: SerialNumberStatus,
    default: SerialNumberStatus.AVAILABLE,
  })
  status: SerialNumberStatus;

  @Column({
    name: 'cost_price',
    type: 'decimal',
    precision: 18,
    scale: 4,
    nullable: true,
  })
  costPrice: number;

  @Column({ name: 'purchase_order_id', nullable: true })
  purchaseOrderId: string;

  @Column({ name: 'grn_id', nullable: true })
  grnId: string;

  @Column({ name: 'received_date', type: 'date', nullable: true })
  receivedDate: Date;

  @Column({ name: 'sales_order_id', nullable: true })
  salesOrderId: string;

  @Column({ name: 'sold_date', type: 'date', nullable: true })
  soldDate: Date;

  @Column({ name: 'warranty_start_date', type: 'date', nullable: true })
  warrantyStartDate: Date;

  @Column({ name: 'warranty_end_date', type: 'date', nullable: true })
  warrantyEndDate: Date;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

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
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: Warehouse;

  @ManyToOne(() => WarehouseLocation)
  @JoinColumn({ name: 'location_id' })
  location: WarehouseLocation;

  // Helpers
  get isUnderWarranty(): boolean {
    if (!this.warrantyEndDate) return false;
    return new Date(this.warrantyEndDate) >= new Date();
  }

  get warrantyDaysRemaining(): number | null {
    if (!this.warrantyEndDate) return null;
    const diff =
      new Date(this.warrantyEndDate).getTime() - new Date().getTime();
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  }
}
