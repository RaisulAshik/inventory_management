import { TransferStatus } from '@entities/tenant';
export declare class TransferFilterDto {
    status?: TransferStatus;
    fromWarehouseId?: string;
    toWarehouseId?: string;
    fromDate?: string;
    toDate?: string;
}
