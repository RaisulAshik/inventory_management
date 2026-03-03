export declare enum CouponType {
    PERCENTAGE = "PERCENTAGE",
    FIXED_AMOUNT = "FIXED_AMOUNT",
    FREE_SHIPPING = "FREE_SHIPPING",
    BUY_X_GET_Y = "BUY_X_GET_Y"
}
export declare enum CouponStatus {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    EXPIRED = "EXPIRED",
    EXHAUSTED = "EXHAUSTED"
}
export declare class Coupon {
    id: string;
    couponCode: string;
    couponName: string;
    description: string;
    couponType: CouponType;
    discountValue: number;
    maxDiscountAmount: number;
    minOrderAmount: number;
    minQuantity: number;
    startDate: Date;
    endDate: Date;
    usageLimit: number;
    usageLimitPerCustomer: number;
    timesUsed: number;
    status: CouponStatus;
    appliesToAllProducts: boolean;
    appliesToAllCustomers: boolean;
    isFirstOrderOnly: boolean;
    isCombinable: boolean;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
    get isValid(): boolean;
    get remainingUses(): number | null;
}
