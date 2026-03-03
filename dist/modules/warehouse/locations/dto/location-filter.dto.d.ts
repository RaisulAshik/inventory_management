import { LocationType, LocationStatus } from '@common/enums';
export declare class LocationFilterDto {
    warehouseId?: string;
    zoneId?: string;
    locationType?: LocationType;
    status?: LocationStatus;
    aisle?: string;
    rack?: string;
}
