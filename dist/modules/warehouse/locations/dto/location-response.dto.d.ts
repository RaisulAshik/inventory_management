import { LocationType, LocationStatus } from '@common/enums';
import { WarehouseLocation } from '@entities/tenant';
export declare class LocationResponseDto {
    id: string;
    warehouseId: string;
    warehouseName?: string;
    zoneId?: string;
    zoneName?: string;
    locationCode: string;
    locationName: string;
    aisle?: string;
    rack?: string;
    shelf?: string;
    bin?: string;
    fullPath: string;
    locationType: LocationType;
    barcode?: string;
    status: LocationStatus;
    maxWeightKg?: number;
    maxVolumeCbm?: number;
    maxUnits?: number;
    currentWeightKg: number;
    currentVolumeCbm: number;
    currentUnits: number;
    createdAt: Date;
    updatedAt: Date;
    constructor(location: WarehouseLocation);
}
