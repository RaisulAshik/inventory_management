import { Budget, BudgetLine, BudgetStatus } from '@/entities/tenant';
import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import {
  CreateBudgetDto,
  QueryBudgetDto,
  UpdateBudgetDto,
  CreateBudgetLineDto,
  UpdateBudgetLineDto,
  ApproveBudgetDto,
} from '../dto/budgets.dto';
import { TenantConnectionManager } from '@database/tenant-connection.manager';

@Injectable()
export class BudgetsService {
  constructor(
    private readonly tenantConnectionManager: TenantConnectionManager,
  ) {}

  private async getBudgetRepo(): Promise<Repository<Budget>> {
    return this.tenantConnectionManager.getRepository(Budget);
  }

  private async getBudgetLineRepo(): Promise<Repository<BudgetLine>> {
    return this.tenantConnectionManager.getRepository(BudgetLine);
  }

  async create(dto: CreateBudgetDto, userId?: string): Promise<Budget> {
    const budgetRepo = await this.getBudgetRepo();
    const budgetLineRepo = await this.getBudgetLineRepo();
    const dataSource = await this.tenantConnectionManager.getDataSource();

    const existing = await budgetRepo.findOne({
      where: { budgetCode: dto.budgetCode },
    });
    if (existing)
      throw new ConflictException(
        `Budget code ${dto.budgetCode} already exists`,
      );

    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const budget = budgetRepo.create({
        ...dto,
        status: BudgetStatus.DRAFT,
        createdBy: userId,
      });
      const savedBudget = await queryRunner.manager.save(Budget, budget);

      if (dto.lines?.length) {
        let allocatedAmount = 0;
        const lines = dto.lines.map((lineDto) => {
          allocatedAmount += Number(lineDto.budgetAmount);
          return budgetLineRepo.create({
            ...lineDto,
            budgetId: savedBudget.id,
          });
        });
        await queryRunner.manager.save(BudgetLine, lines);
        savedBudget.allocatedAmount = allocatedAmount;
        await queryRunner.manager.save(Budget, savedBudget);
      }

      await queryRunner.commitTransaction();
      return this.findOne(savedBudget.id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(query: QueryBudgetDto) {
    const budgetRepo = await this.getBudgetRepo();
    const {
      budgetType,
      status,
      fiscalYearId,
      costCenterId,
      search,
      page = 1,
      limit = 20,
    } = query;
    const qb = budgetRepo.createQueryBuilder('b');
    qb.leftJoinAndSelect('b.fiscalYear', 'fy');
    qb.leftJoinAndSelect('b.costCenter', 'cc');
    if (budgetType) qb.andWhere('b.budgetType = :budgetType', { budgetType });
    if (status) qb.andWhere('b.status = :status', { status });
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

  async findOne(id: string): Promise<Budget> {
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
    if (!budget) throw new NotFoundException(`Budget ${id} not found`);
    return budget;
  }

  async update(id: string, dto: UpdateBudgetDto): Promise<Budget> {
    const budgetRepo = await this.getBudgetRepo();
    const budget = await this.findOne(id);
    if (
      budget.status !== BudgetStatus.DRAFT &&
      budget.status !== BudgetStatus.REJECTED
    ) {
      throw new BadRequestException(
        'Only draft or rejected budgets can be updated',
      );
    }
    Object.assign(budget, { ...dto, lines: undefined });
    return budgetRepo.save(budget);
  }

  async addLine(
    budgetId: string,
    dto: CreateBudgetLineDto,
  ): Promise<BudgetLine> {
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

  async updateLine(
    lineId: string,
    dto: UpdateBudgetLineDto,
  ): Promise<BudgetLine> {
    const budgetLineRepo = await this.getBudgetLineRepo();
    const line = await budgetLineRepo.findOne({
      where: { id: lineId },
      relations: ['budget'],
    });
    if (!line) throw new NotFoundException(`Budget line ${lineId} not found`);
    Object.assign(line, dto);
    return budgetLineRepo.save(line);
  }

  async removeLine(lineId: string): Promise<void> {
    const budgetRepo = await this.getBudgetRepo();
    const budgetLineRepo = await this.getBudgetLineRepo();
    const line = await budgetLineRepo.findOne({
      where: { id: lineId },
      relations: ['budget'],
    });
    if (!line) throw new NotFoundException(`Budget line ${lineId} not found`);
    const budget = line.budget;
    budget.allocatedAmount =
      Number(budget.allocatedAmount) - Number(line.budgetAmount);
    await budgetRepo.save(budget);
    await budgetLineRepo.remove(line);
  }

  async submitForApproval(id: string): Promise<Budget> {
    const budgetRepo = await this.getBudgetRepo();
    const budget = await this.findOne(id);
    if (budget.status !== BudgetStatus.DRAFT)
      throw new BadRequestException(
        'Only draft budgets can be submitted for approval',
      );
    budget.status = BudgetStatus.PENDING_APPROVAL;
    return budgetRepo.save(budget);
  }

  async approve(
    id: string,
    dto: ApproveBudgetDto,
    userId: string,
  ): Promise<Budget> {
    const budgetRepo = await this.getBudgetRepo();
    const budget = await this.findOne(id);
    if (budget.status !== BudgetStatus.PENDING_APPROVAL)
      throw new BadRequestException('Only pending budgets can be approved');
    budget.status = BudgetStatus.APPROVED;
    budget.approvedBy = userId;
    budget.approvedAt = new Date();
    if (dto.notes) budget.notes = dto.notes;
    return budgetRepo.save(budget);
  }

  async reject(
    id: string,
    dto: ApproveBudgetDto,
    _userId: string,
  ): Promise<Budget> {
    const budgetRepo = await this.getBudgetRepo();
    const budget = await this.findOne(id);
    if (budget.status !== BudgetStatus.PENDING_APPROVAL)
      throw new BadRequestException('Only pending budgets can be rejected');
    budget.status = BudgetStatus.REJECTED;
    if (dto.notes) budget.notes = dto.notes;
    return budgetRepo.save(budget);
  }

  async activate(id: string): Promise<Budget> {
    const budgetRepo = await this.getBudgetRepo();
    const budget = await this.findOne(id);
    if (budget.status !== BudgetStatus.APPROVED)
      throw new BadRequestException('Only approved budgets can be activated');
    budget.status = BudgetStatus.ACTIVE;
    return budgetRepo.save(budget);
  }

  async close(id: string): Promise<Budget> {
    const budgetRepo = await this.getBudgetRepo();
    const budget = await this.findOne(id);
    if (budget.status !== BudgetStatus.ACTIVE)
      throw new BadRequestException('Only active budgets can be closed');
    budget.status = BudgetStatus.CLOSED;
    return budgetRepo.save(budget);
  }

  async getBudgetVsActual(id: string) {
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

  async remove(id: string): Promise<void> {
    const budgetRepo = await this.getBudgetRepo();
    const budgetLineRepo = await this.getBudgetLineRepo();
    const budget = await this.findOne(id);
    if (budget.status !== BudgetStatus.DRAFT)
      throw new BadRequestException('Only draft budgets can be deleted');
    await budgetLineRepo.delete({ budgetId: id });
    await budgetRepo.remove(budget);
  }
}
