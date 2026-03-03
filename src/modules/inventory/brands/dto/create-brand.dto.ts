import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsUrl,
  MaxLength,
} from 'class-validator';

export class CreateBrandDto {
  @ApiProperty({ example: 'BRD-001' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  brandCode: string;

  @ApiProperty({ example: 'Apple' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  brandName: string;

  @ApiPropertyOptional({ example: 'Premium electronics brand' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: 'https://example.com/logo.png' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  logoUrl?: string;

  @ApiPropertyOptional({ example: 'https://www.apple.com' })
  @IsOptional()
  @IsUrl()
  @MaxLength(500)
  website?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
