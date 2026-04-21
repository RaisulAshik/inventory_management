import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { AttendanceStatus } from '@common/enums';
import { Employee } from './employee.entity';

@Entity('hr_attendance')
@Index('IDX_ATTENDANCE_EMP_DATE', ['employeeId', 'attendanceDate'], { unique: true })
export class Attendance {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'employee_id' })
  employeeId: string;

  @Column({ name: 'attendance_date', type: 'date' })
  attendanceDate: Date;

  @Column({ name: 'check_in_time', type: 'time', nullable: true })
  checkInTime: string;

  @Column({ name: 'check_out_time', type: 'time', nullable: true })
  checkOutTime: string;

  @Column({
    type: 'enum',
    enum: AttendanceStatus,
    default: AttendanceStatus.ABSENT,
  })
  status: AttendanceStatus;

  @Column({ name: 'work_hours', type: 'decimal', precision: 5, scale: 2, nullable: true })
  workHours: number;

  @Column({ name: 'overtime_hours', type: 'decimal', precision: 5, scale: 2, default: 0 })
  overtimeHours: number;

  @Column({ name: 'late_minutes', type: 'int', default: 0 })
  lateMinutes: number;

  @Column({ length: 500, nullable: true })
  remarks: string;

  @Column({ name: 'approved_by', nullable: true })
  approvedBy: string;

  @Column({ name: 'created_by', nullable: true })
  createdBy: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Employee, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;
}
