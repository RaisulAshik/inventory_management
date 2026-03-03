import { Customer } from './customer.entity';
import { Coupon } from './coupon.entity';
import { ShoppingCartItem } from './shopping-cart-item.entity';
export declare enum CartStatus {
    ACTIVE = "ACTIVE",
    CONVERTED = "CONVERTED",
    ABANDONED = "ABANDONED",
    MERGED = "MERGED"
}
export declare class ShoppingCart {
    id: string;
    customerId: string;
    sessionId: string;
    status: CartStatus;
    subtotal: number;
    discountAmount: number;
    taxAmount: number;
    totalAmount: number;
    couponId: string;
    couponCode: string;
    couponDiscount: number;
    itemCount: number;
    currency: string;
    ipAddress: string;
    userAgent: string;
    lastActivityAt: Date;
    convertedOrderId: string;
    notes: string;
    createdAt: Date;
    updatedAt: Date;
    customer: Customer;
    coupon: Coupon;
    items: ShoppingCartItem[];
    get isEmpty(): boolean;
}
