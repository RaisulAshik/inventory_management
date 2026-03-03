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
exports.RecordPaymentDto = exports.SendInvoiceDto = exports.UpdateInvoiceDto = exports.CreateInvoiceDto = exports.CreateInvoiceItemDto = exports.InvoiceStatus = exports.InvoiceType = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
var InvoiceType;
(function (InvoiceType) {
    InvoiceType["SALES_INVOICE"] = "SALES_INVOICE";
    InvoiceType["PURCHASE_INVOICE"] = "PURCHASE_INVOICE";
    InvoiceType["CREDIT_NOTE"] = "CREDIT_NOTE";
    InvoiceType["DEBIT_NOTE"] = "DEBIT_NOTE";
    InvoiceType["PROFORMA"] = "PROFORMA";
})(InvoiceType || (exports.InvoiceType = InvoiceType = {}));
var InvoiceStatus;
(function (InvoiceStatus) {
    InvoiceStatus["DRAFT"] = "DRAFT";
    InvoiceStatus["SENT"] = "SENT";
    InvoiceStatus["PARTIALLY_PAID"] = "PARTIALLY_PAID";
    InvoiceStatus["PAID"] = "PAID";
    InvoiceStatus["OVERDUE"] = "OVERDUE";
    InvoiceStatus["VOID"] = "VOID";
    InvoiceStatus["CANCELLED"] = "CANCELLED";
})(InvoiceStatus || (exports.InvoiceStatus = InvoiceStatus = {}));
class CreateInvoiceItemDto {
    productId;
    description;
    quantity;
    unitPrice;
    discountPercent;
    discountAmount;
    taxCodeId;
    accountId;
    costCenterId;
    static _OPENAPI_METADATA_FACTORY() {
        return { productId: { required: false, type: () => String, format: "uuid" }, description: { required: true, type: () => String, maxLength: 500 }, quantity: { required: true, type: () => Number, minimum: 0.0001 }, unitPrice: { required: true, type: () => Number, minimum: 0 }, discountPercent: { required: false, type: () => Number, minimum: 0 }, discountAmount: { required: false, type: () => Number, minimum: 0 }, taxCodeId: { required: false, type: () => String, format: "uuid" }, accountId: { required: false, type: () => String, format: "uuid" }, costCenterId: { required: false, type: () => String, format: "uuid" } };
    }
}
exports.CreateInvoiceItemDto = CreateInvoiceItemDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Product ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateInvoiceItemDto.prototype, "productId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Item description' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(500),
    __metadata("design:type", String)
], CreateInvoiceItemDto.prototype, "description", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Quantity', example: 1 }),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 4 }),
    (0, class_validator_1.Min)(0.0001),
    __metadata("design:type", Number)
], CreateInvoiceItemDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Unit price', example: 100.0 }),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateInvoiceItemDto.prototype, "unitPrice", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Discount percentage', example: 0 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateInvoiceItemDto.prototype, "discountPercent", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Discount amount', example: 0 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateInvoiceItemDto.prototype, "discountAmount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Tax code ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateInvoiceItemDto.prototype, "taxCodeId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Chart of Account ID for revenue/expense',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateInvoiceItemDto.prototype, "accountId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Cost center ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateInvoiceItemDto.prototype, "costCenterId", void 0);
class CreateInvoiceDto {
    invoiceType;
    invoiceDate;
    dueDate;
    customerId;
    supplierId;
    referenceNumber;
    terms;
    notes;
    items;
    discountAmount;
    shippingCharges;
    otherCharges;
    currency;
    exchangeRate;
    static _OPENAPI_METADATA_FACTORY() {
        return { invoiceType: { required: true, enum: require("./invoices.dto").InvoiceType }, invoiceDate: { required: true, type: () => String }, dueDate: { required: true, type: () => String }, customerId: { required: false, type: () => String, format: "uuid" }, supplierId: { required: false, type: () => String, format: "uuid" }, referenceNumber: { required: false, type: () => String, maxLength: 50 }, terms: { required: false, type: () => String }, notes: { required: false, type: () => String }, items: { required: true, type: () => [require("./invoices.dto").CreateInvoiceItemDto] }, discountAmount: { required: false, type: () => Number, minimum: 0 }, shippingCharges: { required: false, type: () => Number, minimum: 0 }, otherCharges: { required: false, type: () => Number, minimum: 0 }, currency: { required: false, type: () => String, maxLength: 3 }, exchangeRate: { required: false, type: () => Number } };
    }
}
exports.CreateInvoiceDto = CreateInvoiceDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: InvoiceType, description: 'Invoice type' }),
    (0, class_validator_1.IsEnum)(InvoiceType),
    __metadata("design:type", String)
], CreateInvoiceDto.prototype, "invoiceType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Invoice date' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateInvoiceDto.prototype, "invoiceDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Due date' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateInvoiceDto.prototype, "dueDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Customer ID (for sales invoices)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateInvoiceDto.prototype, "customerId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Supplier ID (for purchase invoices)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateInvoiceDto.prototype, "supplierId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Reference number (PO, SO, etc.)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], CreateInvoiceDto.prototype, "referenceNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Terms and conditions' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateInvoiceDto.prototype, "terms", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Notes' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateInvoiceDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ type: [CreateInvoiceItemDto], description: 'Invoice items' }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateInvoiceItemDto),
    __metadata("design:type", Array)
], CreateInvoiceDto.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Discount amount at invoice level',
        example: 0,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateInvoiceDto.prototype, "discountAmount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Shipping charges', example: 0 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateInvoiceDto.prototype, "shippingCharges", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Other charges', example: 0 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], CreateInvoiceDto.prototype, "otherCharges", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Currency code', default: 'USD' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(3),
    __metadata("design:type", String)
], CreateInvoiceDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Exchange rate', default: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 6 }),
    __metadata("design:type", Number)
], CreateInvoiceDto.prototype, "exchangeRate", void 0);
class UpdateInvoiceDto {
    invoiceDate;
    dueDate;
    referenceNumber;
    terms;
    notes;
    items;
    discountAmount;
    shippingCharges;
    otherCharges;
    static _OPENAPI_METADATA_FACTORY() {
        return { invoiceDate: { required: false, type: () => String }, dueDate: { required: false, type: () => String }, referenceNumber: { required: false, type: () => String, maxLength: 50 }, terms: { required: false, type: () => String }, notes: { required: false, type: () => String }, items: { required: false, type: () => [require("./invoices.dto").CreateInvoiceItemDto] }, discountAmount: { required: false, type: () => Number, minimum: 0 }, shippingCharges: { required: false, type: () => Number, minimum: 0 }, otherCharges: { required: false, type: () => Number, minimum: 0 } };
    }
}
exports.UpdateInvoiceDto = UpdateInvoiceDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Invoice date' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateInvoiceDto.prototype, "invoiceDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Due date' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdateInvoiceDto.prototype, "dueDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Reference number' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], UpdateInvoiceDto.prototype, "referenceNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Terms and conditions' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateInvoiceDto.prototype, "terms", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Notes' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateInvoiceDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: [CreateInvoiceItemDto],
        description: 'Invoice items',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CreateInvoiceItemDto),
    __metadata("design:type", Array)
], UpdateInvoiceDto.prototype, "items", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Discount amount' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateInvoiceDto.prototype, "discountAmount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Shipping charges' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateInvoiceDto.prototype, "shippingCharges", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Other charges' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], UpdateInvoiceDto.prototype, "otherCharges", void 0);
class SendInvoiceDto {
    email;
    message;
    static _OPENAPI_METADATA_FACTORY() {
        return { email: { required: true, type: () => String }, message: { required: false, type: () => String } };
    }
}
exports.SendInvoiceDto = SendInvoiceDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Email address to send invoice' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendInvoiceDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Additional message' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SendInvoiceDto.prototype, "message", void 0);
class RecordPaymentDto {
    amount;
    paymentDate;
    paymentMethod;
    bankAccountId;
    referenceNumber;
    notes;
    static _OPENAPI_METADATA_FACTORY() {
        return { amount: { required: true, type: () => Number, minimum: 0.01 }, paymentDate: { required: true, type: () => String }, paymentMethod: { required: true, type: () => String }, bankAccountId: { required: false, type: () => String, format: "uuid" }, referenceNumber: { required: false, type: () => String, maxLength: 50 }, notes: { required: false, type: () => String } };
    }
}
exports.RecordPaymentDto = RecordPaymentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Payment amount', example: 1000.0 }),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.Min)(0.01),
    __metadata("design:type", Number)
], RecordPaymentDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Payment date' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], RecordPaymentDto.prototype, "paymentDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Payment method' }),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RecordPaymentDto.prototype, "paymentMethod", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Bank account ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], RecordPaymentDto.prototype, "bankAccountId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Reference number (check number, transaction ID)',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], RecordPaymentDto.prototype, "referenceNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Notes' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RecordPaymentDto.prototype, "notes", void 0);
//# sourceMappingURL=invoices.dto.js.map