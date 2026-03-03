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
import { WorkOrderOperation } from './work-order-operation.entity';
import { Product } from '../inventory/product.entity';
import { ProductVariant } from '../inventory/product-variant.entity';
import { Warehouse } from '../warehouse/warehouse.entity';
import { User } from '../user/user.entity';
import { UnitOfMeasure } from '../inventory/unit-of-measure.entity';
import { WarehouseLocation } from '../warehouse/warehouse-location.entity';
import { InventoryBatch } from '../warehouse/inventory-batch.entity';

export enum ProductionOutputStatus {
  PENDING_QC = 'PENDING_QC',
  QC_PASSED = 'QC_PASSED',
  QC_FAILED = 'QC_FAILED',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  REWORK = 'REWORK',
}

@Entity('production_outputs')
export class ProductionOutput {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'output_number', length: 50, unique: true })
  outputNumber: string;

  @Column({ name: 'output_date', type: 'timestamp' })
  outputDate: Date;

  @Column({ name: 'work_order_id' })
  workOrderId: string;

  @Column({ name: 'work_order_operation_id', nullable: true })
  workOrderOperationId: string;

  @Column({ name: 'product_id' })
  productId: string;

  @Column({ name: 'variant_id', nullable: true })
  variantId: string;

  @Column({ name: 'warehouse_id' })
  warehouseId: string;

  @Column({ name: 'location_id', nullable: true })
  locationId: string;

  @Column({ name: 'batch_id', nullable: true })
  batchId: string;

  @Column({
    name: 'produced_quantity',
    type: 'decimal',
    precision: 18,
    scale: 4,
  })
  producedQuantity: number;

  @Column({
    name: 'accepted_quantity',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  acceptedQuantity: number;

  @Column({
    name: 'rejected_quantity',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  rejectedQuantity: number;

  @Column({
    name: 'rework_quantity',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  reworkQuantity: number;

  @Column({ name: 'uom_id' })
  uomId: string;

  @Column({
    type: 'enum',
    enum: ProductionOutputStatus,
    default: ProductionOutputStatus.PENDING_QC,
  })
  status: ProductionOutputStatus;

  @Column({
    name: 'material_cost',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  materialCost: number;

  @Column({
    name: 'labor_cost',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  laborCost: number;

  @Column({
    name: 'overhead_cost',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  overheadCost: number;

  @Column({
    name: 'total_cost',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  totalCost: number;

  @Column({
    name: 'unit_cost',
    type: 'decimal',
    precision: 18,
    scale: 4,
    nullable: true,
  })
  unitCost: number;

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

  @Column({ name: 'produced_by', nullable: true })
  producedBy: string;

  @Column({ name: 'qc_by', nullable: true })
  qcBy: string;

  @Column({ name: 'qc_at', type: 'timestamp', nullable: true })
  qcAt: Date;

  @Column({ name: 'created_by', nullable: true })
  createdBy: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => WorkOrder)
  @JoinColumn({ name: 'work_order_id' })
  workOrder: WorkOrder;

  @ManyToOne(() => WorkOrderOperation)
  @JoinColumn({ name: 'work_order_operation_id' })
  workOrderOperation: WorkOrderOperation;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => ProductVariant)
  @JoinColumn({ name: 'variant_id' })
  variant: ProductVariant;

  @ManyToOne(() => Warehouse)
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: Warehouse;

  @ManyToOne(() => WarehouseLocation)
  @JoinColumn({ name: 'location_id' })
  location: WarehouseLocation;

  @ManyToOne(() => InventoryBatch)
  @JoinColumn({ name: 'batch_id' })
  batch: InventoryBatch;

  @ManyToOne(() => UnitOfMeasure)
  @JoinColumn({ name: 'uom_id' })
  uom: UnitOfMeasure;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'produced_by' })
  producedByUser: User;

  // Computed
  get yieldPercentage(): number {
    return this.producedQuantity > 0
      ? (this.acceptedQuantity / this.producedQuantity) * 100
      : 0;
  }
}
