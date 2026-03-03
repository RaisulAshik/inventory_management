import { BankAccount } from '@/entities/tenant';
import { CreateBankAccountDto, QueryBankAccountDto, UpdateBankAccountDto } from '../dto/bank-accounts.dto';
import { TenantConnectionManager } from '@database/tenant-connection.manager';
export declare class BankAccountsService {
    private readonly tenantConnectionManager;
    constructor(tenantConnectionManager: TenantConnectionManager);
    private getRepo;
    create(dto: CreateBankAccountDto): Promise<BankAccount>;
    findAll(query: QueryBankAccountDto): Promise<{
        data: BankAccount[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string): Promise<BankAccount>;
    update(id: string, dto: UpdateBankAccountDto): Promise<BankAccount>;
    updateBalance(id: string, amount: number, isDebit: boolean): Promise<void>;
    remove(id: string): Promise<void>;
}
