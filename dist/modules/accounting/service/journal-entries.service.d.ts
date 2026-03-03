import { JournalEntry } from '@/entities/tenant';
import { CreateJournalEntryDto, ReverseJournalEntryDto, QueryJournalEntryDto, UpdateJournalEntryDto } from '../dto/journal-entries.dto';
import { GeneralLedgerService } from './journal-ledger.service';
import { TenantConnectionManager } from '@database/tenant-connection.manager';
export declare class JournalEntriesService {
    private readonly tenantConnectionManager;
    private readonly glService;
    constructor(tenantConnectionManager: TenantConnectionManager, glService: GeneralLedgerService);
    private getJeRepo;
    private getLineRepo;
    private getPeriodRepo;
    private getAccountRepo;
    create(dto: CreateJournalEntryDto, userId?: string): Promise<JournalEntry>;
    post(id: string, userId: string): Promise<JournalEntry>;
    reverse(id: string, dto: ReverseJournalEntryDto, userId: string): Promise<JournalEntry>;
    findAll(query: QueryJournalEntryDto): Promise<{
        data: JournalEntry[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string): Promise<JournalEntry>;
    update(id: string, dto: UpdateJournalEntryDto): Promise<JournalEntry>;
    remove(id: string): Promise<void>;
    private validateBalance;
    private generateEntryNumber;
}
