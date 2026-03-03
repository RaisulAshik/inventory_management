import { SalesOrderStatus } from '@common/enums';
import { PaginationDto } from '@/common/dto/pagination.dto';
export declare class OrderFilterDto extends PaginationDto {
    status?: SalesOrderStatus;
    customerId?: string;
    warehouseId?: string;
    fromDate?: string;
    toDate?: string;
    paymentStatus?: 'PAID' | 'UNPAID' | 'PARTIAL';
}
