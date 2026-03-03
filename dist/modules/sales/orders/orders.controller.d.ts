import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderFilterDto } from './dto/order-filter.dto';
import { AddPaymentDto } from './dto/add-payment.dto';
import { ShipOrderDto } from './dto/ship-order.dto';
import { OrderResponseDto } from './dto/order-response.dto';
import { JwtPayload } from '@common/interfaces';
export declare class OrdersController {
    private readonly ordersService;
    constructor(ordersService: OrdersService);
    create(createOrderDto: CreateOrderDto, currentUser: JwtPayload): Promise<OrderResponseDto>;
    findAll(filterDto: OrderFilterDto): Promise<{
        data: OrderResponseDto[];
        meta: import("@common/interfaces").PaginationMeta;
    }>;
    getStatistics(fromDate?: string, toDate?: string, warehouseId?: string): Promise<any>;
    findByNumber(orderNumber: string): Promise<{
        data: OrderResponseDto | null;
    }>;
    findOne(id: string): Promise<OrderResponseDto>;
    getPayments(id: string): Promise<{
        data: import("../../../entities/tenant").OrderPayment[];
    }>;
    update(id: string, updateOrderDto: UpdateOrderDto): Promise<OrderResponseDto>;
    confirm(id: string, currentUser: JwtPayload): Promise<OrderResponseDto>;
    process(id: string, currentUser: JwtPayload): Promise<OrderResponseDto>;
    ship(id: string, shipDto: ShipOrderDto, currentUser: JwtPayload): Promise<OrderResponseDto>;
    deliver(id: string, currentUser: JwtPayload): Promise<OrderResponseDto>;
    complete(id: string): Promise<OrderResponseDto>;
    cancel(id: string, reason: string, currentUser: JwtPayload): Promise<OrderResponseDto>;
    addPayment(id: string, paymentDto: AddPaymentDto, currentUser: JwtPayload): Promise<OrderResponseDto>;
    remove(id: string): Promise<void>;
}
