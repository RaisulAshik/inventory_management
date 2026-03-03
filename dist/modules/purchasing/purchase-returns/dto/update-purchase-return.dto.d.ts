import { CreatePurchaseReturnDto } from './create-purchase-return.dto';
declare const UpdatePurchaseReturnDto_base: import("@nestjs/common").Type<Partial<Omit<CreatePurchaseReturnDto, "purchaseOrderId" | "items" | "grnId">>>;
export declare class UpdatePurchaseReturnDto extends UpdatePurchaseReturnDto_base {
}
export {};
