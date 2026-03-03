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
exports.FinancialReportsService = void 0;
const enums_1 = require("../../../common/enums");
const tenant_1 = require("../../../entities/tenant");
const common_1 = require("@nestjs/common");
const financial_reports_dto_1 = require("../dto/financial-reports.dto");
const journal_ledger_service_1 = require("./journal-ledger.service");
const tenant_connection_manager_1 = require("../../../database/tenant-connection.manager");
let FinancialReportsService = class FinancialReportsService {
    tenantConnectionManager;
    glService;
    constructor(tenantConnectionManager, glService) {
        this.tenantConnectionManager = tenantConnectionManager;
        this.glService = glService;
    }
    async getGlRepo() {
        return this.tenantConnectionManager.getRepository(tenant_1.GeneralLedger);
    }
    async getBankAccountRepo() {
        return this.tenantConnectionManager.getRepository(tenant_1.BankAccount);
    }
    async generateReport(query) {
        switch (query.reportType) {
            case financial_reports_dto_1.ReportType.BALANCE_SHEET:
                return this.balanceSheet(query);
            case financial_reports_dto_1.ReportType.INCOME_STATEMENT:
                return this.incomeStatement(query);
            case financial_reports_dto_1.ReportType.TRIAL_BALANCE:
                return this.trialBalance(query);
            case financial_reports_dto_1.ReportType.CASH_FLOW:
                return this.cashFlowStatement(query);
            case financial_reports_dto_1.ReportType.GENERAL_LEDGER_REPORT:
                return this.generalLedgerReport(query);
            case financial_reports_dto_1.ReportType.BUDGET_VS_ACTUAL:
                return this.budgetVsActual(query);
            case financial_reports_dto_1.ReportType.BANK_SUMMARY:
                return this.bankSummary(query);
            default:
                throw new Error(`Unsupported report type: ${query.reportType}`);
        }
    }
    async balanceSheet(query) {
        const glRepo = await this.getGlRepo();
        const asOfDate = query.asOfDate || new Date().toISOString().split('T')[0];
        const qb = glRepo
            .createQueryBuilder('gl')
            .select('gl.accountId', 'accountId')
            .addSelect('account.accountCode', 'accountCode')
            .addSelect('account.accountName', 'accountName')
            .addSelect('account.accountType', 'accountType')
            .addSelect('account.accountSubtype', 'accountSubtype')
            .addSelect('account.parentId', 'parentId')
            .addSelect('account.level', 'level')
            .addSelect('SUM(gl.debitAmount)', 'totalDebit')
            .addSelect('SUM(gl.creditAmount)', 'totalCredit')
            .leftJoin('gl.account', 'account')
            .where('gl.transactionDate <= :asOfDate', { asOfDate })
            .andWhere('account.accountType IN (:...types)', {
            types: [enums_1.AccountType.ASSET, enums_1.AccountType.LIABILITY, enums_1.AccountType.EQUITY],
        })
            .groupBy('gl.accountId')
            .addGroupBy('account.accountCode')
            .addGroupBy('account.accountName')
            .addGroupBy('account.accountType')
            .addGroupBy('account.accountSubtype')
            .addGroupBy('account.parentId')
            .addGroupBy('account.level');
        if (query.fiscalYearId)
            qb.andWhere('gl.fiscalYearId = :fiscalYearId', {
                fiscalYearId: query.fiscalYearId,
            });
        if (query.costCenterId)
            qb.andWhere('gl.costCenterId = :costCenterId', {
                costCenterId: query.costCenterId,
            });
        qb.orderBy('account.accountCode', 'ASC');
        const results = await qb.getRawMany();
        const assets = [];
        const liabilities = [];
        const equity = [];
        let totalAssets = 0;
        let totalLiabilities = 0;
        let totalEquity = 0;
        for (const row of results) {
            const debit = Number(row.totalDebit) || 0;
            const credit = Number(row.totalCredit) || 0;
            let balance;
            if (row.accountType === enums_1.AccountType.ASSET) {
                balance = debit - credit;
                totalAssets += balance;
                assets.push({ ...row, balance });
            }
            else if (row.accountType === enums_1.AccountType.LIABILITY) {
                balance = credit - debit;
                totalLiabilities += balance;
                liabilities.push({ ...row, balance });
            }
            else {
                balance = credit - debit;
                totalEquity += balance;
                equity.push({ ...row, balance });
            }
        }
        const netIncome = await this.calculateNetIncome(query);
        return {
            reportType: financial_reports_dto_1.ReportType.BALANCE_SHEET,
            asOfDate,
            assets: {
                accounts: assets.filter((a) => query.includeZeroBalances || a.balance !== 0),
                total: totalAssets,
            },
            liabilities: {
                accounts: liabilities.filter((l) => query.includeZeroBalances || l.balance !== 0),
                total: totalLiabilities,
            },
            equity: {
                accounts: equity.filter((e) => query.includeZeroBalances || e.balance !== 0),
                total: totalEquity,
                netIncome,
                totalWithNetIncome: totalEquity + netIncome,
            },
            totalAssets,
            totalLiabilitiesAndEquity: totalLiabilities + totalEquity + netIncome,
            isBalanced: Math.abs(totalAssets - (totalLiabilities + totalEquity + netIncome)) <
                0.01,
        };
    }
    async incomeStatement(query) {
        const glRepo = await this.getGlRepo();
        const startDate = query.startDate;
        const endDate = query.endDate || query.asOfDate || new Date().toISOString().split('T')[0];
        const qb = glRepo
            .createQueryBuilder('gl')
            .select('gl.accountId', 'accountId')
            .addSelect('account.accountCode', 'accountCode')
            .addSelect('account.accountName', 'accountName')
            .addSelect('account.accountType', 'accountType')
            .addSelect('account.accountSubtype', 'accountSubtype')
            .addSelect('SUM(gl.debitAmount)', 'totalDebit')
            .addSelect('SUM(gl.creditAmount)', 'totalCredit')
            .leftJoin('gl.account', 'account')
            .where('account.accountType IN (:...types)', {
            types: [enums_1.AccountType.REVENUE, enums_1.AccountType.EXPENSE],
        })
            .groupBy('gl.accountId')
            .addGroupBy('account.accountCode')
            .addGroupBy('account.accountName')
            .addGroupBy('account.accountType')
            .addGroupBy('account.accountSubtype');
        if (startDate)
            qb.andWhere('gl.transactionDate >= :startDate', { startDate });
        if (endDate)
            qb.andWhere('gl.transactionDate <= :endDate', { endDate });
        if (query.fiscalYearId)
            qb.andWhere('gl.fiscalYearId = :fiscalYearId', {
                fiscalYearId: query.fiscalYearId,
            });
        if (query.costCenterId)
            qb.andWhere('gl.costCenterId = :costCenterId', {
                costCenterId: query.costCenterId,
            });
        qb.orderBy('account.accountCode', 'ASC');
        const results = await qb.getRawMany();
        const revenue = [];
        const expenses = [];
        let totalRevenue = 0;
        let totalExpenses = 0;
        for (const row of results) {
            const debit = Number(row.totalDebit) || 0;
            const credit = Number(row.totalCredit) || 0;
            if (row.accountType === enums_1.AccountType.REVENUE) {
                const balance = credit - debit;
                totalRevenue += balance;
                revenue.push({ ...row, balance });
            }
            else {
                const balance = debit - credit;
                totalExpenses += balance;
                expenses.push({ ...row, balance });
            }
        }
        return {
            reportType: financial_reports_dto_1.ReportType.INCOME_STATEMENT,
            startDate,
            endDate,
            revenue: {
                accounts: revenue.filter((r) => query.includeZeroBalances || r.balance !== 0),
                total: totalRevenue,
            },
            expenses: {
                accounts: expenses.filter((e) => query.includeZeroBalances || e.balance !== 0),
                total: totalExpenses,
            },
            grossProfit: totalRevenue,
            operatingExpenses: totalExpenses,
            netIncome: totalRevenue - totalExpenses,
        };
    }
    async trialBalance(query) {
        if (!query.fiscalYearId)
            throw new Error('Fiscal year is required for trial balance');
        return this.glService.getTrialBalance(query.fiscalYearId, query.asOfDate);
    }
    async cashFlowStatement(query) {
        const glRepo = await this.getGlRepo();
        const bankAccountRepo = await this.getBankAccountRepo();
        const startDate = query.startDate;
        const endDate = query.endDate || new Date().toISOString().split('T')[0];
        const operatingQb = glRepo
            .createQueryBuilder('gl')
            .select('account.accountType', 'accountType')
            .addSelect('account.accountSubtype', 'accountSubtype')
            .addSelect('SUM(gl.debitAmount)', 'totalDebit')
            .addSelect('SUM(gl.creditAmount)', 'totalCredit')
            .leftJoin('gl.account', 'account')
            .groupBy('account.accountType')
            .addGroupBy('account.accountSubtype');
        if (startDate)
            operatingQb.andWhere('gl.transactionDate >= :startDate', { startDate });
        if (endDate)
            operatingQb.andWhere('gl.transactionDate <= :endDate', { endDate });
        if (query.fiscalYearId)
            operatingQb.andWhere('gl.fiscalYearId = :fiscalYearId', {
                fiscalYearId: query.fiscalYearId,
            });
        const results = await operatingQb.getRawMany();
        let operatingActivities = 0;
        const investingActivities = 0;
        const financingActivities = 0;
        const details = [];
        for (const row of results) {
            const debit = Number(row.totalDebit) || 0;
            const credit = Number(row.totalCredit) || 0;
            const net = credit - debit;
            if ([enums_1.AccountType.REVENUE, enums_1.AccountType.EXPENSE].includes(row.accountType)) {
                operatingActivities +=
                    row.accountType === enums_1.AccountType.REVENUE ? net : -net;
                details.push({ category: 'operating', ...row, net });
            }
        }
        const bankAccounts = await bankAccountRepo.find({
            where: { isActive: true },
        });
        const totalCashBalance = bankAccounts.reduce((sum, ba) => sum + Number(ba.currentBalance), 0);
        return {
            reportType: financial_reports_dto_1.ReportType.CASH_FLOW,
            startDate,
            endDate,
            operatingActivities: {
                total: operatingActivities,
                details: details.filter((d) => d.category === 'operating'),
            },
            investingActivities: { total: investingActivities },
            financingActivities: { total: financingActivities },
            netCashChange: operatingActivities + investingActivities + financingActivities,
            currentCashBalance: totalCashBalance,
        };
    }
    async generalLedgerReport(query) {
        if (!query.accountId)
            throw new Error('Account ID is required for general ledger report');
        return this.glService.getAccountLedger(query.accountId, query.startDate, query.endDate);
    }
    budgetVsActual(_query) {
        return {
            reportType: financial_reports_dto_1.ReportType.BUDGET_VS_ACTUAL,
            message: 'Use the budgets/:id/vs-actual endpoint for detailed budget vs actual report',
        };
    }
    async bankSummary(_query) {
        const bankAccountRepo = await this.getBankAccountRepo();
        const bankAccounts = await bankAccountRepo.find({
            where: { isActive: true },
            relations: ['glAccount'],
        });
        const summary = bankAccounts.map((ba) => ({
            id: ba.id,
            accountCode: ba.accountCode,
            accountName: ba.accountName,
            bankName: ba.bankName,
            accountNumber: ba.accountNumber,
            accountType: ba.accountType,
            currency: ba.currency,
            openingBalance: Number(ba.openingBalance),
            currentBalance: Number(ba.currentBalance),
            availableBalance: ba.availableBalance,
            overdraftLimit: ba.overdraftLimit ? Number(ba.overdraftLimit) : null,
            lastReconciledDate: ba.lastReconciledDate,
            lastReconciledBalance: ba.lastReconciledBalance
                ? Number(ba.lastReconciledBalance)
                : null,
        }));
        const totalBalance = summary.reduce((sum, s) => sum + s.currentBalance, 0);
        return {
            reportType: financial_reports_dto_1.ReportType.BANK_SUMMARY,
            accounts: summary,
            totalBalance,
            accountCount: summary.length,
        };
    }
    async calculateNetIncome(query) {
        const glRepo = await this.getGlRepo();
        const qb = glRepo
            .createQueryBuilder('gl')
            .select('account.accountType', 'accountType')
            .addSelect('SUM(gl.debitAmount)', 'totalDebit')
            .addSelect('SUM(gl.creditAmount)', 'totalCredit')
            .leftJoin('gl.account', 'account')
            .where('account.accountType IN (:...types)', {
            types: [enums_1.AccountType.REVENUE, enums_1.AccountType.EXPENSE],
        })
            .groupBy('account.accountType');
        if (query.asOfDate)
            qb.andWhere('gl.transactionDate <= :asOfDate', {
                asOfDate: query.asOfDate,
            });
        if (query.fiscalYearId)
            qb.andWhere('gl.fiscalYearId = :fiscalYearId', {
                fiscalYearId: query.fiscalYearId,
            });
        const results = await qb.getRawMany();
        let revenue = 0;
        let expenses = 0;
        for (const row of results) {
            const debit = Number(row.totalDebit) || 0;
            const credit = Number(row.totalCredit) || 0;
            if (row.accountType === enums_1.AccountType.REVENUE) {
                revenue = credit - debit;
            }
            else {
                expenses = debit - credit;
            }
        }
        return revenue - expenses;
    }
};
exports.FinancialReportsService = FinancialReportsService;
exports.FinancialReportsService = FinancialReportsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tenant_connection_manager_1.TenantConnectionManager,
        journal_ledger_service_1.GeneralLedgerService])
], FinancialReportsService);
//# sourceMappingURL=financial-reports.service.js.map