import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsEnum, IsUUID, IsString } from 'class-validator';
import { LocationType, LocationStatus } from '@common/enums';
import { PaginationDto } from '@common/dto/pagination.dto';

export class LocationFilterDto extends PaginationDto {
  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  warehouseId?: string;

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  zoneId?: string;

  @ApiPropertyOptional({ enum: LocationType })
  @IsOptional()
  @IsEnum(LocationType)
  locationType?: LocationType;

  @ApiPropertyOptional({ enum: LocationStatus })
  @IsOptional()
  @IsEnum(LocationStatus)
  status?: LocationStatus;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  aisle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  rack?: string;
}
