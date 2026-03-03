import { CostCenter } from '@/entities/tenant';
import { CreateCostCenterDto, QueryCostCenterDto, UpdateCostCenterDto } from '../dto/cost-centers.dto';
import { TenantConnectionManager } from '@database/tenant-connection.manager';
export declare class CostCentersService {
    private readonly tenantConnectionManager;
    constructor(tenantConnectionManager: TenantConnectionManager);
    private getRepo;
    create(dto: CreateCostCenterDto): Promise<CostCenter>;
    findAll(query: QueryCostCenterDto): Promise<{
        data: CostCenter[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string): Promise<CostCenter>;
    update(id: string, dto: UpdateCostCenterDto): Promise<CostCenter>;
    remove(id: string): Promise<void>;
    getTree(): Promise<CostCenter[]>;
}
