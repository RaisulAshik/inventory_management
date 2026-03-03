import { PosSession } from './pos-session.entity';
import { Customer } from '../eCommerce/customer.entity';
import { SalesOrder } from '../eCommerce/sales-order.entity';
import { Store } from './store.entity';
import { PosTerminal } from './pos-terminal.entity';
import { User } from '../user/user.entity';
import { PosTransactionItem } from './pos-transaction-item.entity';
import { PosTransactionPayment } from './pos-transaction-payment.entity';
export declare enum PosTransactionType {
    SALE = "SALE",
    RETURN = "RETURN",
    EXCHANGE = "EXCHANGE",
    VOID = "VOID"
}
export declare enum PosTransactionStatus {
    COMPLETED = "COMPLETED",
    VOIDED = "VOIDED",
    HELD = "HELD",
    PENDING = "PENDING"
}
export declare class PosTransaction {
    id: string;
    transactionNumber: string;
    sessionId: string;
    storeId: string;
    terminalId: string;
    salesOrderId: string;
    transactionType: PosTransactionType;
    customerId: string;
    customerName: string;
    customerPhone: string;
    transactionDate: Date;
    subtotal: number;
    discountAmount: number;
    taxAmount: number;
    totalAmount: number;
    paidAmount: number;
    changeAmount: number;
    status: PosTransactionStatus;
    voidReason: string;
    voidedBy: string;
    voidedAt: Date;
    notes: string;
    cashierId: string;
    createdAt: Date;
    updatedAt: Date;
    session: PosSession;
    store: Store;
    terminal: PosTerminal;
    salesOrder: SalesOrder;
    customer: Customer;
    cashier: User;
    items: PosTransactionItem[];
    payments: PosTransactionPayment[];
}
