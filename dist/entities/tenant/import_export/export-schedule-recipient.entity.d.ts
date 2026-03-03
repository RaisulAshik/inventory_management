import { ExportSchedule } from './export-schedule.entity';
import { User } from '../user/user.entity';
export declare enum RecipientType {
    USER = "USER",
    EMAIL = "EMAIL",
    WEBHOOK = "WEBHOOK",
    FTP = "FTP",
    S3 = "S3"
}
export declare class ExportScheduleRecipient {
    id: string;
    scheduleId: string;
    recipientType: RecipientType;
    userId: string;
    email: string;
    recipientName: string;
    webhookUrl: string;
    ftpHost: string;
    ftpUsername: string;
    ftpPassword: string;
    ftpPath: string;
    s3Bucket: string;
    s3Path: string;
    isActive: boolean;
    createdAt: Date;
    schedule: ExportSchedule;
    user: User;
}
