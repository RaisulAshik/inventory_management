import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../user/user.entity';

export enum FileUploadStatus {
  PENDING = 'PENDING',
  UPLOADING = 'UPLOADING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  PROCESSING = 'PROCESSING',
  PROCESSED = 'PROCESSED',
  EXPIRED = 'EXPIRED',
  DELETED = 'DELETED',
}

export enum FileUploadPurpose {
  IMPORT = 'IMPORT',
  ATTACHMENT = 'ATTACHMENT',
  PRODUCT_IMAGE = 'PRODUCT_IMAGE',
  DOCUMENT = 'DOCUMENT',
  REPORT = 'REPORT',
  BACKUP = 'BACKUP',
  OTHER = 'OTHER',
}

@Entity('file_uploads')
export class FileUpload {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'original_filename', length: 255 })
  originalFilename: string;

  @Column({ name: 'stored_filename', length: 255 })
  storedFilename: string;

  @Column({ name: 'file_path', length: 500 })
  filePath: string;

  @Column({ name: 'file_url', length: 500, nullable: true })
  fileUrl: string;

  @Column({ name: 'mime_type', length: 100 })
  mimeType: string;

  @Column({ name: 'file_extension', length: 20 })
  fileExtension: string;

  @Column({ name: 'file_size', type: 'bigint' })
  fileSize: number;

  @Column({ name: 'checksum', length: 64, nullable: true })
  checksum: string;

  @Column({
    type: 'enum',
    enum: FileUploadStatus,
    default: FileUploadStatus.PENDING,
  })
  status: FileUploadStatus;

  @Column({
    type: 'enum',
    enum: FileUploadPurpose,
    default: FileUploadPurpose.OTHER,
  })
  purpose: FileUploadPurpose;

  @Column({ name: 'reference_type', length: 100, nullable: true })
  referenceType: string;

  @Column({ name: 'reference_id', nullable: true })
  referenceId: string;

  @Column({ name: 'storage_provider', length: 50, default: 'LOCAL' })
  storageProvider: string;

  @Column({ name: 'storage_bucket', length: 255, nullable: true })
  storageBucket: string;

  @Column({ name: 'is_public', type: 'tinyint', default: 0 })
  isPublic: boolean;

  @Column({ name: 'is_temporary', type: 'tinyint', default: 0 })
  isTemporary: boolean;

  @Column({ name: 'expires_at', type: 'timestamp', nullable: true })
  expiresAt: Date;

  @Column({ name: 'deleted_at', type: 'timestamp', nullable: true })
  deletedAt: Date;

  @Column({ type: 'json', nullable: true })
  metadata: Record<string, any>;

  @Column({ name: 'error_message', type: 'text', nullable: true })
  errorMessage: string;

  @Column({ name: 'uploaded_by', nullable: true })
  uploadedBy: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  // Relations
  @ManyToOne(() => User)
  @JoinColumn({ name: 'uploaded_by' })
  uploadedByUser: User;

  // Computed
  get fileSizeFormatted(): string {
    const bytes = this.fileSize;
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  get isExpired(): boolean {
    return this.expiresAt && new Date(this.expiresAt) < new Date();
  }

  get isDeleted(): boolean {
    return this.deletedAt !== null;
  }
}
