import { GeneralLedger } from '@/entities/tenant';
import { QueryRunner } from 'typeorm';
import { QueryGeneralLedgerDto } from '../dto/general-ledger.dto';
import { TenantConnectionManager } from '@database/tenant-connection.manager';
export interface PostGLEntryDto {
    accountId: string;
    fiscalYearId: string;
    fiscalPeriodId: string;
    transactionDate: Date | string;
    journalEntryId: string;
    journalEntryLineId: string;
    description?: string;
    debitAmount: number;
    creditAmount: number;
    currency?: string;
    exchangeRate?: number;
    baseDebitAmount?: number;
    baseCreditAmount?: number;
    costCenterId?: string;
    referenceType?: string;
    referenceId?: string;
    referenceNumber?: string;
    partyType?: string;
    partyId?: string;
}
export declare class GeneralLedgerService {
    private readonly tenantConnectionManager;
    constructor(tenantConnectionManager: TenantConnectionManager);
    private getRepo;
    postEntry(dto: PostGLEntryDto, queryRunner?: QueryRunner): Promise<GeneralLedger>;
    findAll(query: QueryGeneralLedgerDto): Promise<{
        data: GeneralLedger[];
        total: number;
        page: number;
        limit: number;
    }>;
    getAccountLedger(accountId: string, startDate?: string, endDate?: string): Promise<{
        accountId: string;
        openingBalance: number;
        entries: GeneralLedger[];
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
