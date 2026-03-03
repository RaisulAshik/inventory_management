import { PaginationDto } from '@common/dto/pagination.dto';
import { QuotationStatus } from '@/entities/tenant';
export declare class QuotationFilterDto extends PaginationDto {
    status?: QuotationStatus;
    customerId?: string;
    warehouseId?: string;
    fromDate?: string;
    toDate?: string;
    sortField?: string;
}
