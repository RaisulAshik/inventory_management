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
exports.AllocatePaymentDto = exports.UpdatePaymentDto = exports.CreatePaymentDto = exports.PaymentAllocationDto = exports.PaymentStatus = exports.PaymentMethod = exports.PaymentType = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
var PaymentType;
(function (PaymentType) {
    PaymentType["RECEIVED"] = "RECEIVED";
    PaymentType["SENT"] = "SENT";
})(PaymentType || (exports.PaymentType = PaymentType = {}));
var PaymentMethod;
(function (PaymentMethod) {
    PaymentMethod["CASH"] = "CASH";
    PaymentMethod["CHEQUE"] = "CHEQUE";
    PaymentMethod["BANK_TRANSFER"] = "BANK_TRANSFER";
    PaymentMethod["CREDIT_CARD"] = "CREDIT_CARD";
    PaymentMethod["DEBIT_CARD"] = "DEBIT_CARD";
    PaymentMethod["MOBILE_PAYMENT"] = "MOBILE_PAYMENT";
    PaymentMethod["OTHER"] = "OTHER";
})(PaymentMethod || (exports.PaymentMethod = PaymentMethod = {}));
var PaymentStatus;
(function (PaymentStatus) {
    PaymentStatus["PENDING"] = "PENDING";
    PaymentStatus["COMPLETED"] = "COMPLETED";
    PaymentStatus["FAILED"] = "FAILED";
    PaymentStatus["CANCELLED"] = "CANCELLED";
    PaymentStatus["RECONCILED"] = "RECONCILED";
})(PaymentStatus || (exports.PaymentStatus = PaymentStatus = {}));
class PaymentAllocationDto {
    invoiceId;
    amount;
    discountAmount;
    static _OPENAPI_METADATA_FACTORY() {
        return { invoiceId: { required: true, type: () => String, format: "uuid" }, amount: { required: true, type: () => Number, minimum: 0.01 }, discountAmount: { required: false, type: () => Number, minimum: 0 } };
    }
}
exports.PaymentAllocationDto = PaymentAllocationDto;
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Invoice ID to allocate payment to' }),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], PaymentAllocationDto.prototype, "invoiceId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Amount to allocate', example: 500.0 }),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.Min)(0.01),
    __metadata("design:type", Number)
], PaymentAllocationDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Discount amount applied' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], PaymentAllocationDto.prototype, "discountAmount", void 0);
class CreatePaymentDto {
    paymentType;
    paymentDate;
    amount;
    paymentMethod;
    customerId;
    supplierId;
    bankAccountId;
    referenceNumber;
    notes;
    currency;
    exchangeRate;
    allocations;
    static _OPENAPI_METADATA_FACTORY() {
        return { paymentType: { required: true, enum: require("./payments.dto").PaymentType }, paymentDate: { required: true, type: () => String }, amount: { required: true, type: () => Number, minimum: 0.01 }, paymentMethod: { required: true, enum: require("./payments.dto").PaymentMethod }, customerId: { required: false, type: () => String, format: "uuid" }, supplierId: { required: false, type: () => String, format: "uuid" }, bankAccountId: { required: false, type: () => String, format: "uuid" }, referenceNumber: { required: false, type: () => String, maxLength: 50 }, notes: { required: false, type: () => String }, currency: { required: false, type: () => String, maxLength: 3 }, exchangeRate: { required: false, type: () => Number }, allocations: { required: false, type: () => [require("./payments.dto").PaymentAllocationDto] } };
    }
}
exports.CreatePaymentDto = CreatePaymentDto;
__decorate([
    (0, swagger_1.ApiProperty)({ enum: PaymentType, description: 'Payment type' }),
    (0, class_validator_1.IsEnum)(PaymentType),
    __metadata("design:type", String)
], CreatePaymentDto.prototype, "paymentType", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Payment date' }),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreatePaymentDto.prototype, "paymentDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ description: 'Payment amount', example: 1000.0 }),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.Min)(0.01),
    __metadata("design:type", Number)
], CreatePaymentDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ enum: PaymentMethod, description: 'Payment method' }),
    (0, class_validator_1.IsEnum)(PaymentMethod),
    __metadata("design:type", String)
], CreatePaymentDto.prototype, "paymentMethod", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Customer ID (for payments received)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreatePaymentDto.prototype, "customerId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Supplier ID (for payments sent)' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreatePaymentDto.prototype, "supplierId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Bank account ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreatePaymentDto.prototype, "bankAccountId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Reference number (check number, transaction ID)',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], CreatePaymentDto.prototype, "referenceNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Notes' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreatePaymentDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Currency code', default: 'USD' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(3),
    __metadata("design:type", String)
], CreatePaymentDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Exchange rate', default: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 6 }),
    __metadata("design:type", Number)
], CreatePaymentDto.prototype, "exchangeRate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: [PaymentAllocationDto],
        description: 'Invoice allocations',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => PaymentAllocationDto),
    __metadata("design:type", Array)
], CreatePaymentDto.prototype, "allocations", void 0);
class UpdatePaymentDto {
    paymentDate;
    amount;
    paymentMethod;
    bankAccountId;
    referenceNumber;
    notes;
    allocations;
    static _OPENAPI_METADATA_FACTORY() {
        return { paymentDate: { required: false, type: () => String }, amount: { required: false, type: () => Number, minimum: 0.01 }, paymentMethod: { required: false, enum: require("./payments.dto").PaymentMethod }, bankAccountId: { required: false, type: () => String, format: "uuid" }, referenceNumber: { required: false, type: () => String, maxLength: 50 }, notes: { required: false, type: () => String }, allocations: { required: false, type: () => [require("./payments.dto").PaymentAllocationDto] } };
    }
}
exports.UpdatePaymentDto = UpdatePaymentDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Payment date' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], UpdatePaymentDto.prototype, "paymentDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Payment amount' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)({ maxDecimalPlaces: 2 }),
    (0, class_validator_1.Min)(0.01),
    __metadata("design:type", Number)
], UpdatePaymentDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: PaymentMethod, description: 'Payment method' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(PaymentMethod),
    __metadata("design:type", String)
], UpdatePaymentDto.prototype, "paymentMethod", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Bank account ID' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], UpdatePaymentDto.prototype, "bankAccountId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Reference number' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.MaxLength)(50),
    __metadata("design:type", String)
], UpdatePaymentDto.prototype, "referenceNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ description: 'Notes' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdatePaymentDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        type: [PaymentAllocationDto],
        description: 'Invoice allocations',
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => PaymentAllocationDto),
    __metadata("design:type", Array)
], UpdatePaymentDto.prototype, "allocations", void 0);
class AllocatePaymentDto {
    allocations;
    static _OPENAPI_METADATA_FACTORY() {
        return { allocations: { required: true, type: () => [require("./payments.dto").PaymentAllocationDto] } };
    }
}
exports.AllocatePaymentDto = AllocatePaymentDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [PaymentAllocationDto],
        description: 'Invoice allocations',
    }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => PaymentAllocationDto),
    __metadata("design:type", Array)
], AllocatePaymentDto.prototype, "allocations", void 0);
//# sourceMappingURL=payments.dto.js.map