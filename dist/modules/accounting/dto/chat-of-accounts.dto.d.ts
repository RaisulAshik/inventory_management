import { AccountType, NormalBalance } from '@common/enums';
export declare class CreateChartOfAccountDto {
    accountCode: string;
    accountName: string;
    accountType: AccountType;
    accountSubtype?: string;
    parentId?: string;
    normalBalance: NormalBalance;
    isHeader?: boolean;
    isSystem?: boolean;
    isActive?: boolean;
    isBankAccount?: boolean;
    isCashAccount?: boolean;
    isReceivable?: boolean;
    isPayable?: boolean;
    currency?: string;
    openingBalanceDebit?: number;
    openingBalanceCredit?: number;
    description?: string;
}
declare const UpdateChartOfAccountDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateChartOfAccountDto>>;
export declare class UpdateChartOfAccountDto extends UpdateChartOfAccountDto_base {
}
export declare class QueryChartOfAccountDto {
    accountType?: AccountType;
    parentId?: string;
    isActive?: boolean;
    isHeader?: boolean;
    isBankAccount?: boolean;
    search?: string;
    page?: number;
    limit?: number;
}
export {};
