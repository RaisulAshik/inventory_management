import { ZoneType } from '@common/enums';
import { Warehouse } from './warehouse.entity';
import { WarehouseLocation } from './warehouse-location.entity';
export declare class WarehouseZone {
    id: string;
    warehouseId: string;
    zoneCode: string;
    zoneName: string;
    zoneType: ZoneType;
    description: string;
    temperatureMin: number;
    temperatureMax: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    warehouse: Warehouse;
    locations: WarehouseLocation[];
}
