import { PaginationDto } from '@common/dto/pagination.dto';
import { DueStatus } from '@common/enums';
export declare class CreateSupplierOpeningBalanceDto {
    supplierId: string;
    originalAmount: number;
    dueDate: string;
    referenceNumber?: string;
    billNumber?: string;
    billDate?: string;
    currency?: string;
    notes?: string;
}
export declare class AdjustSupplierDueDto {
    amount: number;
    reason?: string;
}
export declare class SupplierDueFilterDto extends PaginationDto {
    status?: DueStatus;
    supplierId?: string;
    overdueOnly?: boolean;
    fromDate?: string;
    toDate?: string;
}
