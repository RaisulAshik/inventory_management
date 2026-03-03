import { FinancialReportQueryDto } from '../dto/financial-reports.dto';
import { FinancialReportsService } from '../service/financial-reports.service';
export declare class FinancialReportsController {
    private readonly reportsService;
    constructor(reportsService: FinancialReportsService);
    generateReport(query: FinancialReportQueryDto): Promise<{
        trialBalance: {
            accountId: any;
            accountCode: any;
            accountName: any;
            accountType: any;
            normalBalance: any;
            totalDebit: number;
            totalCredit: number;
            debitBalance: number;
            creditBalance: number;
        }[];
        totals: {
            debit: number;
            credit: number;
            difference: number;
        };
    } | {
        accountId: string;
        openingBalance: number;
        entries: import("../../../entities/tenant").GeneralLedger[];
        totalDebit: number;
        totalCredit: number;
        closingBalance: number;
    } | {
        reportType: import("../dto/financial-reports.dto").ReportType;
        asOfDate: string;
        assets: {
            accounts: any[];
            total: number;
        };
        liabilities: {
            accounts: any[];
            total: number;
        };
        equity: {
            accounts: any[];
            total: number;
            netIncome: number;
            totalWithNetIncome: number;
        };
        totalAssets: number;
        totalLiabilitiesAndEquity: number;
        isBalanced: boolean;
    } | {
        reportType: import("../dto/financial-reports.dto").ReportType;
        startDate: string | undefined;
        endDate: string;
        revenue: {
            accounts: any[];
            total: number;
        };
        expenses: {
            accounts: any[];
            total: number;
        };
        grossProfit: number;
        operatingExpenses: number;
        netIncome: number;
    } | {
        reportType: import("../dto/financial-reports.dto").ReportType;
        startDate: string | undefined;
        endDate: string;
        operatingActivities: {
            total: number;
            details: any[];
        };
        investingActivities: {
            total: number;
        };
        financingActivities: {
            total: number;
        };
        netCashChange: number;
        currentCashBalance: number;
    } | {
        reportType: import("../dto/financial-reports.dto").ReportType;
        message: string;
    } | {
        reportType: import("../dto/financial-reports.dto").ReportType;
        accounts: {
            id: string;
            accountCode: string;
            accountName: string;
            bankName: string;
            accountNumber: string;
            accountType: import("../../../entities/tenant").BankAccountType;
            currency: string;
            openingBalance: number;
            currentBalance: number;
            availableBalance: number;
            overdraftLimit: number | null;
            lastReconciledDate: Date;
            lastReconciledBalance: number | null;
        }[];
        totalBalance: number;
        accountCount: number;
    }>;
    balanceSheet(query: FinancialReportQueryDto): Promise<{
        reportType: import("../dto/financial-reports.dto").ReportType;
        asOfDate: string;
        assets: {
            accounts: any[];
            total: number;
        };
        liabilities: {
            accounts: any[];
            total: number;
        };
        equity: {
            accounts: any[];
            total: number;
            netIncome: number;
            totalWithNetIncome: number;
        };
        totalAssets: number;
        totalLiabilitiesAndEquity: number;
        isBalanced: boolean;
    }>;
    incomeStatement(query: FinancialReportQueryDto): Promise<{
        reportType: import("../dto/financial-reports.dto").ReportType;
        startDate: string | undefined;
        endDate: string;
        revenue: {
            accounts: any[];
            total: number;
        };
        expenses: {
            accounts: any[];
            total: number;
        };
        grossProfit: number;
        operatingExpenses: number;
        netIncome: number;
    }>;
    cashFlow(query: FinancialReportQueryDto): Promise<{
        reportType: import("../dto/financial-reports.dto").ReportType;
        startDate: string | undefined;
        endDate: string;
        operatingActivities: {
            total: number;
            details: any[];
        };
        investingActivities: {
            total: number;
        };
        financingActivities: {
            total: number;
        };
        netCashChange: number;
        currentCashBalance: number;
    }>;
    bankSummary(query: FinancialReportQueryDto): Promise<{
        reportType: import("../dto/financial-reports.dto").ReportType;
        accounts: {
            id: string;
            accountCode: string;
            accountName: string;
            bankName: string;
            accountNumber: string;
            accountType: import("../../../entities/tenant").BankAccountType;
            currency: string;
            openingBalance: number;
            currentBalance: number;
            availableBalance: number;
            overdraftLimit: number | null;
            lastReconciledDate: Date;
            lastReconciledBalance: number | null;
        }[];
        totalBalance: number;
        accountCount: number;
    }>;
}
