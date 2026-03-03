"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WarehousesService = void 0;
const common_1 = require("@nestjs/common");
const uuid_1 = require("uuid");
const tenant_connection_manager_1 = require("../../../database/tenant-connection.manager");
const pagination_util_1 = require("../../../common/utils/pagination.util");
const tenant_1 = require("../../../entities/tenant");
let WarehousesService = class WarehousesService {
    tenantConnectionManager;
    constructor(tenantConnectionManager) {
        this.tenantConnectionManager = tenantConnectionManager;
    }
    async getWarehouseRepository() {
        return this.tenantConnectionManager.getRepository(tenant_1.Warehouse);
    }
    async create(createWarehouseDto, createdBy) {
        const warehouseRepo = await this.getWarehouseRepository();
        const existingWarehouse = await warehouseRepo.findOne({
            where: { warehouseCode: createWarehouseDto.warehouseCode },
        });
        if (existingWarehouse) {
            throw new common_1.BadRequestException(`Warehouse with code ${createWarehouseDto.warehouseCode} already exists`);
        }
        if (createWarehouseDto.isDefault) {
            await warehouseRepo.update({}, { isDefault: false });
        }
        const id = (0, uuid_1.v4)();
        const warehouse = warehouseRepo.create({
            id,
            ...createWarehouseDto,
            createdBy,
        });
        await warehouseRepo.save(warehouse);
        if (createWarehouseDto.zones && createWarehouseDto.zones.length > 0) {
            const dataSource = await this.tenantConnectionManager.getDataSource();
            await this.createZones(id, createWarehouseDto.zones, dataSource);
        }
        return this.findById(id);
    }
    async createZones(warehouseId, zones, dataSource) {
        const zoneRepo = dataSource.getRepository(tenant_1.WarehouseZone);
        for (const zoneDto of zones) {
            const zone = zoneRepo.create({
                id: (0, uuid_1.v4)(),
                warehouseId,
                ...zoneDto,
            });
            await zoneRepo.save(zone);
        }
    }
    async findAll(paginationDto) {
        const warehouseRepo = await this.getWarehouseRepository();
        const queryBuilder = warehouseRepo
            .createQueryBuilder('warehouse')
            .leftJoinAndSelect('warehouse.zones', 'zones');
        if (paginationDto.search) {
            queryBuilder.where('(warehouse.warehouseCode LIKE :search OR warehouse.warehouseName LIKE :search)', { search: `%${paginationDto.search}%` });
        }
        if (!paginationDto.sortBy) {
            paginationDto.sortBy = 'warehouseName';
            paginationDto.sortOrder = 'ASC';
        }
        return (0, pagination_util_1.paginate)(queryBuilder, paginationDto);
    }
    async findAllActive() {
        const warehouseRepo = await this.getWarehouseRepository();
        return warehouseRepo.find({
            where: { isActive: true },
            order: { warehouseName: 'ASC' },
        });
    }
    async getDefault() {
        const warehouseRepo = await this.getWarehouseRepository();
        return warehouseRepo.findOne({
            where: { isDefault: true, isActive: true },
        });
    }
    async findById(id) {
        const warehouseRepo = await this.getWarehouseRepository();
        const warehouse = await warehouseRepo.findOne({
            where: { id },
            relations: ['zones', 'zones.locations'],
        });
        if (!warehouse) {
            throw new common_1.NotFoundException(`Warehouse with ID ${id} not found`);
        }
        return warehouse;
    }
    async findByCode(code) {
        const warehouseRepo = await this.getWarehouseRepository();
        return warehouseRepo.findOne({ where: { warehouseCode: code } });
    }
    async update(id, updateWarehouseDto) {
        const warehouseRepo = await this.getWarehouseRepository();
        const warehouse = await this.findById(id);
        if (updateWarehouseDto.warehouseCode &&
            updateWarehouseDto.warehouseCode !== warehouse.warehouseCode) {
            const existingCode = await warehouseRepo.findOne({
                where: { warehouseCode: updateWarehouseDto.warehouseCode },
            });
            if (existingCode) {
                throw new common_1.BadRequestException(`Warehouse with code ${updateWarehouseDto.warehouseCode} already exists`);
            }
        }
        if (updateWarehouseDto.isDefault && !warehouse.isDefault) {
            await warehouseRepo.update({}, { isDefault: false });
        }
        Object.assign(warehouse, updateWarehouseDto);
        await warehouseRepo.save(warehouse);
        return this.findById(id);
    }
    async remove(id) {
        const warehouseRepo = await this.getWarehouseRepository();
        const dataSource = await this.tenantConnectionManager.getDataSource();
        const stockCount = await dataSource
            .createQueryBuilder()
            .select('COUNT(*)', 'count')
            .from('inventory_stock', 'is')
            .where('is.warehouse_id = :id', { id })
            .andWhere('is.quantity_on_hand > 0')
            .getRawOne();
        if (Number(stockCount.count) > 0) {
            throw new common_1.BadRequestException('Cannot delete warehouse with existing stock');
        }
        await warehouseRepo.delete(id);
    }
    async getZones(warehouseId) {
        const dataSource = await this.tenantConnectionManager.getDataSource();
        const zoneRepo = dataSource.getRepository(tenant_1.WarehouseZone);
        return zoneRepo.find({
            where: { warehouseId },
            relations: ['locations'],
            order: { zoneCode: 'ASC' },
        });
    }
    async addZone(warehouseId, zoneDto) {
        const dataSource = await this.tenantConnectionManager.getDataSource();
        const zoneRepo = dataSource.getRepository(tenant_1.WarehouseZone);
        await this.findById(warehouseId);
        const existingZone = await zoneRepo.findOne({
            where: { warehouseId, zoneCode: zoneDto.zoneCode },
        });
        if (existingZone) {
            throw new common_1.BadRequestException(`Zone with code ${zoneDto.zoneCode} already exists in this warehouse`);
        }
        const zone = zoneRepo.create({
            id: (0, uuid_1.v4)(),
            warehouseId,
            ...zoneDto,
        });
        return zoneRepo.save(zone);
    }
    async updateZone(zoneId, zoneDto) {
        const dataSource = await this.tenantConnectionManager.getDataSource();
        const zoneRepo = dataSource.getRepository(tenant_1.WarehouseZone);
        const zone = await zoneRepo.findOne({ where: { id: zoneId } });
        if (!zone) {
            throw new common_1.NotFoundException(`Zone with ID ${zoneId} not found`);
        }
        Object.assign(zone, zoneDto);
        return zoneRepo.save(zone);
    }
    async removeZone(zoneId) {
        const dataSource = await this.tenantConnectionManager.getDataSource();
        const zoneRepo = dataSource.getRepository(tenant_1.WarehouseZone);
        const locationRepo = dataSource.getRepository(tenant_1.WarehouseLocation);
        const locationCount = await locationRepo
            .createQueryBuilder('loc')
            .innerJoin('location_inventory', 'li', 'li.location_id = loc.id')
            .where('loc.zone_id = :zoneId', { zoneId })
            .andWhere('li.quantity > 0')
            .getCount();
        if (locationCount > 0) {
            throw new common_1.BadRequestException('Cannot delete zone with locations containing stock');
        }
        await zoneRepo.delete(zoneId);
    }
    async getStockSummary(warehouseId) {
        const dataSource = await this.tenantConnectionManager.getDataSource();
        const summary = await dataSource.query(`
      SELECT 
        COUNT(DISTINCT product_id) as total_products,
        SUM(quantity_on_hand) as total_quantity,
        SUM(quantity_reserved) as total_reserved,
        SUM(quantity_on_hand - quantity_reserved) as total_available,
        SUM(quantity_on_hand * COALESCE(
          (SELECT cost_price FROM products WHERE id = inventory_stock.product_id), 0
        )) as total_value
      FROM inventory_stock
      WHERE warehouse_id = ?
    `, [warehouseId]);
        return summary[0];
    }
    async count() {
        const warehouseRepo = await this.getWarehouseRepository();
        return warehouseRepo.count();
    }
};
exports.WarehousesService = WarehousesService;
exports.WarehousesService = WarehousesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tenant_connection_manager_1.TenantConnectionManager])
], WarehousesService);
//# sourceMappingURL=warehouses.service.js.map