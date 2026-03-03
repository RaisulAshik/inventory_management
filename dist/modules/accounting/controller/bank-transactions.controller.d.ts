import { CreateBankTransactionDto, QueryBankTransactionDto, UpdateBankTransactionDto } from '../dto/bank-transactions.dto';
import { BankTransactionsService } from '../service/bank-transactions.service';
import { JwtPayload } from '@/common/interfaces';
export declare class BankTransactionsController {
    private readonly bankTxnService;
    constructor(bankTxnService: BankTransactionsService);
    create(dto: CreateBankTransactionDto, currentUser: JwtPayload): Promise<import("../../../entities/tenant").BankTransaction>;
    findAll(query: QueryBankTransactionDto): Promise<{
        data: import("../../../entities/tenant").BankTransaction[];
        total: number;
        page: number;
        limit: number;
    }>;
    getUnreconciled(bankAccountId: string): Promise<import("../../../entities/tenant").BankTransaction[]>;
    findOne(id: string): Promise<import("../../../entities/tenant").BankTransaction>;
    update(id: string, dto: UpdateBankTransactionDto): Promise<import("../../../entities/tenant").BankTransaction>;
    clear(id: string): Promise<import("../../../entities/tenant").BankTransaction>;
    bounce(id: string): Promise<import("../../../entities/tenant").BankTransaction>;
    remove(id: string): Promise<void>;
}
