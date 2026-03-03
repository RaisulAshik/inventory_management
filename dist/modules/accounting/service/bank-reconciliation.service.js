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
exports.BankReconciliationsService = void 0;
const common_1 = require("@nestjs/common");
const bank_transactions_service_1 = require("./bank-transactions.service");
const tenant_1 = require("../../../entities/tenant");
const tenant_connection_manager_1 = require("../../../database/tenant-connection.manager");
let BankReconciliationsService = class BankReconciliationsService {
    tenantConnectionManager;
    bankTxnService;
    constructor(tenantConnectionManager, bankTxnService) {
        this.tenantConnectionManager = tenantConnectionManager;
        this.bankTxnService = bankTxnService;
    }
    async getRecRepo() {
        return this.tenantConnectionManager.getRepository(tenant_1.BankReconciliation);
    }
    async getBankRepo() {
        return this.tenantConnectionManager.getRepository(tenant_1.BankAccount);
    }
    async create(dto, userId) {
        const recRepo = await this.getRecRepo();
        const bankRepo = await this.getBankRepo();
        const bankAccount = await bankRepo.findOne({
            where: { id: dto.bankAccountId },
        });
        if (!bankAccount)
            throw new common_1.NotFoundException('Bank account not found');
        const existing = await recRepo.findOne({
            where: {
                bankAccountId: dto.bankAccountId,
                status: tenant_1.ReconciliationStatus.DRAFT,
            },
        });
        if (existing)
            throw new common_1.BadRequestException('An open reconciliation already exists for this bank account');
        const reconciliationNumber = await this.generateReconciliationNumber();
        const reconciliation = recRepo.create({
            ...dto,
            reconciliationNumber,
            status: tenant_1.ReconciliationStatus.DRAFT,
            createdBy: userId,
        });
        return recRepo.save(reconciliation);
    }
    async findAll(query) {
        const repo = await this.getRecRepo();
        const { bankAccountId, status, startDate, endDate, page = 1, limit = 20, } = query;
        const qb = repo
            .createQueryBuilder('br')
            .leftJoinAndSelect('br.bankAccount', 'bankAccount');
        if (bankAccountId)
            qb.andWhere('br.bankAccountId = :bankAccountId', { bankAccountId });
        if (status)
            qb.andWhere('br.status = :status', { status });
        if (startDate)
            qb.andWhere('br.statementDate >= :startDate', { startDate });
        if (endDate)
            qb.andWhere('br.statementDate <= :endDate', { endDate });
        qb.orderBy('br.statementDate', 'DESC')
            .skip((page - 1) * limit)
            .take(limit);
        const [data, total] = await qb.getManyAndCount();
        return { data, total, page, limit };
    }
    async findOne(id) {
        const repo = await this.getRecRepo();
        const rec = await repo.findOne({
            where: { id },
            relations: ['bankAccount'],
        });
        if (!rec)
            throw new common_1.NotFoundException(`Bank reconciliation ${id} not found`);
        return rec;
    }
    async update(id, dto) {
        const repo = await this.getRecRepo();
        const rec = await this.findOne(id);
        if (rec.status === tenant_1.ReconciliationStatus.COMPLETED)
            throw new common_1.BadRequestException('Cannot update a completed reconciliation');
        Object.assign(rec, dto);
        return repo.save(rec);
    }
    async startReconciliation(id) {
        const repo = await this.getRecRepo();
        const rec = await this.findOne(id);
        if (rec.status !== tenant_1.ReconciliationStatus.DRAFT)
            throw new common_1.BadRequestException('Only draft reconciliations can be started');
        rec.status = tenant_1.ReconciliationStatus.IN_PROGRESS;
        return repo.save(rec);
    }
    async complete(id, dto, userId) {
        const bankRepo = await this.getBankRepo();
        const dataSource = await this.tenantConnectionManager.getDataSource();
        const rec = await this.findOne(id);
        if (rec.status !== tenant_1.ReconciliationStatus.DRAFT &&
            rec.status !== tenant_1.ReconciliationStatus.IN_PROGRESS) {
            throw new common_1.BadRequestException('Reconciliation cannot be completed in current status');
        }
        const difference = Math.abs(dto.adjustedBalanceBook - dto.adjustedBalanceBank);
        if (difference > 0.01) {
            throw new common_1.BadRequestException(`Adjusted balances do not match. Book: ${dto.adjustedBalanceBook}, Bank: ${dto.adjustedBalanceBank}, Difference: ${difference}`);
        }
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            await this.bankTxnService.reconcileTransactions({
                transactionIds: dto.reconciledTransactionIds,
                reconciliationId: id,
            });
            const bankAccount = await bankRepo.findOne({
                where: { id: rec.bankAccountId },
            });
            if (bankAccount) {
                bankAccount.lastReconciledDate = rec.statementEndDate;
                bankAccount.lastReconciledBalance = dto.adjustedBalanceBank;
                await queryRunner.manager.save(tenant_1.BankAccount, bankAccount);
            }
            rec.adjustedBalanceBook = dto.adjustedBalanceBook;
            rec.adjustedBalanceBank = dto.adjustedBalanceBank;
            rec.difference = difference;
            rec.isReconciled = true;
            rec.status = tenant_1.ReconciliationStatus.COMPLETED;
            rec.reconciledBy = userId;
            rec.reconciledAt = new Date();
            if (dto.notes)
                rec.notes = dto.notes;
            const saved = await queryRunner.manager.save(tenant_1.BankReconciliation, rec);
            await queryRunner.commitTransaction();
            return saved;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async cancel(id) {
        const repo = await this.getRecRepo();
        const rec = await this.findOne(id);
        if (rec.status === tenant_1.ReconciliationStatus.COMPLETED)
            throw new common_1.BadRequestException('Cannot cancel a completed reconciliation');
        rec.status = tenant_1.ReconciliationStatus.CANCELLED;
        return repo.save(rec);
    }
    async getReconciliationSummary(id) {
        const rec = await this.findOne(id);
        const unreconciledTxns = await this.bankTxnService.getUnreconciledTransactions(rec.bankAccountId);
        return {
            reconciliation: rec,
            unreconciledTransactions: unreconciledTxns,
            summary: {
                unreconciledCount: unreconciledTxns.length,
                unreconciledTotal: unreconciledTxns.reduce((sum, t) => sum + Number(t.amount), 0),
            },
        };
    }
    async generateReconciliationNumber() {
        const repo = await this.getRecRepo();
        const year = new Date().getFullYear();
        const prefix = `REC-${year}-`;
        const last = await repo
            .createQueryBuilder('br')
            .where('br.reconciliationNumber LIKE :prefix', { prefix: `${prefix}%` })
            .orderBy('br.reconciliationNumber', 'DESC')
            .getOne();
        if (last) {
            const lastNum = Number.parseInt(last.reconciliationNumber.replace(prefix, ''), 10);
            return `${prefix}${String(lastNum + 1).padStart(6, '0')}`;
        }
        return `${prefix}000001`;
    }
};
exports.BankReconciliationsService = BankReconciliationsService;
exports.BankReconciliationsService = BankReconciliationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tenant_connection_manager_1.TenantConnectionManager,
        bank_transactions_service_1.BankTransactionsService])
], BankReconciliationsService);
//# sourceMappingURL=bank-reconciliation.service.js.map