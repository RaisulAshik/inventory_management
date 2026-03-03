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
import { Warehouse } from './warehouse.entity';
import { StockAdjustmentItem } from './stock-adjustment-item.entity';

export enum AdjustmentType {
  INCREASE = 'INCREASE',
  DECREASE = 'DECREASE',
  WRITE_OFF = 'WRITE_OFF',
  OPENING_STOCK = 'OPENING_STOCK',
  CYCLE_COUNT = 'CYCLE_COUNT',
  DAMAGE = 'DAMAGE',
  EXPIRY = 'EXPIRY',
  THEFT = 'THEFT',
  OTHER = 'OTHER',
}

export enum AdjustmentStatus {
  DRAFT = 'DRAFT',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
}

@Entity('stock_adjustments')
export class StockAdjustment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'adjustment_number', length: 50, unique: true })
  adjustmentNumber: string;

  @Column({ name: 'adjustment_date', type: 'date' })
  adjustmentDate: Date;

  @Column({ name: 'warehouse_id' })
  warehouseId: string;

  @Column({
    name: 'adjustment_type',
    type: 'enum',
    enum: AdjustmentType,
  })
  adjustmentType: AdjustmentType;

  @Column({
    type: 'enum',
    enum: AdjustmentStatus,
    default: AdjustmentStatus.DRAFT,
  })
  status: AdjustmentStatus;

  @Column({ type: 'text' })
  reason: string;

  @Column({ name: 'reference_number', length: 50, nullable: true })
  referenceNumber: string;

  @Column({
    name: 'total_value_impact',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  totalValueImpact: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ name: 'approved_by', nullable: true })
  approvedBy: string;

  @Column({ name: 'approved_at', type: 'timestamp', nullable: true })
  approvedAt: Date;

  @Column({ name: 'rejection_reason', type: 'text', nullable: true })
  rejectionReason: string;

  @Column({ name: 'created_by', nullable: true })
  createdBy: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Warehouse)
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: Warehouse;

  @OneToMany(() => StockAdjustmentItem, (item) => item.stockAdjustment)
  items: StockAdjustmentItem[];

  // Computed
  get itemCount(): number {
    return this.items?.length || 0;
  }
}
