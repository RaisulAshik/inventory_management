import { PurchaseReturnsService } from './purchase-returns.service';
import { PaginationDto } from '@common/dto/pagination.dto';
import { JwtPayload } from '@common/interfaces';
import { CreatePurchaseReturnDto } from './dto/create-purchase-return.dto';
import { ProcessCreditNoteDto } from './dto/process-credit-note.dto';
import { PurchaseReturnFilterDto } from './dto/purchase-return-filter.dto';
import { PurchaseReturnResponseDto } from './dto/purchase-return-response.dto';
import { UpdatePurchaseReturnDto } from './dto/update-purchase-return.dto';
export declare class PurchaseReturnsController {
    private readonly purchaseReturnsService;
    constructor(purchaseReturnsService: PurchaseReturnsService);
    create(createDto: CreatePurchaseReturnDto, currentUser: JwtPayload): Promise<PurchaseReturnResponseDto>;
    findAll(paginationDto: PaginationDto, filterDto: PurchaseReturnFilterDto): Promise<{
        data: PurchaseReturnResponseDto[];
        meta: import("@common/interfaces").PaginationMeta;
    }>;
    findOne(id: string): Promise<PurchaseReturnResponseDto>;
    update(id: string, updateDto: UpdatePurchaseReturnDto): Promise<PurchaseReturnResponseDto>;
    submitForApproval(id: string): Promise<PurchaseReturnResponseDto>;
    approve(id: string, currentUser: JwtPayload): Promise<PurchaseReturnResponseDto>;
    reject(id: string, reason: string, currentUser: JwtPayload): Promise<PurchaseReturnResponseDto>;
    ship(id: string, trackingNumber: string, currentUser: JwtPayload): Promise<PurchaseReturnResponseDto>;
    confirmReceipt(id: string): Promise<PurchaseReturnResponseDto>;
    processCreditNote(id: string, creditNoteDto: ProcessCreditNoteDto, currentUser: JwtPayload): Promise<PurchaseReturnResponseDto>;
    complete(id: string): Promise<PurchaseReturnResponseDto>;
    cancel(id: string, reason: string, currentUser: JwtPayload): Promise<PurchaseReturnResponseDto>;
    remove(id: string): Promise<void>;
}
