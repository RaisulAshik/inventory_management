import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsUUID, Min } from 'class-validator';

export class CreateUomConversionDto {
  @ApiProperty({ format: 'uuid', description: 'Source unit ID' })
  @IsUUID()
  @IsNotEmpty()
  fromUomId: string;

  @ApiProperty({ format: 'uuid', description: 'Target unit ID' })
  @IsUUID()
  @IsNotEmpty()
  toUomId: string;

  @ApiProperty({
    example: 12,
    description: 'Conversion factor (1 fromUom = X toUom)',
  })
  @IsNumber()
  @Min(0.000001)
  conversionFactor: number;
}
