import { TaxCategory } from './tax-category.entity';
export declare class TaxRate {
    id: string;
    taxCategoryId: string;
    taxType: string;
    rateName: string;
    ratePercentage: number;
    effectiveFrom: Date;
    effectiveTo: Date;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    taxCategory: TaxCategory;
}
