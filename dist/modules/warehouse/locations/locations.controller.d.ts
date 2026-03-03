import { LocationsService } from './locations.service';
import { PaginationDto } from '@common/dto/pagination.dto';
import { LocationStatus } from '@common/enums';
import { BulkCreateLocationDto } from './dto/bulk-create-location.dto';
import { CreateLocationDto } from './dto/create-location.dto';
import { LocationFilterDto } from './dto/location-filter.dto';
import { LocationResponseDto } from './dto/location-response.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
export declare class LocationsController {
    private readonly locationsService;
    constructor(locationsService: LocationsService);
    create(createLocationDto: CreateLocationDto): Promise<LocationResponseDto>;
    bulkCreate(dto: BulkCreateLocationDto): Promise<{
        created: number;
    }>;
    findAll(paginationDto: PaginationDto, filterDto: LocationFilterDto): Promise<{
        data: LocationResponseDto[];
        meta: import("../../../common/interfaces").PaginationMeta;
    }>;
    findByWarehouse(warehouseId: string): Promise<{
        data: LocationResponseDto[];
    }>;
    findByZone(zoneId: string): Promise<{
        data: LocationResponseDto[];
    }>;
    getAvailableLocations(warehouseId: string, zoneId?: string): Promise<{
        data: LocationResponseDto[];
    }>;
    findByBarcode(barcode: string): Promise<{
        data: LocationResponseDto | null;
    }>;
    findOne(id: string): Promise<LocationResponseDto>;
    getInventory(id: string): Promise<{
        data: import("../../../entities/tenant").LocationInventory[];
    }>;
    getUtilization(id: string): Promise<{
        weightUtilization: number | null;
        volumeUtilization: number | null;
        unitsUtilization: number | null;
    }>;
    update(id: string, updateLocationDto: UpdateLocationDto): Promise<LocationResponseDto>;
    updateStatus(id: string, status: LocationStatus): Promise<LocationResponseDto>;
    remove(id: string): Promise<void>;
}
