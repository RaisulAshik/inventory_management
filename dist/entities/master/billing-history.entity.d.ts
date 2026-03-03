import { Tenant } from './tenant.entity';
import { Subscription } from './subscription.entity';
export declare enum BillingStatus {
    PENDING = "PENDING",
    PAID = "PAID",
    FAILED = "FAILED",
    REFUNDED = "REFUNDED",
    CANCELLED = "CANCELLED"
}
export declare class BillingHistory {
    id: string;
    tenantId: string;
    subscriptionId: string;
    invoiceNumber: string;
    amount: number;
    taxAmount: number;
    totalAmount: number;
    currency: string;
    status: BillingStatus;
    description: string;
    periodStart: Date;
    periodEnd: Date;
    invoiceDate: Date;
    dueDate: Date;
    paidDate: Date;
    paymentMethod: string;
    paymentReference: string;
    transactionId: string;
    paymentGatewayResponse: string;
    refundAmount: number;
    refundDate: Date;
    refundReason: string;
    invoiceUrl: string;
    createdAt: Date;
    updatedAt: Date;
    tenant: Tenant;
    subscription: Subscription;
    get isPaid(): boolean;
    get isOverdue(): boolean;
}
