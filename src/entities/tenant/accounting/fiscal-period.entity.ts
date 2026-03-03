import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { FiscalPeriodStatus } from '@common/enums';
import { FiscalYear } from './fiscal-year.entity';

@Entity('fiscal_periods')
export class FiscalPeriod {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'fiscal_year_id' })
  fiscalYearId: string;

  @Column({ name: 'period_number', type: 'int' })
  periodNumber: number;

  @Column({ name: 'period_name', length: 50 })
  periodName: string;

  @Column({ name: 'start_date', type: 'date' })
  startDate: Date;

  @Column({ name: 'end_date', type: 'date' })
  endDate: Date;

  @Column({
    type: 'enum',
    enum: FiscalPeriodStatus,
    default: FiscalPeriodStatus.OPEN,
  })
  status: FiscalPeriodStatus;

  @Column({ name: 'closed_by', nullable: true })
  closedBy: string;

  @Column({ name: 'closed_at', type: 'timestamp', nullable: true })
  closedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => FiscalYear, (year) => year.periods)
  @JoinColumn({ name: 'fiscal_year_id' })
  fiscalYear: FiscalYear;

  // Helper
  get isOpen(): boolean {
    return this.status === FiscalPeriodStatus.OPEN;
  }
}
