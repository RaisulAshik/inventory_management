import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';

@Entity('hr_leave_types')
export class LeaveType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100, unique: true })
  name: string;

  @Column({ length: 20, unique: true })
  code: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'max_days_per_year', type: 'int', default: 0 })
  maxDaysPerYear: number;

  @Column({ name: 'is_paid', type: 'tinyint', default: 1 })
  isPaid: boolean;

  @Column({ name: 'carry_forward', type: 'tinyint', default: 0 })
  carryForward: boolean;

  @Column({ name: 'max_carry_forward_days', type: 'int', default: 0 })
  maxCarryForwardDays: number;

  @Column({ name: 'requires_approval', type: 'tinyint', default: 1 })
  requiresApproval: boolean;

  @Column({ name: 'is_active', type: 'tinyint', default: 1 })
  isActive: boolean;

  @Column({ name: 'created_by', nullable: true })
  createdBy: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date;

  @OneToMany('LeaveRequest', 'leaveType')
  leaveRequests: any[];
}
