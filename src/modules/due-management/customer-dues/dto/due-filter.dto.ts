// src/modules/sales/customer-dues/dto/due-filter.dto.ts

import {
  IsOptional,
  IsString,
  IsEnum,
  IsUUID,
  IsBoolean,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationDto } from '@common/dto/pagination.dto';
import { DueStatus } from '@common/enums';
import { Transform } from 'class-transformer';

export class DueFilterDto extends PaginationDto {
  @ApiPropertyOptional({ enum: DueStatus })
  @IsEnum(DueStatus)
  @IsOptional()
  status?: DueStatus;

  @ApiPropertyOptional()
  @IsUUID()
  @IsOptional()
  customerId?: string;

  @ApiPropertyOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  @IsOptional()
  overdueOnly?: boolean;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  fromDate?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  toDate?: string;
}
