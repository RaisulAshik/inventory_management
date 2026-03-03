import { JwtPayload } from '@common/interfaces';
import { SupplierDuesService } from './supplier-dues.service';
import { SupplierDueFilterDto, CreateSupplierOpeningBalanceDto, AdjustSupplierDueDto } from './dto/supplier-due.dto';
export declare class SupplierDuesController {
    private readonly duesService;
    constructor(duesService: SupplierDuesService);
    findAll(filterDto: SupplierDueFilterDto): Promise<import("@common/interfaces").PaginatedResult<import("../../../entities/tenant").SupplierDue>>;
    getDashboard(): Promise<any>;
    getUpcoming(days?: number): Promise<import("../../../entities/tenant").SupplierDue[]>;
    findBySupplier(supplierId: string): Promise<{
        dues: import("../../../entities/tenant").SupplierDue[];
        summary: any;
    }>;
    findOne(id: string): Promise<import("../../../entities/tenant").SupplierDue>;
    createOpeningBalance(dto: CreateSupplierOpeningBalanceDto, user: JwtPayload): Promise<import("../../../entities/tenant").SupplierDue>;
    adjust(id: string, dto: AdjustSupplierDueDto, user: JwtPayload): Promise<import("../../../entities/tenant").SupplierDue>;
}
