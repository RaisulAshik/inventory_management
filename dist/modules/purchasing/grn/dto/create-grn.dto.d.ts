declare class CreateGrnItemDto {
    productId: string;
    variantId?: string;
    receivedQuantity: number;
    rejectedQuantity?: number;
    unitPrice?: number;
    taxAmount?: number;
    batchNumber?: string;
    manufacturingDate?: Date;
    expiryDate?: Date;
    locationId?: string;
    rejectionReason?: string;
    notes?: string;
}
export declare class CreateGrnDto {
    purchaseOrderId: string;
    warehouseId?: string;
    receiptDate?: Date;
    supplierInvoiceNumber?: string;
    supplierInvoiceDate?: Date;
    notes?: string;
    items: CreateGrnItemDto[];
}
export {};
