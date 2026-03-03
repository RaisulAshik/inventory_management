import { WarehousesService } from './warehouses.service';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { WarehouseResponseDto } from './dto/warehouse-response.dto';
import { CreateZoneDto } from './dto/create-zone.dto';
import { PaginationDto } from '@common/dto/pagination.dto';
import { JwtPayload } from '@common/interfaces';
export declare class WarehousesController {
    private readonly warehousesService;
    constructor(warehousesService: WarehousesService);
    create(createWarehouseDto: CreateWarehouseDto, currentUser: JwtPayload): Promise<WarehouseResponseDto>;
    findAll(paginationDto: PaginationDto): Promise<{
        data: WarehouseResponseDto[];
        meta: import("@common/interfaces").PaginationMeta;
    }>;
    findAllActive(): Promise<{
        data: WarehouseResponseDto[];
    }>;
    getDefault(): Promise<{
        data: WarehouseResponseDto | null;
    }>;
    findOne(id: string): Promise<WarehouseResponseDto>;
    getZones(id: string): Promise<{
        data: import("../../../entities/tenant").WarehouseZone[];
    }>;
    getStockSummary(id: string): Promise<any>;
    update(id: string, updateWarehouseDto: UpdateWarehouseDto): Promise<WarehouseResponseDto>;
    remove(id: string): Promise<void>;
    addZone(id: string, zoneDto: CreateZoneDto): Promise<import("../../../entities/tenant").WarehouseZone>;
    updateZone(zoneId: string, zoneDto: CreateZoneDto): Promise<import("../../../entities/tenant").WarehouseZone>;
    removeZone(zoneId: string): Promise<void>;
}
