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
exports.BrandsService = void 0;
const common_1 = require("@nestjs/common");
const uuid_1 = require("uuid");
const tenant_connection_manager_1 = require("../../../database/tenant-connection.manager");
const brand_entity_1 = require("../../../entities/tenant/inventory/brand.entity");
const pagination_util_1 = require("../../../common/utils/pagination.util");
let BrandsService = class BrandsService {
    tenantConnectionManager;
    constructor(tenantConnectionManager) {
        this.tenantConnectionManager = tenantConnectionManager;
    }
    async getBrandRepository() {
        return this.tenantConnectionManager.getRepository(brand_entity_1.Brand);
    }
    async create(createBrandDto) {
        const brandRepo = await this.getBrandRepository();
        const existingBrand = await brandRepo.findOne({
            where: { brandCode: createBrandDto.brandCode },
        });
        if (existingBrand) {
            throw new common_1.BadRequestException(`Brand with code ${createBrandDto.brandCode} already exists`);
        }
        const brand = brandRepo.create({
            id: (0, uuid_1.v4)(),
            ...createBrandDto,
        });
        return brandRepo.save(brand);
    }
    async findAll(paginationDto) {
        const brandRepo = await this.getBrandRepository();
        const queryBuilder = brandRepo.createQueryBuilder('brand');
        if (paginationDto.search) {
            queryBuilder.where('(brand.brandCode LIKE :search OR brand.brandName LIKE :search)', { search: `%${paginationDto.search}%` });
        }
        if (!paginationDto.sortBy) {
            paginationDto.sortBy = 'brandName';
            paginationDto.sortOrder = 'ASC';
        }
        return (0, pagination_util_1.paginate)(queryBuilder, paginationDto);
    }
    async findAllActive() {
        const brandRepo = await this.getBrandRepository();
        return brandRepo.find({
            where: { isActive: true },
            order: { brandName: 'ASC' },
        });
    }
    async findById(id) {
        const brandRepo = await this.getBrandRepository();
        const brand = await brandRepo.findOne({ where: { id } });
        if (!brand) {
            throw new common_1.NotFoundException(`Brand with ID ${id} not found`);
        }
        return brand;
    }
    async findByCode(code) {
        const brandRepo = await this.getBrandRepository();
        return brandRepo.findOne({ where: { brandCode: code } });
    }
    async update(id, updateBrandDto) {
        const brandRepo = await this.getBrandRepository();
        const brand = await this.findById(id);
        if (updateBrandDto.brandCode &&
            updateBrandDto.brandCode !== brand.brandCode) {
            const existingCode = await brandRepo.findOne({
                where: { brandCode: updateBrandDto.brandCode },
            });
            if (existingCode) {
                throw new common_1.BadRequestException(`Brand with code ${updateBrandDto.brandCode} already exists`);
            }
        }
        Object.assign(brand, updateBrandDto);
        return brandRepo.save(brand);
    }
    async remove(id) {
        const brandRepo = await this.getBrandRepository();
        const dataSource = await this.tenantConnectionManager.getDataSource();
        const productCount = await dataSource
            .createQueryBuilder()
            .select('COUNT(*)', 'count')
            .from('products', 'p')
            .where('p.brand_id = :id', { id })
            .andWhere('p.deleted_at IS NULL')
            .getRawOne();
        if (parseInt(productCount.count) > 0) {
            throw new common_1.BadRequestException('Cannot delete brand with associated products');
        }
        await brandRepo.delete(id);
    }
    async count() {
        const brandRepo = await this.getBrandRepository();
        return brandRepo.count();
    }
};
exports.BrandsService = BrandsService;
exports.BrandsService = BrandsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tenant_connection_manager_1.TenantConnectionManager])
], BrandsService);
//# sourceMappingURL=brands.service.js.map