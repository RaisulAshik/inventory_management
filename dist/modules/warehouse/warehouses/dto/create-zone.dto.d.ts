import { ZoneType } from '@common/enums';
export declare class CreateZoneDto {
    zoneCode: string;
    zoneName: string;
    zoneType?: ZoneType;
    description?: string;
    temperatureMin?: number;
    temperatureMax?: number;
}
