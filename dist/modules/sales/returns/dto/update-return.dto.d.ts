import { CreateReturnDto } from './create-return.dto';
declare const UpdateReturnDto_base: import("@nestjs/common").Type<Partial<Omit<CreateReturnDto, "items" | "salesOrderId">>>;
export declare class UpdateReturnDto extends UpdateReturnDto_base {
}
export {};
