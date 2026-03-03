import { BankAccountType } from '@/entities/tenant';
export declare class CreateBankAccountDto {
    accountCode: string;
    accountName: string;
    accountType?: BankAccountType;
    bankName: string;
    branchName?: string;
    accountNumber: string;
    ifscCode?: string;
    swiftCode?: string;
    micrCode?: string;
    currency?: string;
    glAccountId?: string;
    openingBalance?: number;
    overdraftLimit?: number;
    interestRate?: number;
    contactPerson?: string;
    contactPhone?: string;
    contactEmail?: string;
    address?: string;
    isPrimary?: boolean;
    isActive?: boolean;
    notes?: string;
}
declare const UpdateBankAccountDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateBankAccountDto>>;
export declare class UpdateBankAccountDto extends UpdateBankAccountDto_base {
}
export declare class QueryBankAccountDto {
    accountType?: BankAccountType;
    isActive?: boolean;
    bankName?: string;
    search?: string;
    page?: number;
    limit?: number;
}
export {};
