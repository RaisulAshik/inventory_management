import { ShoppingCart } from './shopping-cart.entity';
import { Product } from '../inventory/product.entity';
import { ProductVariant } from '../inventory/product-variant.entity';
export declare class ShoppingCartItem {
    id: string;
    cartId: string;
    productId: string;
    variantId: string;
    quantity: number;
    unitPrice: number;
    originalPrice: number;
    discountAmount: number;
    taxAmount: number;
    lineTotal: number;
    customOptions: Record<string, any>;
    notes: string;
    addedAt: Date;
    createdAt: Date;
    updatedAt: Date;
    cart: ShoppingCart;
    product: Product;
    variant: ProductVariant;
}
