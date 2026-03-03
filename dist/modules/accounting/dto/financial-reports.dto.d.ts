export declare enum ReportType {
    BALANCE_SHEET = "BALANCE_SHEET",
    INCOME_STATEMENT = "INCOME_STATEMENT",
    TRIAL_BALANCE = "TRIAL_BALANCE",
    CASH_FLOW = "CASH_FLOW",
    GENERAL_LEDGER_REPORT = "GENERAL_LEDGER_REPORT",
    BUDGET_VS_ACTUAL = "BUDGET_VS_ACTUAL",
    AGED_RECEIVABLES = "AGED_RECEIVABLES",
    AGED_PAYABLES = "AGED_PAYABLES",
    BANK_SUMMARY = "BANK_SUMMARY"
}
export declare class FinancialReportQueryDto {
    reportType: ReportType;
    fiscalYearId?: string;
    fiscalPeriodId?: string;
    asOfDate?: string;
    startDate?: string;
    endDate?: string;
    costCenterId?: string;
    accountId?: string;
    budgetId?: string;
    includeZeroBalances?: boolean;
    showSubAccounts?: boolean;
    comparePeriod?: string;
}
