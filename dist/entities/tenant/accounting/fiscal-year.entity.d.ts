import { FiscalPeriodStatus } from '@common/enums';
import { FiscalPeriod } from './fiscal-period.entity';
export declare class FiscalYear {
    id: string;
    yearCode: string;
    yearName: string;
    startDate: Date;
    endDate: Date;
    status: FiscalPeriodStatus;
    isCurrent: boolean;
    closedBy: string;
    closedAt: Date;
    createdAt: Date;
    updatedAt: Date;
    periods: FiscalPeriod[];
    get isOpen(): boolean;
}
