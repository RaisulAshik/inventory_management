import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ImportJob } from './import-job.entity';

export enum ImportErrorType {
  VALIDATION = 'VALIDATION',
  DATA_TYPE = 'DATA_TYPE',
  REQUIRED_FIELD = 'REQUIRED_FIELD',
  DUPLICATE = 'DUPLICATE',
  REFERENCE_NOT_FOUND = 'REFERENCE_NOT_FOUND',
  FORMAT = 'FORMAT',
  BUSINESS_RULE = 'BUSINESS_RULE',
  SYSTEM = 'SYSTEM',
}

export enum ImportErrorSeverity {
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL',
}

@Entity('import_job_errors')
export class ImportJobError {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'import_job_id' })
  importJobId: string;

  @Column({ name: 'row_number', type: 'int' })
  rowNumber: number;

  @Column({ name: 'column_name', length: 200, nullable: true })
  columnName: string;

  @Column({ name: 'column_index', type: 'int', nullable: true })
  columnIndex: number;

  @Column({
    name: 'error_type',
    type: 'enum',
    enum: ImportErrorType,
  })
  errorType: ImportErrorType;

  @Column({
    type: 'enum',
    enum: ImportErrorSeverity,
    default: ImportErrorSeverity.ERROR,
  })
  severity: ImportErrorSeverity;

  @Column({ name: 'error_code', length: 50, nullable: true })
  errorCode: string;

  @Column({ name: 'error_message', type: 'text' })
  errorMessage: string;

  @Column({ name: 'field_value', type: 'text', nullable: true })
  fieldValue: string;

  @Column({ name: 'expected_value', type: 'text', nullable: true })
  expectedValue: string;

  @Column({ name: 'row_data', type: 'json', nullable: true })
  rowData: Record<string, any>;

  @Column({ name: 'is_resolved', type: 'tinyint', default: 0 })
  isResolved: boolean;

  @Column({ name: 'resolution_notes', type: 'text', nullable: true })
  resolutionNotes: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relations
  @ManyToOne(() => ImportJob, (job) => job.errors, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'import_job_id' })
  importJob: ImportJob;
}
