import { SalesReturn, SalesReturnStatus, SalesReturnReason, RefundType } from '@entities/tenant/eCommerce/sales-return.entity';
declare class ReturnItemDto {
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
    isRestocked: boolean;
    restockedQuantity: number;
}
export declare class ReturnResponseDto {
    id: string;
    returnNumber: string;
    salesOrderId: string;
    orderNumber?: string;
    customerId: string;
    customerName?: string;
    refundType: RefundType;
    returnDate: Date;
    status: SalesReturnStatus;
    returnReason: SalesReturnReason;
    reasonDetails?: string;
    subtotal: number;
    taxAmount: number;
    restockingFee: number;
    shippingFeeDeduction: number;
    totalAmount: number;
    refundAmount: number;
    inspectionNotes?: string;
    approvedAt?: Date;
    receivedDate?: Date;
    refundedAt?: Date;
    items?: ReturnItemDto[];
    itemCount: number;
    createdAt: Date;
    updatedAt: Date;
    constructor(salesReturn: SalesReturn);
}
export {};
