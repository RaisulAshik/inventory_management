import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsUUID,
  MaxLength,
  IsNumber,
  IsDateString,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';

export class CreateFiscalPeriodDto {
  @IsUUID()
  fiscalYearId: string;

  @IsNumber()
  periodNumber: number;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  periodName: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;
}

export class UpdateFiscalPeriodDto extends PartialType(CreateFiscalPeriodDto) {}

export class QueryFiscalPeriodDto {
  @IsOptional()
  @IsUUID()
  fiscalYearId?: string;

  @IsOptional()
  @IsString()
  status?: string;

  @IsOptional()
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  limit?: number;
}
