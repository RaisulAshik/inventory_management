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
exports.FiscalPeriodsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const enums_1 = require("../../../common/enums");
const tenant_1 = require("../../../entities/tenant");
const tenant_connection_manager_1 = require("../../../database/tenant-connection.manager");
let FiscalPeriodsService = class FiscalPeriodsService {
    tenantConnectionManager;
    constructor(tenantConnectionManager) {
        this.tenantConnectionManager = tenantConnectionManager;
    }
    async getRepo() {
        return this.tenantConnectionManager.getRepository(tenant_1.FiscalPeriod);
    }
    async create(dto) {
        const repo = await this.getRepo();
        const period = repo.create(dto);
        return repo.save(period);
    }
    async findAll(query) {
        const repo = await this.getRepo();
        const { fiscalYearId, status, page = 1, limit = 20 } = query;
        const qb = repo
            .createQueryBuilder('fp')
            .leftJoinAndSelect('fp.fiscalYear', 'fy');
        if (fiscalYearId)
            qb.andWhere('fp.fiscalYearId = :fiscalYearId', { fiscalYearId });
        if (status)
            qb.andWhere('fp.status = :status', { status });
        qb.orderBy('fp.periodNumber', 'ASC')
            .skip((page - 1) * limit)
            .take(limit);
        const [data, total] = await qb.getManyAndCount();
        return { data, total, page, limit };
    }
    async findOne(id) {
        const repo = await this.getRepo();
        const period = await repo.findOne({
            where: { id },
            relations: ['fiscalYear'],
        });
        if (!period)
            throw new common_1.NotFoundException(`Fiscal period ${id} not found`);
        return period;
    }
    async findByDate(date) {
        const repo = await this.getRepo();
        const period = await repo.findOne({
            where: {
                startDate: (0, typeorm_1.LessThanOrEqual)(date),
                endDate: (0, typeorm_1.MoreThanOrEqual)(date),
            },
            relations: ['fiscalYear'],
        });
        if (!period)
            throw new common_1.NotFoundException(`No fiscal period found for date ${date}`);
        return period;
    }
    async update(id, dto) {
        const repo = await this.getRepo();
        const period = await this.findOne(id);
        Object.assign(period, dto);
        return repo.save(period);
    }
    async close(id, userId) {
        const repo = await this.getRepo();
        const period = await this.findOne(id);
        if (period.status === enums_1.FiscalPeriodStatus.CLOSED)
            throw new common_1.BadRequestException('Fiscal period is already closed');
        if (period.periodNumber > 1) {
            const priorOpen = await repo
                .createQueryBuilder('fp')
                .where('fp.fiscalYearId = :fyId', { fyId: period.fiscalYearId })
                .andWhere('fp.periodNumber < :pn', { pn: period.periodNumber })
                .andWhere('fp.status != :status', { status: enums_1.FiscalPeriodStatus.CLOSED })
                .getCount();
            if (priorOpen > 0)
                throw new common_1.BadRequestException('Cannot close period: prior periods are still open');
        }
        period.status = enums_1.FiscalPeriodStatus.CLOSED;
        period.closedBy = userId;
        period.closedAt = new Date();
        return repo.save(period);
    }
    async reopen(id) {
        const repo = await this.getRepo();
        const period = await this.findOne(id);
        if (period.status !== enums_1.FiscalPeriodStatus.CLOSED)
            throw new common_1.BadRequestException('Fiscal period is not closed');
        period.status = enums_1.FiscalPeriodStatus.OPEN;
        return repo.save(period);
    }
};
exports.FiscalPeriodsService = FiscalPeriodsService;
exports.FiscalPeriodsService = FiscalPeriodsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tenant_connection_manager_1.TenantConnectionManager])
], FiscalPeriodsService);
//# sourceMappingURL=fiscal-periods.service.js.map