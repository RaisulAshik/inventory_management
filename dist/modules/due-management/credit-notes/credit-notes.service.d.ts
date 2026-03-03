import { TenantConnectionManager } from '@database/tenant-connection.manager';
import { PaginatedResult } from '@common/interfaces';
import { CreditNote } from '@entities/tenant';
import { CustomerDuesService } from '../customer-dues/customer-dues.service';
import { CreateCreditNoteDto, CreditNoteFilterDto, ApplyToDueDto } from './dto/credit-note.dto';
export declare class CreditNotesService {
    private readonly tenantConnectionManager;
    private readonly duesService;
    constructor(tenantConnectionManager: TenantConnectionManager, duesService: CustomerDuesService);
    private getRepo;
    private getDataSource;
    create(dto: CreateCreditNoteDto, userId: string): Promise<CreditNote>;
    findAll(filterDto: CreditNoteFilterDto): Promise<PaginatedResult<CreditNote>>;
    findById(id: string): Promise<CreditNote>;
    findByCustomer(customerId: string): Promise<CreditNote[]>;
    findUsableByCustomer(customerId: string): Promise<CreditNote[]>;
    submitForApproval(id: string, userId: string): Promise<CreditNote>;
    approve(id: string, userId: string): Promise<CreditNote>;
    applyToDue(id: string, dto: ApplyToDueDto, userId: string): Promise<CreditNote>;
    cancel(id: string, userId: string): Promise<CreditNote>;
    markExpired(): Promise<number>;
}
