import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { PayrollComponentType } from '@common/enums';
import { HrPayroll } from './payroll.entity';

@Entity('hr_payroll_components')
export class PayrollComponent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'payroll_id' })
  payrollId: string;

  @Column({ name: 'component_name', length: 100 })
  componentName: string;

  @Column({
    name: 'component_type',
    type: 'enum',
    enum: PayrollComponentType,
  })
  componentType: PayrollComponentType;

  @Column({ type: 'decimal', precision: 18, scale: 4 })
  amount: number;

  @Column({ length: 500, nullable: true })
  remarks: string;

  @ManyToOne(() => HrPayroll, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'payroll_id' })
  payroll: HrPayroll;
}
