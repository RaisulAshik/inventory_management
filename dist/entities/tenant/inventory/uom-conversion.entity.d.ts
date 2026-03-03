import { UnitOfMeasure } from './unit-of-measure.entity';
export declare class UomConversion {
    id: string;
    fromUomId: string;
    toUomId: string;
    conversionFactor: number;
    isBidirectional: boolean;
    productId: string;
    isActive: boolean;
    description: string;
    createdBy: string;
    updatedBy: string;
    createdAt: Date;
    updatedAt: Date;
    fromUom: UnitOfMeasure;
    toUom: UnitOfMeasure;
    get reverseConversionFactor(): number;
    convert(quantity: number): number;
    reverseConvert(quantity: number): number;
    get displayString(): string;
}
