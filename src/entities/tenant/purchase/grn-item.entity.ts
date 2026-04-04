import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { GoodsReceivedNote } from './goods-received-note.entity';
import { PurchaseOrderItem } from './purchase-order-item.entity';
import { Product } from '../inventory/product.entity';
import { ProductVariant } from '../inventory/product-variant.entity';
import { WarehouseLocation } from '../warehouse/warehouse-location.entity';
import { InventoryBatch } from '../warehouse/inventory-batch.entity';
import { UnitOfMeasure } from '../inventory/unit-of-measure.entity';

export enum GrnItemStatus {
  PENDING_QC = 'PENDING_QC',
  QC_PASSED = 'QC_PASSED',
  QC_FAILED = 'QC_FAILED',
  PARTIALLY_ACCEPTED = 'PARTIALLY_ACCEPTED',
  ACCEPTED = 'ACCEPTED',
}

@Entity('grn_items')
export class GrnItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'grn_id' })
  grnId: string;

  @Column({ name: 'po_item_id', nullable: true })
  poItemId: string;

  @Column({ name: 'product_id' })
  productId: string;

  @Column({ name: 'variant_id', nullable: true })
  variantId: string;

  @Column({ name: 'location_id', nullable: true })
  locationId: string;

  @Column({ name: 'batch_id', nullable: true })
  batchId: string;

  @Column({
    name: 'quantity_received',
    type: 'decimal',
    precision: 18,
    scale: 4,
  })
  quantityReceived: number;

  @Column({
    name: 'quantity_accepted',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  quantityAccepted: number;

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
    nullable: true,
  })
  unitPrice: number;

  @Column({
    name: 'discount_amount',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  discountAmount: number;

  @Column({
    name: 'tax_amount',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  taxAmount: number;

  @Column({
    name: 'line_value',
    type: 'decimal',
    precision: 18,
    scale: 4,
    nullable: true,
  })
  lineValue: number;

  @Column({
    type: 'enum',
    enum: GrnItemStatus,
    default: GrnItemStatus.PENDING_QC,
  })
  status: GrnItemStatus;

  @Column({ name: 'batch_number', length: 100, nullable: true })
  batchNumber: string;

  @Column({ name: 'manufacturing_date', type: 'date', nullable: true })
  manufacturingDate: Date;

  @Column({ name: 'expiry_date', type: 'date', nullable: true })
  expiryDate: Date;

  @Column({ name: 'rejection_reason', type: 'text', nullable: true })
  rejectionReason: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => GoodsReceivedNote, (grn) => grn.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'grn_id' })
  grn: GoodsReceivedNote;

  @ManyToOne(() => PurchaseOrderItem)
  @JoinColumn({ name: 'po_item_id' })
  poItem: PurchaseOrderItem;

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
}
