import { Brand } from '@entities/tenant/inventory/brand.entity';
export declare class BrandResponseDto {
    id: string;
    brandCode: string;
    brandName: string;
    description?: string;
    logoUrl?: string;
    website?: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    constructor(brand: Brand);
}
