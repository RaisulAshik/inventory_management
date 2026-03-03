import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ExportSchedule } from './export-schedule.entity';
import { User } from '../user/user.entity';

export enum RecipientType {
  USER = 'USER',
  EMAIL = 'EMAIL',
  WEBHOOK = 'WEBHOOK',
  FTP = 'FTP',
  S3 = 'S3',
}

@Entity('export_schedule_recipients')
export class ExportScheduleRecipient {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'schedule_id' })
  scheduleId: string;

  @Column({
    name: 'recipient_type',
    type: 'enum',
    enum: RecipientType,
    default: RecipientType.EMAIL,
  })
  recipientType: RecipientType;

  @Column({ name: 'user_id', nullable: true })
  userId: string;

  @Column({ length: 255, nullable: true })
  email: string;

  @Column({ name: 'recipient_name', length: 200, nullable: true })
  recipientName: string;

  @Column({ name: 'webhook_url', length: 500, nullable: true })
  webhookUrl: string;

  @Column({ name: 'ftp_host', length: 255, nullable: true })
  ftpHost: string;

  @Column({ name: 'ftp_username', length: 100, nullable: true })
  ftpUsername: string;

  @Column({ name: 'ftp_password', length: 255, nullable: true })
  ftpPassword: string;

  @Column({ name: 'ftp_path', length: 500, nullable: true })
  ftpPath: string;

  @Column({ name: 's3_bucket', length: 255, nullable: true })
  s3Bucket: string;

  @Column({ name: 's3_path', length: 500, nullable: true })
  s3Path: string;

  @Column({ name: 'is_active', type: 'tinyint', default: 1 })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relations
  @ManyToOne(() => ExportSchedule, (schedule) => schedule.recipients, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'schedule_id' })
  schedule: ExportSchedule;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
