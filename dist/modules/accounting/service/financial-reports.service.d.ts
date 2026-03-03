import { GeneralLedger } from '@/entities/tenant';
import { FinancialReportQueryDto, ReportType } from '../dto/financial-reports.dto';
import { GeneralLedgerService } from './journal-ledger.service';
import { TenantConnectionManager } from '@database/tenant-connection.manager';
export declare class FinancialReportsService {
    private readonly tenantConnectionManager;
    private readonly glService;
    constructor(tenantConnectionManager: TenantConnectionManager, glService: GeneralLedgerService);
    private getGlRepo;
    private getBankAccountRepo;
    generateReport(query: FinancialReportQueryDto): Promise<{
        reportType: ReportType;
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
        reportType: ReportType;
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
        reportType: ReportType;
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
        accountId: string;
        openingBalance: number;
        entries: GeneralLedger[];
        totalDebit: number;
        totalCredit: number;
        closingBalance: number;
    } | {
        reportType: ReportType;
        message: string;
    } | {
        reportType: ReportType;
        accounts: {
            id: string;
            accountCode: string;
            accountName: string;
            bankName: string;
            accountNumber: string;
            accountType: import("@/entities/tenant").BankAccountType;
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
        reportType: ReportType;
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
        reportType: ReportType;
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
    trialBalance(query: FinancialReportQueryDto): Promise<{
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
    }>;
    cashFlowStatement(query: FinancialReportQueryDto): Promise<{
        reportType: ReportType;
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
    generalLedgerReport(query: FinancialReportQueryDto): Promise<{
        accountId: string;
        openingBalance: number;
        entries: GeneralLedger[];
        totalDebit: number;
        totalCredit: number;
        closingBalance: number;
    }>;
    budgetVsActual(_query: FinancialReportQueryDto): {
        reportType: ReportType;
        message: string;
    };
    bankSummary(_query: FinancialReportQueryDto): Promise<{
        reportType: ReportType;
        accounts: {
            id: string;
            accountCode: string;
            accountName: string;
            bankName: string;
            accountNumber: string;
            accountType: import("@/entities/tenant").BankAccountType;
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
    private calculateNetIncome;
}
