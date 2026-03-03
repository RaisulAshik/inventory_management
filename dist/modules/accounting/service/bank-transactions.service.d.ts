import { BankTransaction } from '@/entities/tenant';
import { CreateBankTransactionDto, QueryBankTransactionDto, UpdateBankTransactionDto, ReconcileTransactionsDto } from '../dto/bank-transactions.dto';
import { TenantConnectionManager } from '@database/tenant-connection.manager';
export declare class BankTransactionsService {
    private readonly tenantConnectionManager;
    constructor(tenantConnectionManager: TenantConnectionManager);
    private readonly DEBIT_TYPES;
    private getTxnRepo;
    private getBankRepo;
    create(dto: CreateBankTransactionDto, userId?: string): Promise<BankTransaction>;
    findAll(query: QueryBankTransactionDto): Promise<{
        data: BankTransaction[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string): Promise<BankTransaction>;
    update(id: string, dto: UpdateBankTransactionDto): Promise<BankTransaction>;
    clearTransaction(id: string): Promise<BankTransaction>;
    bounceTransaction(id: string): Promise<BankTransaction>;
    reconcileTransactions(dto: ReconcileTransactionsDto): Promise<void>;
    getUnreconciledTransactions(bankAccountId: string): Promise<BankTransaction[]>;
    remove(id: string): Promise<void>;
    private generateTransactionNumber;
}
