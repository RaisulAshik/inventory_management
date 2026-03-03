import { TenantConnectionManager } from '@database/tenant-connection.manager';
import { PaginationDto } from '@common/dto/pagination.dto';
import { PaginatedResult } from '@common/interfaces';
import { PurchaseReturn } from '@entities/tenant';
import { CreatePurchaseReturnDto } from './dto/create-purchase-return.dto';
import { PurchaseReturnFilterDto } from './dto/purchase-return-filter.dto';
import { UpdatePurchaseReturnDto } from './dto/update-purchase-return.dto';
export declare class PurchaseReturnsService {
    private readonly tenantConnectionManager;
    constructor(tenantConnectionManager: TenantConnectionManager);
    private getPurchaseReturnRepository;
    create(createDto: CreatePurchaseReturnDto, createdBy: string): Promise<PurchaseReturn>;
    private validateReturnItemsAgainstGrn;
    private validateReturnItemsAgainstPo;
    private calculateReturnTotals;
    private createReturnItems;
    findAll(paginationDto: PaginationDto, filterDto: PurchaseReturnFilterDto): Promise<PaginatedResult<PurchaseReturn>>;
    findById(id: string): Promise<PurchaseReturn>;
    update(id: string, updateDto: UpdatePurchaseReturnDto): Promise<PurchaseReturn>;
    submitForApproval(id: string): Promise<PurchaseReturn>;
    approve(id: string, approvedBy: string): Promise<PurchaseReturn>;
    ship(id: string, shippedBy: string, trackingNumber?: string): Promise<PurchaseReturn>;
    confirmReceipt(id: string): Promise<PurchaseReturn>;
    processCreditNote(id: string, creditNoteNumber: string, creditAmount: number, processedBy: string): Promise<PurchaseReturn>;
    complete(id: string): Promise<PurchaseReturn>;
    reject(id: string, rejectedBy: string, reason: string): Promise<PurchaseReturn>;
    cancel(id: string, cancelledBy: string, reason: string): Promise<PurchaseReturn>;
    remove(id: string): Promise<void>;
}
