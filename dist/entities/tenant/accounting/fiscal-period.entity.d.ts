import { FiscalPeriodStatus } from '@common/enums';
import { FiscalYear } from './fiscal-year.entity';
export declare class FiscalPeriod {
    id: string;
    fiscalYearId: string;
    periodNumber: number;
    periodName: string;
    startDate: Date;
    endDate: Date;
    status: FiscalPeriodStatus;
    closedBy: string;
    closedAt: Date;
    createdAt: Date;
    updatedAt: Date;
    fiscalYear: FiscalYear;
    get isOpen(): boolean;
}
