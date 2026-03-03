import { PurchaseReturnStatus, PurchaseReturn } from '@entities/tenant';
declare class PurchaseReturnItemDto {
    id: string;
    productId: string;
    productName?: string;
    variantId?: string;
    quantity: number;
    unitPrice: number;
    taxAmount: number;
    lineTotal: number;
    reason?: string;
    condition: string;
}
export declare class PurchaseReturnResponseDto {
    id: string;
    returnNumber: string;
    purchaseOrderId?: string;
    poNumber?: string;
    grnId?: string;
    grnNumber?: string;
    supplierId: string;
    supplierName?: string;
    warehouseId: string;
    warehouseName?: string;
    returnDate: Date;
    status: PurchaseReturnStatus;
    returnType: string;
    reason: string;
    reasonDetails?: string;
    currency: string;
    subtotal: number;
    taxAmount: number;
    totalAmount: number;
    trackingNumber?: string;
    creditNoteNumber?: string;
    creditNoteAmount?: number;
    creditNoteDate?: Date;
    approvedAt?: Date;
    shippedAt?: Date;
    receivedBySupplierAt?: Date;
    rejectionReason?: string;
    items?: PurchaseReturnItemDto[];
    itemCount: number;
    totalQuantity: number;
    createdAt: Date;
    updatedAt: Date;
    constructor(purchaseReturn: PurchaseReturn);
}
export {};
