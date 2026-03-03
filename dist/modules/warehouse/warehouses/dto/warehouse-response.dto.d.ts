import { Warehouse } from '@entities/tenant/warehouse/warehouse.entity';
import { WarehouseType } from '@common/enums';
declare class ZoneResponseDto {
    id: string;
    zoneCode: string;
    zoneName: string;
    zoneType: string;
    description?: string;
    temperatureMin?: number;
    temperatureMax?: number;
    locationCount?: number;
}
export declare class WarehouseResponseDto {
    id: string;
    warehouseCode: string;
    warehouseName: string;
    warehouseType: WarehouseType;
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
    isActive: boolean;
    isDefault: boolean;
    allowNegativeStock: boolean;
    zones?: ZoneResponseDto[];
    createdAt: Date;
    updatedAt: Date;
    constructor(warehouse: Warehouse);
}
export {};
