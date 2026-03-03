import { Customer } from './customer.entity';
import { Product } from '../inventory/product.entity';
import { ProductVariant } from '../inventory/product-variant.entity';
export declare class Wishlist {
    id: string;
    customerId: string;
    productId: string;
    variantId: string;
    notes: string;
    priority: number;
    notifyOnSale: boolean;
    notifyOnStock: boolean;
    createdAt: Date;
    customer: Customer;
    product: Product;
    variant: ProductVariant;
}
