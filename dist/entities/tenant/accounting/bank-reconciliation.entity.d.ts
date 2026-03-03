import { BankAccount } from './bank-account.entity';
import { User } from '../user/user.entity';
export declare enum ReconciliationStatus {
    DRAFT = "DRAFT",
    IN_PROGRESS = "IN_PROGRESS",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED"
}
export declare class BankReconciliation {
    id: string;
    reconciliationNumber: string;
    bankAccountId: string;
    statementDate: Date;
    statementStartDate: Date;
    statementEndDate: Date;
    status: ReconciliationStatus;
    openingBalanceBook: number;
    closingBalanceBook: number;
    openingBalanceBank: number;
    closingBalanceBank: number;
    totalDepositsBook: number;
    totalWithdrawalsBook: number;
    totalDepositsBank: number;
    totalWithdrawalsBank: number;
    depositsInTransit: number;
    outstandingCheques: number;
    bankErrors: number;
    bookErrors: number;
    adjustedBalanceBook: number;
    adjustedBalanceBank: number;
    difference: number;
    isReconciled: boolean;
    notes: string;
    reconciledBy: string;
    reconciledAt: Date;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
    bankAccount: BankAccount;
    reconciledByUser: User;
}
