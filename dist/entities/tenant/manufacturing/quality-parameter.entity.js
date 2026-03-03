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
exports.QualityParameter = exports.QualityParameterType = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
var QualityParameterType;
(function (QualityParameterType) {
    QualityParameterType["NUMERIC"] = "NUMERIC";
    QualityParameterType["BOOLEAN"] = "BOOLEAN";
    QualityParameterType["TEXT"] = "TEXT";
    QualityParameterType["RANGE"] = "RANGE";
    QualityParameterType["OPTIONS"] = "OPTIONS";
})(QualityParameterType || (exports.QualityParameterType = QualityParameterType = {}));
let QualityParameter = class QualityParameter {
    id;
    parameterCode;
    parameterName;
    description;
    parameterType;
    unitOfMeasure;
    minValue;
    maxValue;
    targetValue;
    allowedOptions;
    isCritical;
    isActive;
    inspectionMethod;
    samplingInstructions;
    createdAt;
    updatedAt;
    isValueWithinLimits(value) {
        if (this.parameterType !== QualityParameterType.NUMERIC &&
            this.parameterType !== QualityParameterType.RANGE) {
            return true;
        }
        const meetsMin = this.minValue === null || value >= this.minValue;
        const meetsMax = this.maxValue === null || value <= this.maxValue;
        return meetsMin && meetsMax;
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, parameterCode: { required: true, type: () => String }, parameterName: { required: true, type: () => String }, description: { required: true, type: () => String }, parameterType: { required: true, enum: require("./quality-parameter.entity").QualityParameterType }, unitOfMeasure: { required: true, type: () => String }, minValue: { required: true, type: () => Number }, maxValue: { required: true, type: () => Number }, targetValue: { required: true, type: () => Number }, allowedOptions: { required: true, type: () => [String] }, isCritical: { required: true, type: () => Boolean }, isActive: { required: true, type: () => Boolean }, inspectionMethod: { required: true, type: () => String }, samplingInstructions: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date } };
    }
};
exports.QualityParameter = QualityParameter;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], QualityParameter.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'parameter_code', length: 50, unique: true }),
    __metadata("design:type", String)
], QualityParameter.prototype, "parameterCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'parameter_name', length: 200 }),
    __metadata("design:type", String)
], QualityParameter.prototype, "parameterName", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], QualityParameter.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'parameter_type',
        type: 'enum',
        enum: QualityParameterType,
        default: QualityParameterType.NUMERIC,
    }),
    __metadata("design:type", String)
], QualityParameter.prototype, "parameterType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'unit_of_measure', length: 50, nullable: true }),
    __metadata("design:type", String)
], QualityParameter.prototype, "unitOfMeasure", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'min_value',
        type: 'decimal',
        precision: 18,
        scale: 6,
        nullable: true,
    }),
    __metadata("design:type", Number)
], QualityParameter.prototype, "minValue", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'max_value',
        type: 'decimal',
        precision: 18,
        scale: 6,
        nullable: true,
    }),
    __metadata("design:type", Number)
], QualityParameter.prototype, "maxValue", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'target_value',
        type: 'decimal',
        precision: 18,
        scale: 6,
        nullable: true,
    }),
    __metadata("design:type", Number)
], QualityParameter.prototype, "targetValue", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'allowed_options', type: 'json', nullable: true }),
    __metadata("design:type", Array)
], QualityParameter.prototype, "allowedOptions", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_critical', type: 'tinyint', default: 0 }),
    __metadata("design:type", Boolean)
], QualityParameter.prototype, "isCritical", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', type: 'tinyint', default: 1 }),
    __metadata("design:type", Boolean)
], QualityParameter.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'inspection_method', type: 'text', nullable: true }),
    __metadata("design:type", String)
], QualityParameter.prototype, "inspectionMethod", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'sampling_instructions', type: 'text', nullable: true }),
    __metadata("design:type", String)
], QualityParameter.prototype, "samplingInstructions", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], QualityParameter.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], QualityParameter.prototype, "updatedAt", void 0);
exports.QualityParameter = QualityParameter = __decorate([
    (0, typeorm_1.Entity)('quality_parameters')
], QualityParameter);
//# sourceMappingURL=quality-parameter.entity.js.map