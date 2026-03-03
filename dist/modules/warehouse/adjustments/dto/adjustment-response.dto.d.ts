import { AdjustmentType, AdjustmentStatus, StockAdjustment } from '@entities/tenant';
declare class AdjustmentItemDto {
    id: string;
    productId: string;
    productName?: string;
    productSku?: string;
    variantId?: string;
    variantName?: string;
    systemQuantity: number;
    physicalQuantity: number;
    adjustmentQuantity: number;
    unitCost?: number;
    valueImpact: number;
    reason?: string;
}
export declare class AdjustmentResponseDto {
    id: string;
    adjustmentNumber: string;
    warehouseId: string;
    warehouseName?: string;
    adjustmentType: AdjustmentType;
    adjustmentDate: Date;
    status: AdjustmentStatus;
    reason: string;
    totalValueImpact: number;
    notes?: string;
    approvedBy?: string;
    approvedAt?: Date;
    items?: AdjustmentItemDto[];
    createdAt: Date;
    updatedAt: Date;
    constructor(adjustment: StockAdjustment);
}
export {};
