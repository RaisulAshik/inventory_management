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
exports.GoodsReceivedNote = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const enums_1 = require("../../../common/enums");
const purchase_order_entity_1 = require("./purchase-order.entity");
const supplier_entity_1 = require("../inventory/supplier.entity");
const warehouse_entity_1 = require("../warehouse/warehouse.entity");
const grn_item_entity_1 = require("./grn-item.entity");
let GoodsReceivedNote = class GoodsReceivedNote {
    id;
    grnNumber;
    grnDate;
    receiptDate;
    purchaseOrderId;
    supplierId;
    warehouseId;
    status;
    supplierInvoiceNumber;
    supplierInvoiceDate;
    deliveryNoteNumber;
    vehicleNumber;
    transporterName;
    lrNumber;
    currency;
    lrDate;
    totalQuantity;
    acceptedQuantity;
    rejectedQuantity;
    totalValue;
    taxAmount;
    subtotal;
    notes;
    qcNotes;
    qcBy;
    qcAt;
    receivedBy;
    createdBy;
    approvedBy;
    approvedAt;
    createdAt;
    updatedAt;
    purchaseOrder;
    supplier;
    warehouse;
    items;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, grnNumber: { required: true, type: () => String }, grnDate: { required: true, type: () => Date }, receiptDate: { required: true, type: () => Date }, purchaseOrderId: { required: true, type: () => String }, supplierId: { required: true, type: () => String }, warehouseId: { required: true, type: () => String }, status: { required: true, enum: require("../../../common/enums/index").GRNStatus }, supplierInvoiceNumber: { required: true, type: () => String }, supplierInvoiceDate: { required: true, type: () => Date }, deliveryNoteNumber: { required: true, type: () => String }, vehicleNumber: { required: true, type: () => String }, transporterName: { required: true, type: () => String }, lrNumber: { required: true, type: () => String }, currency: { required: true, type: () => String }, lrDate: { required: true, type: () => Date }, totalQuantity: { required: true, type: () => Number }, acceptedQuantity: { required: true, type: () => Number }, rejectedQuantity: { required: true, type: () => Number }, totalValue: { required: true, type: () => Number }, taxAmount: { required: true, type: () => Number }, subtotal: { required: true, type: () => Number }, notes: { required: true, type: () => String }, qcNotes: { required: true, type: () => String }, qcBy: { required: true, type: () => String }, qcAt: { required: true, type: () => Date }, receivedBy: { required: true, type: () => String }, createdBy: { required: true, type: () => String }, approvedBy: { required: true, type: () => String }, approvedAt: { required: true, type: () => Date }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, purchaseOrder: { required: true, type: () => require("./purchase-order.entity").PurchaseOrder }, supplier: { required: true, type: () => require("../inventory/supplier.entity").Supplier }, warehouse: { required: true, type: () => require("../warehouse/warehouse.entity").Warehouse }, items: { required: true, type: () => [require("./grn-item.entity").GrnItem] } };
    }
};
exports.GoodsReceivedNote = GoodsReceivedNote;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], GoodsReceivedNote.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'grn_number', length: 50, unique: true }),
    __metadata("design:type", String)
], GoodsReceivedNote.prototype, "grnNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'grn_date', type: 'date' }),
    __metadata("design:type", Date)
], GoodsReceivedNote.prototype, "grnDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'receipt_date', type: 'date' }),
    __metadata("design:type", Date)
], GoodsReceivedNote.prototype, "receiptDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'purchase_order_id', nullable: true }),
    __metadata("design:type", String)
], GoodsReceivedNote.prototype, "purchaseOrderId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'supplier_id' }),
    __metadata("design:type", String)
], GoodsReceivedNote.prototype, "supplierId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'warehouse_id' }),
    __metadata("design:type", String)
], GoodsReceivedNote.prototype, "warehouseId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: enums_1.GRNStatus,
        default: enums_1.GRNStatus.DRAFT,
    }),
    __metadata("design:type", String)
], GoodsReceivedNote.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'supplier_invoice_number', length: 100, nullable: true }),
    __metadata("design:type", String)
], GoodsReceivedNote.prototype, "supplierInvoiceNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'supplier_invoice_date', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], GoodsReceivedNote.prototype, "supplierInvoiceDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'delivery_note_number', length: 100, nullable: true }),
    __metadata("design:type", String)
], GoodsReceivedNote.prototype, "deliveryNoteNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'vehicle_number', length: 50, nullable: true }),
    __metadata("design:type", String)
], GoodsReceivedNote.prototype, "vehicleNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'transporter_name', length: 200, nullable: true }),
    __metadata("design:type", String)
], GoodsReceivedNote.prototype, "transporterName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'lr_number', length: 100, nullable: true }),
    __metadata("design:type", String)
], GoodsReceivedNote.prototype, "lrNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'currency', length: 100, nullable: true }),
    __metadata("design:type", String)
], GoodsReceivedNote.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'lr_date', type: 'date', nullable: true }),
    __metadata("design:type", Date)
], GoodsReceivedNote.prototype, "lrDate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'total_quantity',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], GoodsReceivedNote.prototype, "totalQuantity", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'accepted_quantity',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], GoodsReceivedNote.prototype, "acceptedQuantity", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'rejected_quantity',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], GoodsReceivedNote.prototype, "rejectedQuantity", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'total_value',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], GoodsReceivedNote.prototype, "totalValue", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'tax_amount',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], GoodsReceivedNote.prototype, "taxAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'subtotal',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], GoodsReceivedNote.prototype, "subtotal", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], GoodsReceivedNote.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'qc_notes', type: 'text', nullable: true }),
    __metadata("design:type", String)
], GoodsReceivedNote.prototype, "qcNotes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'qc_by', nullable: true }),
    __metadata("design:type", String)
], GoodsReceivedNote.prototype, "qcBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'qc_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], GoodsReceivedNote.prototype, "qcAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'received_by', nullable: true }),
    __metadata("design:type", String)
], GoodsReceivedNote.prototype, "receivedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by', nullable: true }),
    __metadata("design:type", String)
], GoodsReceivedNote.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'approved_by', nullable: true }),
    __metadata("design:type", String)
], GoodsReceivedNote.prototype, "approvedBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'approved_at' }),
    __metadata("design:type", Date)
], GoodsReceivedNote.prototype, "approvedAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], GoodsReceivedNote.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], GoodsReceivedNote.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => purchase_order_entity_1.PurchaseOrder),
    (0, typeorm_1.JoinColumn)({ name: 'purchase_order_id' }),
    __metadata("design:type", purchase_order_entity_1.PurchaseOrder)
], GoodsReceivedNote.prototype, "purchaseOrder", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => supplier_entity_1.Supplier),
    (0, typeorm_1.JoinColumn)({ name: 'supplier_id' }),
    __metadata("design:type", supplier_entity_1.Supplier)
], GoodsReceivedNote.prototype, "supplier", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => warehouse_entity_1.Warehouse),
    (0, typeorm_1.JoinColumn)({ name: 'warehouse_id' }),
    __metadata("design:type", warehouse_entity_1.Warehouse)
], GoodsReceivedNote.prototype, "warehouse", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => grn_item_entity_1.GrnItem, (item) => item.grn),
    __metadata("design:type", Array)
], GoodsReceivedNote.prototype, "items", void 0);
exports.GoodsReceivedNote = GoodsReceivedNote = __decorate([
    (0, typeorm_1.Entity)('goods_received_notes')
], GoodsReceivedNote);
//# sourceMappingURL=goods-received-note.entity.js.map