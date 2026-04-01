import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsEnum,
  IsUUID,
  IsDateString,
  IsIn,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { SalesOrderStatus } from '@common/enums';
import { PaginationDto } from '@/common/dto/pagination.dto';

class CustomerFilterDto {
  @IsOptional()
  @IsString()
  displayName?: string;
}

export class OrderFilterDto extends PaginationDto {
  @ApiPropertyOptional({ enum: SalesOrderStatus })
  @IsOptional()
  @IsEnum(SalesOrderStatus)
  status?: SalesOrderStatus;

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  customerId?: string;

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

  @ApiPropertyOptional({ enum: ['PAID', 'UNPAID', 'PARTIAL'] })
  @IsOptional()
  @IsIn(['PAID', 'UNPAID', 'PARTIAL'])
  paymentStatus?: 'PAID' | 'UNPAID' | 'PARTIAL';

  @ApiPropertyOptional({ description: 'Filter by order number (partial match)' })
  @IsOptional()
  @IsString()
  orderNumber?: string;

  @ApiPropertyOptional({ type: CustomerFilterDto })
  @IsOptional()
  @ValidateNested()
  @Type(() => CustomerFilterDto)
  customer?: CustomerFilterDto;
}
