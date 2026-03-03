import { ProductVariant } from './product-variant.entity';
import { ProductAttribute } from './product-attribute.entity';
import { ProductAttributeValue } from './product-attribute-value.entity';
export declare class ProductVariantAttribute {
    id: string;
    variantId: string;
    attributeId: string;
    attributeValueId: string;
    customValue: string;
    createdAt: Date;
    variant: ProductVariant;
    attribute: ProductAttribute;
    attributeValue: ProductAttributeValue;
    get displayValue(): string;
}
