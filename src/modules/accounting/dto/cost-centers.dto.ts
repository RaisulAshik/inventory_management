import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsUUID,
  MaxLength,
  IsNumber,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';

export class CreateCostCenterDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  costCenterCode: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  costCenterName: string;

  @IsUUID()
  @IsOptional()
  parentId?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsUUID()
  @IsOptional()
  managerId?: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  budget?: number;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

export class UpdateCostCenterDto extends PartialType(CreateCostCenterDto) {}

export class QueryCostCenterDto {
  @IsOptional()
  @IsUUID()
  parentId?: string;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isActive?: boolean;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  limit?: number;
}
