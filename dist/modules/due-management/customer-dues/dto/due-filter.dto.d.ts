import { PaginationDto } from '@common/dto/pagination.dto';
import { DueStatus } from '@common/enums';
export declare class DueFilterDto extends PaginationDto {
    status?: DueStatus;
    customerId?: string;
    overdueOnly?: boolean;
    fromDate?: string;
    toDate?: string;
}
