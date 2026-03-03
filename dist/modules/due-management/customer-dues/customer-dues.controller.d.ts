import { JwtPayload } from '@common/interfaces';
import { CustomerDuesService } from './customer-dues.service';
import { DueFilterDto } from './dto/due-filter.dto';
import { CreateOpeningBalanceDto, AdjustDueDto, WriteOffDueDto } from './dto/create-opening-balance.dto';
export declare class CustomerDuesController {
    private readonly duesService;
    constructor(duesService: CustomerDuesService);
    findAll(filterDto: DueFilterDto): Promise<import("@common/interfaces").PaginatedResult<import("../../../entities/tenant").CustomerDue>>;
    getOverdue(): Promise<{
        data: import("../../../entities/tenant").CustomerDue[];
    }>;
    getDashboard(): Promise<any>;
    findByCustomer(customerId: string): Promise<{
        dues: import("../../../entities/tenant").CustomerDue[];
        summary: any;
    }>;
    getStatement(customerId: string, fromDate: string, toDate: string): Promise<any>;
    findOne(id: string): Promise<import("../../../entities/tenant").CustomerDue>;
    createOpeningBalance(dto: CreateOpeningBalanceDto, user: JwtPayload): Promise<import("../../../entities/tenant").CustomerDue>;
    adjust(id: string, dto: AdjustDueDto, user: JwtPayload): Promise<import("../../../entities/tenant").CustomerDue>;
    writeOff(id: string, dto: WriteOffDueDto, user: JwtPayload): Promise<import("../../../entities/tenant").CustomerDue>;
}
