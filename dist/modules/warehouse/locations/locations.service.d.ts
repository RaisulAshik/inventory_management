import { TenantConnectionManager } from '@database/tenant-connection.manager';
import { PaginationDto } from '@common/dto/pagination.dto';
import { PaginatedResult } from '@common/interfaces';
import { LocationStatus } from '@common/enums';
import { WarehouseLocation, LocationInventory } from '@entities/tenant';
import { CreateLocationDto } from './dto/create-location.dto';
import { LocationFilterDto } from './dto/location-filter.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
export declare class LocationsService {
    private readonly tenantConnectionManager;
    constructor(tenantConnectionManager: TenantConnectionManager);
    private getLocationRepository;
    create(createLocationDto: CreateLocationDto): Promise<WarehouseLocation>;
    findAll(paginationDto: PaginationDto, filterDto: LocationFilterDto): Promise<PaginatedResult<WarehouseLocation>>;
    findByWarehouse(warehouseId: string): Promise<WarehouseLocation[]>;
    findByZone(zoneId: string): Promise<WarehouseLocation[]>;
    getAvailableLocations(warehouseId: string, zoneId?: string): Promise<WarehouseLocation[]>;
    findById(id: string): Promise<WarehouseLocation>;
    findByBarcode(barcode: string): Promise<WarehouseLocation | null>;
    update(id: string, updateLocationDto: UpdateLocationDto): Promise<WarehouseLocation>;
    remove(id: string): Promise<void>;
    updateStatus(id: string, status: LocationStatus): Promise<WarehouseLocation>;
    getInventory(locationId: string): Promise<LocationInventory[]>;
    getUtilization(locationId: string): Promise<{
        weightUtilization: number | null;
        volumeUtilization: number | null;
        unitsUtilization: number | null;
    }>;
    bulkCreate(warehouseId: string, zoneId: string, config: {
        aisleStart: string;
        aisleEnd: string;
        rackStart: string;
        rackEnd: string;
        shelfStart: number;
        shelfEnd: number;
        binStart?: number;
        binEnd?: number;
        locationType: string;
    }): Promise<{
        created: number;
    }>;
    private generateRange;
    count(warehouseId?: string): Promise<number>;
}
