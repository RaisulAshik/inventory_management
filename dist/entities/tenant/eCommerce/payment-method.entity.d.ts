export declare enum PaymentMethodType {
    CASH = "CASH",
    CARD = "CARD",
    UPI = "UPI",
    NET_BANKING = "NET_BANKING",
    WALLET = "WALLET",
    BANK_TRANSFER = "BANK_TRANSFER",
    CHEQUE = "CHEQUE",
    COD = "COD",
    CREDIT = "CREDIT",
    EMI = "EMI",
    GIFT_CARD = "GIFT_CARD",
    STORE_CREDIT = "STORE_CREDIT",
    OTHER = "OTHER"
}
export declare class PaymentMethod {
    id: string;
    methodCode: string;
    methodName: string;
    description: string;
    methodType: PaymentMethodType;
    gatewayCode: string;
    gatewayConfig: Record<string, any>;
    processingFeeType: 'PERCENTAGE' | 'FIXED' | 'NONE';
    processingFeeValue: number;
    minAmount: number;
    maxAmount: number;
    isAvailablePos: boolean;
    isAvailableEcommerce: boolean;
    requiresReference: boolean;
    isActive: boolean;
    sortOrder: number;
    iconUrl: string;
    createdAt: Date;
    updatedAt: Date;
    calculateProcessingFee(amount: number): number;
}
