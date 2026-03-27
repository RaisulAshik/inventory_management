import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsUUID,
  IsNumber,
  IsOptional,
  IsDateString,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateExpenseDto {
  @ApiProperty({ description: 'Date of the expense (YYYY-MM-DD)' })
  @IsDateString()
  expenseDate: string;

  @ApiProperty({
    format: 'uuid',
    description: 'GL account to debit — must be an EXPENSE type account',
  })
  @IsUUID()
  @IsNotEmpty()
  expenseAccountId: string;

  @ApiProperty({
    format: 'uuid',
    description: 'GL account to credit — typically Bank, Cash, or Payable',
  })
  @IsUUID()
  @IsNotEmpty()
  paidFromAccountId: string;

  @ApiProperty({ description: 'Expense amount (before tax)', example: 5000 })
  @Type(() => Number)
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiPropertyOptional({ description: 'Tax amount on the expense', example: 900 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  taxAmount?: number;

  @ApiProperty({ description: 'Short description of the expense' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({
    description: 'Vendor bill / invoice number for reference',
  })
  @IsOptional()
  @IsString()
  referenceNumber?: string;

  @ApiPropertyOptional({ description: 'Additional notes' })
  @IsOptional()
  @IsString()
  notes?: string;
}
