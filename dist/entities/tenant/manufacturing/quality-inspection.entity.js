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
exports.QualityInspection = exports.InspectionStatus = exports.InspectionType = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const product_variant_entity_1 = require("../inventory/product-variant.entity");
const product_entity_1 = require("../inventory/product.entity");
const goods_received_note_entity_1 = require("../purchase/goods-received-note.entity");
const user_entity_1 = require("../user/user.entity");
const production_output_entity_1 = require("./production-output.entity");
var InspectionType;
(function (InspectionType) {
    InspectionType["INCOMING"] = "INCOMING";
    InspectionType["IN_PROCESS"] = "IN_PROCESS";
    InspectionType["FINAL"] = "FINAL";
    InspectionType["RANDOM"] = "RANDOM";
})(InspectionType || (exports.InspectionType = InspectionType = {}));
var InspectionStatus;
(function (InspectionStatus) {
    InspectionStatus["PENDING"] = "PENDING";
    InspectionStatus["IN_PROGRESS"] = "IN_PROGRESS";
    InspectionStatus["PASSED"] = "PASSED";
    InspectionStatus["FAILED"] = "FAILED";
    InspectionStatus["CONDITIONAL"] = "CONDITIONAL";
    InspectionStatus["CANCELLED"] = "CANCELLED";
})(InspectionStatus || (exports.InspectionStatus = InspectionStatus = {}));
let QualityInspection = class QualityInspection {
    id;
    inspectionNumber;
    inspectionDate;
    inspectionType;
    status;
    referenceType;
    referenceId;
    productId;
    variantId;
    grnId;
    productionOutputId;
    batchNumber;
    sampleSize;
    inspectedQuantity;
    passedQuantity;
    failedQuantity;
    inspectionResults;
    defectsFound;
    remarks;
    correctiveAction;
    inspectorId;
    approvedBy;
    approvedAt;
    createdAt;
    updatedAt;
    product;
    variant;
    grn;
    productionOutput;
    inspector;
    get passRate() {
        return this.inspectedQuantity > 0
            ? (this.passedQuantity / this.inspectedQuantity) * 100
            : 0;
    }
    get failRate() {
        return this.inspectedQuantity > 0
            ? (this.failedQuantity / this.inspectedQuantity) * 100
            : 0;
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, inspectionNumber: { required: true, type: () => String }, inspectionDate: { required: true, type: () => Date }, inspectionType: { required: true, enum: require("./quality-inspection.entity").InspectionType }, status: { required: true, enum: require("./quality-inspection.entity").InspectionStatus }, referenceType: { required: true, type: () => String }, referenceId: { required: true, type: () => String }, productId: { required: true, type: () => String }, variantId: { required: true, type: () => String }, grnId: { required: true, type: () => String }, productionOutputId: { required: true, type: () => String }, batchNumber: { required: true, type: () => String }, sampleSize: { required: true, type: () => Number }, inspectedQuantity: { required: true, type: () => Number }, passedQuantity: { required: true, type: () => Number }, failedQuantity: { required: true, type: () => Number }, inspectionResults: { required: true, type: () => [Object] }, defectsFound: { required: true, type: () => [Object] }, remarks: { required: true, type: () => String }, correctiveAction: { required: true, type: () => String }, inspectorId: { required: true, type: () => String }, approvedBy: { required: true, type: () => String }, approvedAt: { required: true, type: () => Date }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, product: { required: true, type: () => require("../inventory/product.entity").Product }, variant: { required: true, type: () => require("../inventory/product-variant.entity").ProductVariant }, grn: { required: true, type: () => require("../purchase/goods-received-note.entity").GoodsReceivedNote }, productionOutput: { required: true, type: () => require("./production-output.entity").ProductionOutput }, inspector: { required: true, type: () => require("../user/user.entity").User } };
    }
};
exports.QualityInspection = QualityInspection;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], QualityInspection.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'inspection_number', length: 50, unique: true }),
    __metadata("design:type", String)
], QualityInspection.prototype, "inspectionNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'inspection_date', type: 'timestamp' }),
    __metadata("design:type", Date)
], QualityInspection.prototype, "inspectionDate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'inspection_type',
        type: 'enum',
        enum: InspectionType,
    }),
    __metadata("design:type", String)
], QualityInspection.prototype, "inspectionType", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: InspectionStatus,
        default: InspectionStatus.PENDING,
    }),
    __metadata("design:type", String)
], QualityInspection.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'reference_type', length: 50 }),
    __metadata("design:type", String)
], QualityInspection.prototype, "referenceType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'reference_id' }),
    __metadata("design:type", String)
], QualityInspection.prototype, "referenceId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'product_id' }),
    __metadata("design:type", String)
], QualityInspection.prototype, "productId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'variant_id', nullable: true }),
    __metadata("design:type", String)
], QualityInspection.prototype, "variantId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'grn_id', nullable: true }),
    __metadata("design:type", String)
], QualityInspection.prototype, "grnId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'production_output_id', nullable: true }),
    __metadata("design:type", String)
], QualityInspection.prototype, "productionOutputId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'batch_number', length: 100, nullable: true }),
    __metadata("design:type", String)
], QualityInspection.prototype, "batchNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'sample_size',
        type: 'decimal',
        precision: 18,
        scale: 4,
    }),
    __metadata("design:type", Number)
], QualityInspection.prototype, "sampleSize", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'inspected_quantity',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], QualityInspection.prototype, "inspectedQuantity", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'passed_quantity',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], QualityInspection.prototype, "passedQuantity", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'failed_quantity',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], QualityInspection.prototype, "failedQuantity", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'inspection_results', type: 'json', nullable: true }),
    __metadata("design:type", Array)
], QualityInspection.prototype, "inspectionResults", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'defects_found', type: 'json', nullable: true }),
    __metadata("design:type", Array)
], QualityInspection.prototype, "defectsFound", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], QualityInspection.prototype, "remarks", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'corrective_action', type: 'text', nullable: true }),
    __metadata("design:type", String)
], QualityInspection.prototype, "correctiveAction", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'inspector_id' }),
    __metadata("design:type", String)
], QualityInspection.prototype, "inspectorId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'approved_by', nullable: true }),
    __metadata("design:type", String)
], QualityInspection.prototype, "approvedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'approved_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], QualityInspection.prototype, "approvedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], QualityInspection.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], QualityInspection.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_entity_1.Product),
    (0, typeorm_1.JoinColumn)({ name: 'product_id' }),
    __metadata("design:type", product_entity_1.Product)
], QualityInspection.prototype, "product", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => product_variant_entity_1.ProductVariant),
    (0, typeorm_1.JoinColumn)({ name: 'variant_id' }),
    __metadata("design:type", product_variant_entity_1.ProductVariant)
], QualityInspection.prototype, "variant", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => goods_received_note_entity_1.GoodsReceivedNote),
    (0, typeorm_1.JoinColumn)({ name: 'grn_id' }),
    __metadata("design:type", goods_received_note_entity_1.GoodsReceivedNote)
], QualityInspection.prototype, "grn", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => production_output_entity_1.ProductionOutput),
    (0, typeorm_1.JoinColumn)({ name: 'production_output_id' }),
    __metadata("design:type", production_output_entity_1.ProductionOutput)
], QualityInspection.prototype, "productionOutput", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'inspector_id' }),
    __metadata("design:type", user_entity_1.User)
], QualityInspection.prototype, "inspector", void 0);
exports.QualityInspection = QualityInspection = __decorate([
    (0, typeorm_1.Entity)('quality_inspections')
], QualityInspection);
//# sourceMappingURL=quality-inspection.entity.js.map