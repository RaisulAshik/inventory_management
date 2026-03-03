import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { FileFormat } from '@common/enums';
import { ExportScheduleRecipient } from './export-schedule-recipient.entity';

export enum ScheduleFrequency {
  DAILY = 'DAILY',
  WEEKLY = 'WEEKLY',
  BIWEEKLY = 'BIWEEKLY',
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  YEARLY = 'YEARLY',
  CUSTOM = 'CUSTOM',
}

@Entity('export_schedules')
export class ExportSchedule {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'schedule_name', length: 200 })
  scheduleName: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ name: 'entity_type', length: 100 })
  entityType: string;

  @Column({
    name: 'file_format',
    type: 'enum',
    enum: FileFormat,
    default: FileFormat.XLSX,
  })
  fileFormat: FileFormat;

  @Column({ type: 'json', nullable: true })
  filters: Record<string, any>;

  @Column({ type: 'json', nullable: true })
  columns: string[];

  @Column({
    type: 'enum',
    enum: ScheduleFrequency,
  })
  frequency: ScheduleFrequency;

  @Column({ name: 'cron_expression', length: 100, nullable: true })
  cronExpression: string;

  @Column({ name: 'day_of_week', type: 'int', nullable: true })
  dayOfWeek: number;

  @Column({ name: 'day_of_month', type: 'int', nullable: true })
  dayOfMonth: number;

  @Column({ name: 'time_of_day', type: 'time' })
  timeOfDay: string;

  @Column({ length: 100, default: 'Asia/Kolkata' })
  timezone: string;

  @Column({ name: 'is_active', type: 'tinyint', default: 1 })
  isActive: boolean;

  @Column({ name: 'send_empty_report', type: 'tinyint', default: 0 })
  sendEmptyReport: boolean;

  @Column({ name: 'email_subject', length: 500, nullable: true })
  emailSubject: string;

  @Column({ name: 'email_body', type: 'text', nullable: true })
  emailBody: string;

  @Column({ name: 'last_run_at', type: 'timestamp', nullable: true })
  lastRunAt: Date;

  @Column({ name: 'last_run_status', length: 50, nullable: true })
  lastRunStatus: string;

  @Column({ name: 'next_run_at', type: 'timestamp', nullable: true })
  nextRunAt: Date;

  @Column({ name: 'run_count', type: 'int', default: 0 })
  runCount: number;

  @Column({ name: 'created_by', nullable: true })
  createdBy: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @OneToMany(() => ExportScheduleRecipient, (recipient) => recipient.schedule)
  recipients: ExportScheduleRecipient[];
}
