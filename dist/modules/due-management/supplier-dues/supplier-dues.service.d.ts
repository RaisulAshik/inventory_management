import { TenantConnectionManager } from '@database/tenant-connection.manager';
import { PaginatedResult } from '@common/interfaces';
import { SupplierDue } from '@entities/tenant';
import { SupplierDueFilterDto, CreateSupplierOpeningBalanceDto, AdjustSupplierDueDto } from './dto/supplier-due.dto';
export declare class SupplierDuesService {
    private readonly tenantConnectionManager;
    constructor(tenantConnectionManager: TenantConnectionManager);
    private getRepo;
    private getDataSource;
    findAll(filterDto: SupplierDueFilterDto): Promise<PaginatedResult<SupplierDue>>;
    findById(id: string): Promise<SupplierDue>;
    findBySupplier(supplierId: string): Promise<{
        dues: SupplierDue[];
        summary: any;
    }>;
    createFromGRN(supplierId: string, purchaseOrderId: string, referenceNumber: string, amount: number, dueDate: Date, billNumber?: string, billDate?: Date, currency?: string): Promise<SupplierDue>;
    createOpeningBalance(dto: CreateSupplierOpeningBalanceDto, userId: string): Promise<SupplierDue>;
    adjustDue(id: string, dto: AdjustSupplierDueDto, userId: string): Promise<SupplierDue>;
    addPayment(dueId: string, amount: number, manager?: any): Promise<SupplierDue>;
    reversePayment(dueId: string, amount: number, manager?: any): Promise<SupplierDue>;
    applyDebitNote(dueId: string, amount: number, manager?: any): Promise<SupplierDue>;
    markOverdueDues(): Promise<number>;
    getUpcomingPayments(days?: number): Promise<SupplierDue[]>;
    getDashboardSummary(): Promise<any>;
}
