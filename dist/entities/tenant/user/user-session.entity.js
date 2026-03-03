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
exports.UserSession = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const user_entity_1 = require("./user.entity");
let UserSession = class UserSession {
    id;
    userId;
    tokenHash;
    refreshTokenHash;
    deviceType;
    deviceName;
    browser;
    os;
    ipAddress;
    location;
    expiresAt;
    refreshExpiresAt;
    lastActivityAt;
    createdAt;
    user;
    get isExpired() {
        return this.expiresAt < new Date();
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, userId: { required: true, type: () => String }, tokenHash: { required: true, type: () => String }, refreshTokenHash: { required: true, type: () => String }, deviceType: { required: true, type: () => String }, deviceName: { required: true, type: () => String }, browser: { required: true, type: () => String }, os: { required: true, type: () => String }, ipAddress: { required: true, type: () => String }, location: { required: true, type: () => String }, expiresAt: { required: true, type: () => Date }, refreshExpiresAt: { required: true, type: () => Date }, lastActivityAt: { required: true, type: () => Date }, createdAt: { required: true, type: () => Date }, user: { required: true, type: () => require("./user.entity").User } };
    }
};
exports.UserSession = UserSession;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], UserSession.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'user_id' }),
    __metadata("design:type", String)
], UserSession.prototype, "userId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'token_hash', length: 255 }),
    __metadata("design:type", String)
], UserSession.prototype, "tokenHash", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'refresh_token_hash', length: 255, nullable: true }),
    __metadata("design:type", String)
], UserSession.prototype, "refreshTokenHash", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'device_type', length: 50, nullable: true }),
    __metadata("design:type", String)
], UserSession.prototype, "deviceType", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'device_name', length: 200, nullable: true }),
    __metadata("design:type", String)
], UserSession.prototype, "deviceName", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], UserSession.prototype, "browser", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], UserSession.prototype, "os", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'ip_address', length: 45, nullable: true }),
    __metadata("design:type", String)
], UserSession.prototype, "ipAddress", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 200, nullable: true }),
    __metadata("design:type", String)
], UserSession.prototype, "location", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'expires_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], UserSession.prototype, "expiresAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'refresh_expires_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], UserSession.prototype, "refreshExpiresAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'last_activity_at', type: 'timestamp' }),
    __metadata("design:type", Date)
], UserSession.prototype, "lastActivityAt", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], UserSession.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.sessions, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'user_id' }),
    __metadata("design:type", user_entity_1.User)
], UserSession.prototype, "user", void 0);
exports.UserSession = UserSession = __decorate([
    (0, typeorm_1.Entity)('user_sessions')
], UserSession);
//# sourceMappingURL=user-session.entity.js.map