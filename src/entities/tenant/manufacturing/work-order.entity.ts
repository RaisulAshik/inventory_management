import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { WorkOrderStatus, Priority } from '@common/enums';
import { BillOfMaterials } from '../manufacturing/bill-of-materials.entity';
import { Product } from '../inventory/product.entity';
import { ProductVariant } from '../inventory/product-variant.entity';
import { UnitOfMeasure } from '../inventory/unit-of-measure.entity';
import { SalesOrder } from '../eCommerce/sales-order.entity';
import { Warehouse } from '../warehouse/warehouse.entity';
import { WorkOrderItem } from './work-order-item.entity';
import { WorkOrderOperation } from './work-order-operation.entity';

@Entity('work_orders')
export class WorkOrder {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'work_order_number', length: 50, unique: true })
  workOrderNumber: string;

  @Column({ name: 'bom_id' })
  bomId: string;

  @Column({ name: 'product_id' })
  productId: string;

  @Column({ name: 'variant_id', nullable: true })
  variantId: string;

  @Column({ name: 'warehouse_id' })
  warehouseId: string;

  @Column({
    type: 'enum',
    enum: WorkOrderStatus,
    default: WorkOrderStatus.DRAFT,
  })
  status: WorkOrderStatus;

  @Column({
    type: 'enum',
    enum: Priority,
    default: Priority.NORMAL,
  })
  priority: Priority;

  @Column({
    name: 'planned_quantity',
    type: 'decimal',
    precision: 18,
    scale: 4,
  })
  plannedQuantity: number;

  @Column({
    name: 'completed_quantity',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  completedQuantity: number;

  @Column({
    name: 'rejected_quantity',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  rejectedQuantity: number;

  @Column({ name: 'uom_id' })
  uomId: string;

  @Column({ name: 'planned_start_date', type: 'date' })
  plannedStartDate: Date;

  @Column({ name: 'planned_end_date', type: 'date' })
  plannedEndDate: Date;

  @Column({ name: 'actual_start_date', type: 'date', nullable: true })
  actualStartDate: Date;

  @Column({ name: 'actual_end_date', type: 'date', nullable: true })
  actualEndDate: Date;

  @Column({ name: 'sales_order_id', nullable: true })
  salesOrderId: string;

  @Column({ name: 'parent_work_order_id', nullable: true })
  parentWorkOrderId: string;

  @Column({
    name: 'estimated_material_cost',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  estimatedMaterialCost: number;

  @Column({
    name: 'estimated_labor_cost',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  estimatedLaborCost: number;

  @Column({
    name: 'estimated_overhead_cost',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  estimatedOverheadCost: number;

  @Column({
    name: 'estimated_total_cost',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  estimatedTotalCost: number;

  @Column({
    name: 'actual_material_cost',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  actualMaterialCost: number;

  @Column({
    name: 'actual_labor_cost',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  actualLaborCost: number;

  @Column({
    name: 'actual_overhead_cost',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  actualOverheadCost: number;

  @Column({
    name: 'actual_total_cost',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  actualTotalCost: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ name: 'created_by', nullable: true })
  createdBy: string;

  @Column({ name: 'released_by', nullable: true })
  releasedBy: string;

  @Column({ name: 'released_at', type: 'timestamp', nullable: true })
  releasedAt: Date;

  @Column({ name: 'completed_by', nullable: true })
  completedBy: string;

  @Column({ name: 'completed_at', type: 'timestamp', nullable: true })
  completedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => BillOfMaterials)
  @JoinColumn({ name: 'bom_id' })
  bom: BillOfMaterials;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => ProductVariant)
  @JoinColumn({ name: 'variant_id' })
  variant: ProductVariant;

  @ManyToOne(() => Warehouse)
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: Warehouse;

  @ManyToOne(() => UnitOfMeasure)
  @JoinColumn({ name: 'uom_id' })
  uom: UnitOfMeasure;

  @ManyToOne(() => SalesOrder)
  @JoinColumn({ name: 'sales_order_id' })
  salesOrder: SalesOrder;

  @ManyToOne(() => WorkOrder)
  @JoinColumn({ name: 'parent_work_order_id' })
  parentWorkOrder: WorkOrder;

  @OneToMany(() => WorkOrderItem, (item) => item.workOrder)
  items: WorkOrderItem[];

  @OneToMany(() => WorkOrderOperation, (op) => op.workOrder)
  operations: WorkOrderOperation[];

  // Computed
  get completionPercentage(): number {
    return this.plannedQuantity > 0
      ? (this.completedQuantity / this.plannedQuantity) * 100
      : 0;
  }

  get costVariance(): number {
    return this.estimatedTotalCost - this.actualTotalCost;
  }
}
