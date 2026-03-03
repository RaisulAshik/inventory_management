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
exports.StockAdjustment = exports.AdjustmentStatus = exports.AdjustmentType = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const warehouse_entity_1 = require("./warehouse.entity");
const stock_adjustment_item_entity_1 = require("./stock-adjustment-item.entity");
var AdjustmentType;
(function (AdjustmentType) {
    AdjustmentType["INCREASE"] = "INCREASE";
    AdjustmentType["DECREASE"] = "DECREASE";
    AdjustmentType["WRITE_OFF"] = "WRITE_OFF";
    AdjustmentType["OPENING_STOCK"] = "OPENING_STOCK";
    AdjustmentType["CYCLE_COUNT"] = "CYCLE_COUNT";
    AdjustmentType["DAMAGE"] = "DAMAGE";
    AdjustmentType["EXPIRY"] = "EXPIRY";
    AdjustmentType["THEFT"] = "THEFT";
    AdjustmentType["OTHER"] = "OTHER";
})(AdjustmentType || (exports.AdjustmentType = AdjustmentType = {}));
var AdjustmentStatus;
(function (AdjustmentStatus) {
    AdjustmentStatus["DRAFT"] = "DRAFT";
    AdjustmentStatus["PENDING_APPROVAL"] = "PENDING_APPROVAL";
    AdjustmentStatus["APPROVED"] = "APPROVED";
    AdjustmentStatus["REJECTED"] = "REJECTED";
    AdjustmentStatus["CANCELLED"] = "CANCELLED";
})(AdjustmentStatus || (exports.AdjustmentStatus = AdjustmentStatus = {}));
let StockAdjustment = class StockAdjustment {
    id;
    adjustmentNumber;
    adjustmentDate;
    warehouseId;
    adjustmentType;
    status;
    reason;
    referenceNumber;
    totalValueImpact;
    notes;
    approvedBy;
    approvedAt;
    rejectionReason;
    createdBy;
    createdAt;
    updatedAt;
    warehouse;
    items;
    get itemCount() {
        return this.items?.length || 0;
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, adjustmentNumber: { required: true, type: () => String }, adjustmentDate: { required: true, type: () => Date }, warehouseId: { required: true, type: () => String }, adjustmentType: { required: true, enum: require("./stock-adjustment.entity").AdjustmentType }, status: { required: true, enum: require("./stock-adjustment.entity").AdjustmentStatus }, reason: { required: true, type: () => String }, referenceNumber: { required: true, type: () => String }, totalValueImpact: { required: true, type: () => Number }, notes: { required: true, type: () => String }, approvedBy: { required: true, type: () => String }, approvedAt: { required: true, type: () => Date }, rejectionReason: { required: true, type: () => String }, createdBy: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, warehouse: { required: true, type: () => require("./warehouse.entity").Warehouse }, items: { required: true, type: () => [require("./stock-adjustment-item.entity").StockAdjustmentItem] } };
    }
};
exports.StockAdjustment = StockAdjustment;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], StockAdjustment.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'adjustment_number', length: 50, unique: true }),
    __metadata("design:type", String)
], StockAdjustment.prototype, "adjustmentNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'adjustment_date', type: 'date' }),
    __metadata("design:type", Date)
], StockAdjustment.prototype, "adjustmentDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'warehouse_id' }),
    __metadata("design:type", String)
], StockAdjustment.prototype, "warehouseId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'adjustment_type',
        type: 'enum',
        enum: AdjustmentType,
    }),
    __metadata("design:type", String)
], StockAdjustment.prototype, "adjustmentType", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: AdjustmentStatus,
        default: AdjustmentStatus.DRAFT,
    }),
    __metadata("design:type", String)
], StockAdjustment.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], StockAdjustment.prototype, "reason", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'reference_number', length: 50, nullable: true }),
    __metadata("design:type", String)
], StockAdjustment.prototype, "referenceNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'total_value_impact',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], StockAdjustment.prototype, "totalValueImpact", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], StockAdjustment.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'approved_by', nullable: true }),
    __metadata("design:type", String)
], StockAdjustment.prototype, "approvedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'approved_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], StockAdjustment.prototype, "approvedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'rejection_reason', type: 'text', nullable: true }),
    __metadata("design:type", String)
], StockAdjustment.prototype, "rejectionReason", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by', nullable: true }),
    __metadata("design:type", String)
], StockAdjustment.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], StockAdjustment.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], StockAdjustment.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => warehouse_entity_1.Warehouse),
    (0, typeorm_1.JoinColumn)({ name: 'warehouse_id' }),
    __metadata("design:type", warehouse_entity_1.Warehouse)
], StockAdjustment.prototype, "warehouse", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => stock_adjustment_item_entity_1.StockAdjustmentItem, (item) => item.stockAdjustment),
    __metadata("design:type", Array)
], StockAdjustment.prototype, "items", void 0);
exports.StockAdjustment = StockAdjustment = __decorate([
    (0, typeorm_1.Entity)('stock_adjustments')
], StockAdjustment);
//# sourceMappingURL=stock-adjustment.entity.js.map