import { CreateCostCenterDto, QueryCostCenterDto, UpdateCostCenterDto } from '../dto/cost-centers.dto';
import { CostCentersService } from '../service/cost-centers.service';
export declare class CostCentersController {
    private readonly costCentersService;
    constructor(costCentersService: CostCentersService);
    create(dto: CreateCostCenterDto): Promise<import("../../../entities/tenant").CostCenter>;
    findAll(query: QueryCostCenterDto): Promise<{
        data: import("../../../entities/tenant").CostCenter[];
        total: number;
        page: number;
        limit: number;
    }>;
    getTree(): Promise<import("../../../entities/tenant").CostCenter[]>;
    findOne(id: string): Promise<import("../../../entities/tenant").CostCenter>;
    update(id: string, dto: UpdateCostCenterDto): Promise<import("../../../entities/tenant").CostCenter>;
    remove(id: string): Promise<void>;
}
