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
exports.SupplierDuesService = void 0;
const common_1 = require("@nestjs/common");
const uuid_1 = require("uuid");
const tenant_connection_manager_1 = require("../../../database/tenant-connection.manager");
const pagination_util_1 = require("../../../common/utils/pagination.util");
const enums_1 = require("../../../common/enums");
const tenant_1 = require("../../../entities/tenant");
let SupplierDuesService = class SupplierDuesService {
    tenantConnectionManager;
    constructor(tenantConnectionManager) {
        this.tenantConnectionManager = tenantConnectionManager;
    }
    async getRepo() {
        return this.tenantConnectionManager.getRepository(tenant_1.SupplierDue);
    }
    async getDataSource() {
        return this.tenantConnectionManager.getDataSource();
    }
    async findAll(filterDto) {
        const repo = await this.getRepo();
        const qb = repo
            .createQueryBuilder('due')
            .leftJoinAndSelect('due.supplier', 'supplier');
        if (filterDto.status)
            qb.andWhere('due.status = :status', { status: filterDto.status });
        if (filterDto.supplierId)
            qb.andWhere('due.supplierId = :sid', { sid: filterDto.supplierId });
        if (filterDto.overdueOnly) {
            qb.andWhere('due.status NOT IN (:...settled)', {
                settled: [enums_1.DueStatus.PAID, enums_1.DueStatus.WRITTEN_OFF],
            });
            qb.andWhere('due.dueDate < :today', {
                today: new Date().toISOString().split('T')[0],
            });
        }
        if (filterDto.fromDate)
            qb.andWhere('due.dueDate >= :from', { from: filterDto.fromDate });
        if (filterDto.toDate)
            qb.andWhere('due.dueDate <= :to', { to: filterDto.toDate });
        if (filterDto.search) {
            qb.andWhere('(due.referenceNumber LIKE :s OR due.billNumber LIKE :s OR supplier.name LIKE :s OR supplier.companyName LIKE :s)', { s: `%${filterDto.search}%` });
        }
        if (!filterDto.sortBy) {
            filterDto.sortBy = 'dueDate';
            filterDto.sortOrder = 'ASC';
        }
        return (0, pagination_util_1.paginate)(qb, filterDto);
    }
    async findById(id) {
        const repo = await this.getRepo();
        const due = await repo.findOne({ where: { id }, relations: ['supplier'] });
        if (!due)
            throw new common_1.NotFoundException(`Supplier due ${id} not found`);
        return due;
    }
    async findBySupplier(supplierId) {
        const repo = await this.getRepo();
        const dues = await repo.find({
            where: { supplierId },
            relations: ['supplier'],
            order: { dueDate: 'ASC' },
        });
        const today = new Date();
        let totalDues = 0, totalPaid = 0, totalOutstanding = 0, overdueCount = 0, overdueAmount = 0;
        for (const due of dues) {
            totalDues += Number(due.originalAmount);
            totalPaid += Number(due.paidAmount);
            const balance = due.balanceAmount;
            if (![enums_1.DueStatus.PAID, enums_1.DueStatus.WRITTEN_OFF].includes(due.status)) {
                totalOutstanding += balance;
                if (new Date(due.dueDate) < today && balance > 0) {
                    overdueCount++;
                    overdueAmount += balance;
                }
            }
        }
        return {
            dues,
            summary: {
                supplierId,
                totalDues,
                totalPaid,
                totalOutstanding,
                overdueCount,
                overdueAmount,
            },
        };
    }
    async createFromGRN(supplierId, purchaseOrderId, referenceNumber, amount, dueDate, billNumber, billDate, currency = 'BDT') {
        const repo = await this.getRepo();
        const due = repo.create({
            id: (0, uuid_1.v4)(),
            supplierId,
            referenceType: tenant_1.SupplierDueReferenceType.PURCHASE_ORDER,
            purchaseOrderId,
            referenceNumber,
            billNumber,
            billDate,
            dueDate,
            originalAmount: amount,
            paidAmount: 0,
            adjustedAmount: 0,
            currency,
            status: enums_1.DueStatus.PENDING,
        });
        return repo.save(due);
    }
    async createOpeningBalance(dto, userId) {
        const repo = await this.getRepo();
        const due = repo.create({
            id: (0, uuid_1.v4)(),
            supplierId: dto.supplierId,
            referenceType: tenant_1.SupplierDueReferenceType.OPENING_BALANCE,
            referenceNumber: dto.referenceNumber || `SOB-${Date.now()}`,
            billNumber: dto.billNumber,
            billDate: dto.billDate,
            dueDate: dto.dueDate,
            originalAmount: dto.originalAmount,
            paidAmount: 0,
            adjustedAmount: 0,
            currency: dto.currency || 'BDT',
            status: enums_1.DueStatus.PENDING,
            notes: dto.notes,
        });
        return repo.save(due);
    }
    async adjustDue(id, dto, userId) {
        const repo = await this.getRepo();
        const due = await this.findById(id);
        if ([enums_1.DueStatus.PAID, enums_1.DueStatus.WRITTEN_OFF].includes(due.status)) {
            throw new common_1.BadRequestException('Cannot adjust a settled due');
        }
        const balance = due.balanceAmount;
        if (dto.amount > balance + 0.01) {
            throw new common_1.BadRequestException(`Adjustment (${dto.amount}) exceeds balance (${balance})`);
        }
        due.adjustedAmount = Number(due.adjustedAmount) + dto.amount;
        const note = `[${new Date().toISOString().split('T')[0]}] Adjusted ${dto.amount}${dto.reason ? ': ' + dto.reason : ''}`;
        due.notes = due.notes ? `${due.notes}\n${note}` : note;
        if (due.balanceAmount <= 0.01)
            due.status = enums_1.DueStatus.PAID;
        return repo.save(due);
    }
    async addPayment(dueId, amount, manager) {
        const repo = manager
            ? manager.getRepository(tenant_1.SupplierDue)
            : await this.getRepo();
        const due = await repo.findOne({ where: { id: dueId } });
        if (!due)
            throw new common_1.NotFoundException(`Supplier due ${dueId} not found`);
        due.paidAmount = Number(due.paidAmount) + amount;
        if (due.balanceAmount <= 0.01) {
            due.status = enums_1.DueStatus.PAID;
        }
        else if (Number(due.paidAmount) > 0) {
            due.status = enums_1.DueStatus.PARTIALLY_PAID;
        }
        return repo.save(due);
    }
    async reversePayment(dueId, amount, manager) {
        const repo = manager
            ? manager.getRepository(tenant_1.SupplierDue)
            : await this.getRepo();
        const due = await repo.findOne({ where: { id: dueId } });
        if (!due)
            throw new common_1.NotFoundException(`Supplier due ${dueId} not found`);
        due.paidAmount = Math.max(0, Number(due.paidAmount) - amount);
        if (due.balanceAmount <= 0.01)
            due.status = enums_1.DueStatus.PAID;
        else if (new Date(due.dueDate) < new Date())
            due.status = enums_1.DueStatus.OVERDUE;
        else if (Number(due.paidAmount) > 0)
            due.status = enums_1.DueStatus.PARTIALLY_PAID;
        else
            due.status = enums_1.DueStatus.PENDING;
        return repo.save(due);
    }
    async applyDebitNote(dueId, amount, manager) {
        const repo = manager
            ? manager.getRepository(tenant_1.SupplierDue)
            : await this.getRepo();
        const due = await repo.findOne({ where: { id: dueId } });
        if (!due)
            throw new common_1.NotFoundException(`Supplier due ${dueId} not found`);
        const balance = due.balanceAmount;
        if (amount > balance + 0.01) {
            throw new common_1.BadRequestException(`Debit note amount (${amount}) exceeds due balance (${balance})`);
        }
        due.adjustedAmount = Number(due.adjustedAmount) + amount;
        if (due.balanceAmount <= 0.01)
            due.status = enums_1.DueStatus.PAID;
        return repo.save(due);
    }
    async markOverdueDues() {
        const ds = await this.getDataSource();
        const result = await ds
            .createQueryBuilder()
            .update('supplier_dues')
            .set({ status: enums_1.DueStatus.OVERDUE })
            .where('status IN (:...statuses)', {
            statuses: [enums_1.DueStatus.PENDING, enums_1.DueStatus.PARTIALLY_PAID],
        })
            .andWhere('due_date < :today', {
            today: new Date().toISOString().split('T')[0],
        })
            .execute();
        return result.affected ?? 0;
    }
    async getUpcomingPayments(days = 7) {
        const repo = await this.getRepo();
        const today = new Date();
        const futureDate = new Date();
        futureDate.setDate(today.getDate() + days);
        return repo
            .createQueryBuilder('due')
            .leftJoinAndSelect('due.supplier', 'supplier')
            .where('due.status NOT IN (:...settled)', {
            settled: [enums_1.DueStatus.PAID, enums_1.DueStatus.WRITTEN_OFF],
        })
            .andWhere('due.dueDate BETWEEN :today AND :future', {
            today: today.toISOString().split('T')[0],
            future: futureDate.toISOString().split('T')[0],
        })
            .orderBy('due.dueDate', 'ASC')
            .getMany();
    }
    async getDashboardSummary() {
        const ds = await this.getDataSource();
        const today = new Date().toISOString().split('T')[0];
        const stats = await ds.query(`
      SELECT
        COALESCE(SUM(CASE WHEN status NOT IN ('PAID','WRITTEN_OFF')
          THEN original_amount - paid_amount - adjusted_amount ELSE 0 END), 0) as totalOutstanding,
        COALESCE(SUM(CASE WHEN status NOT IN ('PAID','WRITTEN_OFF') AND due_date < ?
          THEN original_amount - paid_amount - adjusted_amount ELSE 0 END), 0) as totalOverdue,
        COUNT(CASE WHEN status NOT IN ('PAID','WRITTEN_OFF') AND due_date < ? THEN 1 END) as overdueCount,
        COUNT(CASE WHEN status NOT IN ('PAID','WRITTEN_OFF') AND due_date >= ? AND due_date <= DATE_ADD(?, INTERVAL 7 DAY) THEN 1 END) as upcomingCount,
        COALESCE(SUM(CASE WHEN status NOT IN ('PAID','WRITTEN_OFF') AND due_date >= ? AND due_date <= DATE_ADD(?, INTERVAL 7 DAY)
          THEN original_amount - paid_amount - adjusted_amount ELSE 0 END), 0) as upcomingAmount
      FROM supplier_dues
    `, [today, today, today, today, today, today]);
        const aging = await ds.query(`
      SELECT
        CASE
          WHEN DATEDIFF(?, due_date) BETWEEN 1 AND 30 THEN '1-30 days'
          WHEN DATEDIFF(?, due_date) BETWEEN 31 AND 60 THEN '31-60 days'
          WHEN DATEDIFF(?, due_date) BETWEEN 61 AND 90 THEN '61-90 days'
          WHEN DATEDIFF(?, due_date) > 90 THEN '90+ days'
          ELSE 'Current'
        END as bucket,
        COUNT(*) as count,
        COALESCE(SUM(original_amount - paid_amount - adjusted_amount), 0) as amount
      FROM supplier_dues
      WHERE status NOT IN ('PAID', 'WRITTEN_OFF')
      GROUP BY bucket
      ORDER BY FIELD(bucket, 'Current', '1-30 days', '31-60 days', '61-90 days', '90+ days')
    `, [today, today, today, today]);
        return {
            totalOutstanding: Number(stats[0]?.totalOutstanding ?? 0),
            totalOverdue: Number(stats[0]?.totalOverdue ?? 0),
            overdueCount: Number(stats[0]?.overdueCount ?? 0),
            upcomingCount: Number(stats[0]?.upcomingCount ?? 0),
            upcomingAmount: Number(stats[0]?.upcomingAmount ?? 0),
            aging: aging.map((r) => ({
                bucket: r.bucket,
                count: Number(r.count),
                amount: Number(r.amount),
            })),
        };
    }
};
exports.SupplierDuesService = SupplierDuesService;
exports.SupplierDuesService = SupplierDuesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tenant_connection_manager_1.TenantConnectionManager])
], SupplierDuesService);
//# sourceMappingURL=supplier-dues.service.js.map