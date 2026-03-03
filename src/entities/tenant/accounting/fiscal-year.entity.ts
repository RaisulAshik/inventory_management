import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { FiscalPeriodStatus } from '@common/enums';
import { FiscalPeriod } from './fiscal-period.entity';

@Entity('fiscal_years')
export class FiscalYear {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'year_code', length: 20, unique: true })
  yearCode: string;

  @Column({ name: 'year_name', length: 100 })
  yearName: string;

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

  @Column({ name: 'is_current', type: 'tinyint', default: 0 })
  isCurrent: boolean;

  @Column({ name: 'closed_by', nullable: true })
  closedBy: string;

  @Column({ name: 'closed_at', type: 'timestamp', nullable: true })
  closedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @OneToMany(() => FiscalPeriod, (period) => period.fiscalYear)
  periods: FiscalPeriod[];

  // Helper
  get isOpen(): boolean {
    return this.status === FiscalPeriodStatus.OPEN;
  }
}
