export declare class CreateSupplierProductDto {
    productId: string;
    variantId?: string;
    supplierSku?: string;
    supplierProductName?: string;
    purchaseUomId?: string;
    conversionFactor?: number;
    unitPrice?: number;
    currency?: string;
    minOrderQuantity?: number;
    packSize?: number;
    leadTimeDays?: number;
    isPreferred?: boolean;
    isActive?: boolean;
}
