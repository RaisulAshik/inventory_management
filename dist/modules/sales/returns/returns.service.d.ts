import { TenantConnectionManager } from '@database/tenant-connection.manager';
import { SalesReturn } from '@entities/tenant/eCommerce/sales-return.entity';
import { PaginationDto } from '@common/dto/pagination.dto';
import { PaginatedResult } from '@common/interfaces';
import { CreateReturnDto } from './dto/create-return.dto';
import { ReturnFilterDto } from './dto/return-filter.dto';
import { UpdateReturnDto } from './dto/update-return.dto';
export declare class ReturnsService {
    private readonly tenantConnectionManager;
    constructor(tenantConnectionManager: TenantConnectionManager);
    private getReturnRepository;
    create(createReturnDto: CreateReturnDto, createdBy: string): Promise<SalesReturn>;
    private validateReturnItems;
    private calculateReturnTotals;
    private createReturnItems;
    findAll(paginationDto: PaginationDto, filterDto: ReturnFilterDto): Promise<PaginatedResult<SalesReturn>>;
    findById(id: string): Promise<SalesReturn>;
    update(id: string, updateReturnDto: UpdateReturnDto): Promise<SalesReturn>;
    approve(id: string, approvedBy: string): Promise<SalesReturn>;
    receive(id: string, receivedBy: string): Promise<SalesReturn>;
    processRefund(id: string, refundAmount: number, processedBy: string): Promise<SalesReturn>;
    complete(id: string): Promise<SalesReturn>;
    reject(id: string, rejectedBy: string, reason: string): Promise<SalesReturn>;
    cancel(id: string, cancelledBy: string, reason: string): Promise<SalesReturn>;
    remove(id: string): Promise<void>;
}
