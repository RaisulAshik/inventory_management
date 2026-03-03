import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsUUID,
  MaxLength,
  IsNumber,
  IsEmail,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { BankAccountType } from '@/entities/tenant';

export class CreateBankAccountDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  accountCode: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  accountName: string;

  @IsEnum(BankAccountType)
  @IsOptional()
  accountType?: BankAccountType;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  bankName: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  branchName?: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  accountNumber: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  ifscCode?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  swiftCode?: string;

  @IsString()
  @IsOptional()
  @MaxLength(20)
  micrCode?: string;

  @IsString()
  @IsOptional()
  @MaxLength(3)
  currency?: string;

  @IsUUID()
  @IsOptional()
  glAccountId?: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  openingBalance?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  overdraftLimit?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  interestRate?: number;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  contactPerson?: string;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  contactPhone?: string;

  @IsEmail()
  @IsOptional()
  @MaxLength(255)
  contactEmail?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsBoolean()
  @IsOptional()
  isPrimary?: boolean;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateBankAccountDto extends PartialType(CreateBankAccountDto) {}

export class QueryBankAccountDto {
  @IsOptional()
  @IsEnum(BankAccountType)
  accountType?: BankAccountType;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isActive?: boolean;

  @IsOptional()
  @IsString()
  bankName?: string;

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
