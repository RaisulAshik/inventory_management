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
exports.MaterialIssue = exports.MaterialIssueType = exports.MaterialIssueStatus = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const work_order_entity_1 = require("./work-order.entity");
const warehouse_entity_1 = require("../warehouse/warehouse.entity");
const user_entity_1 = require("../user/user.entity");
const material_issue_item_entity_1 = require("./material-issue-item.entity");
var MaterialIssueStatus;
(function (MaterialIssueStatus) {
    MaterialIssueStatus["DRAFT"] = "DRAFT";
    MaterialIssueStatus["PENDING_APPROVAL"] = "PENDING_APPROVAL";
    MaterialIssueStatus["APPROVED"] = "APPROVED";
    MaterialIssueStatus["ISSUED"] = "ISSUED";
    MaterialIssueStatus["PARTIALLY_RETURNED"] = "PARTIALLY_RETURNED";
    MaterialIssueStatus["RETURNED"] = "RETURNED";
    MaterialIssueStatus["CANCELLED"] = "CANCELLED";
})(MaterialIssueStatus || (exports.MaterialIssueStatus = MaterialIssueStatus = {}));
var MaterialIssueType;
(function (MaterialIssueType) {
    MaterialIssueType["PRODUCTION"] = "PRODUCTION";
    MaterialIssueType["REWORK"] = "REWORK";
    MaterialIssueType["SAMPLE"] = "SAMPLE";
    MaterialIssueType["REPLACEMENT"] = "REPLACEMENT";
    MaterialIssueType["OTHER"] = "OTHER";
})(MaterialIssueType || (exports.MaterialIssueType = MaterialIssueType = {}));
let MaterialIssue = class MaterialIssue {
    id;
    issueNumber;
    issueDate;
    workOrderId;
    warehouseId;
    issueType;
    status;
    totalValue;
    reason;
    notes;
    issuedBy;
    issuedAt;
    approvedBy;
    approvedAt;
    createdBy;
    createdAt;
    updatedAt;
    workOrder;
    warehouse;
    issuedByUser;
    items;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, issueNumber: { required: true, type: () => String }, issueDate: { required: true, type: () => Date }, workOrderId: { required: true, type: () => String }, warehouseId: { required: true, type: () => String }, issueType: { required: true, enum: require("./material-issue.entity").MaterialIssueType }, status: { required: true, enum: require("./material-issue.entity").MaterialIssueStatus }, totalValue: { required: true, type: () => Number }, reason: { required: true, type: () => String }, notes: { required: true, type: () => String }, issuedBy: { required: true, type: () => String }, issuedAt: { required: true, type: () => Date }, approvedBy: { required: true, type: () => String }, approvedAt: { required: true, type: () => Date }, createdBy: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, workOrder: { required: true, type: () => require("./work-order.entity").WorkOrder }, warehouse: { required: true, type: () => require("../warehouse/warehouse.entity").Warehouse }, issuedByUser: { required: true, type: () => require("../user/user.entity").User }, items: { required: true, type: () => [require("./material-issue-item.entity").MaterialIssueItem] } };
    }
};
exports.MaterialIssue = MaterialIssue;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], MaterialIssue.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'issue_number', length: 50, unique: true }),
    __metadata("design:type", String)
], MaterialIssue.prototype, "issueNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'issue_date', type: 'timestamp' }),
    __metadata("design:type", Date)
], MaterialIssue.prototype, "issueDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'work_order_id', nullable: true }),
    __metadata("design:type", String)
], MaterialIssue.prototype, "workOrderId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'warehouse_id' }),
    __metadata("design:type", String)
], MaterialIssue.prototype, "warehouseId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'issue_type',
        type: 'enum',
        enum: MaterialIssueType,
        default: MaterialIssueType.PRODUCTION,
    }),
    __metadata("design:type", String)
], MaterialIssue.prototype, "issueType", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: MaterialIssueStatus,
        default: MaterialIssueStatus.DRAFT,
    }),
    __metadata("design:type", String)
], MaterialIssue.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'total_value',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], MaterialIssue.prototype, "totalValue", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], MaterialIssue.prototype, "reason", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], MaterialIssue.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'issued_by', nullable: true }),
    __metadata("design:type", String)
], MaterialIssue.prototype, "issuedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'issued_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], MaterialIssue.prototype, "issuedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'approved_by', nullable: true }),
    __metadata("design:type", String)
], MaterialIssue.prototype, "approvedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'approved_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], MaterialIssue.prototype, "approvedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by', nullable: true }),
    __metadata("design:type", String)
], MaterialIssue.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], MaterialIssue.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], MaterialIssue.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => work_order_entity_1.WorkOrder),
    (0, typeorm_1.JoinColumn)({ name: 'work_order_id' }),
    __metadata("design:type", work_order_entity_1.WorkOrder)
], MaterialIssue.prototype, "workOrder", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => warehouse_entity_1.Warehouse),
    (0, typeorm_1.JoinColumn)({ name: 'warehouse_id' }),
    __metadata("design:type", warehouse_entity_1.Warehouse)
], MaterialIssue.prototype, "warehouse", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'issued_by' }),
    __metadata("design:type", user_entity_1.User)
], MaterialIssue.prototype, "issuedByUser", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => material_issue_item_entity_1.MaterialIssueItem, (item) => item.materialIssue),
    __metadata("design:type", Array)
], MaterialIssue.prototype, "items", void 0);
exports.MaterialIssue = MaterialIssue = __decorate([
    (0, typeorm_1.Entity)('material_issues')
], MaterialIssue);
//# sourceMappingURL=material-issue.entity.js.map