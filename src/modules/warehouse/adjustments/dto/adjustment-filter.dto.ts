import { AdjustmentStatus, AdjustmentType } from '@entities/tenant';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsUUID, IsDateString } from 'class-validator';
import { PaginationDto } from '@common/dto/pagination.dto';

export class AdjustmentFilterDto extends PaginationDto {
  @ApiPropertyOptional({ enum: AdjustmentStatus })
  @IsOptional()
  @IsEnum(AdjustmentStatus)
  status?: AdjustmentStatus;

  @ApiPropertyOptional({ enum: AdjustmentType })
  @IsOptional()
  @IsEnum(AdjustmentType)
  adjustmentType?: AdjustmentType;

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  warehouseId?: string;

  @ApiPropertyOptional({ type: 'string', format: 'date' })
  @IsOptional()
  @IsDateString()
  fromDate?: string;

  @ApiPropertyOptional({ type: 'string', format: 'date' })
  @IsOptional()
  @IsDateString()
  toDate?: string;
}
