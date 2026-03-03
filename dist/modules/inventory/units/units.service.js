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
exports.UnitsService = void 0;
const common_1 = require("@nestjs/common");
const uuid_1 = require("uuid");
const tenant_connection_manager_1 = require("../../../database/tenant-connection.manager");
const pagination_util_1 = require("../../../common/utils/pagination.util");
const tenant_1 = require("../../../entities/tenant");
const uom_conversion_entity_1 = require("../../../entities/tenant/inventory/uom-conversion.entity");
let UnitsService = class UnitsService {
    tenantConnectionManager;
    constructor(tenantConnectionManager) {
        this.tenantConnectionManager = tenantConnectionManager;
    }
    async getUomRepository() {
        return this.tenantConnectionManager.getRepository(tenant_1.UnitOfMeasure);
    }
    async create(createUnitDto) {
        const uomRepo = await this.getUomRepository();
        const existingUom = await uomRepo.findOne({
            where: { uomCode: createUnitDto.uomCode },
        });
        if (existingUom) {
            throw new common_1.BadRequestException(`Unit with code ${createUnitDto.uomCode} already exists`);
        }
        const uom = uomRepo.create({
            id: (0, uuid_1.v4)(),
            ...createUnitDto,
        });
        return uomRepo.save(uom);
    }
    async findAll(paginationDto) {
        const uomRepo = await this.getUomRepository();
        const queryBuilder = uomRepo.createQueryBuilder('uom');
        if (paginationDto.search) {
            queryBuilder.where('(uom.uomCode LIKE :search OR uom.uomName LIKE :search)', { search: `%${paginationDto.search}%` });
        }
        if (!paginationDto.sortBy) {
            paginationDto.sortBy = 'uomName';
            paginationDto.sortOrder = 'ASC';
        }
        return (0, pagination_util_1.paginate)(queryBuilder, paginationDto);
    }
    async findAllActive() {
        const uomRepo = await this.getUomRepository();
        return uomRepo.find({
            where: { isActive: true },
            order: { uomName: 'ASC' },
        });
    }
    async findByType(uomType) {
        const uomRepo = await this.getUomRepository();
        return uomRepo.find({
            where: { uomType: uomType, isActive: true },
            order: { uomName: 'ASC' },
        });
    }
    async findById(id) {
        const uomRepo = await this.getUomRepository();
        const uom = await uomRepo.findOne({
            where: { id },
            relations: ['conversionsFrom', 'conversionsTo'],
        });
        if (!uom) {
            throw new common_1.NotFoundException(`Unit with ID ${id} not found`);
        }
        return uom;
    }
    async findByCode(code) {
        const uomRepo = await this.getUomRepository();
        return uomRepo.findOne({ where: { uomCode: code } });
    }
    async update(id, updateUnitDto) {
        const uomRepo = await this.getUomRepository();
        const uom = await this.findById(id);
        if (updateUnitDto.uomCode && updateUnitDto.uomCode !== uom.uomCode) {
            const existingCode = await uomRepo.findOne({
                where: { uomCode: updateUnitDto.uomCode },
            });
            if (existingCode) {
                throw new common_1.BadRequestException(`Unit with code ${updateUnitDto.uomCode} already exists`);
            }
        }
        Object.assign(uom, updateUnitDto);
        return uomRepo.save(uom);
    }
    async remove(id) {
        const uomRepo = await this.getUomRepository();
        const dataSource = await this.tenantConnectionManager.getDataSource();
        const productCount = await dataSource
            .createQueryBuilder()
            .select('COUNT(*)', 'count')
            .from('products', 'p')
            .where('(p.base_uom_id = :id OR p.secondary_uom_id = :id)', { id })
            .andWhere('p.deleted_at IS NULL')
            .getRawOne();
        if (parseInt(productCount.count) > 0) {
            throw new common_1.BadRequestException('Cannot delete unit used by products');
        }
        await uomRepo.delete(id);
    }
    async createConversion(dto) {
        const dataSource = await this.tenantConnectionManager.getDataSource();
        const conversionRepo = dataSource.getRepository(uom_conversion_entity_1.UomConversion);
        await this.findById(dto.fromUomId);
        await this.findById(dto.toUomId);
        const existing = await conversionRepo.findOne({
            where: {
                fromUomId: dto.fromUomId,
                toUomId: dto.toUomId,
            },
        });
        if (existing) {
            throw new common_1.BadRequestException('Conversion between these units already exists');
        }
        const conversion = conversionRepo.create({
            id: (0, uuid_1.v4)(),
            ...dto,
        });
        return conversionRepo.save(conversion);
    }
    async getConversions(uomId) {
        const dataSource = await this.tenantConnectionManager.getDataSource();
        const conversionRepo = dataSource.getRepository(uom_conversion_entity_1.UomConversion);
        return conversionRepo.find({
            where: [{ fromUomId: uomId }, { toUomId: uomId }],
            relations: ['fromUom', 'toUom'],
        });
    }
    async convert(fromUomId, toUomId, quantity) {
        if (fromUomId === toUomId) {
            return quantity;
        }
        const dataSource = await this.tenantConnectionManager.getDataSource();
        const conversionRepo = dataSource.getRepository(uom_conversion_entity_1.UomConversion);
        let conversion = await conversionRepo.findOne({
            where: { fromUomId, toUomId },
        });
        if (conversion) {
            return quantity * Number(conversion.conversionFactor);
        }
        conversion = await conversionRepo.findOne({
            where: { fromUomId: toUomId, toUomId: fromUomId },
        });
        if (conversion) {
            return quantity / Number(conversion.conversionFactor);
        }
        throw new common_1.BadRequestException('No conversion factor found between these units');
    }
    async updateConversion(conversionId, conversionFactor) {
        const dataSource = await this.tenantConnectionManager.getDataSource();
        const conversionRepo = dataSource.getRepository(uom_conversion_entity_1.UomConversion);
        const conversion = await conversionRepo.findOne({
            where: { id: conversionId },
        });
        if (!conversion) {
            throw new common_1.NotFoundException(`Conversion with ID ${conversionId} not found`);
        }
        conversion.conversionFactor = conversionFactor;
        return conversionRepo.save(conversion);
    }
    async removeConversion(conversionId) {
        const dataSource = await this.tenantConnectionManager.getDataSource();
        const conversionRepo = dataSource.getRepository(uom_conversion_entity_1.UomConversion);
        await conversionRepo.delete(conversionId);
    }
    async count() {
        const uomRepo = await this.getUomRepository();
        return uomRepo.count();
    }
};
exports.UnitsService = UnitsService;
exports.UnitsService = UnitsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tenant_connection_manager_1.TenantConnectionManager])
], UnitsService);
//# sourceMappingURL=units.service.js.map