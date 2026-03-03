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
exports.LocationsService = void 0;
const common_1 = require("@nestjs/common");
const uuid_1 = require("uuid");
const tenant_connection_manager_1 = require("../../../database/tenant-connection.manager");
const pagination_util_1 = require("../../../common/utils/pagination.util");
const enums_1 = require("../../../common/enums");
const tenant_1 = require("../../../entities/tenant");
let LocationsService = class LocationsService {
    tenantConnectionManager;
    constructor(tenantConnectionManager) {
        this.tenantConnectionManager = tenantConnectionManager;
    }
    async getLocationRepository() {
        return this.tenantConnectionManager.getRepository(tenant_1.WarehouseLocation);
    }
    async create(createLocationDto) {
        const locationRepo = await this.getLocationRepository();
        const existingLocation = await locationRepo.findOne({
            where: {
                warehouseId: createLocationDto.warehouseId,
                locationCode: createLocationDto.locationCode,
            },
        });
        if (existingLocation) {
            throw new common_1.BadRequestException(`Location with code ${createLocationDto.locationCode} already exists in this warehouse`);
        }
        const barcode = createLocationDto.barcode ||
            `LOC-${createLocationDto.warehouseId.substring(0, 8)}-${createLocationDto.locationCode}`;
        const location = locationRepo.create({
            id: (0, uuid_1.v4)(),
            ...createLocationDto,
            barcode,
            status: enums_1.LocationStatus.AVAILABLE,
        });
        return locationRepo.save(location);
    }
    async findAll(paginationDto, filterDto) {
        const locationRepo = await this.getLocationRepository();
        const queryBuilder = locationRepo
            .createQueryBuilder('location')
            .leftJoinAndSelect('location.warehouse', 'warehouse')
            .leftJoinAndSelect('location.zone', 'zone');
        if (filterDto.warehouseId) {
            queryBuilder.andWhere('location.warehouseId = :warehouseId', {
                warehouseId: filterDto.warehouseId,
            });
        }
        if (filterDto.zoneId) {
            queryBuilder.andWhere('location.zoneId = :zoneId', {
                zoneId: filterDto.zoneId,
            });
        }
        if (filterDto.locationType) {
            queryBuilder.andWhere('location.locationType = :locationType', {
                locationType: filterDto.locationType,
            });
        }
        if (filterDto.status) {
            queryBuilder.andWhere('location.status = :status', {
                status: filterDto.status,
            });
        }
        if (filterDto.aisle) {
            queryBuilder.andWhere('location.aisle = :aisle', {
                aisle: filterDto.aisle,
            });
        }
        if (filterDto.rack) {
            queryBuilder.andWhere('location.rack = :rack', {
                rack: filterDto.rack,
            });
        }
        if (paginationDto.search) {
            queryBuilder.andWhere('(location.locationCode LIKE :search OR location.locationName LIKE :search OR location.barcode LIKE :search)', { search: `%${paginationDto.search}%` });
        }
        if (!paginationDto.sortBy) {
            paginationDto.sortBy = 'locationCode';
            paginationDto.sortOrder = 'ASC';
        }
        return (0, pagination_util_1.paginate)(queryBuilder, paginationDto);
    }
    async findByWarehouse(warehouseId) {
        const locationRepo = await this.getLocationRepository();
        return locationRepo.find({
            where: { warehouseId },
            relations: ['zone'],
            order: { locationCode: 'ASC' },
        });
    }
    async findByZone(zoneId) {
        const locationRepo = await this.getLocationRepository();
        return locationRepo.find({
            where: { zoneId },
            order: { locationCode: 'ASC' },
        });
    }
    async getAvailableLocations(warehouseId, zoneId) {
        const locationRepo = await this.getLocationRepository();
        const queryBuilder = locationRepo
            .createQueryBuilder('location')
            .where('location.warehouseId = :warehouseId', { warehouseId })
            .andWhere('location.status = :status', {
            status: enums_1.LocationStatus.AVAILABLE,
        })
            .andWhere('(location.maxUnits IS NULL OR location.currentUnits < location.maxUnits)');
        if (zoneId) {
            queryBuilder.andWhere('location.zoneId = :zoneId', { zoneId });
        }
        queryBuilder.orderBy('location.currentUnits', 'ASC');
        return queryBuilder.getMany();
    }
    async findById(id) {
        const locationRepo = await this.getLocationRepository();
        const location = await locationRepo.findOne({
            where: { id },
            relations: ['warehouse', 'zone'],
        });
        if (!location) {
            throw new common_1.NotFoundException(`Location with ID ${id} not found`);
        }
        return location;
    }
    async findByBarcode(barcode) {
        const locationRepo = await this.getLocationRepository();
        return locationRepo.findOne({
            where: { barcode },
            relations: ['warehouse', 'zone'],
        });
    }
    async update(id, updateLocationDto) {
        const locationRepo = await this.getLocationRepository();
        const location = await this.findById(id);
        if (updateLocationDto.locationCode &&
            updateLocationDto.locationCode !== location.locationCode) {
            const existingCode = await locationRepo.findOne({
                where: {
                    warehouseId: location.warehouseId,
                    locationCode: updateLocationDto.locationCode,
                },
            });
            if (existingCode) {
                throw new common_1.BadRequestException(`Location with code ${updateLocationDto.locationCode} already exists in this warehouse`);
            }
        }
        Object.assign(location, updateLocationDto);
        return locationRepo.save(location);
    }
    async remove(id) {
        const locationRepo = await this.getLocationRepository();
        const dataSource = await this.tenantConnectionManager.getDataSource();
        const inventoryCount = await dataSource
            .createQueryBuilder()
            .select('COUNT(*)', 'count')
            .from('location_inventory', 'li')
            .where('li.location_id = :id', { id })
            .andWhere('li.quantity > 0')
            .getRawOne();
        if (parseInt(inventoryCount.count) > 0) {
            throw new common_1.BadRequestException('Cannot delete location with existing inventory');
        }
        await locationRepo.delete(id);
    }
    async updateStatus(id, status) {
        const location = await this.findById(id);
        location.status = status;
        const locationRepo = await this.getLocationRepository();
        return locationRepo.save(location);
    }
    async getInventory(locationId) {
        const dataSource = await this.tenantConnectionManager.getDataSource();
        const locationInvRepo = dataSource.getRepository(tenant_1.LocationInventory);
        return locationInvRepo.find({
            where: { locationId },
            relations: ['product', 'variant', 'batch'],
        });
    }
    async getUtilization(locationId) {
        const location = await this.findById(locationId);
        const weightUtilization = location.maxWeightKg
            ? (Number(location.currentWeightKg) / Number(location.maxWeightKg)) * 100
            : null;
        const volumeUtilization = location.maxVolumeCbm
            ? (Number(location.currentVolumeCbm) / Number(location.maxVolumeCbm)) *
                100
            : null;
        const unitsUtilization = location.maxUnits
            ? (Number(location.currentUnits) / Number(location.maxUnits)) * 100
            : null;
        return {
            weightUtilization,
            volumeUtilization,
            unitsUtilization,
        };
    }
    async bulkCreate(warehouseId, zoneId, config) {
        const locationRepo = await this.getLocationRepository();
        let created = 0;
        const aisles = this.generateRange(config.aisleStart, config.aisleEnd);
        const racks = this.generateRange(config.rackStart, config.rackEnd);
        for (const aisle of aisles) {
            for (const rack of racks) {
                for (let shelf = config.shelfStart; shelf <= config.shelfEnd; shelf++) {
                    const binStart = config.binStart || 1;
                    const binEnd = config.binEnd || 1;
                    for (let bin = binStart; bin <= binEnd; bin++) {
                        const locationCode = `${aisle}-${rack}-${String(shelf).padStart(2, '0')}-${String(bin).padStart(2, '0')}`;
                        const locationName = `Aisle ${aisle}, Rack ${rack}, Shelf ${shelf}, Bin ${bin}`;
                        try {
                            const location = locationRepo.create({
                                id: (0, uuid_1.v4)(),
                                warehouseId,
                                zoneId,
                                locationCode,
                                locationName,
                                aisle,
                                rack,
                                shelf: String(shelf),
                                bin: String(bin),
                                locationType: config.locationType,
                                barcode: `LOC-${locationCode}`,
                                status: enums_1.LocationStatus.AVAILABLE,
                            });
                            await locationRepo.save(location);
                            created++;
                        }
                        catch (error) {
                            console.log(error);
                        }
                    }
                }
            }
        }
        return { created };
    }
    generateRange(start, end) {
        const result = [];
        if (/^\d+$/.test(start) && /^\d+$/.test(end)) {
            for (let i = parseInt(start); i <= parseInt(end); i++) {
                result.push(String(i).padStart(start.length, '0'));
            }
        }
        else {
            for (let i = start.charCodeAt(0); i <= end.charCodeAt(0); i++) {
                result.push(String.fromCharCode(i));
            }
        }
        return result;
    }
    async count(warehouseId) {
        const locationRepo = await this.getLocationRepository();
        if (warehouseId) {
            return locationRepo.count({ where: { warehouseId } });
        }
        return locationRepo.count();
    }
};
exports.LocationsService = LocationsService;
exports.LocationsService = LocationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tenant_connection_manager_1.TenantConnectionManager])
], LocationsService);
//# sourceMappingURL=locations.service.js.map