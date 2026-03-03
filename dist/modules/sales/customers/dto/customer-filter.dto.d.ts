import { CustomerType } from '@common/enums';
import { PaginationDto } from '@/common/dto/pagination.dto';
export declare class CustomerFilterDto extends PaginationDto {
    customerType?: CustomerType;
    customerGroupId?: string;
    isActive?: boolean;
    city?: string;
    state?: string;
}
