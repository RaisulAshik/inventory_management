import { TenantConnectionManager } from '@/database/tenant-connection.manager';
import { Quotation, SalesOrder } from '@/entities/tenant';
import { CreateQuotationDto } from './dto/create-quotation.dto';
import { QuotationFilterDto } from './dto/quotation-filter.dto';
import { UpdateQuotationDto } from './dto/update-quotation.dto';
export declare class QuotationsService {
    private readonly tenantConnectionManager;
    sequenceService: any;
    constructor(tenantConnectionManager: TenantConnectionManager);
    private getRepo;
    private getQuotationItemRepository;
    create(dto: CreateQuotationDto, userId: string): Promise<Quotation>;
    findAll(filterDto: QuotationFilterDto): Promise<{
        data: Quotation[];
        meta: any;
    }>;
    findOne(id: string): Promise<Quotation>;
    findByNumber(quotationNumber: string): Promise<Quotation | null>;
    update(id: string, dto: UpdateQuotationDto): Promise<Quotation>;
    remove(id: string): Promise<void>;
    send(id: string, userId?: any): Promise<Quotation>;
    accept(id: string, userId: string): Promise<Quotation>;
    reject(id: string, userId: string, reason: string): Promise<Quotation>;
    cancel(id: string, userId: string, reason: string): Promise<Quotation>;
    convertToSalesOrder(id: string, userId: string): Promise<{
        quotation: Quotation;
        salesOrder: SalesOrder;
    }>;
}
