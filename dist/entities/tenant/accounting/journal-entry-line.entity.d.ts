import { JournalEntry } from './journal-entry.entity';
import { ChartOfAccounts } from './chart-of-accounts.entity';
import { TaxCategory } from '../inventory/tax-category.entity';
import { CostCenter } from './cost-center.entity';
export declare enum PartyType {
    CUSTOMER = "CUSTOMER",
    SUPPLIER = "SUPPLIER",
    EMPLOYEE = "EMPLOYEE",
    OTHER = "OTHER"
}
export declare class JournalEntryLine {
    id: string;
    journalEntryId: string;
    lineNumber: number;
    accountId: string;
    costCenterId: string;
    description: string;
    debitAmount: number;
    creditAmount: number;
    currency: string;
    exchangeRate: number;
    baseDebitAmount: number;
    baseCreditAmount: number;
    partyType: PartyType;
    partyId: string;
    taxCategoryId: string;
    createdAt: Date;
    journalEntry: JournalEntry;
    account: ChartOfAccounts;
    costCenter: CostCenter;
    taxCategory: TaxCategory;
}
