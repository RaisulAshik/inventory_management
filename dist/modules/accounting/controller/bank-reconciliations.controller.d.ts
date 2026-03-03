import { CreateBankReconciliationDto, QueryBankReconciliationDto, UpdateBankReconciliationDto, CompleteReconciliationDto } from '../dto/bank-reconciliation.dto';
import { BankReconciliationsService } from '../service/bank-reconciliation.service';
import { JwtPayload } from '@/common/interfaces';
export declare class BankReconciliationsController {
    private readonly reconciliationsService;
    constructor(reconciliationsService: BankReconciliationsService);
    create(dto: CreateBankReconciliationDto, currentUser: JwtPayload): Promise<import("../../../entities/tenant").BankReconciliation>;
    findAll(query: QueryBankReconciliationDto): Promise<{
        data: import("../../../entities/tenant").BankReconciliation[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string): Promise<import("../../../entities/tenant").BankReconciliation>;
    getSummary(id: string): Promise<{
        reconciliation: import("../../../entities/tenant").BankReconciliation;
        unreconciledTransactions: import("../../../entities/tenant").BankTransaction[];
        summary: {
            unreconciledCount: number;
            unreconciledTotal: number;
        };
    }>;
    update(id: string, dto: UpdateBankReconciliationDto): Promise<import("../../../entities/tenant").BankReconciliation>;
    start(id: string): Promise<import("../../../entities/tenant").BankReconciliation>;
    complete(id: string, dto: CompleteReconciliationDto, currentUser: JwtPayload): Promise<import("../../../entities/tenant").BankReconciliation>;
    cancel(id: string): Promise<import("../../../entities/tenant").BankReconciliation>;
}
