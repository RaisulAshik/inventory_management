import { BankTransactionsService } from './bank-transactions.service';
import { BankReconciliation } from '@/entities/tenant';
import { CreateBankReconciliationDto, QueryBankReconciliationDto, UpdateBankReconciliationDto, CompleteReconciliationDto } from '../dto/bank-reconciliation.dto';
import { TenantConnectionManager } from '@database/tenant-connection.manager';
export declare class BankReconciliationsService {
    private readonly tenantConnectionManager;
    private readonly bankTxnService;
    constructor(tenantConnectionManager: TenantConnectionManager, bankTxnService: BankTransactionsService);
    private getRecRepo;
    private getBankRepo;
    create(dto: CreateBankReconciliationDto, userId?: string): Promise<BankReconciliation>;
    findAll(query: QueryBankReconciliationDto): Promise<{
        data: BankReconciliation[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string): Promise<BankReconciliation>;
    update(id: string, dto: UpdateBankReconciliationDto): Promise<BankReconciliation>;
    startReconciliation(id: string): Promise<BankReconciliation>;
    complete(id: string, dto: CompleteReconciliationDto, userId: string): Promise<BankReconciliation>;
    cancel(id: string): Promise<BankReconciliation>;
    getReconciliationSummary(id: string): Promise<{
        reconciliation: BankReconciliation;
        unreconciledTransactions: import("@/entities/tenant").BankTransaction[];
        summary: {
            unreconciledCount: number;
            unreconciledTotal: number;
        };
    }>;
    private generateReconciliationNumber;
}
