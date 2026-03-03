import { CreateFiscalPeriodDto, QueryFiscalPeriodDto, UpdateFiscalPeriodDto } from '../dto/fiscal-periods.dto';
import { FiscalPeriodsService } from '../service/fiscal-periods.service';
import { JwtPayload } from '@/common/interfaces';
export declare class FiscalPeriodsController {
    private readonly fiscalPeriodsService;
    constructor(fiscalPeriodsService: FiscalPeriodsService);
    create(dto: CreateFiscalPeriodDto): Promise<import("../../../entities/tenant").FiscalPeriod>;
    findAll(query: QueryFiscalPeriodDto): Promise<{
        data: import("../../../entities/tenant").FiscalPeriod[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string): Promise<import("../../../entities/tenant").FiscalPeriod>;
    update(id: string, dto: UpdateFiscalPeriodDto): Promise<import("../../../entities/tenant").FiscalPeriod>;
    close(id: string, currentUser: JwtPayload): Promise<import("../../../entities/tenant").FiscalPeriod>;
    reopen(id: string): Promise<import("../../../entities/tenant").FiscalPeriod>;
}
