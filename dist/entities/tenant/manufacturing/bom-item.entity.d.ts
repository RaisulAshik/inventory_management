import { BillOfMaterials } from './bill-of-materials.entity';
import { Product } from '../inventory/product.entity';
import { ProductVariant } from '../inventory/product-variant.entity';
import { UnitOfMeasure } from '../inventory/unit-of-measure.entity';
export declare enum BomItemType {
    RAW_MATERIAL = "RAW_MATERIAL",
    SEMI_FINISHED = "SEMI_FINISHED",
    SUB_ASSEMBLY = "SUB_ASSEMBLY",
    PACKAGING = "PACKAGING",
    CONSUMABLE = "CONSUMABLE"
}
export declare class BomItem {
    id: string;
    bomId: string;
    itemType: BomItemType;
    productId: string;
    variantId: string;
    quantity: number;
    uomId: string;
    unitCost: number;
    totalCost: number;
    scrapPercentage: number;
    isCritical: boolean;
    substituteProductId: string;
    sequence: number;
    notes: string;
    createdAt: Date;
    updatedAt: Date;
    bom: BillOfMaterials;
    product: Product;
    variant: ProductVariant;
    uom: UnitOfMeasure;
    substituteProduct: Product;
}
