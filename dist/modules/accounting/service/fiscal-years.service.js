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
exports.FiscalYearsService = void 0;
const common_1 = require("@nestjs/common");
const enums_1 = require("../../../common/enums");
const tenant_1 = require("../../../entities/tenant");
const tenant_connection_manager_1 = require("../../../database/tenant-connection.manager");
let FiscalYearsService = class FiscalYearsService {
    tenantConnectionManager;
    constructor(tenantConnectionManager) {
        this.tenantConnectionManager = tenantConnectionManager;
    }
    async getFYRepo() {
        return this.tenantConnectionManager.getRepository(tenant_1.FiscalYear);
    }
    async getFPRepo() {
        return this.tenantConnectionManager.getRepository(tenant_1.FiscalPeriod);
    }
    async create(dto) {
        const fyRepo = await this.getFYRepo();
        const existing = await fyRepo.findOne({
            where: { yearCode: dto.yearCode },
        });
        if (existing)
            throw new common_1.ConflictException(`Fiscal year code ${dto.yearCode} already exists`);
        const overlapping = await fyRepo
            .createQueryBuilder('fy')
            .where('(fy.startDate <= :endDate AND fy.endDate >= :startDate)', {
            startDate: dto.startDate,
            endDate: dto.endDate,
        })
            .getCount();
        if (overlapping > 0)
            throw new common_1.ConflictException('Fiscal year dates overlap with existing fiscal year');
        if (dto.isCurrent)
            await fyRepo.update({}, { isCurrent: false });
        const fiscalYear = fyRepo.create(dto);
        const saved = await fyRepo.save(fiscalYear);
        await this.generateMonthlyPeriods(saved);
        return this.findOne(saved.id);
    }
    async generateMonthlyPeriods(fiscalYear) {
        const fpRepo = await this.getFPRepo();
        const start = new Date(fiscalYear.startDate);
        const periods = [];
        const monthNames = [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
        ];
        for (let i = 0; i < 12; i++) {
            const periodStart = new Date(start.getFullYear(), start.getMonth() + i, start.getDate());
            const periodEnd = new Date(start.getFullYear(), start.getMonth() + i + 1, 0);
            const fyEnd = new Date(fiscalYear.endDate);
            if (i === 11 || periodEnd > fyEnd)
                periodEnd.setTime(fyEnd.getTime());
            periods.push({
                fiscalYearId: fiscalYear.id,
                periodNumber: i + 1,
                periodName: `${monthNames[periodStart.getMonth()]} ${periodStart.getFullYear()}`,
                startDate: periodStart,
                endDate: periodEnd,
                status: enums_1.FiscalPeriodStatus.OPEN,
            });
        }
        await fpRepo.save(periods);
    }
    async findAll(query) {
        const fyRepo = await this.getFYRepo();
        const { status, isCurrent, page = 1, limit = 20 } = query;
        const qb = fyRepo
            .createQueryBuilder('fy')
            .leftJoinAndSelect('fy.periods', 'periods');
        if (status)
            qb.andWhere('fy.status = :status', { status });
        if (isCurrent !== undefined)
            qb.andWhere('fy.isCurrent = :isCurrent', { isCurrent });
        qb.orderBy('fy.startDate', 'DESC')
            .addOrderBy('periods.periodNumber', 'ASC')
            .skip((page - 1) * limit)
            .take(limit);
        const [data, total] = await qb.getManyAndCount();
        return { data, total, page, limit };
    }
    async findOne(id) {
        const fyRepo = await this.getFYRepo();
        const fy = await fyRepo.findOne({ where: { id }, relations: ['periods'] });
        if (!fy)
            throw new common_1.NotFoundException(`Fiscal year ${id} not found`);
        return fy;
    }
    async findCurrent() {
        const fyRepo = await this.getFYRepo();
        const fy = await fyRepo.findOne({
            where: { isCurrent: true },
            relations: ['periods'],
        });
        if (!fy)
            throw new common_1.NotFoundException('No current fiscal year found');
        return fy;
    }
    async update(id, dto) {
        const fyRepo = await this.getFYRepo();
        const fy = await this.findOne(id);
        if (dto.isCurrent)
            await fyRepo.update({}, { isCurrent: false });
        Object.assign(fy, dto);
        return fyRepo.save(fy);
    }
    async close(id, _dto, userId) {
        const fyRepo = await this.getFYRepo();
        const fpRepo = await this.getFPRepo();
        const fy = await this.findOne(id);
        if (fy.status === enums_1.FiscalPeriodStatus.CLOSED)
            throw new common_1.BadRequestException('Fiscal year is already closed');
        await fpRepo
            .createQueryBuilder()
            .update(tenant_1.FiscalPeriod)
            .set({
            status: enums_1.FiscalPeriodStatus.CLOSED,
            closedBy: userId,
            closedAt: new Date(),
        })
            .where('fiscalYearId = :id AND status != :status', {
            id,
            status: enums_1.FiscalPeriodStatus.CLOSED,
        })
            .execute();
        fy.status = enums_1.FiscalPeriodStatus.CLOSED;
        fy.closedBy = userId;
        fy.closedAt = new Date();
        fy.isCurrent = false;
        return fyRepo.save(fy);
    }
    async remove(id) {
        const fyRepo = await this.getFYRepo();
        const fpRepo = await this.getFPRepo();
        const fy = await this.findOne(id);
        if (fy.status === enums_1.FiscalPeriodStatus.CLOSED)
            throw new common_1.BadRequestException('Cannot delete a closed fiscal year');
        await fpRepo.delete({ fiscalYearId: id });
        await fyRepo.remove(fy);
    }
};
exports.FiscalYearsService = FiscalYearsService;
exports.FiscalYearsService = FiscalYearsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tenant_connection_manager_1.TenantConnectionManager])
], FiscalYearsService);
//# sourceMappingURL=fiscal-years.service.js.map