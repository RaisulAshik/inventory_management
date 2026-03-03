import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEnum,
  IsNumber,
  MaxLength,
} from 'class-validator';
import { ZoneType } from '@common/enums';

export class CreateZoneDto {
  @ApiProperty({ example: 'ZONE-A' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  zoneCode: string;

  @ApiProperty({ example: 'Zone A - General Storage' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  zoneName: string;

  @ApiPropertyOptional({ enum: ZoneType, default: ZoneType.GENERAL })
  @IsOptional()
  @IsEnum(ZoneType)
  zoneType?: ZoneType;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  temperatureMin?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  temperatureMax?: number;
}
