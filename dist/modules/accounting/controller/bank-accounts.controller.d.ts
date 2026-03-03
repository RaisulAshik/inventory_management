import { CreateBankAccountDto, QueryBankAccountDto, UpdateBankAccountDto } from '../dto/bank-accounts.dto';
import { BankAccountsService } from '../service/bank-accounts.service';
export declare class BankAccountsController {
    private readonly bankAccountsService;
    constructor(bankAccountsService: BankAccountsService);
    create(dto: CreateBankAccountDto): Promise<import("../../../entities/tenant").BankAccount>;
    findAll(query: QueryBankAccountDto): Promise<{
        data: import("../../../entities/tenant").BankAccount[];
        total: number;
        page: number;
        limit: number;
    }>;
    findOne(id: string): Promise<import("../../../entities/tenant").BankAccount>;
    update(id: string, dto: UpdateBankAccountDto): Promise<import("../../../entities/tenant").BankAccount>;
    remove(id: string): Promise<void>;
}
