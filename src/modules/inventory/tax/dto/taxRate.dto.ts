import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsUUID,
  IsDateString,
  Min,
  Max,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateTaxRateDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  @IsNotEmpty()
  taxCategoryId: string;

  @ApiProperty({ example: 'Sales & Service Tax 6%' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({ example: 6, description: 'Tax rate percentage (0–100)' })
  @IsNumber()
  @Min(0)
  @Max(100)
  @Type(() => Number)
  rate: number;

  @ApiPropertyOptional({ example: 'PERCENTAGE', default: 'PERCENTAGE' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  taxType?: string;

  @ApiPropertyOptional({ example: '2025-01-01' })
  @IsOptional()
  @IsDateString()
  effectiveFrom?: string;

  @ApiPropertyOptional({ example: '2026-12-31' })
  @IsOptional()
  @IsDateString()
  effectiveTo?: string;

  @ApiPropertyOptional({ default: false })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
