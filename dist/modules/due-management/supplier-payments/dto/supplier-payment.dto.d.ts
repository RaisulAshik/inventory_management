import { PaginationDto } from '@common/dto/pagination.dto';
export declare class PaymentAllocationDto {
    supplierDueId: string;
    amount: number;
    notes?: string;
}
export declare class CreateSupplierPaymentDto {
    supplierId: string;
    paymentMethodId: string;
    bankAccountId?: string;
    amount: number;
    paymentDate: string;
    currency?: string;
    exchangeRate?: number;
    referenceNumber?: string;
    chequeNumber?: string;
    chequeDate?: string;
    bankReference?: string;
    transactionId?: string;
    tdsPercentage?: number;
    tdsAmount?: number;
    notes?: string;
    allocations?: PaymentAllocationDto[];
}
export declare class AllocatePaymentDto {
    allocations: PaymentAllocationDto[];
}
export declare class SupplierPaymentFilterDto extends PaginationDto {
    status?: string;
    supplierId?: string;
    fromDate?: string;
    toDate?: string;
}
