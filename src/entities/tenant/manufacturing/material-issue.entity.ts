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
import { WorkOrder } from './work-order.entity';
import { Warehouse } from '../warehouse/warehouse.entity';
import { User } from '../user/user.entity';
import { MaterialIssueItem } from './material-issue-item.entity';

export enum MaterialIssueStatus {
  DRAFT = 'DRAFT',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  ISSUED = 'ISSUED',
  PARTIALLY_RETURNED = 'PARTIALLY_RETURNED',
  RETURNED = 'RETURNED',
  CANCELLED = 'CANCELLED',
}

export enum MaterialIssueType {
  PRODUCTION = 'PRODUCTION',
  REWORK = 'REWORK',
  SAMPLE = 'SAMPLE',
  REPLACEMENT = 'REPLACEMENT',
  OTHER = 'OTHER',
}

@Entity('material_issues')
export class MaterialIssue {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'issue_number', length: 50, unique: true })
  issueNumber: string;

  @Column({ name: 'issue_date', type: 'timestamp' })
  issueDate: Date;

  @Column({ name: 'work_order_id', nullable: true })
  workOrderId: string;

  @Column({ name: 'warehouse_id' })
  warehouseId: string;

  @Column({
    name: 'issue_type',
    type: 'enum',
    enum: MaterialIssueType,
    default: MaterialIssueType.PRODUCTION,
  })
  issueType: MaterialIssueType;

  @Column({
    type: 'enum',
    enum: MaterialIssueStatus,
    default: MaterialIssueStatus.DRAFT,
  })
  status: MaterialIssueStatus;

  @Column({
    name: 'total_value',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  totalValue: number;

  @Column({ type: 'text', nullable: true })
  reason: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ name: 'issued_by', nullable: true })
  issuedBy: string;

  @Column({ name: 'issued_at', type: 'timestamp', nullable: true })
  issuedAt: Date;

  @Column({ name: 'approved_by', nullable: true })
  approvedBy: string;

  @Column({ name: 'approved_at', type: 'timestamp', nullable: true })
  approvedAt: Date;

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

  @ManyToOne(() => Warehouse)
  @JoinColumn({ name: 'warehouse_id' })
  warehouse: Warehouse;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'issued_by' })
  issuedByUser: User;

  @OneToMany(() => MaterialIssueItem, (item) => item.materialIssue)
  items: MaterialIssueItem[];
}
