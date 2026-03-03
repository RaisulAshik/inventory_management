import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateAdjustmentDto } from './create-adjustment.dto';

export class UpdateAdjustmentDto extends PartialType(
  OmitType(CreateAdjustmentDto, ['items', 'warehouseId'] as const),
) {}
