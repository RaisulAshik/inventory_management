import { GRNStatus } from '@common/enums';
import { GoodsReceivedNote } from '@entities/tenant';
declare class GrnItemDto {
    id: string;
    productId: string;
    productName?: string;
    variantId?: string;
    receivedQuantity: number;
    acceptedQuantity: number;
    rejectedQuantity: number;
    unitPrice: number;
    taxAmount: number;
    lineTotal: number;
    batchNumber?: string;
    expiryDate?: Date;
    locationId?: string;
    rejectionReason?: string;
}
export declare class GrnResponseDto {
    id: string;
    grnNumber: string;
    purchaseOrderId: string;
    poNumber?: string;
    supplierId: string;
    supplierName?: string;
    warehouseId: string;
    warehouseName?: string;
    receiptDate: Date;
    status: GRNStatus;
    supplierInvoiceNumber?: string;
    supplierInvoiceDate?: Date;
    currency: string;
    subtotal: number;
    taxAmount: number;
    totalAmount: number;
    approvedAt?: Date;
    qcCompletedAt?: Date;
    notes?: string;
    items?: GrnItemDto[];
    itemCount: number;
    totalReceivedQuantity: number;
    totalAcceptedQuantity: number;
    totalRejectedQuantity: number;
    createdAt: Date;
    updatedAt: Date;
    constructor(grn: GoodsReceivedNote);
}
export {};
