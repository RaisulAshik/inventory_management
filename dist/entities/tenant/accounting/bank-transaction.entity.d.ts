import { BankAccount } from './bank-account.entity';
import { JournalEntry } from './journal-entry.entity';
export declare enum BankTransactionType {
    DEPOSIT = "DEPOSIT",
    WITHDRAWAL = "WITHDRAWAL",
    TRANSFER_IN = "TRANSFER_IN",
    TRANSFER_OUT = "TRANSFER_OUT",
    INTEREST_CREDIT = "INTEREST_CREDIT",
    BANK_CHARGES = "BANK_CHARGES",
    CHEQUE_DEPOSIT = "CHEQUE_DEPOSIT",
    CHEQUE_ISSUED = "CHEQUE_ISSUED",
    LOAN_DISBURSEMENT = "LOAN_DISBURSEMENT",
    LOAN_REPAYMENT = "LOAN_REPAYMENT",
    OTHER = "OTHER"
}
export declare enum BankTransactionStatus {
    PENDING = "PENDING",
    CLEARED = "CLEARED",
    BOUNCED = "BOUNCED",
    CANCELLED = "CANCELLED",
    RECONCILED = "RECONCILED"
}
export declare class BankTransaction {
    id: string;
    transactionNumber: string;
    bankAccountId: string;
    transactionDate: Date;
    valueDate: Date;
    transactionType: BankTransactionType;
    status: BankTransactionStatus;
    amount: number;
    currency: string;
    runningBalance: number;
    description: string;
    referenceNumber: string;
    chequeNumber: string;
    chequeDate: Date;
    payeePayerName: string;
    bankReference: string;
    journalEntryId: string;
    isReconciled: boolean;
    reconciledDate: Date;
    reconciliationId: string;
    notes: string;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
    bankAccount: BankAccount;
    journalEntry: JournalEntry;
    get isDebit(): boolean;
    get isCredit(): boolean;
}
