import { TenantConnectionManager } from '@database/tenant-connection.manager';
import { PaginatedResult } from '@common/interfaces';
import { PurchaseOrder } from '@entities/tenant';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import { PurchaseOrderFilterDto } from './dto/purchase-order-filter.dto';
import { UpdatePurchaseOrderDto } from './dto/update-purchase-order.dto';
export declare class PurchaseOrdersService {
    private readonly tenantConnectionManager;
    constructor(tenantConnectionManager: TenantConnectionManager);
    private getPurchaseOrderRepository;
    create(createDto: CreatePurchaseOrderDto, createdBy: string): Promise<PurchaseOrder>;
    private createOrderItems;
    private calculateOrderTotals;
    findAll(filterDto: PurchaseOrderFilterDto): Promise<PaginatedResult<PurchaseOrder>>;
    findById(id: string): Promise<PurchaseOrder>;
    findByNumber(poNumber: string): Promise<PurchaseOrder | null>;
    update(id: string, updateDto: UpdatePurchaseOrderDto): Promise<PurchaseOrder>;
    submitForApproval(id: string, approvalId: string, userId: string): Promise<PurchaseOrder>;
    approve(id: string, approverId: string, approvedBy: string): Promise<PurchaseOrder>;
    reject(id: string, rejectedBy: string, reason: string): Promise<PurchaseOrder>;
    sendToSupplier(id: string, senderId: string, userId: string): Promise<PurchaseOrder>;
    acknowledge(id: string, acknowledgementNumber?: string): Promise<PurchaseOrder>;
    updateReceivedQuantities(id: string): Promise<PurchaseOrder>;
    close(id: string): Promise<PurchaseOrder>;
    cancel(id: string, cancelledBy: string, reason: string): Promise<PurchaseOrder>;
    remove(id: string): Promise<void>;
    getPendingOrdersForSupplier(supplierId: string): Promise<PurchaseOrder[]>;
    getOverdueOrders(): Promise<PurchaseOrder[]>;
}
