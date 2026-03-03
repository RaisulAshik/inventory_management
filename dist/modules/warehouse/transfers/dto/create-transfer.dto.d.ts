import { TransferType } from '@entities/tenant';
import { CreateTransferItemDto } from './create-transfer-item.dto';
export declare class CreateTransferDto {
    fromWarehouseId: string;
    toWarehouseId: string;
    transferType?: TransferType;
    transferDate?: Date;
    expectedDeliveryDate?: Date;
    reason?: string;
    notes?: string;
    items?: CreateTransferItemDto[];
}
