import { User } from '../user/user.entity';
export declare enum FileUploadStatus {
    PENDING = "PENDING",
    UPLOADING = "UPLOADING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    PROCESSING = "PROCESSING",
    PROCESSED = "PROCESSED",
    EXPIRED = "EXPIRED",
    DELETED = "DELETED"
}
export declare enum FileUploadPurpose {
    IMPORT = "IMPORT",
    ATTACHMENT = "ATTACHMENT",
    PRODUCT_IMAGE = "PRODUCT_IMAGE",
    DOCUMENT = "DOCUMENT",
    REPORT = "REPORT",
    BACKUP = "BACKUP",
    OTHER = "OTHER"
}
export declare class FileUpload {
    id: string;
    originalFilename: string;
    storedFilename: string;
    filePath: string;
    fileUrl: string;
    mimeType: string;
    fileExtension: string;
    fileSize: number;
    checksum: string;
    status: FileUploadStatus;
    purpose: FileUploadPurpose;
    referenceType: string;
    referenceId: string;
    storageProvider: string;
    storageBucket: string;
    isPublic: boolean;
    isTemporary: boolean;
    expiresAt: Date;
    deletedAt: Date;
    metadata: Record<string, any>;
    errorMessage: string;
    uploadedBy: string;
    createdAt: Date;
    uploadedByUser: User;
    get fileSizeFormatted(): string;
    get isExpired(): boolean;
    get isDeleted(): boolean;
}
