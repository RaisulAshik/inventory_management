import { PaginationDto } from '@/common/dto/pagination.dto';
import { PurchaseOrderStatus } from '@common/enums';
export declare class PurchaseOrderFilterDto extends PaginationDto {
    status?: PurchaseOrderStatus;
    supplierId?: string;
    warehouseId?: string;
    fromDate?: string;
    toDate?: string;
}
