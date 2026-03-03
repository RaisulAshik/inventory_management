import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UomType } from '@common/enums';
import { UnitOfMeasure } from '@entities/tenant';

export class UnitResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  uomCode: string;

  @ApiProperty()
  uomName: string;

  @ApiProperty({ enum: UomType })
  uomType: UomType;

  @ApiPropertyOptional()
  symbol?: string;

  @ApiProperty()
  decimalPlaces: number;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(uom: UnitOfMeasure) {
    this.id = uom.id;
    this.uomCode = uom.uomCode;
    this.uomName = uom.uomName;
    this.uomType = uom.uomType;
    this.symbol = uom.symbol;
    this.decimalPlaces = uom.decimalPlaces;
    this.description = uom.description;
    this.isActive = uom.isActive;
    this.createdAt = uom.createdAt;
    this.updatedAt = uom.updatedAt;
  }
}
