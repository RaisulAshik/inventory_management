import { PurchaseReturnStatus } from '@entities/tenant';
export declare class PurchaseReturnFilterDto {
    status?: PurchaseReturnStatus;
    supplierId?: string;
    warehouseId?: string;
    fromDate?: string;
    toDate?: string;
}
