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
exports.CashMovement = exports.CashMovementStatus = exports.CashMovementType = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const pos_session_entity_1 = require("./pos-session.entity");
const store_entity_1 = require("./store.entity");
const user_entity_1 = require("../user/user.entity");
var CashMovementType;
(function (CashMovementType) {
    CashMovementType["CASH_IN"] = "CASH_IN";
    CashMovementType["CASH_OUT"] = "CASH_OUT";
    CashMovementType["PETTY_CASH"] = "PETTY_CASH";
    CashMovementType["FLOAT"] = "FLOAT";
    CashMovementType["BANK_DEPOSIT"] = "BANK_DEPOSIT";
    CashMovementType["BANK_WITHDRAWAL"] = "BANK_WITHDRAWAL";
    CashMovementType["EXPENSE"] = "EXPENSE";
    CashMovementType["REFUND"] = "REFUND";
    CashMovementType["ADJUSTMENT"] = "ADJUSTMENT";
})(CashMovementType || (exports.CashMovementType = CashMovementType = {}));
var CashMovementStatus;
(function (CashMovementStatus) {
    CashMovementStatus["PENDING"] = "PENDING";
    CashMovementStatus["APPROVED"] = "APPROVED";
    CashMovementStatus["REJECTED"] = "REJECTED";
    CashMovementStatus["CANCELLED"] = "CANCELLED";
})(CashMovementStatus || (exports.CashMovementStatus = CashMovementStatus = {}));
let CashMovement = class CashMovement {
    id;
    movementNumber;
    sessionId;
    storeId;
    movementType;
    movementDate;
    amount;
    currency;
    status;
    reason;
    referenceNumber;
    referenceType;
    referenceId;
    expenseCategory;
    receivedFrom;
    paidTo;
    notes;
    approvedBy;
    approvedAt;
    createdBy;
    createdAt;
    session;
    store;
    createdByUser;
    get isInflow() {
        return [
            CashMovementType.CASH_IN,
            CashMovementType.FLOAT,
            CashMovementType.BANK_WITHDRAWAL,
        ].includes(this.movementType);
    }
    get isOutflow() {
        return [
            CashMovementType.CASH_OUT,
            CashMovementType.BANK_DEPOSIT,
            CashMovementType.EXPENSE,
            CashMovementType.PETTY_CASH,
            CashMovementType.REFUND,
        ].includes(this.movementType);
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, movementNumber: { required: true, type: () => String }, sessionId: { required: true, type: () => String }, storeId: { required: true, type: () => String }, movementType: { required: true, enum: require("./cash-movement.entity").CashMovementType }, movementDate: { required: true, type: () => Date }, amount: { required: true, type: () => Number }, currency: { required: true, type: () => String }, status: { required: true, enum: require("./cash-movement.entity").CashMovementStatus }, reason: { required: true, type: () => String }, referenceNumber: { required: true, type: () => String }, referenceType: { required: true, type: () => String }, referenceId: { required: true, type: () => String }, expenseCategory: { required: true, type: () => String }, receivedFrom: { required: true, type: () => String }, paidTo: { required: true, type: () => String }, notes: { required: true, type: () => String }, approvedBy: { required: true, type: () => String }, approvedAt: { required: true, type: () => Date }, createdBy: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, session: { required: true, type: () => require("./pos-session.entity").PosSession }, store: { required: true, type: () => require("./store.entity").Store }, createdByUser: { required: true, type: () => require("../user/user.entity").User } };
    }
};
exports.CashMovement = CashMovement;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], CashMovement.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'movement_number', length: 50, unique: true }),
    __metadata("design:type", String)
], CashMovement.prototype, "movementNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'session_id', nullable: true }),
    __metadata("design:type", String)
], CashMovement.prototype, "sessionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'store_id' }),
    __metadata("design:type", String)
], CashMovement.prototype, "storeId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'movement_type',
        type: 'enum',
        enum: CashMovementType,
    }),
    __metadata("design:type", String)
], CashMovement.prototype, "movementType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'movement_date', type: 'timestamp' }),
    __metadata("design:type", Date)
], CashMovement.prototype, "movementDate", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 18,
        scale: 4,
    }),
    __metadata("design:type", Number)
], CashMovement.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 3, default: 'INR' }),
    __metadata("design:type", String)
], CashMovement.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: CashMovementStatus,
        default: CashMovementStatus.APPROVED,
    }),
    __metadata("design:type", String)
], CashMovement.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text' }),
    __metadata("design:type", String)
], CashMovement.prototype, "reason", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'reference_number', length: 100, nullable: true }),
    __metadata("design:type", String)
], CashMovement.prototype, "referenceNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'reference_type', length: 50, nullable: true }),
    __metadata("design:type", String)
], CashMovement.prototype, "referenceType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'reference_id', nullable: true }),
    __metadata("design:type", String)
], CashMovement.prototype, "referenceId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'expense_category', length: 100, nullable: true }),
    __metadata("design:type", String)
], CashMovement.prototype, "expenseCategory", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'received_from', length: 200, nullable: true }),
    __metadata("design:type", String)
], CashMovement.prototype, "receivedFrom", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'paid_to', length: 200, nullable: true }),
    __metadata("design:type", String)
], CashMovement.prototype, "paidTo", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], CashMovement.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'approved_by', nullable: true }),
    __metadata("design:type", String)
], CashMovement.prototype, "approvedBy", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'approved_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], CashMovement.prototype, "approvedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by' }),
    __metadata("design:type", String)
], CashMovement.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], CashMovement.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => pos_session_entity_1.PosSession),
    (0, typeorm_1.JoinColumn)({ name: 'session_id' }),
    __metadata("design:type", pos_session_entity_1.PosSession)
], CashMovement.prototype, "session", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => store_entity_1.Store),
    (0, typeorm_1.JoinColumn)({ name: 'store_id' }),
    __metadata("design:type", store_entity_1.Store)
], CashMovement.prototype, "store", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'created_by' }),
    __metadata("design:type", user_entity_1.User)
], CashMovement.prototype, "createdByUser", void 0);
exports.CashMovement = CashMovement = __decorate([
    (0, typeorm_1.Entity)('cash_movements')
], CashMovement);
//# sourceMappingURL=cash-movement.entity.js.map