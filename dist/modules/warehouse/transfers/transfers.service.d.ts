import { TenantConnectionManager } from '@database/tenant-connection.manager';
import { PaginationDto } from '@common/dto/pagination.dto';
import { PaginatedResult } from '@common/interfaces';
import { WarehouseTransfer, WarehouseTransferItem } from '@entities/tenant';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { TransferFilterDto } from './dto/transfer-filter.dto';
import { UpdateTransferDto } from './dto/update-transfer.dto';
export declare class TransfersService {
    private readonly tenantConnectionManager;
    constructor(tenantConnectionManager: TenantConnectionManager);
    private getTransferRepository;
    create(createTransferDto: CreateTransferDto, createdBy: string): Promise<WarehouseTransfer>;
    private createItems;
    findAll(paginationDto: PaginationDto, filterDto: TransferFilterDto): Promise<PaginatedResult<WarehouseTransfer>>;
    findById(id: string): Promise<WarehouseTransfer>;
    update(id: string, updateTransferDto: UpdateTransferDto): Promise<WarehouseTransfer>;
    submitForApproval(id: string, userId: string): Promise<WarehouseTransfer>;
    approve(id: string, approvedBy: string): Promise<WarehouseTransfer>;
    private validateStockAvailability;
    reject(id: string, rejectedBy: string, reason: string): Promise<WarehouseTransfer>;
    ship(id: string, shippedBy: string, trackingNumber?: string): Promise<WarehouseTransfer>;
    receive(id: string, receivedBy: string, receivedItems: {
        itemId: string;
        quantityReceived: number;
        quantityDamaged?: number;
    }[]): Promise<WarehouseTransfer>;
    cancel(id: string, cancelledBy: string, reason: string): Promise<WarehouseTransfer>;
    addItem(transferId: string, itemDto: Partial<WarehouseTransferItem>): Promise<WarehouseTransferItem>;
    updateItem(itemId: string, itemDto: any): Promise<WarehouseTransferItem>;
    removeItem(itemId: string): Promise<void>;
    remove(id: string): Promise<void>;
}
