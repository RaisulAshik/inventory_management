import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { LeaveRequestStatus } from '@common/enums';
import { Employee } from './employee.entity';
import { LeaveType } from './leave-type.entity';

@Entity('hr_leave_requests')
export class LeaveRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'request_number', length: 50, unique: true })
  requestNumber: string;

  @Column({ name: 'employee_id' })
  employeeId: string;

  @Column({ name: 'leave_type_id' })
  leaveTypeId: string;

  @Column({ name: 'from_date', type: 'date' })
  fromDate: Date;

  @Column({ name: 'to_date', type: 'date' })
  toDate: Date;

  @Column({ name: 'total_days', type: 'decimal', precision: 5, scale: 1 })
  totalDays: number;

  @Column({ type: 'text', nullable: true })
  reason: string;

  @Column({
    type: 'enum',
    enum: LeaveRequestStatus,
    default: LeaveRequestStatus.PENDING,
  })
  status: LeaveRequestStatus;

  @Column({ name: 'approved_by', nullable: true })
  approvedBy: string;

  @Column({ name: 'approved_at', type: 'datetime', nullable: true })
  approvedAt: Date;

  @Column({ name: 'rejection_reason', type: 'text', nullable: true })
  rejectionReason: string;

  @Column({ name: 'created_by', nullable: true })
  createdBy: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date;

  @ManyToOne(() => Employee, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @ManyToOne(() => LeaveType, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'leave_type_id' })
  leaveType: LeaveType;
}
