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
exports.SequenceNumber = exports.ResetPeriod = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
var ResetPeriod;
(function (ResetPeriod) {
    ResetPeriod["NEVER"] = "NEVER";
    ResetPeriod["YEARLY"] = "YEARLY";
    ResetPeriod["MONTHLY"] = "MONTHLY";
    ResetPeriod["DAILY"] = "DAILY";
})(ResetPeriod || (exports.ResetPeriod = ResetPeriod = {}));
let SequenceNumber = class SequenceNumber {
    id;
    sequenceType;
    prefix;
    suffix;
    currentNumber;
    paddingLength;
    resetPeriod;
    lastResetAt;
    createdAt;
    updatedAt;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, sequenceType: { required: true, type: () => String }, prefix: { required: true, type: () => String }, suffix: { required: true, type: () => String }, currentNumber: { required: true, type: () => Number }, paddingLength: { required: true, type: () => Number }, resetPeriod: { required: true, enum: require("./sequence-number.entity").ResetPeriod }, lastResetAt: { required: true, type: () => Date }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
};
exports.SequenceNumber = SequenceNumber;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], SequenceNumber.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sequence_type', length: 50, unique: true }),
    __metadata("design:type", String)
], SequenceNumber.prototype, "sequenceType", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20, nullable: true }),
    __metadata("design:type", String)
], SequenceNumber.prototype, "prefix", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 20, nullable: true }),
    __metadata("design:type", String)
], SequenceNumber.prototype, "suffix", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'current_number', type: 'bigint', default: 0 }),
    __metadata("design:type", Number)
], SequenceNumber.prototype, "currentNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'padding_length', type: 'int', default: 6 }),
    __metadata("design:type", Number)
], SequenceNumber.prototype, "paddingLength", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'reset_period',
        type: 'enum',
        enum: ResetPeriod,
        default: ResetPeriod.NEVER,
    }),
    __metadata("design:type", String)
], SequenceNumber.prototype, "resetPeriod", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'last_reset_at', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], SequenceNumber.prototype, "lastResetAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], SequenceNumber.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], SequenceNumber.prototype, "updatedAt", void 0);
exports.SequenceNumber = SequenceNumber = __decorate([
    (0, typeorm_1.Entity)('sequence_numbers')
], SequenceNumber);
//# sourceMappingURL=sequence-number.entity.js.map