import { PaginationDto } from '@common/dto/pagination.dto';
import { ReminderType, ReminderStatus } from '@/entities/tenant/dueManagement/payment-reminder.entity';
export declare class CreateReminderDto {
    customerId: string;
    customerDueId?: string;
    reminderType: ReminderType;
    reminderDate: string;
    scheduledTime?: string;
    subject?: string;
    message?: string;
    recipientEmail?: string;
    recipientPhone?: string;
    notes?: string;
}
export declare class RecordResponseDto {
    responseReceived: boolean;
    responseDate?: string;
    responseNotes?: string;
    promiseToPayDate?: string;
    promisedAmount?: number;
    followUpRequired?: boolean;
    followUpDate?: string;
}
export declare class ReminderFilterDto extends PaginationDto {
    status?: ReminderStatus;
    reminderType?: ReminderType;
    customerId?: string;
    customerDueId?: string;
    fromDate?: string;
    toDate?: string;
    followUpToday?: boolean;
    brokenPromises?: boolean;
}
