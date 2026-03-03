import { PosSession } from './pos-session.entity';
import { Store } from './store.entity';
import { User } from '../user/user.entity';
export declare enum CashMovementType {
    CASH_IN = "CASH_IN",
    CASH_OUT = "CASH_OUT",
    PETTY_CASH = "PETTY_CASH",
    FLOAT = "FLOAT",
    BANK_DEPOSIT = "BANK_DEPOSIT",
    BANK_WITHDRAWAL = "BANK_WITHDRAWAL",
    EXPENSE = "EXPENSE",
    REFUND = "REFUND",
    ADJUSTMENT = "ADJUSTMENT"
}
export declare enum CashMovementStatus {
    PENDING = "PENDING",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    CANCELLED = "CANCELLED"
}
export declare class CashMovement {
    id: string;
    movementNumber: string;
    sessionId: string;
    storeId: string;
    movementType: CashMovementType;
    movementDate: Date;
    amount: number;
    currency: string;
    status: CashMovementStatus;
    reason: string;
    referenceNumber: string;
    referenceType: string;
    referenceId: string;
    expenseCategory: string;
    receivedFrom: string;
    paidTo: string;
    notes: string;
    approvedBy: string;
    approvedAt: Date;
    createdBy: string;
    createdAt: Date;
    session: PosSession;
    store: Store;
    createdByUser: User;
    get isInflow(): boolean;
    get isOutflow(): boolean;
}
