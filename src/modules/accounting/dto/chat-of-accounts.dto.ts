import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsUUID,
  MaxLength,
  IsNumber,
} from 'class-validator';
import { PartialType } from '@nestjs/mapped-types';
import { Type } from 'class-transformer';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { AccountType, NormalBalance } from '@common/enums';

/**
 * When set, the newly created (or updated) account will automatically become
 * the default for the corresponding auto-accounting setting.
 * e.g. defaultFor: AccountingRole.AR  →  acc.default_ar_account = <this account id>
 */
export enum AccountingRole {
  AR = 'AR', // Accounts Receivable
  REVENUE = 'REVENUE', // Sales Revenue
  COGS = 'COGS', // Cost of Goods Sold
  INVENTORY = 'INVENTORY', // Inventory Asset
  BANK = 'BANK', // Bank / Cash
  VAT = 'VAT', // Output VAT / GST Payable (on sales)
  INPUT_VAT = 'INPUT_VAT', // Input VAT / GST Recoverable (on purchases)
  AP = 'AP', // Accounts Payable
  INVENTORY_ADJUSTMENT = 'INVENTORY_ADJUSTMENT', // Inventory Adjustment Gain/Loss
  SALES_RETURNS = 'SALES_RETURNS', // Sales Returns & Allowances
  PURCHASE_RETURNS = 'PURCHASE_RETURNS', // Purchase Returns & Allowances
  EXPENSE = 'EXPENSE', // Default General Expense Account
}

export class CreateChartOfAccountDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  accountCode: string;

  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  accountName: string;

  @IsEnum(AccountType)
  accountType: AccountType;

  @IsString()
  @IsOptional()
  @MaxLength(50)
  accountSubtype?: string;

  @IsUUID()
  @IsOptional()
  parentId?: string;

  @IsEnum(NormalBalance)
  @IsOptional()
  normalBalance?: NormalBalance;

  @IsBoolean()
  @IsOptional()
  isHeader?: boolean;

  @IsBoolean()
  @IsOptional()
  isSystem?: boolean;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  isBankAccount?: boolean;

  @IsBoolean()
  @IsOptional()
  isCashAccount?: boolean;

  @IsBoolean()
  @IsOptional()
  isReceivable?: boolean;

  @IsBoolean()
  @IsOptional()
  isPayable?: boolean;

  @IsString()
  @IsOptional()
  @MaxLength(3)
  currency?: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  openingBalanceDebit?: number;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  openingBalanceCredit?: number;

  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({
    enum: AccountingRole,
    description:
      'Mark this account as the default for auto-accounting. ' +
      'Automatically saves the matching acc.default_* tenant setting.',
  })
  @IsEnum(AccountingRole)
  @IsOptional()
  defaultFor?: AccountingRole;
}

export class UpdateChartOfAccountDto extends PartialType(
  CreateChartOfAccountDto,
) {
  @ApiPropertyOptional({
    description:
      'Set to true to remove this account as the default for the given role. ' +
      'Use together with defaultFor to specify which role to clear.',
  })
  @IsBoolean()
  @IsOptional()
  clearDefaultFor?: boolean;
}

export class QueryChartOfAccountDto {
  @IsOptional()
  @IsEnum(AccountType)
  accountType?: AccountType;

  @IsOptional()
  @IsUUID()
  parentId?: string;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isHeader?: boolean;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  isBankAccount?: boolean;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  rootOnly?: boolean;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  page?: number;

  @IsOptional()
  @Type(() => Number)
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  pageSize?: number;
}
