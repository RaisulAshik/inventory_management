import { CreateOrderDto } from './create-order.dto';
declare const UpdateOrderDto_base: import("@nestjs/common").Type<Partial<Omit<CreateOrderDto, "items" | "customerId">>>;
export declare class UpdateOrderDto extends UpdateOrderDto_base {
}
export {};
