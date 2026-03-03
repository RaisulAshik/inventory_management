import { PartialType, OmitType } from '@nestjs/swagger';
import { CreatePurchaseReturnDto } from './create-purchase-return.dto';

export class UpdatePurchaseReturnDto extends PartialType(
  OmitType(CreatePurchaseReturnDto, [
    'items',
    'purchaseOrderId',
    'grnId',
  ] as const),
) {}
