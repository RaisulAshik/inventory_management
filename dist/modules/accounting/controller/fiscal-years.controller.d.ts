import { CreateFiscalYearDto, QueryFiscalYearDto, UpdateFiscalYearDto, CloseFiscalYearDto } from '../dto/fiscal-years.dto';
import { FiscalYearsService } from '../service/fiscal-years.service';
import { JwtPayload } from '@/common/interfaces';
export declare class FiscalYearsController {
    private readonly fiscalYearsService;
    constructor(fiscalYearsService: FiscalYearsService);
    create(dto: CreateFiscalYearDto): Promise<import("../../../entities/tenant").FiscalYear>;
    findAll(query: QueryFiscalYearDto): Promise<{
        data: import("../../../entities/tenant").FiscalYear[];
        total: number;
        page: number;
        limit: number;
    }>;
    findCurrent(): Promise<import("../../../entities/tenant").FiscalYear>;
    findOne(id: string): Promise<import("../../../entities/tenant").FiscalYear>;
    update(id: string, dto: UpdateFiscalYearDto): Promise<import("../../../entities/tenant").FiscalYear>;
    close(id: string, dto: CloseFiscalYearDto, currentUser: JwtPayload): Promise<import("../../../entities/tenant").FiscalYear>;
    remove(id: string): Promise<void>;
}
