import { TaxRate } from './tax-rate.entity';
import { Product } from './product.entity';
export declare class TaxCategory {
    id: string;
    taxCode: string;
    taxName: string;
    description: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    taxRates: TaxRate[];
    products: Product[];
}
