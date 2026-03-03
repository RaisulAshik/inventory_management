import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ExportJobStatus, FileFormat } from '@common/enums';
import { User } from '../user/user.entity';

@Entity('export_jobs')
export class ExportJob {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'job_number', length: 50, unique: true })
  jobNumber: string;

  @Column({ name: 'export_name', length: 200 })
  exportName: string;

  @Column({ name: 'entity_type', length: 100 })
  entityType: string;

  @Column({
    type: 'enum',
    enum: ExportJobStatus,
    default: ExportJobStatus.PENDING,
  })
  status: ExportJobStatus;

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

  @Column({ name: 'sort_by', length: 100, nullable: true })
  sortBy: string;

  @Column({ name: 'sort_order', length: 10, nullable: true })
  sortOrder: 'ASC' | 'DESC';

  @Column({ name: 'include_headers', type: 'tinyint', default: 1 })
  includeHeaders: boolean;

  @Column({ name: 'total_records', type: 'int', default: 0 })
  totalRecords: number;

  @Column({ name: 'processed_records', type: 'int', default: 0 })
  processedRecords: number;

  @Column({ name: 'file_name', length: 255, nullable: true })
  fileName: string;

  @Column({ name: 'file_size', type: 'bigint', nullable: true })
  fileSize: number;

  @Column({ name: 'file_url', length: 500, nullable: true })
  fileUrl: string;

  @Column({ name: 'started_at', type: 'timestamp', nullable: true })
  startedAt: Date;

  @Column({ name: 'completed_at', type: 'timestamp', nullable: true })
  completedAt: Date;

  @Column({ name: 'expires_at', type: 'timestamp', nullable: true })
  expiresAt: Date;

  @Column({ name: 'error_message', type: 'text', nullable: true })
  errorMessage: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ name: 'created_by', nullable: true })
  createdBy: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => User)
  @JoinColumn({ name: 'created_by' })
  createdByUser: User;

  // Computed
  get progressPercentage(): number {
    return this.totalRecords > 0
      ? Math.round((this.processedRecords / this.totalRecords) * 100)
      : 0;
  }

  get isExpired(): boolean {
    return this.expiresAt && new Date(this.expiresAt) < new Date();
  }

  get processingDurationSeconds(): number | null {
    if (!this.startedAt || !this.completedAt) return null;
    return Math.round(
      (this.completedAt.getTime() - this.startedAt.getTime()) / 1000,
    );
  }
}
