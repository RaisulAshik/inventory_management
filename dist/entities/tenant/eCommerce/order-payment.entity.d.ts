import { SalesOrder } from './sales-order.entity';
import { PaymentMethod } from './payment-method.entity';
export declare enum OrderPaymentStatus {
    PENDING = "PENDING",
    PROCESSING = "PROCESSING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    CANCELLED = "CANCELLED",
    REFUNDED = "REFUNDED",
    PARTIALLY_REFUNDED = "PARTIALLY_REFUNDED"
}
export declare class OrderPayment {
    id: string;
    orderId: string;
    paymentMethodId: string;
    paymentDate: Date;
    amount: number;
    currency: string;
    status: OrderPaymentStatus;
    transactionId: string;
    gatewayTransactionId: string;
    gatewayResponse: Record<string, any>;
    paymentReference: string;
    refundedAmount: number;
    refundReason: string;
    refundedAt: Date;
    failureReason: string;
    notes: string;
    processedBy: string;
    createdAt: Date;
    updatedAt: Date;
    order: SalesOrder;
    paymentMethod: PaymentMethod;
    get netAmount(): number;
}
