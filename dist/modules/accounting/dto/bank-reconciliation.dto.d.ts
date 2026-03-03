import { ReconciliationStatus } from '@/entities/tenant';
export declare class CreateBankReconciliationDto {
    bankAccountId: string;
    statementDate: string;
    statementStartDate: string;
    statementEndDate: string;
    openingBalanceBook: number;
    closingBalanceBook: number;
    openingBalanceBank: number;
    closingBalanceBank: number;
    notes?: string;
}
declare const UpdateBankReconciliationDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateBankReconciliationDto>>;
export declare class UpdateBankReconciliationDto extends UpdateBankReconciliationDto_base {
    totalDepositsBook?: number;
    totalWithdrawalsBook?: number;
    totalDepositsBank?: number;
    totalWithdrawalsBank?: number;
    depositsInTransit?: number;
    outstandingCheques?: number;
    bankErrors?: number;
    bookErrors?: number;
}
export declare class CompleteReconciliationDto {
    reconciledTransactionIds: string[];
    adjustedBalanceBook: number;
    adjustedBalanceBank: number;
    notes?: string;
}
export declare class QueryBankReconciliationDto {
    bankAccountId?: string;
    status?: ReconciliationStatus;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
}
export {};
