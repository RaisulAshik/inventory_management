import { FiscalPeriod } from '@/entities/tenant';
import { CreateFiscalPeriodDto, QueryFiscalPeriodDto, UpdateFiscalPeriodDto } from '../dto/fiscal-periods.dto';
import { TenantConnectionManager } from '@database/tenant-connection.manager';
export declare class FiscalPeriodsService {
    private readonly tenantConnectionManager;
    constructor(tenantConnectionManager: TenantConnectionManager);
    private getRepo;
    create(dto: CreateFiscalPeriodDto): Promise<FiscalPeriod>;
    findAll(query: QueryFiscalPeriodDto): Promise<{
        data: FiscalPeriod[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string): Promise<FiscalPeriod>;
    findByDate(date: Date): Promise<FiscalPeriod>;
    update(id: string, dto: UpdateFiscalPeriodDto): Promise<FiscalPeriod>;
    close(id: string, userId: string): Promise<FiscalPeriod>;
    reopen(id: string): Promise<FiscalPeriod>;
}
