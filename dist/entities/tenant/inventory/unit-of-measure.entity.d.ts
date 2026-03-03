import { UomType } from '@common/enums';
import { Product } from './product.entity';
import { UomConversion } from './uom-conversion.entity';
export declare class UnitOfMeasure {
    id: string;
    uomCode: string;
    uomName: string;
    description: string;
    symbol: string;
    uomType: UomType;
    decimalPlaces: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    products: Product[];
    conversionsFrom: UomConversion[];
    conversionsTo: UomConversion[];
    formatQuantity(quantity: number): string;
    get displayName(): string;
}
