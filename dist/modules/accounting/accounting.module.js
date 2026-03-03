"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountingModule = void 0;
const common_1 = require("@nestjs/common");
const database_module_1 = require("../../database/database.module");
const bank_accounts_service_1 = require("./service/bank-accounts.service");
const bank_reconciliation_service_1 = require("./service/bank-reconciliation.service");
const bank_transactions_service_1 = require("./service/bank-transactions.service");
const budgets_service_1 = require("./service/budgets.service");
const chart_of_accounts_service_1 = require("./service/chart-of-accounts.service");
const cost_centers_service_1 = require("./service/cost-centers.service");
const financial_reports_service_1 = require("./service/financial-reports.service");
const fiscal_periods_service_1 = require("./service/fiscal-periods.service");
const fiscal_years_service_1 = require("./service/fiscal-years.service");
const journal_entries_service_1 = require("./service/journal-entries.service");
const journal_ledger_service_1 = require("./service/journal-ledger.service");
const bank_accounts_controller_1 = require("./controller/bank-accounts.controller");
const bank_reconciliations_controller_1 = require("./controller/bank-reconciliations.controller");
const bank_transactions_controller_1 = require("./controller/bank-transactions.controller");
const budgets_controller_1 = require("./controller/budgets.controller");
const chart_of_accounts_controller_1 = require("./controller/chart-of-accounts.controller");
const cost_centers_controller_1 = require("./controller/cost-centers.controller");
const financial_reports_controller_1 = require("./controller/financial-reports.controller");
const fiscal_periods_controller_1 = require("./controller/fiscal-periods.controller");
const fiscal_years_controller_1 = require("./controller/fiscal-years.controller");
const general_ledger_controller_1 = require("./controller/general-ledger.controller");
const journal_entries_controller_1 = require("./controller/journal-entries.controller");
let AccountingModule = class AccountingModule {
};
exports.AccountingModule = AccountingModule;
exports.AccountingModule = AccountingModule = __decorate([
    (0, common_1.Module)({
        imports: [database_module_1.DatabaseModule],
        controllers: [
            chart_of_accounts_controller_1.ChartOfAccountsController,
            cost_centers_controller_1.CostCentersController,
            fiscal_years_controller_1.FiscalYearsController,
            fiscal_periods_controller_1.FiscalPeriodsController,
            journal_entries_controller_1.JournalEntriesController,
            general_ledger_controller_1.GeneralLedgerController,
            bank_accounts_controller_1.BankAccountsController,
            bank_transactions_controller_1.BankTransactionsController,
            bank_reconciliations_controller_1.BankReconciliationsController,
            budgets_controller_1.BudgetsController,
            financial_reports_controller_1.FinancialReportsController,
        ],
        providers: [
            chart_of_accounts_service_1.ChartOfAccountsService,
            cost_centers_service_1.CostCentersService,
            fiscal_years_service_1.FiscalYearsService,
            fiscal_periods_service_1.FiscalPeriodsService,
            journal_ledger_service_1.GeneralLedgerService,
            journal_entries_service_1.JournalEntriesService,
            bank_accounts_service_1.BankAccountsService,
            bank_transactions_service_1.BankTransactionsService,
            bank_reconciliation_service_1.BankReconciliationsService,
            budgets_service_1.BudgetsService,
            financial_reports_service_1.FinancialReportsService,
        ],
        exports: [
            chart_of_accounts_service_1.ChartOfAccountsService,
            cost_centers_service_1.CostCentersService,
            fiscal_years_service_1.FiscalYearsService,
            fiscal_periods_service_1.FiscalPeriodsService,
            journal_ledger_service_1.GeneralLedgerService,
            journal_entries_service_1.JournalEntriesService,
            bank_accounts_service_1.BankAccountsService,
            bank_transactions_service_1.BankTransactionsService,
            bank_reconciliation_service_1.BankReconciliationsService,
            budgets_service_1.BudgetsService,
            financial_reports_service_1.FinancialReportsService,
        ],
    })
], AccountingModule);
//# sourceMappingURL=accounting.module.js.map