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
exports.CreateTransferDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const tenant_1 = require("../../../../entities/tenant");
const create_transfer_item_dto_1 = require("./create-transfer-item.dto");
class CreateTransferDto {
    fromWarehouseId;
    toWarehouseId;
    transferType;
    transferDate;
    expectedDeliveryDate;
    reason;
    notes;
    items;
    static _OPENAPI_METADATA_FACTORY() {
        return { fromWarehouseId: { required: true, type: () => String, format: "uuid" }, toWarehouseId: { required: true, type: () => String, format: "uuid" }, transferType: { required: false, enum: require("../../../../entities/tenant/warehouse/warehouse-transfer.entity").TransferType }, transferDate: { required: false, type: () => Date }, expectedDeliveryDate: { required: false, type: () => Date }, reason: { required: false, type: () => String }, notes: { required: false, type: () => String }, items: { required: false, type: () => [require("./create-transfer-item.dto").CreateTransferItemDto] } };
    }
}
exports.CreateTransferDto = CreateTransferDto;
__decorate([
    (0, swagger_1.ApiProperty)({ format: 'uuid' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateTransferDto.prototype, "fromWarehouseId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ format: 'uuid' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], CreateTransferDto.prototype, "toWarehouseId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({
        enum: tenant_1.TransferType,
        default: tenant_1.TransferType.INTER_WAREHOUSE,
    }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsEnum)(tenant_1.TransferType),
    __metadata("design:type", String)
], CreateTransferDto.prototype, "transferType", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: 'string', format: 'date' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], CreateTransferDto.prototype, "transferDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: 'string', format: 'date' }),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Type)(() => Date),
    (0, class_validator_1.IsDate)(),
    __metadata("design:type", Date)
], CreateTransferDto.prototype, "expectedDeliveryDate", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTransferDto.prototype, "reason", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTransferDto.prototype, "notes", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ type: [create_transfer_item_dto_1.CreateTransferItemDto] }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => create_transfer_item_dto_1.CreateTransferItemDto),
    __metadata("design:type", Array)
], CreateTransferDto.prototype, "items", void 0);
//# sourceMappingURL=create-transfer.dto.js.map