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
exports.WarehouseTransfer = exports.TransferType = exports.TransferStatus = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const warehouse_entity_1 = require("./warehouse.entity");
const warehouse_transfer_item_entity_1 = require("./warehouse-transfer-item.entity");
var TransferStatus;
(function (TransferStatus) {
    TransferStatus["DRAFT"] = "DRAFT";
    TransferStatus["PENDING_APPROVAL"] = "PENDING_APPROVAL";
    TransferStatus["APPROVED"] = "APPROVED";
    TransferStatus["IN_TRANSIT"] = "IN_TRANSIT";
    TransferStatus["PARTIALLY_RECEIVED"] = "PARTIALLY_RECEIVED";
    TransferStatus["RECEIVED"] = "RECEIVED";
    TransferStatus["CANCELLED"] = "CANCELLED";
})(TransferStatus || (exports.TransferStatus = TransferStatus = {}));
var TransferType;
(function (TransferType) {
    TransferType["INTER_WAREHOUSE"] = "INTER_WAREHOUSE";
    TransferType["INTER_LOCATION"] = "INTER_LOCATION";
})(TransferType || (exports.TransferType = TransferType = {}));
let WarehouseTransfer = class WarehouseTransfer {
    id;
    transferNumber;
    transferType;
    transferDate;
    fromWarehouseId;
    toWarehouseId;
    status;
    expectedDeliveryDate;
    actualDeliveryDate;
    shippingMethod;
    trackingNumber;
    shippingCost;
    totalValue;
    reason;
    notes;
    approvedBy;
    approvedAt;
    shippedBy;
    shippedAt;
    receivedBy;
    receivedAt;
    createdBy;
    createdAt;
    updatedAt;
    fromWarehouse;
    toWarehouse;
    items;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, transferNumber: { required: true, type: () => String }, transferType: { required: true, enum: require("./warehouse-transfer.entity").TransferType }, transferDate: { required: true, type: () => Date }, fromWarehouseId: { required: true, type: () => String }, toWarehouseId: { required: true, type: () => String }, status: { required: true, enum: require("./warehouse-transfer.entity").TransferStatus }, expectedDeliveryDate: { required: true, type: () => Date }, actualDeliveryDate: { required: true, type: () => Date }, shippingMethod: { required: true, type: () => String }, trackingNumber: { required: true, type: () => String }, shippingCost: { required: true, type: () => Number }, totalValue: { required: true, type: () => Number }, reason: { required: true, type: () => String }, notes: { required: true, type: () => String }, approvedBy: { required: true, type: () => String }, approvedAt: { required: true, type: () => Date }, shippedBy: { required: true, type: () => String }, shippedAt: { required: true, type: () => Date }, receivedBy: { required: true, type: () => String }, receivedAt: { required: true, type: () => Date }, createdBy: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, fromWarehouse: { required: true, type: () => require("./warehouse.entity").Warehouse }, toWarehouse: { required: true, type: () => require("./warehouse.entity").Warehouse }, items: { required: true, type: () => [require("./warehouse-transfer-item.entity").WarehouseTransferItem] } };
    }
};
exports.WarehouseTransfer = WarehouseTransfer;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], WarehouseTransfer.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'transfer_number', length: 50, unique: true }),
    __metadata("design:type", String)
], WarehouseTransfer.prototype, "transferNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'transfer_type',
        type: 'enum',
        enum: TransferType,
        default: TransferType.INTER_WAREHOUSE,
    }),
    __metadata("design:type", String)
], WarehouseTransfer.prototype, "transferType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'transfer_date', type: 'date' }),
    __metadata("design:type", Date)
], WarehouseTransfer.prototype, "transferDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'from_warehouse_id' }),
    __metadata("design:type", String)
], WarehouseTransfer.prototype, "fromWarehouseId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'to_warehouse_id' }),
    __metadata("design:type", String)
], WarehouseTransfer.prototype, "toWarehouseId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: TransferStatus,
        default: TransferStatus.DRAFT,
    }),
    __metadata("design:type", String)
], WarehouseTransfer.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'expected_delivery_date', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], WarehouseTransfer.prototype, "expectedDeliveryDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'actual_delivery_date', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], WarehouseTransfer.prototype, "actualDeliveryDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'shipping_method', length: 100, nullable: true }),
    __metadata("design:type", String)
], WarehouseTransfer.prototype, "shippingMethod", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tracking_number', length: 100, nullable: true }),
    __metadata("design:type", String)
], WarehouseTransfer.prototype, "trackingNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'shipping_cost',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], WarehouseTransfer.prototype, "shippingCost", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'total_value',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], WarehouseTransfer.prototype, "totalValue", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], WarehouseTransfer.prototype, "reason", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], WarehouseTransfer.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'approved_by', nullable: true }),
    __metadata("design:type", String)
], WarehouseTransfer.prototype, "approvedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'approved_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], WarehouseTransfer.prototype, "approvedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'shipped_by', nullable: true }),
    __metadata("design:type", String)
], WarehouseTransfer.prototype, "shippedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'shipped_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], WarehouseTransfer.prototype, "shippedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'received_by', nullable: true }),
    __metadata("design:type", String)
], WarehouseTransfer.prototype, "receivedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'received_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], WarehouseTransfer.prototype, "receivedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by', nullable: true }),
    __metadata("design:type", String)
], WarehouseTransfer.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], WarehouseTransfer.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], WarehouseTransfer.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => warehouse_entity_1.Warehouse),
    (0, typeorm_1.JoinColumn)({ name: 'from_warehouse_id' }),
    __metadata("design:type", warehouse_entity_1.Warehouse)
], WarehouseTransfer.prototype, "fromWarehouse", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => warehouse_entity_1.Warehouse),
    (0, typeorm_1.JoinColumn)({ name: 'to_warehouse_id' }),
    __metadata("design:type", warehouse_entity_1.Warehouse)
], WarehouseTransfer.prototype, "toWarehouse", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => warehouse_transfer_item_entity_1.WarehouseTransferItem, (item) => item.warehouseTransfer),
    __metadata("design:type", Array)
], WarehouseTransfer.prototype, "items", void 0);
exports.WarehouseTransfer = WarehouseTransfer = __decorate([
    (0, typeorm_1.Entity)('warehouse_transfers')
], WarehouseTransfer);
//# sourceMappingURL=warehouse-transfer.entity.js.map