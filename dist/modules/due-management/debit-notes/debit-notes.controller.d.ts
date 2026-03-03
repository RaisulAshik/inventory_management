import { JwtPayload } from '@common/interfaces';
import { DebitNotesService } from './debit-notes.service';
import { CreateDebitNoteDto, AcknowledgeDebitNoteDto, ApplyToSupplierDueDto, DebitNoteFilterDto } from './dto/debit-note.dto';
export declare class DebitNotesController {
    private readonly debitNotesService;
    constructor(debitNotesService: DebitNotesService);
    create(dto: CreateDebitNoteDto, user: JwtPayload): Promise<import("../../../entities/tenant").DebitNote>;
    findAll(filterDto: DebitNoteFilterDto): Promise<import("@common/interfaces").PaginatedResult<import("../../../entities/tenant").DebitNote>>;
    findBySupplier(supplierId: string): Promise<import("../../../entities/tenant").DebitNote[]>;
    findOne(id: string): Promise<import("../../../entities/tenant").DebitNote>;
    submit(id: string, user: JwtPayload): Promise<import("../../../entities/tenant").DebitNote>;
    approve(id: string, user: JwtPayload): Promise<import("../../../entities/tenant").DebitNote>;
    send(id: string, user: JwtPayload): Promise<import("../../../entities/tenant").DebitNote>;
    acknowledge(id: string, dto: AcknowledgeDebitNoteDto, user: JwtPayload): Promise<import("../../../entities/tenant").DebitNote>;
    applyToDue(id: string, dto: ApplyToSupplierDueDto, user: JwtPayload): Promise<import("../../../entities/tenant").DebitNote>;
    cancel(id: string, user: JwtPayload): Promise<import("../../../entities/tenant").DebitNote>;
}
