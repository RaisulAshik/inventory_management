import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateGrnDto } from './create-grn.dto';

export class UpdateGrnDto extends PartialType(
  OmitType(CreateGrnDto, ['items', 'purchaseOrderId'] as const),
) {}
