import { ProductAttributeValue } from './product-attribute-value.entity';
export declare enum AttributeType {
    TEXT = "TEXT",
    NUMBER = "NUMBER",
    SELECT = "SELECT",
    MULTI_SELECT = "MULTI_SELECT",
    BOOLEAN = "BOOLEAN",
    DATE = "DATE",
    COLOR = "COLOR"
}
export declare class ProductAttribute {
    id: string;
    attributeCode: string;
    attributeName: string;
    attributeType: AttributeType;
    description: string;
    isRequired: boolean;
    isFilterable: boolean;
    isSearchable: boolean;
    isVisibleOnFront: boolean;
    isUsedForVariants: boolean;
    sortOrder: number;
    validationRules: Record<string, any>;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    values: ProductAttributeValue[];
}
