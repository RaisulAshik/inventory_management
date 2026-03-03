import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Warehouse } from '../warehouse/warehouse.entity';

export enum WorkstationType {
  ASSEMBLY = 'ASSEMBLY',
  MACHINING = 'MACHINING',
  PACKAGING = 'PACKAGING',
  QUALITY_CHECK = 'QUALITY_CHECK',
  PAINTING = 'PAINTING',
  WELDING = 'WELDING',
  CUTTING = 'CUTTING',
  MOLDING = 'MOLDING',
  FINISHING = 'FINISHING',
  OTHER = 'OTHER',
}

export enum WorkstationStatus {
  AVAILABLE = 'AVAILABLE',
  IN_USE = 'IN_USE',
  MAINTENANCE = 'MAINTENANCE',
  BREAKDOWN = 'BREAKDOWN',
  INACTIVE = 'INACTIVE',
}

@Entity('workstations')
export class Workstation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'workstation_code', length: 50, unique: true })
  workstationCode: string;

  @Column({ name: 'workstation_name', length: 200 })
  workstationName: string;

  @Column({
    name: 'workstation_type',
    type: 'enum',
    enum: WorkstationType,
    default: WorkstationType.ASSEMBLY,
  })
  workstationType: WorkstationType;

  @Column({ name: 'warehouse_id', nullable: true })
  warehouseId: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: WorkstationStatus,
    default: WorkstationStatus.AVAILABLE,
  })
  status: WorkstationStatus;

  @Column({
    name: 'hourly_rate',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  hourlyRate: number;

  @Column({
    name: 'operating_cost_per_hour',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  operatingCostPerHour: number;

  @Column({
    name: 'capacity_per_hour',
    type: 'decimal',
    precision: 18,
    scale: 4,
    nullable: true,
  })
  capacityPerHour: number;

  @Column({
    name: 'working_hours_per_day',
    type: 'decimal',
    precision: 4,
    scale: 2,
    default: 8,
  })
  workingHoursPerDay: number;

  @Column({
    name: 'efficiency_percentage',
    type: 'decimal',
    precision: 5,
    scale: 2,
    default: 100,
  })
  efficiencyPercentage: number;

  @Column({ name: 'setup_time_minutes', type: 'int', default: 0 })
  setupTimeMinutes: number;

  @Column({ name: 'cleanup_time_minutes', type: 'int', default: 0 })
  cleanupTimeMinutes: number;

  @Column({ name: 'last_maintenance_date', type: 'date', nullable: true })
  lastMaintenanceDate: Date;

  @Column({ name: 'next_maintenance_date', type: 'date', nullable: true })
  nextMaintenanceDate: Date;

  @Column({ name: 'is_active', type: 'tinyint', default: 1 })
  isActive: boolean;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Warehouse)
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: Warehouse;

  // Computed
  get effectiveCapacityPerDay(): number {
    if (!this.capacityPerHour) return 0;
    return (
      this.capacityPerHour *
      this.workingHoursPerDay *
      (this.efficiencyPercentage / 100)
    );
  }

  get needsMaintenance(): boolean {
    if (!this.nextMaintenanceDate) return false;
    return new Date(this.nextMaintenanceDate) <= new Date();
  }
}
