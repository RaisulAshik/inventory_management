import { AccountType } from '@/common/enums';
import { GeneralLedger, BankAccount } from '@/entities/tenant';
import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import {
  FinancialReportQueryDto,
  ReportType,
} from '../dto/financial-reports.dto';
import { GeneralLedgerService } from './journal-ledger.service';
import { TenantConnectionManager } from '@database/tenant-connection.manager';

@Injectable()
export class FinancialReportsService {
  constructor(
    private readonly tenantConnectionManager: TenantConnectionManager,
    private readonly glService: GeneralLedgerService,
  ) {}

  private async getGlRepo(): Promise<Repository<GeneralLedger>> {
    return this.tenantConnectionManager.getRepository(GeneralLedger);
  }

  private async getBankAccountRepo(): Promise<Repository<BankAccount>> {
    return this.tenantConnectionManager.getRepository(BankAccount);
  }

  async generateReport(query: FinancialReportQueryDto) {
    switch (query.reportType) {
      case ReportType.BALANCE_SHEET:
        return this.balanceSheet(query);
      case ReportType.INCOME_STATEMENT:
        return this.incomeStatement(query);
      case ReportType.TRIAL_BALANCE:
        return this.trialBalance(query);
      case ReportType.CASH_FLOW:
        return this.cashFlowStatement(query);
      case ReportType.GENERAL_LEDGER_REPORT:
        return this.generalLedgerReport(query);
      case ReportType.BUDGET_VS_ACTUAL:
        return this.budgetVsActual(query);
      case ReportType.BANK_SUMMARY:
        return this.bankSummary(query);
      default:
        throw new Error(`Unsupported report type: ${query.reportType}`);
    }
  }

  async balanceSheet(query: FinancialReportQueryDto) {
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
        types: [AccountType.ASSET, AccountType.LIABILITY, AccountType.EQUITY],
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

    const assets: any[] = [];
    const liabilities: any[] = [];
    const equity: any[] = [];
    let totalAssets = 0;
    let totalLiabilities = 0;
    let totalEquity = 0;

    for (const row of results) {
      const debit = Number(row.totalDebit) || 0;
      const credit = Number(row.totalCredit) || 0;
      let balance: number;

      if (row.accountType === AccountType.ASSET) {
        balance = debit - credit;
        totalAssets += balance;
        assets.push({ ...row, balance });
      } else if (row.accountType === AccountType.LIABILITY) {
        balance = credit - debit;
        totalLiabilities += balance;
        liabilities.push({ ...row, balance });
      } else {
        balance = credit - debit;
        totalEquity += balance;
        equity.push({ ...row, balance });
      }
    }

    const netIncome = await this.calculateNetIncome(query);

    return {
      reportType: ReportType.BALANCE_SHEET,
      asOfDate,
      assets: {
        accounts: assets.filter(
          (a) => query.includeZeroBalances || a.balance !== 0,
        ),
        total: totalAssets,
      },
      liabilities: {
        accounts: liabilities.filter(
          (l) => query.includeZeroBalances || l.balance !== 0,
        ),
        total: totalLiabilities,
      },
      equity: {
        accounts: equity.filter(
          (e) => query.includeZeroBalances || e.balance !== 0,
        ),
        total: totalEquity,
        netIncome,
        totalWithNetIncome: totalEquity + netIncome,
      },
      totalAssets,
      totalLiabilitiesAndEquity: totalLiabilities + totalEquity + netIncome,
      isBalanced:
        Math.abs(totalAssets - (totalLiabilities + totalEquity + netIncome)) <
        0.01,
    };
  }

  async incomeStatement(query: FinancialReportQueryDto) {
    const glRepo = await this.getGlRepo();
    const startDate = query.startDate;
    const endDate =
      query.endDate || query.asOfDate || new Date().toISOString().split('T')[0];

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
        types: [AccountType.REVENUE, AccountType.EXPENSE],
      })
      .groupBy('gl.accountId')
      .addGroupBy('account.accountCode')
      .addGroupBy('account.accountName')
      .addGroupBy('account.accountType')
      .addGroupBy('account.accountSubtype');

    if (startDate)
      qb.andWhere('gl.transactionDate >= :startDate', { startDate });
    if (endDate) qb.andWhere('gl.transactionDate <= :endDate', { endDate });
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

    const revenue: any[] = [];
    const expenses: any[] = [];
    let totalRevenue = 0;
    let totalExpenses = 0;

    for (const row of results) {
      const debit = Number(row.totalDebit) || 0;
      const credit = Number(row.totalCredit) || 0;
      if (row.accountType === AccountType.REVENUE) {
        const balance = credit - debit;
        totalRevenue += balance;
        revenue.push({ ...row, balance });
      } else {
        const balance = debit - credit;
        totalExpenses += balance;
        expenses.push({ ...row, balance });
      }
    }

    return {
      reportType: ReportType.INCOME_STATEMENT,
      startDate,
      endDate,
      revenue: {
        accounts: revenue.filter(
          (r) => query.includeZeroBalances || r.balance !== 0,
        ),
        total: totalRevenue,
      },
      expenses: {
        accounts: expenses.filter(
          (e) => query.includeZeroBalances || e.balance !== 0,
        ),
        total: totalExpenses,
      },
      grossProfit: totalRevenue,
      operatingExpenses: totalExpenses,
      netIncome: totalRevenue - totalExpenses,
    };
  }

  async trialBalance(query: FinancialReportQueryDto) {
    if (!query.fiscalYearId)
      throw new Error('Fiscal year is required for trial balance');
    return this.glService.getTrialBalance(query.fiscalYearId, query.asOfDate);
  }

  async cashFlowStatement(query: FinancialReportQueryDto) {
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
    const details: any[] = [];

    for (const row of results) {
      const debit = Number(row.totalDebit) || 0;
      const credit = Number(row.totalCredit) || 0;
      const net = credit - debit;
      if (
        [AccountType.REVENUE, AccountType.EXPENSE].includes(row.accountType)
      ) {
        operatingActivities +=
          row.accountType === AccountType.REVENUE ? net : -net;
        details.push({ category: 'operating', ...row, net });
      }
    }

    const bankAccounts = await bankAccountRepo.find({
      where: { isActive: true as any },
    });
    const totalCashBalance = bankAccounts.reduce(
      (sum, ba) => sum + Number(ba.currentBalance),
      0,
    );

    return {
      reportType: ReportType.CASH_FLOW,
      startDate,
      endDate,
      operatingActivities: {
        total: operatingActivities,
        details: details.filter((d) => d.category === 'operating'),
      },
      investingActivities: { total: investingActivities },
      financingActivities: { total: financingActivities },
      netCashChange:
        operatingActivities + investingActivities + financingActivities,
      currentCashBalance: totalCashBalance,
    };
  }

  async generalLedgerReport(query: FinancialReportQueryDto) {
    if (!query.accountId)
      throw new Error('Account ID is required for general ledger report');
    return this.glService.getAccountLedger(
      query.accountId,
      query.startDate,
      query.endDate,
    );
  }

  budgetVsActual(_query: FinancialReportQueryDto) {
    return {
      reportType: ReportType.BUDGET_VS_ACTUAL,
      message:
        'Use the budgets/:id/vs-actual endpoint for detailed budget vs actual report',
    };
  }

  async bankSummary(_query: FinancialReportQueryDto) {
    const bankAccountRepo = await this.getBankAccountRepo();
    const bankAccounts = await bankAccountRepo.find({
      where: { isActive: true as any },
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
      reportType: ReportType.BANK_SUMMARY,
      accounts: summary,
      totalBalance,
      accountCount: summary.length,
    };
  }

  private async calculateNetIncome(
    query: FinancialReportQueryDto,
  ): Promise<number> {
    const glRepo = await this.getGlRepo();
    const qb = glRepo
      .createQueryBuilder('gl')
      .select('account.accountType', 'accountType')
      .addSelect('SUM(gl.debitAmount)', 'totalDebit')
      .addSelect('SUM(gl.creditAmount)', 'totalCredit')
      .leftJoin('gl.account', 'account')
      .where('account.accountType IN (:...types)', {
        types: [AccountType.REVENUE, AccountType.EXPENSE],
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
      if (row.accountType === AccountType.REVENUE) {
        revenue = credit - debit;
      } else {
        expenses = debit - credit;
      }
    }
    return revenue - expenses;
  }
}
