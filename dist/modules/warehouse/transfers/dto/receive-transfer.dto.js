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
exports.ReceiveTransferDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class ReceiveItemDto {
    itemId;
    quantityReceived;
    quantityDamaged;
    static _OPENAPI_METADATA_FACTORY() {
        return { itemId: { required: true, type: () => String, format: "uuid" }, quantityReceived: { required: true, type: () => Number, minimum: 0 }, quantityDamaged: { required: false, type: () => Number, minimum: 0 } };
    }
}
__decorate([
    (0, swagger_1.ApiProperty)({ format: 'uuid' }),
    (0, class_validator_1.IsUUID)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ReceiveItemDto.prototype, "itemId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 10 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], ReceiveItemDto.prototype, "quantityReceived", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 0 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0),
    __metadata("design:type", Number)
], ReceiveItemDto.prototype, "quantityDamaged", void 0);
class ReceiveTransferDto {
    items;
    static _OPENAPI_METADATA_FACTORY() {
        return { items: { required: true, type: () => [ReceiveItemDto] } };
    }
}
exports.ReceiveTransferDto = ReceiveTransferDto;
__decorate([
    (0, swagger_1.ApiProperty)({ type: [ReceiveItemDto] }),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ReceiveItemDto),
    __metadata("design:type", Array)
], ReceiveTransferDto.prototype, "items", void 0);
//# sourceMappingURL=receive-transfer.dto.js.map