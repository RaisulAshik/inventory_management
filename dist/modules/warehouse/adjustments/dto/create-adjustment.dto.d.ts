import { AdjustmentType } from '@entities/tenant';
import { CreateAdjustmentItemDto } from './create-adjustment-item.dto';
export declare class CreateAdjustmentDto {
    warehouseId: string;
    adjustmentType: AdjustmentType;
    adjustmentDate?: Date;
    reason: string;
    notes?: string;
    items?: CreateAdjustmentItemDto[];
}
