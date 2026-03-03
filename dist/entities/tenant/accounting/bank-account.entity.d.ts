import { ChartOfAccounts } from './chart-of-accounts.entity';
export declare enum BankAccountType {
    SAVINGS = "SAVINGS",
    CURRENT = "CURRENT",
    CASH_CREDIT = "CASH_CREDIT",
    OVERDRAFT = "OVERDRAFT",
    FIXED_DEPOSIT = "FIXED_DEPOSIT",
    OTHER = "OTHER"
}
export declare class BankAccount {
    id: string;
    accountCode: string;
    accountName: string;
    accountType: BankAccountType;
    bankName: string;
    branchName: string;
    accountNumber: string;
    ifscCode: string;
    swiftCode: string;
    micrCode: string;
    currency: string;
    glAccountId: string;
    openingBalance: number;
    currentBalance: number;
    overdraftLimit: number;
    interestRate: number;
    contactPerson: string;
    contactPhone: string;
    contactEmail: string;
    address: string;
    isPrimary: boolean;
    isActive: boolean;
    lastReconciledDate: Date;
    lastReconciledBalance: number;
    notes: string;
    createdAt: Date;
    updatedAt: Date;
    glAccount: ChartOfAccounts;
    get availableBalance(): number;
}
