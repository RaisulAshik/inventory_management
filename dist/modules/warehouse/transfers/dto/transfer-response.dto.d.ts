import { TransferType, TransferStatus, WarehouseTransfer } from '@entities/tenant';
declare class TransferItemDto {
    id: string;
    productId: string;
    productName?: string;
    productSku?: string;
    variantId?: string;
    variantName?: string;
    quantityRequested: number;
    quantityShipped: number;
    quantityReceived: number;
    quantityDamaged: number;
    fromLocationId?: string;
    toLocationId?: string;
}
export declare class TransferResponseDto {
    id: string;
    transferNumber: string;
    transferType: TransferType;
    fromWarehouseId: string;
    fromWarehouseName?: string;
    toWarehouseId: string;
    toWarehouseName?: string;
    status: TransferStatus;
    transferDate?: Date;
    expectedDeliveryDate?: Date;
    trackingNumber?: string;
    reason?: string;
    notes?: string;
    approvedBy?: string;
    approvedAt?: Date;
    shippedBy?: string;
    shippedAt?: Date;
    receivedBy?: string;
    receivedAt?: Date;
    items?: TransferItemDto[];
    createdAt: Date;
    updatedAt: Date;
    constructor(transfer: WarehouseTransfer);
}
export {};
