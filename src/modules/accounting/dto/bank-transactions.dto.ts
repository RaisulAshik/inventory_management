import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsUUID,
  MaxLength,
  IsNumber,
  IsDateString,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { BankTransactionType, BankTransactionStatus } from '@/entities/tenant';

export class CreateBankTransactionDto {
  @IsUUID()
  bankAccountId: string;

  @IsDateString()
  transactionDate: string;

  @IsDateString()
  @IsOptional()
  valueDate?: string;

  @IsEnum(BankTransactionType)
  transactionType: BankTransactionType;

  @IsNumber()
  @Type(() => Number)
  amount: number;

  @IsString()
  @IsOptional()
  @MaxLength(3)
  currency?: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  referenceNumber?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  chequeNumber?: string;

  @IsDateString()
  @IsOptional()
  chequeDate?: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  payeePayerName?: string;

  @IsString()
  @IsOptional()
  @MaxLength(100)
  bankReference?: string;

  @IsUUID()
  @IsOptional()
  journalEntryId?: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateBankTransactionDto extends PartialType(
  CreateBankTransactionDto,
) {
  @IsEnum(BankTransactionStatus)
  @IsOptional()
  status?: BankTransactionStatus;
}

export class QueryBankTransactionDto {
  @IsOptional()
  @IsUUID()
  bankAccountId?: string;

  @IsOptional()
  @IsEnum(BankTransactionType)
  transactionType?: BankTransactionType;

  @IsOptional()
  @IsEnum(BankTransactionStatus)
  status?: BankTransactionStatus;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  minAmount?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  maxAmount?: number;

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

export class ReconcileTransactionsDto {
  @IsUUID('4', { each: true })
  transactionIds: string[];

  @IsUUID()
  @IsOptional()
  reconciliationId?: string;
}
