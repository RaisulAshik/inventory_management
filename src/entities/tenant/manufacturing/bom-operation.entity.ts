import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { BillOfMaterials } from './bill-of-materials.entity';
import { Workstation } from './workstation.entity';

@Entity('bom_operations')
export class BomOperation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'bom_id' })
  bomId: string;

  @Column({ name: 'operation_number', type: 'int' })
  operationNumber: number;

  @Column({ name: 'operation_name', length: 200 })
  operationName: string;

  @Column({ name: 'workstation_id', nullable: true })
  workstationId: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  instructions: string;

  @Column({
    name: 'setup_time_minutes',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  setupTimeMinutes: number;

  @Column({
    name: 'operation_time_minutes',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  operationTimeMinutes: number;

  @Column({
    name: 'teardown_time_minutes',
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  teardownTimeMinutes: number;

  @Column({
    name: 'labor_cost_per_unit',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  laborCostPerUnit: number;

  @Column({
    name: 'overhead_cost_per_unit',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  overheadCostPerUnit: number;

  @Column({
    name: 'total_cost_per_unit',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  totalCostPerUnit: number;

  @Column({ name: 'is_outsourced', type: 'tinyint', default: 0 })
  isOutsourced: boolean;

  @Column({ name: 'outsourced_vendor', length: 200, nullable: true })
  outsourcedVendor: string;

  @Column({
    name: 'outsourced_cost',
    type: 'decimal',
    precision: 18,
    scale: 4,
    nullable: true,
  })
  outsourcedCost: number;

  @Column({ name: 'is_quality_check_required', type: 'tinyint', default: 0 })
  isQualityCheckRequired: boolean;

  @Column({ name: 'quality_parameters', type: 'json', nullable: true })
  qualityParameters: Record<string, any>;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => BillOfMaterials, (bom) => bom.operations, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'bom_id' })
  bom: BillOfMaterials;

  @ManyToOne(() => Workstation)
  @JoinColumn({ name: 'workstation_id' })
  workstation: Workstation;

  // Computed
  get totalTimeMinutes(): number {
    return (
      this.setupTimeMinutes +
      this.operationTimeMinutes +
      this.teardownTimeMinutes
    );
  }
}
