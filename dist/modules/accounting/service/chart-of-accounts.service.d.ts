import { ChartOfAccounts } from '@/entities/tenant';
import { CreateChartOfAccountDto, QueryChartOfAccountDto, UpdateChartOfAccountDto } from '../dto/chat-of-accounts.dto';
import { TenantConnectionManager } from '@database/tenant-connection.manager';
export declare class ChartOfAccountsService {
    private readonly tenantConnectionManager;
    constructor(tenantConnectionManager: TenantConnectionManager);
    private getRepo;
    create(dto: CreateChartOfAccountDto, userId?: string): Promise<ChartOfAccounts>;
    findAll(query: QueryChartOfAccountDto): Promise<{
        data: ChartOfAccounts[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string): Promise<ChartOfAccounts>;
    findByCode(code: string): Promise<ChartOfAccounts>;
    update(id: string, dto: UpdateChartOfAccountDto): Promise<ChartOfAccounts>;
    private validateNoCircularReference;
    remove(id: string): Promise<void>;
    getTree(): Promise<ChartOfAccounts[]>;
    updateBalance(accountId: string, debitAmount: number, creditAmount: number): Promise<void>;
}
