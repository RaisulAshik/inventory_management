import { ProductCategory } from '@entities/tenant/inventory/product-category.entity';
export declare class CategoryResponseDto {
    id: string;
    categoryCode: string;
    categoryName: string;
    parentId?: string;
    level: number;
    path?: string;
    description?: string;
    imageUrl?: string;
    isActive: boolean;
    sortOrder: number;
    parent?: CategoryResponseDto;
    children?: CategoryResponseDto[];
    createdAt: Date;
    updatedAt: Date;
    constructor(category: ProductCategory);
}
