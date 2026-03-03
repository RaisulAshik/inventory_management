import { SalesOrderStatus } from '@common/enums';
import { SalesOrder } from '@entities/tenant';
declare class OrderItemDto {
    id: string;
    lineNumber: number;
    productId: string;
    productName: string;
    productSku: string;
    variantId?: string;
    variantName?: string;
    quantity: number;
    shippedQuantity: number;
    returnedQuantity: number;
    unitPrice: number;
    discountPercentage: number;
    discountAmount: number;
    taxPercentage: number;
    taxAmount: number;
    lineTotal: number;
}
declare class OrderPaymentDto {
    id: string;
    paymentMethodName: string;
    amount: number;
    paymentDate: Date;
    referenceNumber?: string;
    status: string;
}
declare class CustomerDto {
    id: string;
    customerCode: string;
    displayName: string;
    email?: string;
    phone?: string;
}
export declare class OrderResponseDto {
    id: string;
    orderNumber: string;
    status: SalesOrderStatus;
    orderDate: Date;
    expectedDeliveryDate?: Date;
    customer?: CustomerDto;
    warehouseId?: string;
    warehouseName?: string;
    currency: string;
    exchangeRate: number;
    subtotal: number;
    discountPercentage: number;
    discountAmount: number;
    taxAmount: number;
    shippingAmount: number;
    totalAmount: number;
    paidAmount: number;
    balanceAmount: number;
    paymentStatus: string;
    trackingNumber?: string;
    shippingCarrier?: string;
    shippedAt?: Date;
    deliveredAt?: Date;
    notes?: string;
    items?: OrderItemDto[];
    payments?: OrderPaymentDto[];
    itemCount: number;
    totalQuantity: number;
    createdAt: Date;
    updatedAt: Date;
    constructor(order: SalesOrder);
}
export {};
