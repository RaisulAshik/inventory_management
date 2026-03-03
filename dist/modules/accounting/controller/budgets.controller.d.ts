import { CreateBudgetDto, QueryBudgetDto, UpdateBudgetDto, CreateBudgetLineDto, UpdateBudgetLineDto, ApproveBudgetDto } from '../dto/budgets.dto';
import { BudgetsService } from '../service/budgets.service';
import { JwtPayload } from '@/common/interfaces';
export declare class BudgetsController {
    private readonly budgetsService;
    constructor(budgetsService: BudgetsService);
    create(dto: CreateBudgetDto, currentUser: JwtPayload): Promise<import("../../../entities/tenant").Budget>;
    findAll(query: QueryBudgetDto): Promise<{
        data: import("../../../entities/tenant").Budget[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string): Promise<import("../../../entities/tenant").Budget>;
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
    update(id: string, dto: UpdateBudgetDto): Promise<import("../../../entities/tenant").Budget>;
    addLine(id: string, dto: CreateBudgetLineDto): Promise<import("../../../entities/tenant").BudgetLine>;
    updateLine(lineId: string, dto: UpdateBudgetLineDto): Promise<import("../../../entities/tenant").BudgetLine>;
    removeLine(lineId: string): Promise<void>;
    submit(id: string): Promise<import("../../../entities/tenant").Budget>;
    approve(id: string, dto: ApproveBudgetDto, currentUser: JwtPayload): Promise<import("../../../entities/tenant").Budget>;
    reject(id: string, dto: ApproveBudgetDto, currentUser: JwtPayload): Promise<import("../../../entities/tenant").Budget>;
    activate(id: string): Promise<import("../../../entities/tenant").Budget>;
    close(id: string): Promise<import("../../../entities/tenant").Budget>;
    remove(id: string): Promise<void>;
}
