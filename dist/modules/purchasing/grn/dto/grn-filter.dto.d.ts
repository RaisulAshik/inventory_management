import { GRNStatus } from '@common/enums';
export declare class GrnFilterDto {
    status?: GRNStatus;
    supplierId?: string;
    warehouseId?: string;
    purchaseOrderId?: string;
    fromDate?: string;
    toDate?: string;
}
