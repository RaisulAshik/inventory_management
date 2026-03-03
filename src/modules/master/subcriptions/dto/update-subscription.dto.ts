import { BillingCycle } from '@common/enums';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsBoolean,
  IsNumber,
  Min,
  IsEnum,
  IsUUID,
} from 'class-validator';

export class UpdateSubscriptionDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  quantity?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  autoRenew?: boolean;
}

export class ChangePlanDto {
  @ApiProperty()
  @IsUUID()
  newPlanId: string;

  @ApiPropertyOptional({ enum: BillingCycle })
  @IsEnum(BillingCycle)
  @IsOptional()
  billingCycle?: BillingCycle;
}
