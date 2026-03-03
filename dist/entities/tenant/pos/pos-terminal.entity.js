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
exports.PosTerminal = exports.TerminalType = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const store_entity_1 = require("./store.entity");
var TerminalType;
(function (TerminalType) {
    TerminalType["DESKTOP"] = "DESKTOP";
    TerminalType["TABLET"] = "TABLET";
    TerminalType["MOBILE"] = "MOBILE";
    TerminalType["SELF_SERVICE"] = "SELF_SERVICE";
})(TerminalType || (exports.TerminalType = TerminalType = {}));
let PosTerminal = class PosTerminal {
    id;
    terminalCode;
    terminalName;
    storeId;
    terminalType;
    deviceId;
    ipAddress;
    isActive;
    lastSyncAt;
    createdAt;
    updatedAt;
    store;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, terminalCode: { required: true, type: () => String }, terminalName: { required: true, type: () => String }, storeId: { required: true, type: () => String }, terminalType: { required: true, enum: require("./pos-terminal.entity").TerminalType }, deviceId: { required: true, type: () => String }, ipAddress: { required: true, type: () => String }, isActive: { required: true, type: () => Boolean }, lastSyncAt: { required: true, type: () => Date }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, store: { required: true, type: () => require("./store.entity").Store } };
    }
};
exports.PosTerminal = PosTerminal;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], PosTerminal.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'terminal_code', length: 50, unique: true }),
    __metadata("design:type", String)
], PosTerminal.prototype, "terminalCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'terminal_name', length: 200 }),
    __metadata("design:type", String)
], PosTerminal.prototype, "terminalName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'store_id' }),
    __metadata("design:type", String)
], PosTerminal.prototype, "storeId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'terminal_type',
        type: 'enum',
        enum: TerminalType,
        default: TerminalType.DESKTOP,
    }),
    __metadata("design:type", String)
], PosTerminal.prototype, "terminalType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'device_id', length: 200, nullable: true }),
    __metadata("design:type", String)
], PosTerminal.prototype, "deviceId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ip_address', length: 45, nullable: true }),
    __metadata("design:type", String)
], PosTerminal.prototype, "ipAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', type: 'tinyint', default: 1 }),
    __metadata("design:type", Boolean)
], PosTerminal.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'last_sync_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], PosTerminal.prototype, "lastSyncAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], PosTerminal.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], PosTerminal.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => store_entity_1.Store, (store) => store.terminals, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'store_id' }),
    __metadata("design:type", store_entity_1.Store)
], PosTerminal.prototype, "store", void 0);
exports.PosTerminal = PosTerminal = __decorate([
    (0, typeorm_1.Entity)('pos_terminals')
], PosTerminal);
//# sourceMappingURL=pos-terminal.entity.js.map