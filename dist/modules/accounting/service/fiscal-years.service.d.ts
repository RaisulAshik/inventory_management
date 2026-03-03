import { FiscalYear } from '@/entities/tenant';
import { CreateFiscalYearDto, QueryFiscalYearDto, UpdateFiscalYearDto, CloseFiscalYearDto } from '../dto/fiscal-years.dto';
import { TenantConnectionManager } from '@database/tenant-connection.manager';
export declare class FiscalYearsService {
    private readonly tenantConnectionManager;
    constructor(tenantConnectionManager: TenantConnectionManager);
    private getFYRepo;
    private getFPRepo;
    create(dto: CreateFiscalYearDto): Promise<FiscalYear>;
    private generateMonthlyPeriods;
    findAll(query: QueryFiscalYearDto): Promise<{
        data: FiscalYear[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string): Promise<FiscalYear>;
    findCurrent(): Promise<FiscalYear>;
    update(id: string, dto: UpdateFiscalYearDto): Promise<FiscalYear>;
    close(id: string, _dto: CloseFiscalYearDto, userId: string): Promise<FiscalYear>;
    remove(id: string): Promise<void>;
}
