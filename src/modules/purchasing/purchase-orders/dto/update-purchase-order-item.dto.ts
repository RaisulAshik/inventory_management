import { PartialType, OmitType } from '@nestjs/swagger';
import { CreatePurchaseOrderItemDto } from './create-purchase-order.dto';

export class UpdatePurchaseOrderItemDto extends PartialType(
  OmitType(CreatePurchaseOrderItemDto, ['productId', 'variantId'] as const),
) {}
