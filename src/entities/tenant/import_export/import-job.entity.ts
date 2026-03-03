import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { ImportTemplate } from './import-template.entity';
import { ImportJobStatus, ImportMode } from '@common/enums';
import { User } from '../user/user.entity';
import { FileUpload } from './file-upload.entity';
import { ImportJobError } from './import-job-error.entity';

@Entity('import_jobs')
export class ImportJob {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'job_number', length: 50, unique: true })
  jobNumber: string;

  @Column({ name: 'template_id' })
  templateId: string;

  @Column({ name: 'file_upload_id' })
  fileUploadId: string;

  @Column({
    type: 'enum',
    enum: ImportJobStatus,
    default: ImportJobStatus.PENDING,
  })
  status: ImportJobStatus;

  @Column({
    name: 'import_mode',
    type: 'enum',
    enum: ImportMode,
    default: ImportMode.INSERT,
  })
  importMode: ImportMode;

  @Column({ name: 'total_rows', type: 'int', default: 0 })
  totalRows: number;

  @Column({ name: 'processed_rows', type: 'int', default: 0 })
  processedRows: number;

  @Column({ name: 'successful_rows', type: 'int', default: 0 })
  successfulRows: number;

  @Column({ name: 'failed_rows', type: 'int', default: 0 })
  failedRows: number;

  @Column({ name: 'skipped_rows', type: 'int', default: 0 })
  skippedRows: number;

  @Column({ name: 'inserted_count', type: 'int', default: 0 })
  insertedCount: number;

  @Column({ name: 'updated_count', type: 'int', default: 0 })
  updatedCount: number;

  @Column({ name: 'validation_started_at', type: 'timestamp', nullable: true })
  validationStartedAt: Date;

  @Column({
    name: 'validation_completed_at',
    type: 'timestamp',
    nullable: true,
  })
  validationCompletedAt: Date;

  @Column({ name: 'processing_started_at', type: 'timestamp', nullable: true })
  processingStartedAt: Date;

  @Column({
    name: 'processing_completed_at',
    type: 'timestamp',
    nullable: true,
  })
  processingCompletedAt: Date;

  @Column({ name: 'error_file_url', length: 500, nullable: true })
  errorFileUrl: string;

  @Column({ name: 'result_summary', type: 'json', nullable: true })
  resultSummary: Record<string, any>;

  @Column({ name: 'options', type: 'json', nullable: true })
  options: Record<string, any>;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ name: 'cancelled_at', type: 'timestamp', nullable: true })
  cancelledAt: Date;

  @Column({ name: 'cancelled_by', nullable: true })
  cancelledBy: string;

  @Column({ name: 'created_by', nullable: true })
  createdBy: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => ImportTemplate)
  @JoinColumn({ name: 'template_id' })
  template: ImportTemplate;

  @ManyToOne(() => FileUpload)
  @JoinColumn({ name: 'file_upload_id' })
  fileUpload: FileUpload;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  createdByUser: User;

  @OneToMany(() => ImportJobError, (error) => error.importJob)
  errors: ImportJobError[];

  // Computed
  get progressPercentage(): number {
    return this.totalRows > 0
      ? Math.round((this.processedRows / this.totalRows) * 100)
      : 0;
  }

  get successRate(): number {
    return this.processedRows > 0
      ? Math.round((this.successfulRows / this.processedRows) * 100)
      : 0;
  }

  get processingDurationSeconds(): number | null {
    if (!this.processingStartedAt || !this.processingCompletedAt) return null;
    return Math.round(
      (this.processingCompletedAt.getTime() -
        this.processingStartedAt.getTime()) /
        1000,
    );
  }
}
