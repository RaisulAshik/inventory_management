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
exports.BudgetsService = void 0;
const tenant_1 = require("../../../entities/tenant");
const common_1 = require("@nestjs/common");
const tenant_connection_manager_1 = require("../../../database/tenant-connection.manager");
let BudgetsService = class BudgetsService {
    tenantConnectionManager;
    constructor(tenantConnectionManager) {
        this.tenantConnectionManager = tenantConnectionManager;
    }
    async getBudgetRepo() {
        return this.tenantConnectionManager.getRepository(tenant_1.Budget);
    }
    async getBudgetLineRepo() {
        return this.tenantConnectionManager.getRepository(tenant_1.BudgetLine);
    }
    async create(dto, userId) {
        const budgetRepo = await this.getBudgetRepo();
        const budgetLineRepo = await this.getBudgetLineRepo();
        const dataSource = await this.tenantConnectionManager.getDataSource();
        const existing = await budgetRepo.findOne({
            where: { budgetCode: dto.budgetCode },
        });
        if (existing)
            throw new common_1.ConflictException(`Budget code ${dto.budgetCode} already exists`);
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const budget = budgetRepo.create({
                ...dto,
                status: tenant_1.BudgetStatus.DRAFT,
                createdBy: userId,
            });
            const savedBudget = await queryRunner.manager.save(tenant_1.Budget, budget);
            if (dto.lines?.length) {
                let allocatedAmount = 0;
                const lines = dto.lines.map((lineDto) => {
                    allocatedAmount += Number(lineDto.budgetAmount);
                    return budgetLineRepo.create({
                        ...lineDto,
                        budgetId: savedBudget.id,
                    });
                });
                await queryRunner.manager.save(tenant_1.BudgetLine, lines);
                savedBudget.allocatedAmount = allocatedAmount;
                await queryRunner.manager.save(tenant_1.Budget, savedBudget);
            }
            await queryRunner.commitTransaction();
            return this.findOne(savedBudget.id);
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async findAll(query) {
        const budgetRepo = await this.getBudgetRepo();
        const { budgetType, status, fiscalYearId, costCenterId, search, page = 1, limit = 20, } = query;
        const qb = budgetRepo.createQueryBuilder('b');
        qb.leftJoinAndSelect('b.fiscalYear', 'fy');
        qb.leftJoinAndSelect('b.costCenter', 'cc');
        if (budgetType)
            qb.andWhere('b.budgetType = :budgetType', { budgetType });
        if (status)
            qb.andWhere('b.status = :status', { status });
        if (fiscalYearId)
            qb.andWhere('b.fiscalYearId = :fiscalYearId', { fiscalYearId });
        if (costCenterId)
            qb.andWhere('b.costCenterId = :costCenterId', { costCenterId });
        if (search)
            qb.andWhere('(b.budgetCode LIKE :search OR b.budgetName LIKE :search)', {
                search: `%${search}%`,
            });
        qb.orderBy('b.createdAt', 'DESC')
            .skip((page - 1) * limit)
            .take(limit);
        const [data, total] = await qb.getManyAndCount();
        return { data, total, page, limit };
    }
    async findOne(id) {
        const budgetRepo = await this.getBudgetRepo();
        const budget = await budgetRepo.findOne({
            where: { id },
            relations: [
                'lines',
                'lines.account',
                'lines.fiscalPeriod',
                'fiscalYear',
                'costCenter',
            ],
        });
        if (!budget)
            throw new common_1.NotFoundException(`Budget ${id} not found`);
        return budget;
    }
    async update(id, dto) {
        const budgetRepo = await this.getBudgetRepo();
        const budget = await this.findOne(id);
        if (budget.status !== tenant_1.BudgetStatus.DRAFT &&
            budget.status !== tenant_1.BudgetStatus.REJECTED) {
            throw new common_1.BadRequestException('Only draft or rejected budgets can be updated');
        }
        Object.assign(budget, { ...dto, lines: undefined });
        return budgetRepo.save(budget);
    }
    async addLine(budgetId, dto) {
        const budgetRepo = await this.getBudgetRepo();
        const budgetLineRepo = await this.getBudgetLineRepo();
        const budget = await this.findOne(budgetId);
        const line = budgetLineRepo.create({ ...dto, budgetId });
        const savedLine = await budgetLineRepo.save(line);
        budget.allocatedAmount =
            Number(budget.allocatedAmount) + Number(dto.budgetAmount);
        await budgetRepo.save(budget);
        return savedLine;
    }
    async updateLine(lineId, dto) {
        const budgetLineRepo = await this.getBudgetLineRepo();
        const line = await budgetLineRepo.findOne({
            where: { id: lineId },
            relations: ['budget'],
        });
        if (!line)
            throw new common_1.NotFoundException(`Budget line ${lineId} not found`);
        Object.assign(line, dto);
        return budgetLineRepo.save(line);
    }
    async removeLine(lineId) {
        const budgetRepo = await this.getBudgetRepo();
        const budgetLineRepo = await this.getBudgetLineRepo();
        const line = await budgetLineRepo.findOne({
            where: { id: lineId },
            relations: ['budget'],
        });
        if (!line)
            throw new common_1.NotFoundException(`Budget line ${lineId} not found`);
        const budget = line.budget;
        budget.allocatedAmount =
            Number(budget.allocatedAmount) - Number(line.budgetAmount);
        await budgetRepo.save(budget);
        await budgetLineRepo.remove(line);
    }
    async submitForApproval(id) {
        const budgetRepo = await this.getBudgetRepo();
        const budget = await this.findOne(id);
        if (budget.status !== tenant_1.BudgetStatus.DRAFT)
            throw new common_1.BadRequestException('Only draft budgets can be submitted for approval');
        budget.status = tenant_1.BudgetStatus.PENDING_APPROVAL;
        return budgetRepo.save(budget);
    }
    async approve(id, dto, userId) {
        const budgetRepo = await this.getBudgetRepo();
        const budget = await this.findOne(id);
        if (budget.status !== tenant_1.BudgetStatus.PENDING_APPROVAL)
            throw new common_1.BadRequestException('Only pending budgets can be approved');
        budget.status = tenant_1.BudgetStatus.APPROVED;
        budget.approvedBy = userId;
        budget.approvedAt = new Date();
        if (dto.notes)
            budget.notes = dto.notes;
        return budgetRepo.save(budget);
    }
    async reject(id, dto, _userId) {
        const budgetRepo = await this.getBudgetRepo();
        const budget = await this.findOne(id);
        if (budget.status !== tenant_1.BudgetStatus.PENDING_APPROVAL)
            throw new common_1.BadRequestException('Only pending budgets can be rejected');
        budget.status = tenant_1.BudgetStatus.REJECTED;
        if (dto.notes)
            budget.notes = dto.notes;
        return budgetRepo.save(budget);
    }
    async activate(id) {
        const budgetRepo = await this.getBudgetRepo();
        const budget = await this.findOne(id);
        if (budget.status !== tenant_1.BudgetStatus.APPROVED)
            throw new common_1.BadRequestException('Only approved budgets can be activated');
        budget.status = tenant_1.BudgetStatus.ACTIVE;
        return budgetRepo.save(budget);
    }
    async close(id) {
        const budgetRepo = await this.getBudgetRepo();
        const budget = await this.findOne(id);
        if (budget.status !== tenant_1.BudgetStatus.ACTIVE)
            throw new common_1.BadRequestException('Only active budgets can be closed');
        budget.status = tenant_1.BudgetStatus.CLOSED;
        return budgetRepo.save(budget);
    }
    async getBudgetVsActual(id) {
        const budget = await this.findOne(id);
        const lines = budget.lines.map((line) => ({
            accountId: line.accountId,
            accountCode: line.account?.accountCode,
            accountName: line.account?.accountName,
            budgetAmount: Number(line.budgetAmount),
            revisedAmount: line.revisedAmount ? Number(line.revisedAmount) : null,
            effectiveBudget: line.effectiveBudgetAmount,
            utilizedAmount: Number(line.utilizedAmount),
            committedAmount: Number(line.committedAmount),
            availableAmount: line.availableAmount,
            variance: line.variance,
            variancePercentage: line.variancePercentage,
            monthlyBreakdown: {
                january: Number(line.januaryAmount),
                february: Number(line.februaryAmount),
                march: Number(line.marchAmount),
                april: Number(line.aprilAmount),
                may: Number(line.mayAmount),
                june: Number(line.juneAmount),
                july: Number(line.julyAmount),
                august: Number(line.augustAmount),
                september: Number(line.septemberAmount),
                october: Number(line.octoberAmount),
                november: Number(line.novemberAmount),
                december: Number(line.decemberAmount),
            },
        }));
        return {
            budget: {
                id: budget.id,
                budgetCode: budget.budgetCode,
                budgetName: budget.budgetName,
                totalBudgetAmount: Number(budget.totalBudgetAmount),
                allocatedAmount: Number(budget.allocatedAmount),
                utilizedAmount: Number(budget.utilizedAmount),
                committedAmount: Number(budget.committedAmount),
                availableAmount: budget.availableAmount,
                utilizationPercentage: budget.utilizationPercentage,
                isOverBudget: budget.isOverBudget,
            },
            lines,
        };
    }
    async remove(id) {
        const budgetRepo = await this.getBudgetRepo();
        const budgetLineRepo = await this.getBudgetLineRepo();
        const budget = await this.findOne(id);
        if (budget.status !== tenant_1.BudgetStatus.DRAFT)
            throw new common_1.BadRequestException('Only draft budgets can be deleted');
        await budgetLineRepo.delete({ budgetId: id });
        await budgetRepo.remove(budget);
    }
};
exports.BudgetsService = BudgetsService;
exports.BudgetsService = BudgetsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tenant_connection_manager_1.TenantConnectionManager])
], BudgetsService);
//# sourceMappingURL=budgets.service.js.map