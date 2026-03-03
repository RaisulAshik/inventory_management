export declare enum ShippingCarrierType {
    INTERNAL = "INTERNAL",
    EXTERNAL = "EXTERNAL",
    PICKUP = "PICKUP"
}
export declare enum ShippingCalculationType {
    FLAT_RATE = "FLAT_RATE",
    WEIGHT_BASED = "WEIGHT_BASED",
    PRICE_BASED = "PRICE_BASED",
    ITEM_BASED = "ITEM_BASED",
    REAL_TIME = "REAL_TIME",
    FREE = "FREE"
}
export declare class ShippingMethod {
    id: string;
    methodCode: string;
    methodName: string;
    description: string;
    carrierType: ShippingCarrierType;
    carrierCode: string;
    calculationType: ShippingCalculationType;
    baseRate: number;
    ratePerKg: number;
    ratePerItem: number;
    freeShippingThreshold: number;
    minOrderAmount: number;
    maxOrderAmount: number;
    maxWeightKg: number;
    estimatedDeliveryDaysMin: number;
    estimatedDeliveryDaysMax: number;
    trackingAvailable: boolean;
    insuranceAvailable: boolean;
    isActive: boolean;
    sortOrder: number;
    createdAt: Date;
    updatedAt: Date;
    get estimatedDeliveryText(): string;
}
