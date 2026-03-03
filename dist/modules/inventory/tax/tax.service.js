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
exports.TaxService = void 0;
const tenant_1 = require("../../../entities/tenant");
const common_1 = require("@nestjs/common");
const uuid_1 = require("uuid");
const tenant_connection_manager_1 = require("../../../database/tenant-connection.manager");
let TaxService = class TaxService {
    tenantConnectionManager;
    constructor(tenantConnectionManager) {
        this.tenantConnectionManager = tenantConnectionManager;
    }
    async getTaxCategoryRepository() {
        return this.tenantConnectionManager.getRepository(tenant_1.TaxCategory);
    }
    async getTaxRateRepository() {
        return this.tenantConnectionManager.getRepository(tenant_1.TaxRate);
    }
    async findAllCategories() {
        const categoryRepo = await this.getTaxCategoryRepository();
        return categoryRepo.find({ relations: ['taxRates'] });
    }
    async findCategoryByCode(taxCode) {
        const categoryRepo = await this.getTaxCategoryRepository();
        const category = await categoryRepo.findOne({
            where: { taxCode },
            relations: ['taxRates'],
        });
        if (!category)
            throw new common_1.NotFoundException(`Tax code ${taxCode} not found`);
        return category;
    }
    async findAllRates(categoryId) {
        const rateRepo = await this.getTaxRateRepository();
        return rateRepo.find({
            where: categoryId ? { taxCategoryId: categoryId } : undefined,
            relations: ['taxCategory'],
            order: { taxCategoryId: 'ASC', rateName: 'ASC' },
        });
    }
    async findActiveRates(categoryId) {
        const rateRepo = await this.getTaxRateRepository();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const queryBuilder = rateRepo
            .createQueryBuilder('rate')
            .leftJoinAndSelect('rate.taxCategory', 'category')
            .where('rate.isActive = :isActive', { isActive: true })
            .andWhere('rate.effectiveFrom <= :today', { today })
            .andWhere('(rate.effectiveTo IS NULL OR rate.effectiveTo >= :today)', {
            today,
        })
            .orderBy('category.taxCode', 'ASC')
            .addOrderBy('rate.rateName', 'ASC');
        if (categoryId) {
            queryBuilder.andWhere('rate.taxCategoryId = :categoryId', { categoryId });
        }
        return queryBuilder.getMany();
    }
    async findRateById(id) {
        const rateRepo = await this.getTaxRateRepository();
        const rate = await rateRepo.findOne({
            where: { id },
            relations: ['taxCategory'],
        });
        if (!rate)
            throw new common_1.NotFoundException(`Tax rate with ID ${id} not found`);
        return rate;
    }
    async createRate(dto) {
        const rateRepo = await this.getTaxRateRepository();
        const rate = rateRepo.create({
            id: (0, uuid_1.v4)(),
            taxCategoryId: dto.taxCategoryId,
            taxType: dto.taxType,
            rateName: dto.rateName,
            ratePercentage: dto.ratePercentage,
            effectiveFrom: dto.effectiveFrom,
            isActive: true,
        });
        return rateRepo.save(rate);
    }
};
exports.TaxService = TaxService;
exports.TaxService = TaxService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tenant_connection_manager_1.TenantConnectionManager])
], TaxService);
//# sourceMappingURL=tax.service.js.map