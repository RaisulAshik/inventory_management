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
exports.PosSession = exports.PosSessionStatus = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const store_entity_1 = require("./store.entity");
const pos_terminal_entity_1 = require("./pos-terminal.entity");
const user_entity_1 = require("../user/user.entity");
const pos_transaction_entity_1 = require("./pos-transaction.entity");
var PosSessionStatus;
(function (PosSessionStatus) {
    PosSessionStatus["OPEN"] = "OPEN";
    PosSessionStatus["CLOSED"] = "CLOSED";
    PosSessionStatus["SUSPENDED"] = "SUSPENDED";
})(PosSessionStatus || (exports.PosSessionStatus = PosSessionStatus = {}));
let PosSession = class PosSession {
    id;
    sessionNumber;
    storeId;
    terminalId;
    userId;
    status;
    openingTime;
    closingTime;
    openingCash;
    closingCash;
    expectedCash;
    cashDifference;
    totalSales;
    totalReturns;
    totalTransactions;
    cashSales;
    cardSales;
    upiSales;
    otherSales;
    cashIn;
    cashOut;
    openingNotes;
    closingNotes;
    closedBy;
    createdAt;
    updatedAt;
    store;
    terminal;
    user;
    transactions;
    get isOpen() {
        return this.status === PosSessionStatus.OPEN;
    }
    get netSales() {
        return this.totalSales - this.totalReturns;
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, sessionNumber: { required: true, type: () => String }, storeId: { required: true, type: () => String }, terminalId: { required: true, type: () => String }, userId: { required: true, type: () => String }, status: { required: true, enum: require("./pos-session.entity").PosSessionStatus }, openingTime: { required: true, type: () => Date }, closingTime: { required: true, type: () => Date }, openingCash: { required: true, type: () => Number }, closingCash: { required: true, type: () => Number }, expectedCash: { required: true, type: () => Number }, cashDifference: { required: true, type: () => Number }, totalSales: { required: true, type: () => Number }, totalReturns: { required: true, type: () => Number }, totalTransactions: { required: true, type: () => Number }, cashSales: { required: true, type: () => Number }, cardSales: { required: true, type: () => Number }, upiSales: { required: true, type: () => Number }, otherSales: { required: true, type: () => Number }, cashIn: { required: true, type: () => Number }, cashOut: { required: true, type: () => Number }, openingNotes: { required: true, type: () => String }, closingNotes: { required: true, type: () => String }, closedBy: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, store: { required: true, type: () => require("./store.entity").Store }, terminal: { required: true, type: () => require("./pos-terminal.entity").PosTerminal }, user: { required: true, type: () => require("../user/user.entity").User }, transactions: { required: true, type: () => [require("./pos-transaction.entity").PosTransaction] } };
    }
};
exports.PosSession = PosSession;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], PosSession.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'session_number', length: 50, unique: true }),
    __metadata("design:type", String)
], PosSession.prototype, "sessionNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'store_id' }),
    __metadata("design:type", String)
], PosSession.prototype, "storeId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'terminal_id' }),
    __metadata("design:type", String)
], PosSession.prototype, "terminalId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id' }),
    __metadata("design:type", String)
], PosSession.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'enum',
        enum: PosSessionStatus,
        default: PosSessionStatus.OPEN,
    }),
    __metadata("design:type", String)
], PosSession.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'opening_time', type: 'timestamp' }),
    __metadata("design:type", Date)
], PosSession.prototype, "openingTime", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'closing_time', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], PosSession.prototype, "closingTime", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'opening_cash',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], PosSession.prototype, "openingCash", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'closing_cash',
        type: 'decimal',
        precision: 18,
        scale: 4,
        nullable: true,
    }),
    __metadata("design:type", Number)
], PosSession.prototype, "closingCash", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'expected_cash',
        type: 'decimal',
        precision: 18,
        scale: 4,
        nullable: true,
    }),
    __metadata("design:type", Number)
], PosSession.prototype, "expectedCash", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'cash_difference',
        type: 'decimal',
        precision: 18,
        scale: 4,
        nullable: true,
    }),
    __metadata("design:type", Number)
], PosSession.prototype, "cashDifference", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'total_sales',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], PosSession.prototype, "totalSales", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'total_returns',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], PosSession.prototype, "totalReturns", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'total_transactions', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], PosSession.prototype, "totalTransactions", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'cash_sales',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], PosSession.prototype, "cashSales", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'card_sales',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], PosSession.prototype, "cardSales", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'upi_sales',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], PosSession.prototype, "upiSales", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'other_sales',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], PosSession.prototype, "otherSales", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'cash_in',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], PosSession.prototype, "cashIn", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'cash_out',
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
    }),
    __metadata("design:type", Number)
], PosSession.prototype, "cashOut", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'opening_notes', type: 'text', nullable: true }),
    __metadata("design:type", String)
], PosSession.prototype, "openingNotes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'closing_notes', type: 'text', nullable: true }),
    __metadata("design:type", String)
], PosSession.prototype, "closingNotes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'closed_by', nullable: true }),
    __metadata("design:type", String)
], PosSession.prototype, "closedBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], PosSession.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], PosSession.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => store_entity_1.Store),
    (0, typeorm_1.JoinColumn)({ name: 'store_id' }),
    __metadata("design:type", store_entity_1.Store)
], PosSession.prototype, "store", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => pos_terminal_entity_1.PosTerminal),
    (0, typeorm_1.JoinColumn)({ name: 'terminal_id' }),
    __metadata("design:type", pos_terminal_entity_1.PosTerminal)
], PosSession.prototype, "terminal", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], PosSession.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => pos_transaction_entity_1.PosTransaction, (transaction) => transaction.session),
    __metadata("design:type", Array)
], PosSession.prototype, "transactions", void 0);
exports.PosSession = PosSession = __decorate([
    (0, typeorm_1.Entity)('pos_sessions')
], PosSession);
//# sourceMappingURL=pos-session.entity.js.map