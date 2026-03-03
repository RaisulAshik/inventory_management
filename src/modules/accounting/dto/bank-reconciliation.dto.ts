import {
  IsString,
  IsOptional,
  IsEnum,
  IsUUID,
  IsNumber,
  IsDateString,
  IsArray,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { ReconciliationStatus } from '@/entities/tenant';

export class CreateBankReconciliationDto {
  @IsUUID()
  bankAccountId: string;

  @IsDateString()
  statementDate: string;

  @IsDateString()
  statementStartDate: string;

  @IsDateString()
  statementEndDate: string;

  @IsNumber()
  @Type(() => Number)
  openingBalanceBook: number;

  @IsNumber()
  @Type(() => Number)
  closingBalanceBook: number;

  @IsNumber()
  @Type(() => Number)
  openingBalanceBank: number;

  @IsNumber()
  @Type(() => Number)
  closingBalanceBank: number;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateBankReconciliationDto extends PartialType(
  CreateBankReconciliationDto,
) {
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  totalDepositsBook?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  totalWithdrawalsBook?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  totalDepositsBank?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  totalWithdrawalsBank?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  depositsInTransit?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  outstandingCheques?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  bankErrors?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  bookErrors?: number;
}

export class CompleteReconciliationDto {
  @IsArray()
  @IsUUID('4', { each: true })
  reconciledTransactionIds: string[];

  @IsNumber()
  @Type(() => Number)
  adjustedBalanceBook: number;

  @IsNumber()
  @Type(() => Number)
  adjustedBalanceBank: number;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class QueryBankReconciliationDto {
  @IsOptional()
  @IsUUID()
  bankAccountId?: string;

  @IsOptional()
  @IsEnum(ReconciliationStatus)
  status?: ReconciliationStatus;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  limit?: number;
}
