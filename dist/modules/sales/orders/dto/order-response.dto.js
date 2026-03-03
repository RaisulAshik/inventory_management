"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderResponseDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const enums_1 = require("../../../../common/enums");
class OrderItemDto {
    id;
    lineNumber;
    productId;
    productName;
    productSku;
    variantId;
    variantName;
    quantity;
    shippedQuantity;
    returnedQuantity;
    unitPrice;
    discountPercentage;
    discountAmount;
    taxPercentage;
    taxAmount;
    lineTotal;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, lineNumber: { required: true, type: () => Number }, productId: { required: true, type: () => String }, productName: { required: true, type: () => String }, productSku: { required: true, type: () => String }, variantId: { required: false, type: () => String }, variantName: { required: false, type: () => String }, quantity: { required: true, type: () => Number }, shippedQuantity: { required: true, type: () => Number }, returnedQuantity: { required: true, type: () => Number }, unitPrice: { required: true, type: () => Number }, discountPercentage: { required: true, type: () => Number }, discountAmount: { required: true, type: () => Number }, taxPercentage: { required: true, type: () => Number }, taxAmount: { required: true, type: () => Number }, lineTotal: { required: true, type: () => Number } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], OrderItemDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], OrderItemDto.prototype, "lineNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], OrderItemDto.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], OrderItemDto.prototype, "productName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], OrderItemDto.prototype, "productSku", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], OrderItemDto.prototype, "variantId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], OrderItemDto.prototype, "variantName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], OrderItemDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], OrderItemDto.prototype, "shippedQuantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], OrderItemDto.prototype, "returnedQuantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], OrderItemDto.prototype, "unitPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], OrderItemDto.prototype, "discountPercentage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], OrderItemDto.prototype, "discountAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], OrderItemDto.prototype, "taxPercentage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], OrderItemDto.prototype, "taxAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], OrderItemDto.prototype, "lineTotal", void 0);
class OrderPaymentDto {
    id;
    paymentMethodName;
    amount;
    paymentDate;
    referenceNumber;
    status;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, paymentMethodName: { required: true, type: () => String }, amount: { required: true, type: () => Number }, paymentDate: { required: true, type: () => Date }, referenceNumber: { required: false, type: () => String }, status: { required: true, type: () => String } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], OrderPaymentDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], OrderPaymentDto.prototype, "paymentMethodName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], OrderPaymentDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], OrderPaymentDto.prototype, "paymentDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], OrderPaymentDto.prototype, "referenceNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], OrderPaymentDto.prototype, "status", void 0);
class CustomerDto {
    id;
    customerCode;
    displayName;
    email;
    phone;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, customerCode: { required: true, type: () => String }, displayName: { required: true, type: () => String }, email: { required: false, type: () => String }, phone: { required: false, type: () => String } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CustomerDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CustomerDto.prototype, "customerCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], CustomerDto.prototype, "displayName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CustomerDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], CustomerDto.prototype, "phone", void 0);
class OrderResponseDto {
    id;
    orderNumber;
    status;
    orderDate;
    expectedDeliveryDate;
    customer;
    warehouseId;
    warehouseName;
    currency;
    exchangeRate;
    subtotal;
    discountPercentage;
    discountAmount;
    taxAmount;
    shippingAmount;
    totalAmount;
    paidAmount;
    balanceAmount;
    paymentStatus;
    trackingNumber;
    shippingCarrier;
    shippedAt;
    deliveredAt;
    notes;
    items;
    payments;
    itemCount;
    totalQuantity;
    createdAt;
    updatedAt;
    constructor(order) {
        this.id = order.id;
        this.orderNumber = order.orderNumber;
        this.status = order.status;
        this.orderDate = order.orderDate;
        this.expectedDeliveryDate = order.expectedDeliveryDate;
        this.warehouseId = order.warehouseId;
        this.warehouseName = order.warehouse?.warehouseName;
        this.currency = order.currency;
        this.exchangeRate = Number(order.exchangeRate);
        this.subtotal = Number(order.subtotal);
        this.discountPercentage = Number(order.discountPercentage);
        this.discountAmount = Number(order.discountAmount);
        this.taxAmount = Number(order.taxAmount);
        this.shippingAmount = Number(order.shippingAmount);
        this.totalAmount = Number(order.totalAmount);
        this.paidAmount = Number(order.paidAmount);
        this.balanceAmount = Number(order.totalAmount) - Number(order.paidAmount);
        this.trackingNumber = order.trackingNumber;
        this.shippingCarrier = order.shippingCarrier;
        this.shippedAt = order.shippedAt;
        this.deliveredAt = order.deliveredAt;
        this.notes = order.notes;
        this.createdAt = order.createdAt;
        this.updatedAt = order.updatedAt;
        if (Number(order.paidAmount) >= Number(order.totalAmount)) {
            this.paymentStatus = 'PAID';
        }
        else if (Number(order.paidAmount) > 0) {
            this.paymentStatus = 'PARTIAL';
        }
        else {
            this.paymentStatus = 'UNPAID';
        }
        if (order.customer) {
            this.customer = {
                id: order.customer.id,
                customerCode: order.customer.customerCode,
                displayName: order.customer.displayName,
                email: order.customer.email,
                phone: order.customer.phone,
            };
        }
        if (order.items) {
            this.items = order.items.map((item) => ({
                id: item.id,
                lineNumber: item.lineNumber,
                productId: item.productId,
                productName: item.productName,
                productSku: item.productSku,
                variantId: item.variantId,
                variantName: item.variant?.variantName,
                quantity: Number(item.quantity),
                shippedQuantity: Number(item.shippedQuantity) || 0,
                returnedQuantity: Number(item.returnedQuantity) || 0,
                unitPrice: Number(item.unitPrice),
                discountPercentage: Number(item.discountPercentage),
                discountAmount: Number(item.discountAmount),
                taxPercentage: Number(item.taxPercentage),
                taxAmount: Number(item.taxAmount),
                lineTotal: Number(item.lineTotal),
            }));
            this.itemCount = order.items.length;
            this.totalQuantity = order.items.reduce((sum, item) => sum + Number(item.quantity), 0);
        }
        else {
            this.itemCount = 0;
            this.totalQuantity = 0;
        }
        if (order.payments) {
            this.payments = order.payments.map((payment) => ({
                id: payment.id,
                paymentMethodName: payment.paymentMethod?.methodName || 'Unknown',
                amount: Number(payment.amount),
                paymentDate: payment.paymentDate,
                referenceNumber: payment.referenceNumber,
                status: payment.status,
            }));
        }
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, orderNumber: { required: true, type: () => String }, status: { required: true, enum: require("../../../../common/enums/index").SalesOrderStatus }, orderDate: { required: true, type: () => Date }, expectedDeliveryDate: { required: false, type: () => Date }, customer: { required: false, type: () => CustomerDto }, warehouseId: { required: false, type: () => String }, warehouseName: { required: false, type: () => String }, currency: { required: true, type: () => String }, exchangeRate: { required: true, type: () => Number }, subtotal: { required: true, type: () => Number }, discountPercentage: { required: true, type: () => Number }, discountAmount: { required: true, type: () => Number }, taxAmount: { required: true, type: () => Number }, shippingAmount: { required: true, type: () => Number }, totalAmount: { required: true, type: () => Number }, paidAmount: { required: true, type: () => Number }, balanceAmount: { required: true, type: () => Number }, paymentStatus: { required: true, type: () => String }, trackingNumber: { required: false, type: () => String }, shippingCarrier: { required: false, type: () => String }, shippedAt: { required: false, type: () => Date }, deliveredAt: { required: false, type: () => Date }, notes: { required: false, type: () => String }, items: { required: false, type: () => [OrderItemDto] }, payments: { required: false, type: () => [OrderPaymentDto] }, itemCount: { required: true, type: () => Number }, totalQuantity: { required: true, type: () => Number }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
}
exports.OrderResponseDto = OrderResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], OrderResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], OrderResponseDto.prototype, "orderNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: enums_1.SalesOrderStatus }),
    __metadata("design:type", String)
], OrderResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], OrderResponseDto.prototype, "orderDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Date)
], OrderResponseDto.prototype, "expectedDeliveryDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: CustomerDto }),
    __metadata("design:type", CustomerDto)
], OrderResponseDto.prototype, "customer", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], OrderResponseDto.prototype, "warehouseId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], OrderResponseDto.prototype, "warehouseName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], OrderResponseDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], OrderResponseDto.prototype, "exchangeRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], OrderResponseDto.prototype, "subtotal", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], OrderResponseDto.prototype, "discountPercentage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], OrderResponseDto.prototype, "discountAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], OrderResponseDto.prototype, "taxAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], OrderResponseDto.prototype, "shippingAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], OrderResponseDto.prototype, "totalAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], OrderResponseDto.prototype, "paidAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], OrderResponseDto.prototype, "balanceAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], OrderResponseDto.prototype, "paymentStatus", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], OrderResponseDto.prototype, "trackingNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], OrderResponseDto.prototype, "shippingCarrier", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Date)
], OrderResponseDto.prototype, "shippedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Date)
], OrderResponseDto.prototype, "deliveredAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], OrderResponseDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [OrderItemDto] }),
    __metadata("design:type", Array)
], OrderResponseDto.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [OrderPaymentDto] }),
    __metadata("design:type", Array)
], OrderResponseDto.prototype, "payments", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], OrderResponseDto.prototype, "itemCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], OrderResponseDto.prototype, "totalQuantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], OrderResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], OrderResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=order-response.dto.js.map