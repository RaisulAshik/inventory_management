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
} from 'typeorm';
import {
  EmploymentType,
  EmploymentStatus,
  Gender,
  MaritalStatus,
  SalaryBasis,
} from '@common/enums';
import { Department } from './department.entity';
import { Designation } from './designation.entity';

@Entity('hr_employees')
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'employee_code', length: 50, unique: true })
  employeeCode: string;

  @Column({ name: 'first_name', length: 100 })
  firstName: string;

  @Column({ name: 'last_name', length: 100, nullable: true })
  lastName: string;

  @Column({ length: 255, nullable: true, unique: true })
  email: string;

  @Column({ length: 50, nullable: true })
  phone: string;

  @Column({ name: 'date_of_birth', type: 'date', nullable: true })
  dateOfBirth: Date;

  @Column({ type: 'enum', enum: Gender, nullable: true })
  gender: Gender;

  @Column({ name: 'marital_status', type: 'enum', enum: MaritalStatus, nullable: true })
  maritalStatus: MaritalStatus;

  @Column({ name: 'national_id', length: 100, nullable: true })
  nationalId: string;

  @Column({ name: 'address_line1', length: 255, nullable: true })
  addressLine1: string;

  @Column({ name: 'address_line2', length: 255, nullable: true })
  addressLine2: string;

  @Column({ length: 100, nullable: true })
  city: string;

  @Column({ length: 100, nullable: true })
  state: string;

  @Column({ length: 100, nullable: true })
  country: string;

  @Column({ name: 'postal_code', length: 20, nullable: true })
  postalCode: string;

  @Column({ name: 'emergency_contact_name', length: 100, nullable: true })
  emergencyContactName: string;

  @Column({ name: 'emergency_contact_phone', length: 50, nullable: true })
  emergencyContactPhone: string;

  @Column({ name: 'department_id', nullable: true })
  departmentId: string;

  @Column({ name: 'designation_id', nullable: true })
  designationId: string;

  @Column({ name: 'reporting_to', nullable: true })
  reportingTo: string;

  @Column({ name: 'hire_date', type: 'date' })
  hireDate: Date;

  @Column({ name: 'confirmation_date', type: 'date', nullable: true })
  confirmationDate: Date;

  @Column({ name: 'resign_date', type: 'date', nullable: true })
  resignDate: Date;

  @Column({ name: 'termination_date', type: 'date', nullable: true })
  terminationDate: Date;

  @Column({
    name: 'employment_type',
    type: 'enum',
    enum: EmploymentType,
    default: EmploymentType.FULL_TIME,
  })
  employmentType: EmploymentType;

  @Column({
    name: 'employment_status',
    type: 'enum',
    enum: EmploymentStatus,
    default: EmploymentStatus.PROBATION,
  })
  employmentStatus: EmploymentStatus;

  @Column({
    name: 'salary_basis',
    type: 'enum',
    enum: SalaryBasis,
    default: SalaryBasis.MONTHLY,
  })
  salaryBasis: SalaryBasis;

  @Column({ name: 'basic_salary', type: 'decimal', precision: 18, scale: 4, default: 0 })
  basicSalary: number;

  @Column({ name: 'bank_name', length: 200, nullable: true })
  bankName: string;

  @Column({ name: 'bank_account_number', length: 100, nullable: true })
  bankAccountNumber: string;

  @Column({ name: 'bank_branch', length: 200, nullable: true })
  bankBranch: string;

  @Column({ name: 'profile_photo_url', length: 500, nullable: true })
  profilePhotoUrl: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

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

  // Relations
  @ManyToOne(() => Department, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'department_id' })
  department: Department;

  @ManyToOne(() => Designation, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'designation_id' })
  designation: Designation;

  @ManyToOne(() => Employee, (e) => e.subordinates, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'reporting_to' })
  manager: Employee;

  @OneToMany(() => Employee, (e) => e.manager)
  subordinates: Employee[];

  @OneToMany('Attendance', 'employee')
  attendances: any[];

  @OneToMany('LeaveRequest', 'employee')
  leaveRequests: any[];

  @OneToMany('HrPayroll', 'employee')
  payrolls: any[];

  get fullName(): string {
    return [this.firstName, this.lastName].filter(Boolean).join(' ');
  }
}
