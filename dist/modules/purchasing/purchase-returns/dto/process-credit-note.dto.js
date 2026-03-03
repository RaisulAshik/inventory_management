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
exports.ProcessCreditNoteDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class ProcessCreditNoteDto {
    creditNoteNumber;
    creditAmount;
    static _OPENAPI_METADATA_FACTORY() {
        return { creditNoteNumber: { required: true, type: () => String }, creditAmount: { required: true, type: () => Number, minimum: 0.01 } };
    }
}
exports.ProcessCreditNoteDto = ProcessCreditNoteDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'CN-2024-001' }),
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    __metadata("design:type", String)
], ProcessCreditNoteDto.prototype, "creditNoteNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 5000 }),
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.Min)(0.01),
    __metadata("design:type", Number)
], ProcessCreditNoteDto.prototype, "creditAmount", void 0);
//# sourceMappingURL=process-credit-note.dto.js.map