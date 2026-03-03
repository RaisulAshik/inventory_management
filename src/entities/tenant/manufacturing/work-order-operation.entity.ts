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
import { BomOperation } from './bom-operation.entity';
import { Workstation } from './workstation.entity';
import { User } from '../user/user.entity';

export enum WorkOrderOperationStatus {
  PENDING = 'PENDING',
  READY = 'READY',
  IN_PROGRESS = 'IN_PROGRESS',
  PAUSED = 'PAUSED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

@Entity('work_order_operations')
export class WorkOrderOperation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'work_order_id' })
  workOrderId: string;

  @Column({ name: 'bom_operation_id', nullable: true })
  bomOperationId: string;

  @Column({ name: 'operation_number', type: 'int' })
  operationNumber: number;

  @Column({ name: 'operation_name', length: 200 })
  operationName: string;

  @Column({ name: 'workstation_id', nullable: true })
  workstationId: string;

  @Column({
    type: 'enum',
    enum: WorkOrderOperationStatus,
    default: WorkOrderOperationStatus.PENDING,
  })
  status: WorkOrderOperationStatus;

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

  @Column({
    name: 'planned_start_time',
    type: 'timestamp',
    nullable: true,
  })
  plannedStartTime: Date;

  @Column({
    name: 'planned_end_time',
    type: 'timestamp',
    nullable: true,
  })
  plannedEndTime: Date;

  @Column({
    name: 'actual_start_time',
    type: 'timestamp',
    nullable: true,
  })
  actualStartTime: Date;

  @Column({
    name: 'actual_end_time',
    type: 'timestamp',
    nullable: true,
  })
  actualEndTime: Date;

  @Column({
    name: 'planned_duration_minutes',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  plannedDurationMinutes: number;

  @Column({
    name: 'actual_duration_minutes',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  actualDurationMinutes: number;

  @Column({
    name: 'estimated_labor_cost',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  estimatedLaborCost: number;

  @Column({
    name: 'actual_labor_cost',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  actualLaborCost: number;

  @Column({
    name: 'estimated_overhead_cost',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  estimatedOverheadCost: number;

  @Column({
    name: 'actual_overhead_cost',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  actualOverheadCost: number;

  @Column({ name: 'operator_id', nullable: true })
  operatorId: string;

  @Column({ type: 'text', nullable: true })
  instructions: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => WorkOrder, (wo) => wo.operations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'work_order_id' })
  workOrder: WorkOrder;

  @ManyToOne(() => BomOperation)
  @JoinColumn({ name: 'bom_operation_id' })
  bomOperation: BomOperation;

  @ManyToOne(() => Workstation)
  @JoinColumn({ name: 'workstation_id' })
  workstation: Workstation;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'operator_id' })
  operator: User;

  // Computed
  get completionPercentage(): number {
    return this.plannedQuantity > 0
      ? (this.completedQuantity / this.plannedQuantity) * 100
      : 0;
  }

  get timeVariance(): number {
    return this.actualDurationMinutes - this.plannedDurationMinutes;
  }
}
