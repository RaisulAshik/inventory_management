import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  MaxLength,
} from 'class-validator';

export class CreateTaxCategoryDto {
  @ApiProperty({ example: 'SST', description: 'Unique tax code' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  taxCategoryCode: string;

  @ApiProperty({ example: 'Sales and Service Tax' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  taxCategoryName: string;

  @ApiPropertyOptional({
    example: 'Standard SST applied to goods and services',
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
