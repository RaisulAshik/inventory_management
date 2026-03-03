import { SalesReturnReason, RefundType } from '@entities/tenant/eCommerce/sales-return.entity';
declare class CreateReturnItemDto {
    productId: string;
    variantId?: string;
    quantity: number;
    reason?: string;
    condition?: string;
}
export declare class CreateReturnDto {
    salesOrderId: string;
    warehouseId?: string;
    refundType: RefundType;
    returnReason: SalesReturnReason;
    returnDate?: Date;
    reasonDetails?: string;
    restockingFeePercent?: number;
    notes?: string;
    items: CreateReturnItemDto[];
}
export {};
