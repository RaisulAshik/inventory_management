import { CustomerDue } from './customer-due.entity';
import { Customer } from '../eCommerce/customer.entity';
import { User } from '../user/user.entity';
export declare enum ReminderType {
    EMAIL = "EMAIL",
    SMS = "SMS",
    PHONE_CALL = "PHONE_CALL",
    LETTER = "LETTER",
    WHATSAPP = "WHATSAPP",
    IN_PERSON = "IN_PERSON"
}
export declare enum ReminderStatus {
    SCHEDULED = "SCHEDULED",
    SENT = "SENT",
    DELIVERED = "DELIVERED",
    FAILED = "FAILED",
    CANCELLED = "CANCELLED"
}
export declare class PaymentReminder {
    id: string;
    customerId: string;
    customerDueId: string;
    reminderType: ReminderType;
    status: ReminderStatus;
    reminderDate: Date;
    scheduledTime: string;
    sentAt: Date;
    subject: string;
    message: string;
    recipientEmail: string;
    recipientPhone: string;
    overdueAmount: number;
    overdueDays: number;
    reminderLevel: number;
    responseReceived: boolean;
    responseDate: Date;
    responseNotes: string;
    promiseToPayDate: Date;
    promisedAmount: number;
    followUpRequired: boolean;
    followUpDate: Date;
    notes: string;
    sentBy: string;
    createdBy: string;
    createdAt: Date;
    customer: Customer;
    customerDue: CustomerDue;
    sentByUser: User;
}
