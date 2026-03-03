import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { MaterialIssue } from './material-issue.entity';
import { WorkOrderItem } from './work-order-item.entity';
import { Product } from '../inventory/product.entity';
import { ProductVariant } from '../inventory/product-variant.entity';
import { WarehouseLocation } from '../warehouse/warehouse-location.entity';
import { InventoryBatch } from '../warehouse/inventory-batch.entity';
import { UnitOfMeasure } from '..';

@Entity('material_issue_items')
export class MaterialIssueItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'material_issue_id' })
  materialIssueId: string;

  @Column({ name: 'work_order_item_id', nullable: true })
  workOrderItemId: string;

  @Column({ name: 'product_id' })
  productId: string;

  @Column({ name: 'variant_id', nullable: true })
  variantId: string;

  @Column({ name: 'location_id', nullable: true })
  locationId: string;

  @Column({ name: 'batch_id', nullable: true })
  batchId: string;

  @Column({
    name: 'issued_quantity',
    type: 'decimal',
    precision: 18,
    scale: 4,
  })
  issuedQuantity: number;

  @Column({
    name: 'returned_quantity',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  returnedQuantity: number;

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

  @Column({ name: 'serial_numbers', type: 'json', nullable: true })
  serialNumbers: string[];

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relations
  @ManyToOne(() => MaterialIssue, (mi) => mi.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'material_issue_id' })
  materialIssue: MaterialIssue;

  @ManyToOne(() => WorkOrderItem)
  @JoinColumn({ name: 'work_order_item_id' })
  workOrderItem: WorkOrderItem;

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
  get netIssuedQuantity(): number {
    return this.issuedQuantity - this.returnedQuantity;
  }
}
