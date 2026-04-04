// src/modules/sales/customer-dues/dto/create-opening-balance.dto.ts

import {
  IsUUID,
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
  Min,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateOpeningBalanceDto {
  @ApiProperty()
  @IsUUID()
  customerId: string;

  @ApiProperty()
  @IsNumber()
  @Min(0.01)
  originalAmount: number;

  @ApiProperty()
  @IsDateString()
  dueDate: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  referenceNumber?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  notes?: string;
}

// src/modules/sales/customer-dues/dto/adjust-due.dto.ts

export class AdjustDueDto {
  @ApiProperty()
  @IsNumber()
  @Min(0.01)
  adjustmentAmount: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  reason?: string;
}

// src/modules/sales/customer-dues/dto/write-off.dto.ts

export class WriteOffDueDto {
  @ApiProperty()
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiProperty()
  @IsString()
  reason: string;
}
