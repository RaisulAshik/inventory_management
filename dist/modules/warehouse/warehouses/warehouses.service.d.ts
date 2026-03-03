import { TenantConnectionManager } from '@database/tenant-connection.manager';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { PaginationDto } from '@common/dto/pagination.dto';
import { PaginatedResult } from '@common/interfaces';
import { Warehouse, WarehouseZone } from '@entities/tenant';
export declare class WarehousesService {
    private readonly tenantConnectionManager;
    constructor(tenantConnectionManager: TenantConnectionManager);
    private getWarehouseRepository;
    create(createWarehouseDto: CreateWarehouseDto, createdBy: string): Promise<Warehouse>;
    private createZones;
    findAll(paginationDto: PaginationDto): Promise<PaginatedResult<Warehouse>>;
    findAllActive(): Promise<Warehouse[]>;
    getDefault(): Promise<Warehouse | null>;
    findById(id: string): Promise<Warehouse>;
    findByCode(code: string): Promise<Warehouse | null>;
    update(id: string, updateWarehouseDto: UpdateWarehouseDto): Promise<Warehouse>;
    remove(id: string): Promise<void>;
    getZones(warehouseId: string): Promise<WarehouseZone[]>;
    addZone(warehouseId: string, zoneDto: any): Promise<WarehouseZone>;
    updateZone(zoneId: string, zoneDto: any): Promise<WarehouseZone>;
    removeZone(zoneId: string): Promise<void>;
    getStockSummary(warehouseId: string): Promise<any>;
    count(): Promise<number>;
}
