import { PosTransaction } from './pos-transaction.entity';
import { PaymentMethod } from '../eCommerce/payment-method.entity';
export declare enum PosPaymentStatus {
    PENDING = "PENDING",
    COMPLETED = "COMPLETED",
    FAILED = "FAILED",
    CANCELLED = "CANCELLED",
    REFUNDED = "REFUNDED"
}
export declare class PosTransactionPayment {
    id: string;
    transactionId: string;
    paymentMethodId: string;
    amount: number;
    tenderedAmount: number;
    changeAmount: number;
    currency: string;
    status: PosPaymentStatus;
    referenceNumber: string;
    cardLastFour: string;
    cardType: string;
    approvalCode: string;
    terminalResponse: Record<string, any>;
    isRefund: boolean;
    refundReason: string;
    originalPaymentId: string;
    notes: string;
    createdAt: Date;
    transaction: PosTransaction;
    paymentMethod: PaymentMethod;
}
