import { TenantConnectionManager } from '@database/tenant-connection.manager';
import { PaginatedResult } from '@common/interfaces';
import { DebitNote } from '@entities/tenant';
import { SupplierDuesService } from '../supplier-dues/supplier-dues.service';
import { CreateDebitNoteDto, AcknowledgeDebitNoteDto, ApplyToSupplierDueDto, DebitNoteFilterDto } from './dto/debit-note.dto';
export declare class DebitNotesService {
    private readonly tenantConnectionManager;
    private readonly supplierDuesService;
    constructor(tenantConnectionManager: TenantConnectionManager, supplierDuesService: SupplierDuesService);
    private getRepo;
    private getDataSource;
    create(dto: CreateDebitNoteDto, userId: string): Promise<DebitNote>;
    findAll(filterDto: DebitNoteFilterDto): Promise<PaginatedResult<DebitNote>>;
    findById(id: string): Promise<DebitNote>;
    findBySupplier(supplierId: string): Promise<DebitNote[]>;
    submitForApproval(id: string, userId: string): Promise<DebitNote>;
    approve(id: string, userId: string): Promise<DebitNote>;
    sendToSupplier(id: string, userId: string): Promise<DebitNote>;
    acknowledge(id: string, dto: AcknowledgeDebitNoteDto, userId: string): Promise<DebitNote>;
    applyToDue(id: string, dto: ApplyToSupplierDueDto, userId: string): Promise<DebitNote>;
    cancel(id: string, userId: string): Promise<DebitNote>;
}
