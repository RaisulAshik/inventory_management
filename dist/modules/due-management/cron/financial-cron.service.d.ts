import { CustomerDuesService } from '../customer-dues/customer-dues.service';
import { SupplierDuesService } from '../supplier-dues/supplier-dues.service';
import { PaymentRemindersService } from '../payment-reminders/payment-reminders.service';
import { CreditNotesService } from '../credit-notes/credit-notes.service';
export declare class FinancialCronService {
    private readonly customerDuesService;
    private readonly supplierDuesService;
    private readonly remindersService;
    private readonly creditNotesService;
    private readonly logger;
    constructor(customerDuesService: CustomerDuesService, supplierDuesService: SupplierDuesService, remindersService: PaymentRemindersService, creditNotesService: CreditNotesService);
    handleDailyFinancialTasks(): Promise<void>;
    private processPaymentReminders;
    private shouldSendReminder;
}
