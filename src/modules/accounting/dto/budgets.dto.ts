import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsUUID,
  MaxLength,
  IsNumber,
  IsArray,
  ValidateNested,
  IsDateString,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { BudgetType, BudgetStatus } from '@/entities/tenant';

export class CreateBudgetLineDto {
  @IsUUID()
  accountId: string;

  @IsUUID()
  @IsOptional()
  fiscalPeriodId?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsNumber()
  @Type(() => Number)
  budgetAmount: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  januaryAmount?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  februaryAmount?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  marchAmount?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  aprilAmount?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  mayAmount?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  juneAmount?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  julyAmount?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  augustAmount?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  septemberAmount?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  octoberAmount?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  novemberAmount?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  decemberAmount?: number;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class CreateBudgetDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  budgetCode: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  budgetName: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(BudgetType)
  @IsOptional()
  budgetType?: BudgetType;

  @IsUUID()
  fiscalYearId: string;

  @IsUUID()
  @IsOptional()
  costCenterId?: string;

  @IsString()
  @IsOptional()
  @MaxLength(3)
  currency?: string;

  @IsNumber()
  @Type(() => Number)
  totalBudgetAmount: number;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsBoolean()
  @IsOptional()
  allowOverBudget?: boolean;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  overBudgetTolerancePercentage?: number;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateBudgetLineDto)
  lines?: CreateBudgetLineDto[];
}

export class UpdateBudgetDto extends PartialType(CreateBudgetDto) {}

export class UpdateBudgetLineDto extends PartialType(CreateBudgetLineDto) {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  revisedAmount?: number;
}

export class ApproveBudgetDto {
  @IsString()
  @IsOptional()
  notes?: string;
}

export class QueryBudgetDto {
  @IsOptional()
  @IsEnum(BudgetType)
  budgetType?: BudgetType;

  @IsOptional()
  @IsEnum(BudgetStatus)
  status?: BudgetStatus;

  @IsOptional()
  @IsUUID()
  fiscalYearId?: string;

  @IsOptional()
  @IsUUID()
  costCenterId?: string;

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
