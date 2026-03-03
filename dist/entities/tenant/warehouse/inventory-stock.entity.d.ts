import { Warehouse } from './warehouse.entity';
import { Product } from '../inventory/product.entity';
import { ProductVariant } from '../inventory/product-variant.entity';
export declare class InventoryStock {
    id: string;
    productId: string;
    variantId: string;
    warehouseId: string;
    quantityOnHand: number;
    quantityReserved: number;
    quantityIncoming: number;
    quantityOutgoing: number;
    lastStockDate: Date;
    lastCountDate: Date;
    createdAt: Date;
    updatedAt: Date;
    product: Product;
    variant: ProductVariant;
    warehouse: Warehouse;
    get quantityAvailable(): number;
}
