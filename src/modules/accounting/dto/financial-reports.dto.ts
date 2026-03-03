import {
  IsOptional,
  IsUUID,
  IsString,
  IsDateString,
  IsEnum,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum ReportType {
  BALANCE_SHEET = 'BALANCE_SHEET',
  INCOME_STATEMENT = 'INCOME_STATEMENT',
  TRIAL_BALANCE = 'TRIAL_BALANCE',
  CASH_FLOW = 'CASH_FLOW',
  GENERAL_LEDGER_REPORT = 'GENERAL_LEDGER_REPORT',
  BUDGET_VS_ACTUAL = 'BUDGET_VS_ACTUAL',
  AGED_RECEIVABLES = 'AGED_RECEIVABLES',
  AGED_PAYABLES = 'AGED_PAYABLES',
  BANK_SUMMARY = 'BANK_SUMMARY',
}

export class FinancialReportQueryDto {
  @IsEnum(ReportType)
  reportType: ReportType;

  @IsOptional()
  @IsUUID()
  fiscalYearId?: string;

  @IsOptional()
  @IsUUID()
  fiscalPeriodId?: string;

  @IsOptional()
  @IsDateString()
  asOfDate?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsUUID()
  costCenterId?: string;

  @IsOptional()
  @IsUUID()
  accountId?: string;

  @IsOptional()
  @IsUUID()
  budgetId?: string;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  includeZeroBalances?: boolean;

  @IsOptional()
  @IsBoolean()
  @Type(() => Boolean)
  showSubAccounts?: boolean;

  @IsOptional()
  @IsString()
  comparePeriod?: string; // 'previous_year', 'previous_period', 'budget'
}
