import { CreateChartOfAccountDto, QueryChartOfAccountDto, UpdateChartOfAccountDto } from '../dto/chat-of-accounts.dto';
import { ChartOfAccountsService } from '../service/chart-of-accounts.service';
import { JwtPayload } from '@/common/interfaces';
export declare class ChartOfAccountsController {
    private readonly accountsService;
    constructor(accountsService: ChartOfAccountsService);
    create(dto: CreateChartOfAccountDto, currentUser: JwtPayload): Promise<import("../../../entities/tenant").ChartOfAccounts>;
    findAll(query: QueryChartOfAccountDto): Promise<{
        data: import("../../../entities/tenant").ChartOfAccounts[];
        total: number;
        page: number;
        limit: number;
    }>;
    getTree(): Promise<import("../../../entities/tenant").ChartOfAccounts[]>;
    findByCode(code: string): Promise<import("../../../entities/tenant").ChartOfAccounts>;
    findOne(id: string): Promise<import("../../../entities/tenant").ChartOfAccounts>;
    update(id: string, dto: UpdateChartOfAccountDto): Promise<import("../../../entities/tenant").ChartOfAccounts>;
    remove(id: string): Promise<void>;
}
