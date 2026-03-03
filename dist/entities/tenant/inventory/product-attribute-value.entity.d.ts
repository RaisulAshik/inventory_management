import { ProductAttribute } from './product-attribute.entity';
export declare class ProductAttributeValue {
    id: string;
    attributeId: string;
    valueCode: string;
    valueLabel: string;
    colorHex: string;
    imageUrl: string;
    sortOrder: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    attribute: ProductAttribute;
}
