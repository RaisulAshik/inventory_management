import { AccountType } from '@/common/enums';
import { GeneralLedger, BankAccount } from '@/entities/tenant';
import { Injectable, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import {
  FinancialReportQueryDto,
  ReportType,
} from '../dto/financial-reports.dto';
import { GeneralLedgerService } from './journal-ledger.service';
import { TenantConnectionManager } from '@database/tenant-connection.manager';
import {
  BankTransaction,
  BankTransactionStatus,
  BankTransactionType,
} from '@entities/tenant/accounting/bank-transaction.entity';

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

  private async getBankTxRepo(): Promise<Repository<BankTransaction>> {
    return this.tenantConnectionManager.getRepository(BankTransaction);
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
      case ReportType.AGED_RECEIVABLES:
        return this.agedReceivables(query);
      case ReportType.AGED_PAYABLES:
        return this.agedPayables(query);
      default:
        throw new BadRequestException(`Unsupported report type: ${query.reportType}`);
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
    const cogs: any[] = [];
    const operatingExpenses: any[] = [];
    let totalRevenue = 0;
    let totalCogs = 0;
    let totalOperatingExpenses = 0;

    for (const row of results) {
      const debit = Number(row.totalDebit) || 0;
      const credit = Number(row.totalCredit) || 0;
      if (row.accountType === AccountType.REVENUE) {
        const balance = credit - debit;
        totalRevenue += balance;
        revenue.push({ ...row, balance });
      } else {
        // Expense account — split COGS vs operating by accountSubtype
        const balance = debit - credit;
        const subtype = (row.accountSubtype || '').toUpperCase();
        if (subtype === 'COGS' || subtype === 'COST OF GOODS SOLD') {
          totalCogs += balance;
          cogs.push({ ...row, balance });
        } else {
          totalOperatingExpenses += balance;
          operatingExpenses.push({ ...row, balance });
        }
      }
    }

    const grossProfit = totalRevenue - totalCogs;
    const netIncome = grossProfit - totalOperatingExpenses;

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
      costOfGoodsSold: {
        accounts: cogs.filter(
          (c) => query.includeZeroBalances || c.balance !== 0,
        ),
        total: totalCogs,
      },
      grossProfit,
      operatingExpenses: {
        accounts: operatingExpenses.filter(
          (e) => query.includeZeroBalances || e.balance !== 0,
        ),
        total: totalOperatingExpenses,
      },
      netIncome,
    };
  }

  async trialBalance(query: FinancialReportQueryDto) {
    if (!query.fiscalYearId)
      throw new BadRequestException('fiscalYearId is required for trial balance');
    return this.glService.getTrialBalance(query.fiscalYearId, query.asOfDate);
  }

  async cashFlowStatement(query: FinancialReportQueryDto) {
    const txRepo = await this.getBankTxRepo();
    const bankAccountRepo = await this.getBankAccountRepo();
    const startDate = query.startDate;
    const endDate = query.endDate || new Date().toISOString().split('T')[0];

    // Operating inflows: customer receipts, sales deposits, cheques received
    const operatingInTypes = [
      BankTransactionType.DEPOSIT,
      BankTransactionType.CHEQUE_DEPOSIT,
      BankTransactionType.INTEREST_CREDIT,
    ];
    // Operating outflows: payments to suppliers, expenses, bank charges
    const operatingOutTypes = [
      BankTransactionType.WITHDRAWAL,
      BankTransactionType.CHEQUE_ISSUED,
      BankTransactionType.BANK_CHARGES,
    ];
    // Financing
    const financingInTypes = [BankTransactionType.LOAN_DISBURSEMENT];
    const financingOutTypes = [BankTransactionType.LOAN_REPAYMENT];
    const qb = txRepo
      .createQueryBuilder('tx')
      .select('tx.transactionType', 'transactionType')
      .addSelect('SUM(tx.amount)', 'total')
      .where('tx.status NOT IN (:...excluded)', {
        excluded: [BankTransactionStatus.BOUNCED, BankTransactionStatus.CANCELLED],
      })
      .groupBy('tx.transactionType');

    if (startDate) qb.andWhere('tx.transactionDate >= :startDate', { startDate });
    if (endDate) qb.andWhere('tx.transactionDate <= :endDate', { endDate });

    const rows: { transactionType: BankTransactionType; total: string }[] =
      await qb.getRawMany();

    const byType: Record<string, number> = {};
    for (const row of rows) {
      byType[row.transactionType] = Number(row.total) || 0;
    }

    const sumTypes = (types: BankTransactionType[]) =>
      types.reduce((s, t) => s + (byType[t] ?? 0), 0);

    const operatingInflow = sumTypes(operatingInTypes);
    const operatingOutflow = sumTypes(operatingOutTypes);
    const operatingNet = operatingInflow - operatingOutflow;

    const financingInflow = sumTypes(financingInTypes);
    const financingOutflow = sumTypes(financingOutTypes);
    const financingNet = financingInflow - financingOutflow;

    const transferIn = byType[BankTransactionType.TRANSFER_IN] ?? 0;
    const transferOut = byType[BankTransactionType.TRANSFER_OUT] ?? 0;

    // Current cash balance from all active bank accounts
    const bankAccounts = await bankAccountRepo.find({
      where: { isActive: true as any },
    });
    const currentCashBalance = bankAccounts.reduce(
      (sum, ba) => sum + Number(ba.currentBalance),
      0,
    );

    return {
      reportType: ReportType.CASH_FLOW,
      startDate,
      endDate,
      operatingActivities: {
        inflow: operatingInflow,
        outflow: operatingOutflow,
        net: operatingNet,
        breakdown: operatingInTypes.concat(operatingOutTypes).map((t) => ({
          type: t,
          amount: byType[t] ?? 0,
        })),
      },
      investingActivities: {
        net: 0,
        note: 'No investing transactions tracked yet',
      },
      financingActivities: {
        inflow: financingInflow,
        outflow: financingOutflow,
        net: financingNet,
        breakdown: financingInTypes.concat(financingOutTypes).map((t) => ({
          type: t,
          amount: byType[t] ?? 0,
        })),
      },
      internalTransfers: {
        transferIn,
        transferOut,
        note: 'Internal transfers net to zero across accounts',
      },
      netCashChange: operatingNet + financingNet,
      currentCashBalance,
    };
  }

  async generalLedgerReport(query: FinancialReportQueryDto) {
    if (!query.accountId)
      throw new BadRequestException('accountId is required for general ledger report');
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

  async agedReceivables(query: FinancialReportQueryDto) {
    const ds = await this.tenantConnectionManager.getDataSource();
    const asOfDate = query.asOfDate || new Date().toISOString().split('T')[0];

    // Summary by aging bucket
    const buckets = await ds.query(
      `
      SELECT
        CASE
          WHEN due_date >= ? THEN 'Current'
          WHEN DATEDIFF(?, due_date) BETWEEN 1 AND 30 THEN '1-30 days'
          WHEN DATEDIFF(?, due_date) BETWEEN 31 AND 60 THEN '31-60 days'
          WHEN DATEDIFF(?, due_date) BETWEEN 61 AND 90 THEN '61-90 days'
          ELSE '90+ days'
        END AS bucket,
        COUNT(*) AS count,
        COALESCE(SUM(original_amount - paid_amount - adjusted_amount - written_off_amount), 0) AS amount
      FROM customer_dues
      WHERE status NOT IN ('PAID','WRITTEN_OFF')
        AND (original_amount - paid_amount - adjusted_amount - written_off_amount) > 0
      GROUP BY bucket
      ORDER BY FIELD(bucket, 'Current', '1-30 days', '31-60 days', '61-90 days', '90+ days')
      `,
      [asOfDate, asOfDate, asOfDate, asOfDate],
    );

    // Per-customer breakdown
    const customers = await ds.query(
      `
      SELECT
        cd.customer_id AS customerId,
        COALESCE(NULLIF(TRIM(CONCAT(c.first_name,' ',COALESCE(c.last_name,''))), ''), c.company_name, c.email) AS customerName,
        c.email AS email,
        COALESCE(SUM(CASE WHEN cd.due_date >= ? THEN cd.original_amount - cd.paid_amount - cd.adjusted_amount - cd.written_off_amount ELSE 0 END), 0) AS current_amount,
        COALESCE(SUM(CASE WHEN DATEDIFF(?, cd.due_date) BETWEEN 1 AND 30 THEN cd.original_amount - cd.paid_amount - cd.adjusted_amount - cd.written_off_amount ELSE 0 END), 0) AS days_1_30,
        COALESCE(SUM(CASE WHEN DATEDIFF(?, cd.due_date) BETWEEN 31 AND 60 THEN cd.original_amount - cd.paid_amount - cd.adjusted_amount - cd.written_off_amount ELSE 0 END), 0) AS days_31_60,
        COALESCE(SUM(CASE WHEN DATEDIFF(?, cd.due_date) BETWEEN 61 AND 90 THEN cd.original_amount - cd.paid_amount - cd.adjusted_amount - cd.written_off_amount ELSE 0 END), 0) AS days_61_90,
        COALESCE(SUM(CASE WHEN DATEDIFF(?, cd.due_date) > 90 THEN cd.original_amount - cd.paid_amount - cd.adjusted_amount - cd.written_off_amount ELSE 0 END), 0) AS days_over_90,
        COALESCE(SUM(cd.original_amount - cd.paid_amount - cd.adjusted_amount - cd.written_off_amount), 0) AS total
      FROM customer_dues cd
      LEFT JOIN customers c ON cd.customer_id = c.id
      WHERE cd.status NOT IN ('PAID','WRITTEN_OFF')
        AND (cd.original_amount - cd.paid_amount - cd.adjusted_amount - cd.written_off_amount) > 0
      GROUP BY cd.customer_id, c.first_name, c.last_name, c.company_name, c.email
      HAVING total > 0
      ORDER BY total DESC
      `,
      [asOfDate, asOfDate, asOfDate, asOfDate, asOfDate],
    );

    const totalOutstanding = customers.reduce(
      (sum: number, r: any) => sum + Number(r.total),
      0,
    );

    return {
      reportType: ReportType.AGED_RECEIVABLES,
      asOfDate,
      summary: buckets.map((b: any) => ({
        bucket: b.bucket,
        count: Number(b.count),
        amount: Number(b.amount),
      })),
      customers: customers.map((r: any) => ({
        customerId: r.customerId,
        customerName: r.customerName,
        email: r.email,
        current: Number(r.current_amount),
        days1To30: Number(r.days_1_30),
        days31To60: Number(r.days_31_60),
        days61To90: Number(r.days_61_90),
        daysOver90: Number(r.days_over_90),
        total: Number(r.total),
      })),
      totalOutstanding,
    };
  }

  async agedPayables(query: FinancialReportQueryDto) {
    const ds = await this.tenantConnectionManager.getDataSource();
    const asOfDate = query.asOfDate || new Date().toISOString().split('T')[0];

    // Summary by aging bucket
    const buckets = await ds.query(
      `
      SELECT
        CASE
          WHEN due_date >= ? THEN 'Current'
          WHEN DATEDIFF(?, due_date) BETWEEN 1 AND 30 THEN '1-30 days'
          WHEN DATEDIFF(?, due_date) BETWEEN 31 AND 60 THEN '31-60 days'
          WHEN DATEDIFF(?, due_date) BETWEEN 61 AND 90 THEN '61-90 days'
          ELSE '90+ days'
        END AS bucket,
        COUNT(*) AS count,
        COALESCE(SUM(original_amount - paid_amount - adjusted_amount), 0) AS amount
      FROM supplier_dues
      WHERE status NOT IN ('PAID','WRITTEN_OFF')
        AND (original_amount - paid_amount - adjusted_amount) > 0
      GROUP BY bucket
      ORDER BY FIELD(bucket, 'Current', '1-30 days', '31-60 days', '61-90 days', '90+ days')
      `,
      [asOfDate, asOfDate, asOfDate, asOfDate],
    );

    // Per-supplier breakdown
    const suppliers = await ds.query(
      `
      SELECT
        sd.supplier_id AS supplierId,
        COALESCE(s.company_name, s.email) AS supplierName,
        s.email AS email,
        COALESCE(SUM(CASE WHEN sd.due_date >= ? THEN sd.original_amount - sd.paid_amount - sd.adjusted_amount ELSE 0 END), 0) AS current_amount,
        COALESCE(SUM(CASE WHEN DATEDIFF(?, sd.due_date) BETWEEN 1 AND 30 THEN sd.original_amount - sd.paid_amount - sd.adjusted_amount ELSE 0 END), 0) AS days_1_30,
        COALESCE(SUM(CASE WHEN DATEDIFF(?, sd.due_date) BETWEEN 31 AND 60 THEN sd.original_amount - sd.paid_amount - sd.adjusted_amount ELSE 0 END), 0) AS days_31_60,
        COALESCE(SUM(CASE WHEN DATEDIFF(?, sd.due_date) BETWEEN 61 AND 90 THEN sd.original_amount - sd.paid_amount - sd.adjusted_amount ELSE 0 END), 0) AS days_61_90,
        COALESCE(SUM(CASE WHEN DATEDIFF(?, sd.due_date) > 90 THEN sd.original_amount - sd.paid_amount - sd.adjusted_amount ELSE 0 END), 0) AS days_over_90,
        COALESCE(SUM(sd.original_amount - sd.paid_amount - sd.adjusted_amount), 0) AS total
      FROM supplier_dues sd
      LEFT JOIN suppliers s ON sd.supplier_id = s.id
      WHERE sd.status NOT IN ('PAID','WRITTEN_OFF')
        AND (sd.original_amount - sd.paid_amount - sd.adjusted_amount) > 0
      GROUP BY sd.supplier_id, s.company_name, s.email
      HAVING total > 0
      ORDER BY total DESC
      `,
      [asOfDate, asOfDate, asOfDate, asOfDate, asOfDate],
    );

    const totalOutstanding = suppliers.reduce(
      (sum: number, r: any) => sum + Number(r.total),
      0,
    );

    return {
      reportType: ReportType.AGED_PAYABLES,
      asOfDate,
      summary: buckets.map((b: any) => ({
        bucket: b.bucket,
        count: Number(b.count),
        amount: Number(b.amount),
      })),
      suppliers: suppliers.map((r: any) => ({
        supplierId: r.supplierId,
        supplierName: r.supplierName,
        email: r.email,
        current: Number(r.current_amount),
        days1To30: Number(r.days_1_30),
        days31To60: Number(r.days_31_60),
        days61To90: Number(r.days_61_90),
        daysOver90: Number(r.days_over_90),
        total: Number(r.total),
      })),
      totalOutstanding,
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
        revenue += credit - debit;
      } else {
        expenses += debit - credit;
      }
    }
    return revenue - expenses;
  }
}
