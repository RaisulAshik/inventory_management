import { AdjustmentStatus, AdjustmentType } from '@entities/tenant';
export declare class AdjustmentFilterDto {
    status?: AdjustmentStatus;
    adjustmentType?: AdjustmentType;
    warehouseId?: string;
    fromDate?: string;
    toDate?: string;
}
