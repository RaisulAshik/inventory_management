import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
  IsUUID,
  MaxLength,
  Min,
} from 'class-validator';
import { LocationType } from '@common/enums';

export class CreateLocationDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  @IsNotEmpty()
  warehouseId: string;

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @IsUUID()
  zoneId?: string;

  @ApiProperty({ example: 'A-01-01-01' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  locationCode: string;

  @ApiProperty({ example: 'Aisle A, Rack 1, Shelf 1, Bin 1' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  locationName: string;

  @ApiPropertyOptional({ example: 'A' })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  aisle?: string;

  @ApiPropertyOptional({ example: '01' })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  rack?: string;

  @ApiPropertyOptional({ example: '01' })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  shelf?: string;

  @ApiPropertyOptional({ example: '01' })
  @IsOptional()
  @IsString()
  @MaxLength(10)
  bin?: string;

  @ApiProperty({ enum: LocationType, default: LocationType.PICKING })
  @IsEnum(LocationType)
  locationType: LocationType;

  @ApiPropertyOptional({ example: 'LOC-A-01-01-01' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  barcode?: string;

  @ApiPropertyOptional({ example: 500 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxWeightKg?: number;

  @ApiPropertyOptional({ example: 2 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxVolumeCbm?: number;

  @ApiPropertyOptional({ example: 100 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  maxUnits?: number;
}
