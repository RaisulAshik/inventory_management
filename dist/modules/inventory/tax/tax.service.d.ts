import { TaxCategory, TaxRate } from '@/entities/tenant';
import { CreateTaxRateDto } from './dto/taxRate.dto';
import { TenantConnectionManager } from '@/database/tenant-connection.manager';
export declare class TaxService {
    private readonly tenantConnectionManager;
    constructor(tenantConnectionManager: TenantConnectionManager);
    private getTaxCategoryRepository;
    private getTaxRateRepository;
    findAllCategories(): Promise<TaxCategory[]>;
    findCategoryByCode(taxCode: string): Promise<TaxCategory>;
    findAllRates(categoryId?: string): Promise<TaxRate[]>;
    findActiveRates(categoryId?: string): Promise<TaxRate[]>;
    findRateById(id: string): Promise<TaxRate>;
    createRate(dto: CreateTaxRateDto): Promise<TaxRate>;
}
