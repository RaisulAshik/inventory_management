import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { WorkOrder } from './work-order.entity';
import { BomItem, BomItemType } from './bom-item.entity';
import { ProductVariant } from '../inventory/product-variant.entity';
import { Product } from '../inventory/product.entity';
import { UnitOfMeasure } from '../inventory/unit-of-measure.entity';

export enum WorkOrderItemStatus {
  PENDING = 'PENDING',
  PARTIALLY_ISSUED = 'PARTIALLY_ISSUED',
  ISSUED = 'ISSUED',
  RETURNED = 'RETURNED',
}

@Entity('work_order_items')
export class WorkOrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'work_order_id' })
  workOrderId: string;

  @Column({ name: 'bom_item_id', nullable: true })
  bomItemId: string;

  @Column({
    name: 'item_type',
    type: 'enum',
    enum: BomItemType,
    default: BomItemType.RAW_MATERIAL,
  })
  itemType: BomItemType;

  @Column({ name: 'product_id' })
  productId: string;

  @Column({ name: 'variant_id', nullable: true })
  variantId: string;

  @Column({
    name: 'required_quantity',
    type: 'decimal',
    precision: 18,
    scale: 4,
  })
  requiredQuantity: number;

  @Column({
    name: 'issued_quantity',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  issuedQuantity: number;

  @Column({
    name: 'consumed_quantity',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  consumedQuantity: number;

  @Column({
    name: 'returned_quantity',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  returnedQuantity: number;

  @Column({
    name: 'scrap_quantity',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  scrapQuantity: number;

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

  @Column({
    type: 'enum',
    enum: WorkOrderItemStatus,
    default: WorkOrderItemStatus.PENDING,
  })
  status: WorkOrderItemStatus;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => WorkOrder, (wo) => wo.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'work_order_id' })
  workOrder: WorkOrder;

  @ManyToOne(() => BomItem)
  @JoinColumn({ name: 'bom_item_id' })
  bomItem: BomItem;

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
  get pendingQuantity(): number {
    return this.requiredQuantity - this.issuedQuantity;
  }

  get variance(): number {
    return this.consumedQuantity - this.requiredQuantity;
  }
}
