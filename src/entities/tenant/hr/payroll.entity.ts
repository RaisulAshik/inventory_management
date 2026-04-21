import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';
import { HrPayrollStatus } from '@common/enums';
import { Employee } from './employee.entity';

@Entity('hr_payrolls')
@Index('IDX_PAYROLL_EMP_MONTH', ['employeeId', 'payrollMonth', 'payrollYear'], { unique: true })
export class HrPayroll {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'payroll_number', length: 50, unique: true })
  payrollNumber: string;

  @Column({ name: 'employee_id' })
  employeeId: string;

  @Column({ name: 'payroll_month', type: 'tinyint' })
  payrollMonth: number;

  @Column({ name: 'payroll_year', type: 'smallint' })
  payrollYear: number;

  @Column({ name: 'payment_date', type: 'date', nullable: true })
  paymentDate: Date;

  @Column({ name: 'working_days', type: 'int', default: 0 })
  workingDays: number;

  @Column({ name: 'present_days', type: 'int', default: 0 })
  presentDays: number;

  @Column({ name: 'absent_days', type: 'int', default: 0 })
  absentDays: number;

  @Column({ name: 'leave_days', type: 'int', default: 0 })
  leaveDays: number;

  @Column({ name: 'overtime_hours', type: 'decimal', precision: 6, scale: 2, default: 0 })
  overtimeHours: number;

  @Column({ name: 'basic_salary', type: 'decimal', precision: 18, scale: 4, default: 0 })
  basicSalary: number;

  @Column({ name: 'total_earnings', type: 'decimal', precision: 18, scale: 4, default: 0 })
  totalEarnings: number;

  @Column({ name: 'total_deductions', type: 'decimal', precision: 18, scale: 4, default: 0 })
  totalDeductions: number;

  @Column({ name: 'net_pay', type: 'decimal', precision: 18, scale: 4, default: 0 })
  netPay: number;

  @Column({
    type: 'enum',
    enum: HrPayrollStatus,
    default: HrPayrollStatus.DRAFT,
  })
  status: HrPayrollStatus;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ name: 'approved_by', nullable: true })
  approvedBy: string;

  @Column({ name: 'approved_at', type: 'datetime', nullable: true })
  approvedAt: Date;

  @Column({ name: 'created_by', nullable: true })
  createdBy: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at', nullable: true })
  deletedAt: Date;

  @ManyToOne(() => Employee, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'employee_id' })
  employee: Employee;

  @OneToMany('PayrollComponent', 'payroll', { cascade: true })
  components: any[];
}
