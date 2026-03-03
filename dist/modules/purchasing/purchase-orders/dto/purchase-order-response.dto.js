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
exports.PurchaseOrderDetailResponseDto = exports.PurchaseOrderResponseDto = void 0;
const openapi = require("@nestjs/swagger");
const enums_1 = require("../../../../common/enums");
const swagger_1 = require("@nestjs/swagger");
class PurchaseOrderItemDto {
    id;
    lineNumber;
    productId;
    productName;
    productSku;
    variantId;
    quantityOrdered;
    receivedQuantity;
    pendingQuantity;
    unitPrice;
    discountPercentage;
    discountAmount;
    taxPercentage;
    taxAmount;
    lineTotal;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, lineNumber: { required: true, type: () => Number }, productId: { required: true, type: () => String }, productName: { required: true, type: () => String }, productSku: { required: true, type: () => String }, variantId: { required: false, type: () => String }, quantityOrdered: { required: true, type: () => Number }, receivedQuantity: { required: true, type: () => Number }, pendingQuantity: { required: true, type: () => Number }, unitPrice: { required: true, type: () => Number }, discountPercentage: { required: true, type: () => Number }, discountAmount: { required: true, type: () => Number }, taxPercentage: { required: true, type: () => Number }, taxAmount: { required: true, type: () => Number }, lineTotal: { required: true, type: () => Number } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PurchaseOrderItemDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PurchaseOrderItemDto.prototype, "lineNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PurchaseOrderItemDto.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PurchaseOrderItemDto.prototype, "productName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PurchaseOrderItemDto.prototype, "productSku", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], PurchaseOrderItemDto.prototype, "variantId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PurchaseOrderItemDto.prototype, "quantityOrdered", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PurchaseOrderItemDto.prototype, "receivedQuantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PurchaseOrderItemDto.prototype, "pendingQuantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PurchaseOrderItemDto.prototype, "unitPrice", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PurchaseOrderItemDto.prototype, "discountPercentage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PurchaseOrderItemDto.prototype, "discountAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PurchaseOrderItemDto.prototype, "taxPercentage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PurchaseOrderItemDto.prototype, "taxAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PurchaseOrderItemDto.prototype, "lineTotal", void 0);
class SupplierDto {
    id;
    supplierCode;
    companyName;
    email;
    phone;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, supplierCode: { required: true, type: () => String }, companyName: { required: true, type: () => String }, email: { required: false, type: () => String }, phone: { required: false, type: () => String } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SupplierDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SupplierDto.prototype, "supplierCode", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], SupplierDto.prototype, "companyName", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], SupplierDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], SupplierDto.prototype, "phone", void 0);
class PurchaseOrderResponseDto {
    id;
    poNumber;
    status;
    poDate;
    orderDate;
    expectedDeliveryDate;
    supplier;
    warehouseId;
    warehouseName;
    currency;
    exchangeRate;
    subtotal;
    discountPercentage;
    discountAmount;
    taxAmount;
    shippingAmount;
    otherCharges;
    totalAmount;
    paidAmount;
    balanceAmount;
    approvedAt;
    sentAt;
    acknowledgedAt;
    supplierReferenceNumber;
    notes;
    items;
    itemCount;
    totalQuantity;
    receivedQuantity;
    createdAt;
    updatedAt;
    constructor(po) {
        this.id = po.id;
        this.poNumber = po.poNumber;
        this.status = po.status;
        this.orderDate = po.poDate;
        this.expectedDeliveryDate = po.expectedDate;
        this.warehouseId = po.warehouseId;
        this.warehouseName = po.warehouse?.warehouseName;
        this.currency = po.currency;
        this.exchangeRate = Number(po.exchangeRate);
        this.subtotal = Number(po.subtotal);
        this.discountPercentage = Number(po.discountValue);
        this.discountAmount = Number(po.discountAmount);
        this.taxAmount = Number(po.taxAmount);
        this.shippingAmount = Number(po.shippingAmount);
        this.otherCharges = Number(po.otherCharges);
        this.totalAmount = Number(po.totalAmount);
        this.paidAmount = Number(po.paidAmount);
        this.balanceAmount = Number(po.totalAmount) - Number(po.paidAmount);
        this.approvedAt = po.approvedAt;
        this.sentAt = po.sentAt;
        this.acknowledgedAt = po.acknowledgedAt;
        this.supplierReferenceNumber = po.supplierReferenceNumber;
        this.notes = po.notes;
        this.createdAt = po.createdAt;
        this.updatedAt = po.updatedAt;
        if (po.supplier) {
            this.supplier = {
                id: po.supplier.id,
                supplierCode: po.supplier.supplierCode,
                companyName: po.supplier.companyName,
                email: po.supplier.email,
                phone: po.supplier.phone,
            };
        }
        if (po.items) {
            this.items = po.items.map((item) => ({
                id: item.id,
                lineNumber: item.lineNumber,
                productId: item.productId,
                productName: item.product?.productName || item.productName,
                productSku: item.product?.sku || item.sku,
                variantId: item.variantId,
                quantityOrdered: Number(item.quantityOrdered),
                receivedQuantity: Number(item.receivedQuantity) || 0,
                pendingQuantity: Number(item.quantityOrdered) - (Number(item.receivedQuantity) || 0),
                unitPrice: Number(item.unitPrice),
                discountPercentage: Number(item.discountPercentage),
                discountAmount: Number(item.discountAmount),
                taxPercentage: Number(item.taxPercentage),
                taxAmount: Number(item.taxAmount),
                lineTotal: Number(item.lineTotal),
            }));
            this.itemCount = po.items.length;
            this.totalQuantity = po.items.reduce((sum, item) => sum + Number(item.quantityOrdered), 0);
            this.receivedQuantity = po.items.reduce((sum, item) => sum + (Number(item.receivedQuantity) || 0), 0);
        }
        else {
            this.itemCount = 0;
            this.totalQuantity = 0;
            this.receivedQuantity = 0;
        }
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, poNumber: { required: true, type: () => String }, status: { required: true, enum: require("../../../../common/enums/index").PurchaseOrderStatus }, poDate: { required: true, type: () => Date }, orderDate: { required: true, type: () => Date }, expectedDeliveryDate: { required: false, type: () => Date }, supplier: { required: false, type: () => SupplierDto }, warehouseId: { required: false, type: () => String }, warehouseName: { required: false, type: () => String }, currency: { required: true, type: () => String }, exchangeRate: { required: true, type: () => Number }, subtotal: { required: true, type: () => Number }, discountPercentage: { required: true, type: () => Number }, discountAmount: { required: true, type: () => Number }, taxAmount: { required: true, type: () => Number }, shippingAmount: { required: true, type: () => Number }, otherCharges: { required: true, type: () => Number }, totalAmount: { required: true, type: () => Number }, paidAmount: { required: true, type: () => Number }, balanceAmount: { required: true, type: () => Number }, approvedAt: { required: false, type: () => Date }, sentAt: { required: false, type: () => Date }, acknowledgedAt: { required: false, type: () => Date }, supplierReferenceNumber: { required: false, type: () => String }, notes: { required: false, type: () => String }, items: { required: false, type: () => [PurchaseOrderItemDto] }, itemCount: { required: true, type: () => Number }, totalQuantity: { required: true, type: () => Number }, receivedQuantity: { required: true, type: () => Number }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
}
exports.PurchaseOrderResponseDto = PurchaseOrderResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PurchaseOrderResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PurchaseOrderResponseDto.prototype, "poNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: enums_1.PurchaseOrderStatus }),
    __metadata("design:type", String)
], PurchaseOrderResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], PurchaseOrderResponseDto.prototype, "poDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], PurchaseOrderResponseDto.prototype, "orderDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Date)
], PurchaseOrderResponseDto.prototype, "expectedDeliveryDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: SupplierDto }),
    __metadata("design:type", SupplierDto)
], PurchaseOrderResponseDto.prototype, "supplier", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], PurchaseOrderResponseDto.prototype, "warehouseId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], PurchaseOrderResponseDto.prototype, "warehouseName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PurchaseOrderResponseDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PurchaseOrderResponseDto.prototype, "exchangeRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PurchaseOrderResponseDto.prototype, "subtotal", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PurchaseOrderResponseDto.prototype, "discountPercentage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PurchaseOrderResponseDto.prototype, "discountAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PurchaseOrderResponseDto.prototype, "taxAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PurchaseOrderResponseDto.prototype, "shippingAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PurchaseOrderResponseDto.prototype, "otherCharges", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PurchaseOrderResponseDto.prototype, "totalAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PurchaseOrderResponseDto.prototype, "paidAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PurchaseOrderResponseDto.prototype, "balanceAmount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Date)
], PurchaseOrderResponseDto.prototype, "approvedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Date)
], PurchaseOrderResponseDto.prototype, "sentAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Date)
], PurchaseOrderResponseDto.prototype, "acknowledgedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], PurchaseOrderResponseDto.prototype, "supplierReferenceNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], PurchaseOrderResponseDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [PurchaseOrderItemDto] }),
    __metadata("design:type", Array)
], PurchaseOrderResponseDto.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PurchaseOrderResponseDto.prototype, "itemCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PurchaseOrderResponseDto.prototype, "totalQuantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PurchaseOrderResponseDto.prototype, "receivedQuantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], PurchaseOrderResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], PurchaseOrderResponseDto.prototype, "updatedAt", void 0);
class PurchaseOrderDetailResponseDto {
    id;
    poNumber;
    status;
    poDate;
    orderDate;
    expectedDeliveryDate;
    supplier;
    warehouseId;
    warehouseName;
    currency;
    exchangeRate;
    subtotal;
    discountPercentage;
    discountAmount;
    taxAmount;
    shippingAmount;
    otherCharges;
    totalAmount;
    paidAmount;
    balanceAmount;
    approvedAt;
    sentAt;
    acknowledgedAt;
    supplierReferenceNumber;
    notes;
    items;
    itemCount;
    totalQuantity;
    receivedQuantity;
    createdAt;
    updatedAt;
    constructor(po) {
        this.id = po.id;
        this.poNumber = po.poNumber;
        this.status = po.status;
        this.orderDate = po.poDate;
        this.expectedDeliveryDate = po.expectedDate;
        this.warehouseId = po.warehouseId;
        this.warehouseName = po.warehouse?.warehouseName;
        this.currency = po.currency;
        this.exchangeRate = Number(po.exchangeRate);
        this.subtotal = Number(po.subtotal);
        this.discountPercentage = Number(po.discountValue);
        this.discountAmount = Number(po.discountAmount);
        this.taxAmount = Number(po.taxAmount);
        this.shippingAmount = Number(po.shippingAmount);
        this.otherCharges = Number(po.otherCharges);
        this.totalAmount = Number(po.totalAmount);
        this.paidAmount = Number(po.paidAmount);
        this.balanceAmount = Number(po.totalAmount) - Number(po.paidAmount);
        this.approvedAt = po.approvedAt;
        this.sentAt = po.sentAt;
        this.acknowledgedAt = po.acknowledgedAt;
        this.supplierReferenceNumber = po.supplierReferenceNumber;
        this.notes = po.notes;
        this.createdAt = po.createdAt;
        this.updatedAt = po.updatedAt;
        if (po.supplier) {
            this.supplier = {
                id: po.supplier.id,
                supplierCode: po.supplier.supplierCode,
                companyName: po.supplier.companyName,
                email: po.supplier.email,
                phone: po.supplier.phone,
            };
        }
        if (po.items) {
            this.items = po.items.map((item) => ({
                id: item.id,
                lineNumber: item.lineNumber,
                productId: item.productId,
                productName: item.product?.productName || item.productName,
                productSku: item.product?.sku || item.sku,
                variantId: item.variantId,
                quantityOrdered: Number(item.quantityOrdered),
                receivedQuantity: Number(item.receivedQuantity) || 0,
                pendingQuantity: Number(item.quantityOrdered) - (Number(item.receivedQuantity) || 0),
                unitPrice: Number(item.unitPrice),
                discountPercentage: Number(item.discountPercentage),
                discountAmount: Number(item.discountAmount),
                taxPercentage: Number(item.taxPercentage),
                taxAmount: Number(item.taxAmount),
                lineTotal: Number(item.lineTotal),
            }));
            this.itemCount = po.items.length;
            this.totalQuantity = po.items.reduce((sum, item) => sum + Number(item.quantityOrdered), 0);
            this.receivedQuantity = po.items.reduce((sum, item) => sum + (Number(item.receivedQuantity) || 0), 0);
        }
        else {
            this.itemCount = 0;
            this.totalQuantity = 0;
            this.receivedQuantity = 0;
        }
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, poNumber: { required: true, type: () => String }, status: { required: true, enum: require("../../../../common/enums/index").PurchaseOrderStatus }, poDate: { required: true, type: () => Date }, orderDate: { required: true, type: () => Date }, expectedDeliveryDate: { required: false, type: () => Date }, supplier: { required: false, type: () => SupplierDto }, warehouseId: { required: false, type: () => String }, warehouseName: { required: false, type: () => String }, currency: { required: true, type: () => String }, exchangeRate: { required: true, type: () => Number }, subtotal: { required: true, type: () => Number }, discountPercentage: { required: true, type: () => Number }, discountAmount: { required: true, type: () => Number }, taxAmount: { required: true, type: () => Number }, shippingAmount: { required: true, type: () => Number }, otherCharges: { required: true, type: () => Number }, totalAmount: { required: true, type: () => Number }, paidAmount: { required: true, type: () => Number }, balanceAmount: { required: true, type: () => Number }, approvedAt: { required: false, type: () => Date }, sentAt: { required: false, type: () => Date }, acknowledgedAt: { required: false, type: () => Date }, supplierReferenceNumber: { required: false, type: () => String }, notes: { required: false, type: () => String }, items: { required: false, type: () => [PurchaseOrderItemDto] }, itemCount: { required: true, type: () => Number }, totalQuantity: { required: true, type: () => Number }, receivedQuantity: { required: true, type: () => Number }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
}
exports.PurchaseOrderDetailResponseDto = PurchaseOrderDetailResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PurchaseOrderDetailResponseDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PurchaseOrderDetailResponseDto.prototype, "poNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: enums_1.PurchaseOrderStatus }),
    __metadata("design:type", String)
], PurchaseOrderDetailResponseDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], PurchaseOrderDetailResponseDto.prototype, "poDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], PurchaseOrderDetailResponseDto.prototype, "orderDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Date)
], PurchaseOrderDetailResponseDto.prototype, "expectedDeliveryDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: SupplierDto }),
    __metadata("design:type", SupplierDto)
], PurchaseOrderDetailResponseDto.prototype, "supplier", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], PurchaseOrderDetailResponseDto.prototype, "warehouseId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], PurchaseOrderDetailResponseDto.prototype, "warehouseName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", String)
], PurchaseOrderDetailResponseDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PurchaseOrderDetailResponseDto.prototype, "exchangeRate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PurchaseOrderDetailResponseDto.prototype, "subtotal", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PurchaseOrderDetailResponseDto.prototype, "discountPercentage", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PurchaseOrderDetailResponseDto.prototype, "discountAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PurchaseOrderDetailResponseDto.prototype, "taxAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PurchaseOrderDetailResponseDto.prototype, "shippingAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PurchaseOrderDetailResponseDto.prototype, "otherCharges", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PurchaseOrderDetailResponseDto.prototype, "totalAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PurchaseOrderDetailResponseDto.prototype, "paidAmount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PurchaseOrderDetailResponseDto.prototype, "balanceAmount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Date)
], PurchaseOrderDetailResponseDto.prototype, "approvedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Date)
], PurchaseOrderDetailResponseDto.prototype, "sentAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", Date)
], PurchaseOrderDetailResponseDto.prototype, "acknowledgedAt", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], PurchaseOrderDetailResponseDto.prototype, "supplierReferenceNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    __metadata("design:type", String)
], PurchaseOrderDetailResponseDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [PurchaseOrderItemDto] }),
    __metadata("design:type", Array)
], PurchaseOrderDetailResponseDto.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PurchaseOrderDetailResponseDto.prototype, "itemCount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PurchaseOrderDetailResponseDto.prototype, "totalQuantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Number)
], PurchaseOrderDetailResponseDto.prototype, "receivedQuantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], PurchaseOrderDetailResponseDto.prototype, "createdAt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    __metadata("design:type", Date)
], PurchaseOrderDetailResponseDto.prototype, "updatedAt", void 0);
//# sourceMappingURL=purchase-order-response.dto.js.map