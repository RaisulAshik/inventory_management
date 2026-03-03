import { TaxService } from './tax.service';
import { CreateTaxRateDto } from './dto/taxRate.dto';
export declare class TaxController {
    private readonly taxService;
    constructor(taxService: TaxService);
    getAllCategories(): Promise<import("../../../entities/tenant").TaxCategory[]>;
    getCategory(code: string): Promise<import("../../../entities/tenant").TaxCategory>;
    getAllRates(categoryId?: string): Promise<import("../../../entities/tenant").TaxRate[]>;
    getActiveRates(categoryId?: string): Promise<import("../../../entities/tenant").TaxRate[]>;
    getRateById(id: string): Promise<import("../../../entities/tenant").TaxRate>;
    createRate(createRateDto: CreateTaxRateDto): Promise<import("../../../entities/tenant").TaxRate>;
}
