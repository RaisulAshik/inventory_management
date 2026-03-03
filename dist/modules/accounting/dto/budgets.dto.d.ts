import { BudgetType, BudgetStatus } from '@/entities/tenant';
export declare class CreateBudgetLineDto {
    accountId: string;
    fiscalPeriodId?: string;
    description?: string;
    budgetAmount: number;
    januaryAmount?: number;
    februaryAmount?: number;
    marchAmount?: number;
    aprilAmount?: number;
    mayAmount?: number;
    juneAmount?: number;
    julyAmount?: number;
    augustAmount?: number;
    septemberAmount?: number;
    octoberAmount?: number;
    novemberAmount?: number;
    decemberAmount?: number;
    notes?: string;
}
export declare class CreateBudgetDto {
    budgetCode: string;
    budgetName: string;
    description?: string;
    budgetType?: BudgetType;
    fiscalYearId: string;
    costCenterId?: string;
    currency?: string;
    totalBudgetAmount: number;
    startDate: string;
    endDate: string;
    allowOverBudget?: boolean;
    overBudgetTolerancePercentage?: number;
    notes?: string;
    lines?: CreateBudgetLineDto[];
}
declare const UpdateBudgetDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateBudgetDto>>;
export declare class UpdateBudgetDto extends UpdateBudgetDto_base {
}
declare const UpdateBudgetLineDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateBudgetLineDto>>;
export declare class UpdateBudgetLineDto extends UpdateBudgetLineDto_base {
    revisedAmount?: number;
}
export declare class ApproveBudgetDto {
    notes?: string;
}
export declare class QueryBudgetDto {
    budgetType?: BudgetType;
    status?: BudgetStatus;
    fiscalYearId?: string;
    costCenterId?: string;
    search?: string;
    page?: number;
    limit?: number;
}
export {};
