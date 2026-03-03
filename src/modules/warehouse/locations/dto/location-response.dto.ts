import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { LocationType, LocationStatus } from '@common/enums';
import { WarehouseLocation } from '@entities/tenant';

export class LocationResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  warehouseId: string;

  @ApiPropertyOptional()
  warehouseName?: string;

  @ApiPropertyOptional()
  zoneId?: string;

  @ApiPropertyOptional()
  zoneName?: string;

  @ApiProperty()
  locationCode: string;

  @ApiProperty()
  locationName: string;

  @ApiPropertyOptional()
  aisle?: string;

  @ApiPropertyOptional()
  rack?: string;

  @ApiPropertyOptional()
  shelf?: string;

  @ApiPropertyOptional()
  bin?: string;

  @ApiProperty()
  fullPath: string;

  @ApiProperty({ enum: LocationType })
  locationType: LocationType;

  @ApiPropertyOptional()
  barcode?: string;

  @ApiProperty({ enum: LocationStatus })
  status: LocationStatus;

  @ApiPropertyOptional()
  maxWeightKg?: number;

  @ApiPropertyOptional()
  maxVolumeCbm?: number;

  @ApiPropertyOptional()
  maxUnits?: number;

  @ApiProperty()
  currentWeightKg: number;

  @ApiProperty()
  currentVolumeCbm: number;

  @ApiProperty()
  currentUnits: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(location: WarehouseLocation) {
    this.id = location.id;
    this.warehouseId = location.warehouseId;
    this.warehouseName = location.warehouse?.warehouseName;
    this.zoneId = location.zoneId;
    this.zoneName = location.zone?.zoneName;
    this.locationCode = location.locationCode;
    this.locationName = location.locationName;
    this.aisle = location.aisle;
    this.rack = location.rack;
    this.shelf = location.shelf;
    this.bin = location.bin;
    this.fullPath = location.fullPath;
    this.locationType = location.locationType;
    this.barcode = location.barcode;
    this.status = location.status;
    this.maxWeightKg = location.maxWeightKg
      ? Number(location.maxWeightKg)
      : undefined;
    this.maxVolumeCbm = location.maxVolumeCbm
      ? Number(location.maxVolumeCbm)
      : undefined;
    this.maxUnits = location.maxUnits;
    this.currentWeightKg = Number(location.currentWeightKg) || 0;
    this.currentVolumeCbm = Number(location.currentVolumeCbm) || 0;
    this.currentUnits = Number(location.currentUnits) || 0;
    this.createdAt = location.createdAt;
    this.updatedAt = location.updatedAt;
  }
}
