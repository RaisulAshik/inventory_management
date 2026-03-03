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
exports.ChangePlanDto = exports.UpdateSubscriptionDto = void 0;
const openapi = require("@nestjs/swagger");
const enums_1 = require("../../../../common/enums");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class UpdateSubscriptionDto {
    quantity;
    autoRenew;
    static _OPENAPI_METADATA_FACTORY() {
        return { quantity: { required: false, type: () => Number, minimum: 1 }, autoRenew: { required: false, type: () => Boolean } };
    }
}
exports.UpdateSubscriptionDto = UpdateSubscriptionDto;
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ example: 1 }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], UpdateSubscriptionDto.prototype, "quantity", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], UpdateSubscriptionDto.prototype, "autoRenew", void 0);
class ChangePlanDto {
    newPlanId;
    billingCycle;
    static _OPENAPI_METADATA_FACTORY() {
        return { newPlanId: { required: true, type: () => String, format: "uuid" }, billingCycle: { required: false, enum: require("../../../../common/enums/index").BillingCycle } };
    }
}
exports.ChangePlanDto = ChangePlanDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsUUID)(),
    __metadata("design:type", String)
], ChangePlanDto.prototype, "newPlanId", void 0);
__decorate([
    (0, swagger_1.ApiPropertyOptional)({ enum: enums_1.BillingCycle }),
    (0, class_validator_1.IsEnum)(enums_1.BillingCycle),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], ChangePlanDto.prototype, "billingCycle", void 0);
//# sourceMappingURL=update-subscription.dto.js.map