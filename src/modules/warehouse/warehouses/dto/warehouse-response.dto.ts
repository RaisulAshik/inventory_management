import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Warehouse } from '@entities/tenant/warehouse/warehouse.entity';
import { WarehouseType } from '@common/enums';

class ZoneResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  zoneCode: string;

  @ApiProperty()
  zoneName: string;

  @ApiProperty()
  zoneType: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  temperatureMin?: number;

  @ApiPropertyOptional()
  temperatureMax?: number;

  @ApiPropertyOptional()
  locationCount?: number;
}

export class WarehouseResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  warehouseCode: string;

  @ApiProperty()
  warehouseName: string;

  @ApiProperty({ enum: WarehouseType })
  warehouseType: WarehouseType;

  @ApiPropertyOptional()
  addressLine1?: string;

  @ApiPropertyOptional()
  addressLine2?: string;

  @ApiPropertyOptional()
  city?: string;

  @ApiPropertyOptional()
  state?: string;

  @ApiPropertyOptional()
  country?: string;

  @ApiPropertyOptional()
  postalCode?: string;

  @ApiPropertyOptional()
  phone?: string;

  @ApiPropertyOptional()
  email?: string;

  @ApiPropertyOptional()
  contactPerson?: string;

  @ApiPropertyOptional()
  totalAreaSqft?: number;

  @ApiPropertyOptional()
  usableAreaSqft?: number;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  isDefault: boolean;

  @ApiProperty()
  allowNegativeStock: boolean;

  @ApiPropertyOptional({ type: [ZoneResponseDto] })
  zones?: ZoneResponseDto[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(warehouse: Warehouse) {
    this.id = warehouse.id;
    this.warehouseCode = warehouse.warehouseCode;
    this.warehouseName = warehouse.warehouseName;
    this.warehouseType = warehouse.warehouseType;
    this.addressLine1 = warehouse.addressLine1;
    this.addressLine2 = warehouse.addressLine2;
    this.city = warehouse.city;
    this.state = warehouse.state;
    this.country = warehouse.country;
    this.postalCode = warehouse.postalCode;
    this.phone = warehouse.phone;
    this.email = warehouse.email;
    this.contactPerson = warehouse.contactPerson;
    this.totalAreaSqft = warehouse.totalAreaSqft
      ? Number(warehouse.totalAreaSqft)
      : undefined;
    this.usableAreaSqft = warehouse.usableAreaSqft
      ? Number(warehouse.usableAreaSqft)
      : undefined;
    this.isActive = warehouse.isActive;
    this.isDefault = warehouse.isDefault;
    this.allowNegativeStock = warehouse.allowNegativeStock;
    this.createdAt = warehouse.createdAt;
    this.updatedAt = warehouse.updatedAt;

    if (warehouse.zones) {
      this.zones = warehouse.zones.map((z) => ({
        id: z.id,
        zoneCode: z.zoneCode,
        zoneName: z.zoneName,
        zoneType: z.zoneType,
        description: z.description,
        temperatureMin: z.temperatureMin ? Number(z.temperatureMin) : undefined,
        temperatureMax: z.temperatureMax ? Number(z.temperatureMax) : undefined,
        locationCount: z.locations?.length || 0,
      }));
    }
  }
}
