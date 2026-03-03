import { CreateGrnDto } from './create-grn.dto';
declare const UpdateGrnDto_base: import("@nestjs/common").Type<Partial<Omit<CreateGrnDto, "purchaseOrderId" | "items">>>;
export declare class UpdateGrnDto extends UpdateGrnDto_base {
}
export {};
