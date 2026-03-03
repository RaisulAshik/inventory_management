import { CreateTransferDto } from './create-transfer.dto';
declare const UpdateTransferDto_base: import("@nestjs/common").Type<Partial<Omit<CreateTransferDto, "items" | "fromWarehouseId" | "toWarehouseId">>>;
export declare class UpdateTransferDto extends UpdateTransferDto_base {
}
export {};
