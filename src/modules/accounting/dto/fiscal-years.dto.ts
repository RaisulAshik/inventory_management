import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  MaxLength,
  IsDateString,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';

export class CreateFiscalYearDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  yearCode: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  yearName: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsBoolean()
  @IsOptional()
  isCurrent?: boolean;
}

export class UpdateFiscalYearDto extends PartialType(CreateFiscalYearDto) {}

export class CloseFiscalYearDto {
  @IsString()
  @IsOptional()
  retainedEarningsAccountId?: string;
}

export class QueryFiscalYearDto {
  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isCurrent?: boolean;

  @IsOptional()
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  limit?: number;
}
