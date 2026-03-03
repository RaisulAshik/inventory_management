import { QueryGeneralLedgerDto } from '../dto/general-ledger.dto';
import { GeneralLedgerService } from '../service/journal-ledger.service';
export declare class GeneralLedgerController {
    private readonly glService;
    constructor(glService: GeneralLedgerService);
    findAll(query: QueryGeneralLedgerDto): Promise<{
        data: import("../../../entities/tenant").GeneralLedger[];
        total: number;
        page: number;
        limit: number;
    }>;
    getAccountLedger(accountId: string, startDate?: string, endDate?: string): Promise<{
        accountId: string;
        openingBalance: number;
        entries: import("../../../entities/tenant").GeneralLedger[];
        totalDebit: number;
        totalCredit: number;
        closingBalance: number;
    }>;
    getTrialBalance(fiscalYearId: string, asOfDate?: string): Promise<{
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
}
