import { CreatePurchaseOrderDto } from './create-purchase-order.dto';
declare const UpdatePurchaseOrderDto_base: import("@nestjs/common").Type<Partial<Omit<CreatePurchaseOrderDto, "supplierId" | "items">>>;
export declare class UpdatePurchaseOrderDto extends UpdatePurchaseOrderDto_base {
}
export {};
