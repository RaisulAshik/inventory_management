import { Budget, BudgetLine } from '@/entities/tenant';
import { CreateBudgetDto, QueryBudgetDto, UpdateBudgetDto, CreateBudgetLineDto, UpdateBudgetLineDto, ApproveBudgetDto } from '../dto/budgets.dto';
import { TenantConnectionManager } from '@database/tenant-connection.manager';
export declare class BudgetsService {
    private readonly tenantConnectionManager;
    constructor(tenantConnectionManager: TenantConnectionManager);
    private getBudgetRepo;
    private getBudgetLineRepo;
    create(dto: CreateBudgetDto, userId?: string): Promise<Budget>;
    findAll(query: QueryBudgetDto): Promise<{
        data: Budget[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string): Promise<Budget>;
    update(id: string, dto: UpdateBudgetDto): Promise<Budget>;
    addLine(budgetId: string, dto: CreateBudgetLineDto): Promise<BudgetLine>;
    updateLine(lineId: string, dto: UpdateBudgetLineDto): Promise<BudgetLine>;
    removeLine(lineId: string): Promise<void>;
    submitForApproval(id: string): Promise<Budget>;
    approve(id: string, dto: ApproveBudgetDto, userId: string): Promise<Budget>;
    reject(id: string, dto: ApproveBudgetDto, _userId: string): Promise<Budget>;
    activate(id: string): Promise<Budget>;
    close(id: string): Promise<Budget>;
    getBudgetVsActual(id: string): Promise<{
        budget: {
            id: string;
            budgetCode: string;
            budgetName: string;
            totalBudgetAmount: number;
            allocatedAmount: number;
            utilizedAmount: number;
            committedAmount: number;
            availableAmount: number;
            utilizationPercentage: number;
            isOverBudget: boolean;
        };
        lines: {
            accountId: string;
            accountCode: string;
            accountName: string;
            budgetAmount: number;
            revisedAmount: number | null;
            effectiveBudget: number;
            utilizedAmount: number;
            committedAmount: number;
            availableAmount: number;
            variance: number;
            variancePercentage: number;
            monthlyBreakdown: {
                january: number;
                february: number;
                march: number;
                april: number;
                may: number;
                june: number;
                july: number;
                august: number;
                september: number;
                october: number;
                november: number;
                december: number;
            };
        }[];
    }>;
    remove(id: string): Promise<void>;
}
