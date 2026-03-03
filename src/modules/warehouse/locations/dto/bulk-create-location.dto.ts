import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsUUID,
  IsString,
  IsNumber,
  IsOptional,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class LocationConfigDto {
  @ApiProperty({ example: 'A' })
  @IsString()
  @IsNotEmpty()
  aisleStart: string;

  @ApiProperty({ example: 'D' })
  @IsString()
  @IsNotEmpty()
  aisleEnd: string;

  @ApiProperty({ example: '01' })
  @IsString()
  @IsNotEmpty()
  rackStart: string;

  @ApiProperty({ example: '10' })
  @IsString()
  @IsNotEmpty()
  rackEnd: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  shelfStart: number;

  @ApiProperty({ example: 5 })
  @IsNumber()
  shelfEnd: number;

  @ApiProperty({ example: 1 })
  @IsOptional()
  @IsNumber()
  binStart?: number;

  @ApiProperty({ example: 4 })
  @IsOptional()
  @IsNumber()
  binEnd?: number;

  @ApiProperty({ example: 'PICKING' })
  @IsString()
  @IsNotEmpty()
  locationType: string;
}

export class BulkCreateLocationDto {
  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  @IsNotEmpty()
  warehouseId: string;

  @ApiProperty({ format: 'uuid' })
  @IsUUID()
  @IsNotEmpty()
  zoneId: string;

  @ApiProperty({ type: LocationConfigDto })
  @ValidateNested()
  @Type(() => LocationConfigDto)
  config: LocationConfigDto;
}
