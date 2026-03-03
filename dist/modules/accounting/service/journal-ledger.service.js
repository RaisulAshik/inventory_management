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
exports.GeneralLedgerService = void 0;
const tenant_1 = require("../../../entities/tenant");
const common_1 = require("@nestjs/common");
const tenant_connection_manager_1 = require("../../../database/tenant-connection.manager");
let GeneralLedgerService = class GeneralLedgerService {
    tenantConnectionManager;
    constructor(tenantConnectionManager) {
        this.tenantConnectionManager = tenantConnectionManager;
    }
    async getRepo() {
        return this.tenantConnectionManager.getRepository(tenant_1.GeneralLedger);
    }
    async postEntry(dto, queryRunner) {
        const glRepo = await this.getRepo();
        const lastEntry = await (queryRunner?.manager || glRepo.manager)
            .createQueryBuilder(tenant_1.GeneralLedger, 'gl')
            .where('gl.accountId = :accountId', { accountId: dto.accountId })
            .orderBy('gl.transactionDate', 'DESC')
            .addOrderBy('gl.createdAt', 'DESC')
            .getOne();
        const previousBalance = lastEntry ? Number(lastEntry.runningBalance) : 0;
        const runningBalance = previousBalance + dto.debitAmount - dto.creditAmount;
        const entry = glRepo.create({
            ...dto,
            runningBalance,
            currency: dto.currency || 'INR',
            exchangeRate: dto.exchangeRate || 1,
            baseDebitAmount: dto.baseDebitAmount || dto.debitAmount,
            baseCreditAmount: dto.baseCreditAmount || dto.creditAmount,
        });
        if (queryRunner)
            return queryRunner.manager.save(tenant_1.GeneralLedger, entry);
        return glRepo.save(entry);
    }
    async findAll(query) {
        const repo = await this.getRepo();
        const { accountId, fiscalYearId, fiscalPeriodId, costCenterId, startDate, endDate, referenceType, partyType, partyId, search, page = 1, limit = 50, } = query;
        const qb = repo
            .createQueryBuilder('gl')
            .leftJoinAndSelect('gl.account', 'account')
            .leftJoinAndSelect('gl.journalEntry', 'journalEntry');
        if (accountId)
            qb.andWhere('gl.accountId = :accountId', { accountId });
        if (fiscalYearId)
            qb.andWhere('gl.fiscalYearId = :fiscalYearId', { fiscalYearId });
        if (fiscalPeriodId)
            qb.andWhere('gl.fiscalPeriodId = :fiscalPeriodId', { fiscalPeriodId });
        if (costCenterId)
            qb.andWhere('gl.costCenterId = :costCenterId', { costCenterId });
        if (startDate)
            qb.andWhere('gl.transactionDate >= :startDate', { startDate });
        if (endDate)
            qb.andWhere('gl.transactionDate <= :endDate', { endDate });
        if (referenceType)
            qb.andWhere('gl.referenceType = :referenceType', { referenceType });
        if (partyType)
            qb.andWhere('gl.partyType = :partyType', { partyType });
        if (partyId)
            qb.andWhere('gl.partyId = :partyId', { partyId });
        if (search)
            qb.andWhere('(gl.description LIKE :search OR gl.referenceNumber LIKE :search)', { search: `%${search}%` });
        qb.orderBy('gl.transactionDate', 'ASC')
            .addOrderBy('gl.createdAt', 'ASC')
            .skip((page - 1) * limit)
            .take(limit);
        const [data, total] = await qb.getManyAndCount();
        return { data, total, page, limit };
    }
    async getAccountLedger(accountId, startDate, endDate) {
        const repo = await this.getRepo();
        const qb = repo
            .createQueryBuilder('gl')
            .leftJoinAndSelect('gl.account', 'account')
            .leftJoinAndSelect('gl.journalEntry', 'je')
            .where('gl.accountId = :accountId', { accountId });
        if (startDate)
            qb.andWhere('gl.transactionDate >= :startDate', { startDate });
        if (endDate)
            qb.andWhere('gl.transactionDate <= :endDate', { endDate });
        qb.orderBy('gl.transactionDate', 'ASC').addOrderBy('gl.createdAt', 'ASC');
        const entries = await qb.getMany();
        let openingBalance = 0;
        if (startDate) {
            const ob = await repo
                .createQueryBuilder('gl')
                .select('SUM(gl.debitAmount) - SUM(gl.creditAmount)', 'balance')
                .where('gl.accountId = :accountId', { accountId })
                .andWhere('gl.transactionDate < :startDate', { startDate })
                .getRawOne();
            openingBalance = Number(ob?.balance) || 0;
        }
        const totalDebit = entries.reduce((sum, e) => sum + Number(e.debitAmount), 0);
        const totalCredit = entries.reduce((sum, e) => sum + Number(e.creditAmount), 0);
        return {
            accountId,
            openingBalance,
            entries,
            totalDebit,
            totalCredit,
            closingBalance: openingBalance + totalDebit - totalCredit,
        };
    }
    async getTrialBalance(fiscalYearId, asOfDate) {
        const repo = await this.getRepo();
        const qb = repo
            .createQueryBuilder('gl')
            .select('gl.accountId', 'accountId')
            .addSelect('account.accountCode', 'accountCode')
            .addSelect('account.accountName', 'accountName')
            .addSelect('account.accountType', 'accountType')
            .addSelect('account.normalBalance', 'normalBalance')
            .addSelect('SUM(gl.debitAmount)', 'totalDebit')
            .addSelect('SUM(gl.creditAmount)', 'totalCredit')
            .leftJoin('gl.account', 'account')
            .where('gl.fiscalYearId = :fiscalYearId', { fiscalYearId })
            .groupBy('gl.accountId')
            .addGroupBy('account.accountCode')
            .addGroupBy('account.accountName')
            .addGroupBy('account.accountType')
            .addGroupBy('account.normalBalance');
        if (asOfDate)
            qb.andWhere('gl.transactionDate <= :asOfDate', { asOfDate });
        qb.orderBy('account.accountCode', 'ASC');
        const results = await qb.getRawMany();
        let sumDebit = 0;
        let sumCredit = 0;
        const trialBalance = results.map((r) => {
            const debit = Number(r.totalDebit) || 0;
            const credit = Number(r.totalCredit) || 0;
            const balance = debit - credit;
            const debitBalance = balance > 0 ? balance : 0;
            const creditBalance = balance < 0 ? Math.abs(balance) : 0;
            sumDebit += debitBalance;
            sumCredit += creditBalance;
            return {
                accountId: r.accountId,
                accountCode: r.accountCode,
                accountName: r.accountName,
                accountType: r.accountType,
                normalBalance: r.normalBalance,
                totalDebit: debit,
                totalCredit: credit,
                debitBalance,
                creditBalance,
            };
        });
        return {
            trialBalance,
            totals: {
                debit: sumDebit,
                credit: sumCredit,
                difference: sumDebit - sumCredit,
            },
        };
    }
};
exports.GeneralLedgerService = GeneralLedgerService;
exports.GeneralLedgerService = GeneralLedgerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tenant_connection_manager_1.TenantConnectionManager])
], GeneralLedgerService);
//# sourceMappingURL=journal-ledger.service.js.map