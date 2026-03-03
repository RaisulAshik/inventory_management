import { JwtPayload } from '@common/interfaces';
import { CreditNotesService } from './credit-notes.service';
import { CreateCreditNoteDto, CreditNoteFilterDto, ApplyToDueDto } from './dto/credit-note.dto';
export declare class CreditNotesController {
    private readonly creditNotesService;
    constructor(creditNotesService: CreditNotesService);
    create(dto: CreateCreditNoteDto, user: JwtPayload): Promise<import("../../../entities/tenant").CreditNote>;
    findAll(filterDto: CreditNoteFilterDto): Promise<import("@common/interfaces").PaginatedResult<import("../../../entities/tenant").CreditNote>>;
    findByCustomer(customerId: string): Promise<import("../../../entities/tenant").CreditNote[]>;
    findUsable(customerId: string): Promise<import("../../../entities/tenant").CreditNote[]>;
    findOne(id: string): Promise<import("../../../entities/tenant").CreditNote>;
    submit(id: string, user: JwtPayload): Promise<import("../../../entities/tenant").CreditNote>;
    approve(id: string, user: JwtPayload): Promise<import("../../../entities/tenant").CreditNote>;
    applyToDue(id: string, dto: ApplyToDueDto, user: JwtPayload): Promise<import("../../../entities/tenant").CreditNote>;
    cancel(id: string, user: JwtPayload): Promise<import("../../../entities/tenant").CreditNote>;
}
