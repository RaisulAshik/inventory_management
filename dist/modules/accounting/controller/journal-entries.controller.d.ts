import { CreateJournalEntryDto, QueryJournalEntryDto, UpdateJournalEntryDto, ReverseJournalEntryDto } from '../dto/journal-entries.dto';
import { JournalEntriesService } from '../service/journal-entries.service';
import { JwtPayload } from '@/common/interfaces';
export declare class JournalEntriesController {
    private readonly journalEntriesService;
    constructor(journalEntriesService: JournalEntriesService);
    create(dto: CreateJournalEntryDto, currentUser: JwtPayload): Promise<import("../../../entities/tenant").JournalEntry>;
    findAll(query: QueryJournalEntryDto): Promise<{
        data: import("../../../entities/tenant").JournalEntry[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string): Promise<import("../../../entities/tenant").JournalEntry>;
    update(id: string, dto: UpdateJournalEntryDto): Promise<import("../../../entities/tenant").JournalEntry>;
    post(id: string, currentUser: JwtPayload): Promise<import("../../../entities/tenant").JournalEntry>;
    reverse(id: string, dto: ReverseJournalEntryDto, currentUser: JwtPayload): Promise<import("../../../entities/tenant").JournalEntry>;
    remove(id: string): Promise<void>;
}
