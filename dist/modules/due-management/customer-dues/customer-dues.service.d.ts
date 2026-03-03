import { TenantConnectionManager } from '@database/tenant-connection.manager';
import { PaginatedResult } from '@common/interfaces';
import { CustomerDue } from '@entities/tenant';
import { DueFilterDto } from './dto/due-filter.dto';
import { CreateOpeningBalanceDto, AdjustDueDto, WriteOffDueDto } from './dto/create-opening-balance.dto';
export declare class CustomerDuesService {
    private readonly tenantConnectionManager;
    constructor(tenantConnectionManager: TenantConnectionManager);
    private getRepo;
    private getDataSource;
    findAll(filterDto: DueFilterDto): Promise<PaginatedResult<CustomerDue>>;
    findById(id: string): Promise<CustomerDue>;
    findByCustomer(customerId: string): Promise<{
        dues: CustomerDue[];
        summary: any;
    }>;
    createFromOrder(customerId: string, salesOrderId: string, referenceNumber: string, amount: number, dueDate: Date, currency?: string): Promise<CustomerDue>;
    createOpeningBalance(dto: CreateOpeningBalanceDto, userId: string): Promise<CustomerDue>;
    adjustDue(id: string, dto: AdjustDueDto, userId: string): Promise<CustomerDue>;
    writeOff(id: string, dto: WriteOffDueDto, userId: string): Promise<CustomerDue>;
    markOverdueDues(): Promise<number>;
    addPayment(dueId: string, amount: number, manager?: any): Promise<CustomerDue>;
    reversePayment(dueId: string, amount: number, manager?: any): Promise<CustomerDue>;
    applyCreditNote(dueId: string, amount: number, manager?: any): Promise<CustomerDue>;
    getDashboardSummary(): Promise<any>;
    getCustomerStatement(customerId: string, fromDate: string, toDate: string): Promise<any>;
    getOverdueDues(): Promise<CustomerDue[]>;
}
