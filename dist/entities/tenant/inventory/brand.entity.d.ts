import { Product } from './product.entity';
export declare class Brand {
    id: string;
    brandCode: string;
    brandName: string;
    description: string;
    logoUrl: string;
    website: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    products: Product[];
}
