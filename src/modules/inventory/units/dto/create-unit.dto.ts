import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsEnum,
  IsNumber,
  MaxLength,
  Min,
  Max,
} from 'class-validator';
import { UomType } from '@common/enums';

export class CreateUnitDto {
  @ApiProperty({ example: 'PCS' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  uomCode: string;

  @ApiProperty({ example: 'Pieces' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  uomName: string;

  @ApiPropertyOptional({ enum: UomType, default: UomType.UNIT })
  @IsOptional()
  @IsEnum(UomType)
  uomType?: UomType;

  @ApiPropertyOptional({ example: 'PCS' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  symbol?: string;

  @ApiPropertyOptional({ example: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(8)
  decimalPlaces?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
