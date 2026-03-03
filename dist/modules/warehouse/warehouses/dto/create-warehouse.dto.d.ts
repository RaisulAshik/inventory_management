import { WarehouseType, ZoneType } from '@common/enums';
declare class CreateZoneDto {
    zoneCode: string;
    zoneName: string;
    zoneType?: ZoneType;
    description?: string;
    temperatureMin?: number;
    temperatureMax?: number;
}
export declare class CreateWarehouseDto {
    warehouseCode: string;
    warehouseName: string;
    warehouseType?: WarehouseType;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
    phone?: string;
    email?: string;
    contactPerson?: string;
    totalAreaSqft?: number;
    usableAreaSqft?: number;
    isActive?: boolean;
    isDefault?: boolean;
    allowNegativeStock?: boolean;
    zones?: CreateZoneDto[];
}
export {};
