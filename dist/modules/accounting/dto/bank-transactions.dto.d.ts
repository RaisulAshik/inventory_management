import { BankTransactionType, BankTransactionStatus } from '@/entities/tenant';
export declare class CreateBankTransactionDto {
    bankAccountId: string;
    transactionDate: string;
    valueDate?: string;
    transactionType: BankTransactionType;
    amount: number;
    currency?: string;
    description: string;
    referenceNumber?: string;
    chequeNumber?: string;
    chequeDate?: string;
    payeePayerName?: string;
    bankReference?: string;
    journalEntryId?: string;
    notes?: string;
}
declare const UpdateBankTransactionDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateBankTransactionDto>>;
export declare class UpdateBankTransactionDto extends UpdateBankTransactionDto_base {
    status?: BankTransactionStatus;
}
export declare class QueryBankTransactionDto {
    bankAccountId?: string;
    transactionType?: BankTransactionType;
    status?: BankTransactionStatus;
    startDate?: string;
    endDate?: string;
    minAmount?: number;
    maxAmount?: number;
    search?: string;
    page?: number;
    limit?: number;
}
export declare class ReconcileTransactionsDto {
    transactionIds: string[];
    reconciliationId?: string;
}
export {};
