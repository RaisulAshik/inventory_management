import { SalesReturnStatus, RefundType } from '@entities/tenant/eCommerce/sales-return.entity';
export declare class ReturnFilterDto {
    status?: SalesReturnStatus;
    refundType?: RefundType;
    customerId?: string;
    fromDate?: string;
    toDate?: string;
}
