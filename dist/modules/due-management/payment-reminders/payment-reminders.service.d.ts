import { TenantConnectionManager } from '@database/tenant-connection.manager';
import { PaginatedResult } from '@common/interfaces';
import { CustomerDue } from '@/entities/tenant';
import { PaymentReminder, ReminderType } from '@/entities/tenant/dueManagement/payment-reminder.entity';
import { ReminderFilterDto, CreateReminderDto, RecordResponseDto } from './dto/reminder.dto';
export declare class PaymentRemindersService {
    private readonly tenantConnectionManager;
    constructor(tenantConnectionManager: TenantConnectionManager);
    private getRepo;
    private getDataSource;
    findAll(filterDto: ReminderFilterDto): Promise<PaginatedResult<PaymentReminder>>;
    findById(id: string): Promise<PaymentReminder>;
    findByDue(dueId: string): Promise<PaymentReminder[]>;
    getFollowUpsToday(): Promise<PaymentReminder[]>;
    getBrokenPromises(): Promise<PaymentReminder[]>;
    createManual(dto: CreateReminderDto, userId: string): Promise<PaymentReminder>;
    createAutomated(due: CustomerDue, level: number, reminderType?: ReminderType): Promise<PaymentReminder>;
    markSent(id: string, userId: string): Promise<PaymentReminder>;
    markDelivered(id: string): Promise<PaymentReminder>;
    markFailed(id: string, reason: string): Promise<PaymentReminder>;
    recordResponse(id: string, dto: RecordResponseDto, userId: string): Promise<PaymentReminder>;
    cancel(id: string, userId: string): Promise<PaymentReminder>;
    private buildReminderMessage;
}
