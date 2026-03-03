import { Module } from '@nestjs/common';
import { DatabaseModule } from '@database/database.module';
// Services

import { BankAccountsService } from './service/bank-accounts.service';
import { BankReconciliationsService } from './service/bank-reconciliation.service';
import { BankTransactionsService } from './service/bank-transactions.service';
import { BudgetsService } from './service/budgets.service';
import { ChartOfAccountsService } from './service/chart-of-accounts.service';
import { CostCentersService } from './service/cost-centers.service';
import { FinancialReportsService } from './service/financial-reports.service';
import { FiscalPeriodsService } from './service/fiscal-periods.service';
import { FiscalYearsService } from './service/fiscal-years.service';
import { JournalEntriesService } from './service/journal-entries.service';
import { GeneralLedgerService } from './service/journal-ledger.service';
// Controllers
import { BankAccountsController } from './controller/bank-accounts.controller';
import { BankReconciliationsController } from './controller/bank-reconciliations.controller';
import { BankTransactionsController } from './controller/bank-transactions.controller';
import { BudgetsController } from './controller/budgets.controller';
import { ChartOfAccountsController } from './controller/chart-of-accounts.controller';
import { CostCentersController } from './controller/cost-centers.controller';
import { FinancialReportsController } from './controller/financial-reports.controller';
import { FiscalPeriodsController } from './controller/fiscal-periods.controller';
import { FiscalYearsController } from './controller/fiscal-years.controller';
import { GeneralLedgerController } from './controller/general-ledger.controller';
import { JournalEntriesController } from './controller/journal-entries.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [
    ChartOfAccountsController,
    CostCentersController,
    FiscalYearsController,
    FiscalPeriodsController,
    JournalEntriesController,
    GeneralLedgerController,
    BankAccountsController,
    BankTransactionsController,
    BankReconciliationsController,
    BudgetsController,
    FinancialReportsController,
  ],
  providers: [
    ChartOfAccountsService,
    CostCentersService,
    FiscalYearsService,
    FiscalPeriodsService,
    GeneralLedgerService,
    JournalEntriesService,
    BankAccountsService,
    BankTransactionsService,
    BankReconciliationsService,
    BudgetsService,
    FinancialReportsService,
  ],
  exports: [
    ChartOfAccountsService,
    CostCentersService,
    FiscalYearsService,
    FiscalPeriodsService,
    GeneralLedgerService,
    JournalEntriesService,
    BankAccountsService,
    BankTransactionsService,
    BankReconciliationsService,
    BudgetsService,
    FinancialReportsService,
  ],
})
export class AccountingModule {}
