import { LocationType } from '@common/enums';
export declare class CreateLocationDto {
    warehouseId: string;
    zoneId?: string;
    locationCode: string;
    locationName: string;
    aisle?: string;
    rack?: string;
    shelf?: string;
    bin?: string;
    locationType: LocationType;
    barcode?: string;
    maxWeightKg?: number;
    maxVolumeCbm?: number;
    maxUnits?: number;
}
