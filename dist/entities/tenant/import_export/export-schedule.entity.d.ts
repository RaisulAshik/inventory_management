import { FileFormat } from '@common/enums';
import { ExportScheduleRecipient } from './export-schedule-recipient.entity';
export declare enum ScheduleFrequency {
    DAILY = "DAILY",
    WEEKLY = "WEEKLY",
    BIWEEKLY = "BIWEEKLY",
    MONTHLY = "MONTHLY",
    QUARTERLY = "QUARTERLY",
    YEARLY = "YEARLY",
    CUSTOM = "CUSTOM"
}
export declare class ExportSchedule {
    id: string;
    scheduleName: string;
    description: string;
    entityType: string;
    fileFormat: FileFormat;
    filters: Record<string, any>;
    columns: string[];
    frequency: ScheduleFrequency;
    cronExpression: string;
    dayOfWeek: number;
    dayOfMonth: number;
    timeOfDay: string;
    timezone: string;
    isActive: boolean;
    sendEmptyReport: boolean;
    emailSubject: string;
    emailBody: string;
    lastRunAt: Date;
    lastRunStatus: string;
    nextRunAt: Date;
    runCount: number;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
    recipients: ExportScheduleRecipient[];
}
