import { CreateAdjustmentDto } from './create-adjustment.dto';
declare const UpdateAdjustmentDto_base: import("@nestjs/common").Type<Partial<Omit<CreateAdjustmentDto, "warehouseId" | "items">>>;
export declare class UpdateAdjustmentDto extends UpdateAdjustmentDto_base {
}
export {};
