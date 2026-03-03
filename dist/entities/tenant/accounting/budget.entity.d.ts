import { FiscalYear } from './fiscal-year.entity';
import { CostCenter } from './cost-center.entity';
import { BudgetLine } from './budget-line.entity';
export declare enum BudgetType {
    REVENUE = "REVENUE",
    EXPENSE = "EXPENSE",
    CAPITAL = "CAPITAL",
    PROJECT = "PROJECT"
}
export declare enum BudgetStatus {
    DRAFT = "DRAFT",
    PENDING_APPROVAL = "PENDING_APPROVAL",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    ACTIVE = "ACTIVE",
    CLOSED = "CLOSED"
}
export declare class Budget {
    id: string;
    budgetCode: string;
    budgetName: string;
    description: string;
    budgetType: BudgetType;
    fiscalYearId: string;
    costCenterId: string;
    status: BudgetStatus;
    currency: string;
    totalBudgetAmount: number;
    allocatedAmount: number;
    utilizedAmount: number;
    committedAmount: number;
    startDate: Date;
    endDate: Date;
    allowOverBudget: boolean;
    overBudgetTolerancePercentage: number;
    notes: string;
    approvedBy: string;
    approvedAt: Date;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
    fiscalYear: FiscalYear;
    costCenter: CostCenter;
    lines: BudgetLine[];
    get availableAmount(): number;
    get utilizationPercentage(): number;
    get isOverBudget(): boolean;
}
