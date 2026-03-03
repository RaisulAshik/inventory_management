import { TenantConnectionManager } from '@database/tenant-connection.manager';
import { PaginatedResult } from '@common/interfaces';
import { SupplierPayment } from '@entities/tenant';
import { SupplierDuesService } from '../supplier-dues/supplier-dues.service';
import { CreateSupplierPaymentDto, SupplierPaymentFilterDto, AllocatePaymentDto } from './dto/supplier-payment.dto';
export declare class SupplierPaymentsService {
    private readonly tenantConnectionManager;
    private readonly supplierDuesService;
    constructor(tenantConnectionManager: TenantConnectionManager, supplierDuesService: SupplierDuesService);
    private getRepo;
    private getDataSource;
    create(dto: CreateSupplierPaymentDto, userId: string): Promise<SupplierPayment>;
    findAll(filterDto: SupplierPaymentFilterDto): Promise<PaginatedResult<SupplierPayment>>;
    findById(id: string): Promise<SupplierPayment>;
    submitForApproval(id: string, userId: string): Promise<SupplierPayment>;
    approve(id: string, userId: string): Promise<SupplierPayment>;
    process(id: string, userId: string): Promise<SupplierPayment>;
    complete(id: string, userId: string): Promise<SupplierPayment>;
    allocate(id: string, dto: AllocatePaymentDto, userId: string): Promise<SupplierPayment>;
    cancel(id: string, reason: string, userId: string): Promise<SupplierPayment>;
}
