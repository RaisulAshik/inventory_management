import { JwtPayload } from '@common/interfaces';
import { PaymentRemindersService } from './payment-reminders.service';
import { ReminderFilterDto, CreateReminderDto, RecordResponseDto } from './dto/reminder.dto';
export declare class PaymentRemindersController {
    private readonly remindersService;
    constructor(remindersService: PaymentRemindersService);
    findAll(filterDto: ReminderFilterDto): Promise<import("@common/interfaces").PaginatedResult<import("../../../entities/tenant").PaymentReminder>>;
    getFollowUpsToday(): Promise<import("../../../entities/tenant").PaymentReminder[]>;
    getBrokenPromises(): Promise<import("../../../entities/tenant").PaymentReminder[]>;
    findByDue(dueId: string): Promise<import("../../../entities/tenant").PaymentReminder[]>;
    findOne(id: string): Promise<import("../../../entities/tenant").PaymentReminder>;
    create(dto: CreateReminderDto, user: JwtPayload): Promise<import("../../../entities/tenant").PaymentReminder>;
    markSent(id: string, user: JwtPayload): Promise<import("../../../entities/tenant").PaymentReminder>;
    recordResponse(id: string, dto: RecordResponseDto, user: JwtPayload): Promise<import("../../../entities/tenant").PaymentReminder>;
    cancel(id: string, user: JwtPayload): Promise<import("../../../entities/tenant").PaymentReminder>;
}
