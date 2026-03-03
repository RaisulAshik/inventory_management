import { Product } from './product.entity';
export declare class ProductCategory {
    id: string;
    categoryCode: string;
    categoryName: string;
    parentId: string;
    level: number;
    path: string;
    description: string;
    imageUrl: string;
    isActive: boolean;
    sortOrder: number;
    createdAt: Date;
    updatedAt: Date;
    parent: ProductCategory | null;
    children: ProductCategory[];
    products: Product[];
}
