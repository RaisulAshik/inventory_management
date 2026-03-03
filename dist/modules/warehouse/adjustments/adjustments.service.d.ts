import { TenantConnectionManager } from '@database/tenant-connection.manager';
import { PaginationDto } from '@common/dto/pagination.dto';
import { PaginatedResult } from '@common/interfaces';
import { StockAdjustment, StockAdjustmentItem } from '@entities/tenant';
import { AdjustmentFilterDto } from './dto/adjustment-filter.dto';
import { CreateAdjustmentDto } from './dto/create-adjustment.dto';
import { UpdateAdjustmentDto } from './dto/update-adjustment.dto';
export declare class AdjustmentsService {
    private readonly tenantConnectionManager;
    constructor(tenantConnectionManager: TenantConnectionManager);
    private getAdjustmentRepository;
    create(createAdjustmentDto: CreateAdjustmentDto, createdBy: string): Promise<StockAdjustment>;
    private createItems;
    findAll(paginationDto: PaginationDto, filterDto: AdjustmentFilterDto): Promise<PaginatedResult<StockAdjustment>>;
    findById(id: string): Promise<StockAdjustment>;
    update(id: string, updateAdjustmentDto: UpdateAdjustmentDto): Promise<StockAdjustment>;
    submitForApproval(id: string, userId: string): Promise<StockAdjustment>;
    approve(id: string, approvedBy: string): Promise<StockAdjustment>;
    reject(id: string, rejectedBy: string, reason: string): Promise<StockAdjustment>;
    cancel(id: string, cancelledBy: string, reason: string): Promise<StockAdjustment>;
    addItem(adjustmentId: string, itemDto: any): Promise<StockAdjustmentItem>;
    updateItem(itemId: string, itemDto: any): Promise<StockAdjustmentItem>;
    removeItem(itemId: string): Promise<void>;
    remove(id: string): Promise<void>;
}
