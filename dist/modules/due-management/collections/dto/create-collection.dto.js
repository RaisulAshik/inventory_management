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
exports.CollectionFilterDto = exports.BounceDto = exports.DepositDto = exports.AllocateCollectionDto = exports.CreateCollectionDto = exports.CollectionAllocationDto = void 0;
const openapi = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const swagger_1 = require("@nestjs/swagger");
class CollectionAllocationDto {
    customerDueId;
    amount;
    notes;
    static _OPENAPI_METADATA_FACTORY() {
        return { customerDueId: { required: true, type: () => String, format: "uuid" }, amount: { required: true, type: () => Number, minimum: 0.01 }, notes: { required: false, type: () => String } };
    }
}
exports.CollectionAllocationDto = CollectionAllocationDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CollectionAllocationDto.prototype, "customerDueId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.01),
    __metadata("design:type", Number)
], CollectionAllocationDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CollectionAllocationDto.prototype, "notes", void 0);
class CreateCollectionDto {
    customerId;
    paymentMethodId;
    amount;
    collectionDate;
    currency;
    referenceNumber;
    chequeNumber;
    chequeDate;
    chequeBank;
    notes;
    allocations;
    static _OPENAPI_METADATA_FACTORY() {
        return { customerId: { required: true, type: () => String, format: "uuid" }, paymentMethodId: { required: true, type: () => String, format: "uuid" }, amount: { required: true, type: () => Number, minimum: 0.01 }, collectionDate: { required: true, type: () => String }, currency: { required: false, type: () => String }, referenceNumber: { required: false, type: () => String }, chequeNumber: { required: false, type: () => String }, chequeDate: { required: false, type: () => String }, chequeBank: { required: false, type: () => String }, notes: { required: false, type: () => String }, allocations: { required: false, type: () => [require("./create-collection.dto").CollectionAllocationDto] } };
    }
}
exports.CreateCollectionDto = CreateCollectionDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateCollectionDto.prototype, "customerId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CreateCollectionDto.prototype, "paymentMethodId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.01),
    __metadata("design:type", Number)
], CreateCollectionDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateCollectionDto.prototype, "collectionDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCollectionDto.prototype, "currency", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCollectionDto.prototype, "referenceNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCollectionDto.prototype, "chequeNumber", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsDateString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCollectionDto.prototype, "chequeDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCollectionDto.prototype, "chequeBank", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateCollectionDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [CollectionAllocationDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CollectionAllocationDto),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Array)
], CreateCollectionDto.prototype, "allocations", void 0);
class AllocateCollectionDto {
    allocations;
    static _OPENAPI_METADATA_FACTORY() {
        return { allocations: { required: true, type: () => [require("./create-collection.dto").CollectionAllocationDto] } };
    }
}
exports.AllocateCollectionDto = AllocateCollectionDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [CollectionAllocationDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => CollectionAllocationDto),
    __metadata("design:type", Array)
], AllocateCollectionDto.prototype, "allocations", void 0);
class DepositDto {
    bankAccountId;
    depositDate;
    static _OPENAPI_METADATA_FACTORY() {
        return { bankAccountId: { required: true, type: () => String, format: "uuid" }, depositDate: { required: true, type: () => String } };
    }
}
exports.DepositDto = DepositDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], DepositDto.prototype, "bankAccountId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], DepositDto.prototype, "depositDate", void 0);
class BounceDto {
    bounceDate;
    bounceReason;
    bounceCharges;
    static _OPENAPI_METADATA_FACTORY() {
        return { bounceDate: { required: true, type: () => String }, bounceReason: { required: true, type: () => String }, bounceCharges: { required: false, type: () => Number } };
    }
}
exports.BounceDto = BounceDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], BounceDto.prototype, "bounceDate", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], BounceDto.prototype, "bounceReason", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], BounceDto.prototype, "bounceCharges", void 0);
class CollectionFilterDto {
    search;
    status;
    customerId;
    fromDate;
    toDate;
    sortBy;
    sortOrder;
    page;
    limit;
    static _OPENAPI_METADATA_FACTORY() {
        return { search: { required: false, type: () => String }, status: { required: false, type: () => String }, customerId: { required: false, type: () => String, format: "uuid" }, fromDate: { required: false, type: () => String }, toDate: { required: false, type: () => String }, sortBy: { required: false, type: () => String }, sortOrder: { required: false, type: () => Object }, page: { required: false, type: () => Number }, limit: { required: false, type: () => Number } };
    }
}
exports.CollectionFilterDto = CollectionFilterDto;
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CollectionFilterDto.prototype, "search", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CollectionFilterDto.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], CollectionFilterDto.prototype, "customerId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CollectionFilterDto.prototype, "fromDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CollectionFilterDto.prototype, "toDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CollectionFilterDto.prototype, "sortBy", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CollectionFilterDto.prototype, "sortOrder", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CollectionFilterDto.prototype, "page", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], CollectionFilterDto.prototype, "limit", void 0);
//# sourceMappingURL=create-collection.dto.js.map