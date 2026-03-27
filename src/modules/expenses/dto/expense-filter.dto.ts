import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsUUID,
  IsDateString,
  IsEnum,
  IsString,
} from 'class-validator';
import { PaginationDto } from '@common/dto/pagination.dto';
import { ExpenseStatus } from '@entities/tenant/accounting/expense.entity';

export class ExpenseFilterDto extends PaginationDto {
  @ApiPropertyOptional({ format: 'uuid', description: 'Filter by expense GL account' })
  @IsOptional()
  @IsUUID()
  expenseAccountId?: string;

  @ApiPropertyOptional({ format: 'uuid', description: 'Filter by paid-from account' })
  @IsOptional()
  @IsUUID()
  paidFromAccountId?: string;

  @ApiPropertyOptional({ enum: ExpenseStatus })
  @IsOptional()
  @IsEnum(ExpenseStatus)
  status?: ExpenseStatus;

  @ApiPropertyOptional({ description: 'Start date filter (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @ApiPropertyOptional({ description: 'End date filter (YYYY-MM-DD)' })
  @IsOptional()
  @IsDateString()
  toDate?: string;

  @ApiPropertyOptional({ description: 'Search by description or reference number' })
  @IsOptional()
  @IsString()
  keyword?: string;
}
