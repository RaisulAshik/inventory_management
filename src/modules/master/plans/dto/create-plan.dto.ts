import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsEnum,
  IsArray,
  ValidateNested,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { BillingCycle } from '@common/enums';

class CreatePlanFeatureDto {
  @ApiProperty({ example: 'MULTI_WAREHOUSE' })
  @IsString()
  @IsNotEmpty()
  featureCode: string;

  @ApiProperty({ example: 'Multi-Warehouse Support' })
  @IsString()
  @IsNotEmpty()
  featureName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ default: true })
  @IsBoolean()
  isEnabled: boolean;
}

export class CreatePlanDto {
  @ApiProperty({ example: 'STARTER' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  planCode: string;

  @ApiProperty({ example: 'Starter Plan' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  planName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ example: 999 })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiPropertyOptional({ example: 'INR', default: 'BDT' })
  @IsOptional()
  @IsString()
  @MaxLength(3)
  currency?: string;

  @ApiProperty({ enum: BillingCycle, default: BillingCycle.MONTHLY })
  @IsEnum(BillingCycle)
  billingCycle: BillingCycle;

  @ApiPropertyOptional({ example: 14 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  trialDays?: number;

  @ApiPropertyOptional({ example: 5 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  maxUsers?: number;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  maxWarehouses?: number;

  @ApiPropertyOptional({ example: 1000 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  maxProducts?: number;

  @ApiPropertyOptional({ example: 500 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  maxOrders?: number;

  @ApiPropertyOptional({ example: 5 })
  @IsOptional()
  @IsNumber()
  @Min(0.1)
  storageGb?: number;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  displayOrder?: number;

  @ApiPropertyOptional({ type: [CreatePlanFeatureDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreatePlanFeatureDto)
  features?: CreatePlanFeatureDto[];
}
