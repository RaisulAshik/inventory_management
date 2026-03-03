import { PurchaseOrdersService } from './purchase-orders.service';
import { JwtPayload } from '@common/interfaces';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import { PurchaseOrderFilterDto } from './dto/purchase-order-filter.dto';
import { PurchaseOrderDetailResponseDto, PurchaseOrderResponseDto } from './dto/purchase-order-response.dto';
import { UpdatePurchaseOrderDto } from './dto/update-purchase-order.dto';
export declare class PurchaseOrdersController {
    private readonly purchaseOrdersService;
    constructor(purchaseOrdersService: PurchaseOrdersService);
    create(createDto: CreatePurchaseOrderDto, currentUser: JwtPayload): Promise<PurchaseOrderResponseDto>;
    findAll(filterDto: PurchaseOrderFilterDto): Promise<{
        data: PurchaseOrderResponseDto[];
        meta: import("@common/interfaces").PaginationMeta;
    }>;
    getOverdueOrders(): Promise<{
        data: PurchaseOrderResponseDto[];
    }>;
    getPendingForSupplier(supplierId: string): Promise<{
        data: PurchaseOrderResponseDto[];
    }>;
    findByNumber(poNumber: string): Promise<{
        data: PurchaseOrderResponseDto | null;
    }>;
    findOne(id: string): Promise<PurchaseOrderDetailResponseDto>;
    update(id: string, updateDto: UpdatePurchaseOrderDto): Promise<PurchaseOrderResponseDto>;
    submitForApproval(id: string, approverId: string, currentUser: JwtPayload): Promise<PurchaseOrderResponseDto>;
    approve(id: string, approverId: string, currentUser: JwtPayload): Promise<PurchaseOrderResponseDto>;
    reject(id: string, reason: string, currentUser: JwtPayload): Promise<PurchaseOrderResponseDto>;
    sendToSupplier(id: string, senderId: string, currentUser: JwtPayload): Promise<PurchaseOrderResponseDto>;
    acknowledge(id: string, acknowledgementNumber?: string): Promise<PurchaseOrderResponseDto>;
    close(id: string): Promise<PurchaseOrderResponseDto>;
    cancel(id: string, reason: string, currentUser: JwtPayload): Promise<PurchaseOrderResponseDto>;
    remove(id: string): Promise<void>;
}
