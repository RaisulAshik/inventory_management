import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsBoolean,
  IsEnum,
  IsUUID,
  IsString,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { CustomerType } from '@common/enums';
import { PaginationDto } from '@/common/dto/pagination.dto';

export class CustomerFilterDto extends PaginationDto {
  @ApiPropertyOptional({ enum: CustomerType })
  @IsOptional()
  @IsEnum(CustomerType)
  customerType?: CustomerType;

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  customerGroupId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  state?: string;
}
