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
  @ApiPropertyOptional({
    format: 'uuid',
    description: 'Filter by expense GL account',
  })
  @IsOptional()
  @IsUUID()
  expenseAccountId?: string;

  @ApiPropertyOptional({
    format: 'uuid',
    description: 'Filter by paid-from account',
  })
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

  // `keyword` comes from PaginationDto, where it is an alias for `search`.
  // Here it matches on description or reference number. Not redeclared: a
  // `declare` field emits nothing, so its decorators would never run.

  @ApiPropertyOptional({ description: 'Filter by description (partial match)' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Filter by category' })
  @IsOptional()
  @IsString()
  category?: string;
}
