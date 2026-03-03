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
exports.CustomerCredentials = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const customer_entity_1 = require("./customer.entity");
let CustomerCredentials = class CustomerCredentials {
    id;
    customerId;
    passwordHash;
    passwordChangedAt;
    emailVerified;
    emailVerificationToken;
    emailVerificationExpires;
    passwordResetToken;
    passwordResetExpires;
    failedLoginAttempts;
    lockedUntil;
    lastLoginAt;
    lastLoginIp;
    twoFactorEnabled;
    twoFactorSecret;
    createdAt;
    updatedAt;
    customer;
    get isLocked() {
        return this.lockedUntil && this.lockedUntil > new Date();
    }
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, customerId: { required: true, type: () => String }, passwordHash: { required: true, type: () => String }, passwordChangedAt: { required: true, type: () => Date }, emailVerified: { required: true, type: () => Boolean }, emailVerificationToken: { required: true, type: () => String }, emailVerificationExpires: { required: true, type: () => Date }, passwordResetToken: { required: true, type: () => String }, passwordResetExpires: { required: true, type: () => Date }, failedLoginAttempts: { required: true, type: () => Number }, lockedUntil: { required: true, type: () => Date }, lastLoginAt: { required: true, type: () => Date }, lastLoginIp: { required: true, type: () => String }, twoFactorEnabled: { required: true, type: () => Boolean }, twoFactorSecret: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, customer: { required: true, type: () => require("./customer.entity").Customer } };
    }
};
exports.CustomerCredentials = CustomerCredentials;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], CustomerCredentials.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'customer_id', unique: true }),
    __metadata("design:type", String)
], CustomerCredentials.prototype, "customerId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'password_hash', length: 255 }),
    __metadata("design:type", String)
], CustomerCredentials.prototype, "passwordHash", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'password_changed_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], CustomerCredentials.prototype, "passwordChangedAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'email_verified', type: 'tinyint', default: 0 }),
    __metadata("design:type", Boolean)
], CustomerCredentials.prototype, "emailVerified", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'email_verification_token', length: 255, nullable: true }),
    __metadata("design:type", String)
], CustomerCredentials.prototype, "emailVerificationToken", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'email_verification_expires',
        type: 'timestamp',
        nullable: true,
    }),
    __metadata("design:type", Date)
], CustomerCredentials.prototype, "emailVerificationExpires", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'password_reset_token', length: 255, nullable: true }),
    __metadata("design:type", String)
], CustomerCredentials.prototype, "passwordResetToken", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'password_reset_expires', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], CustomerCredentials.prototype, "passwordResetExpires", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'failed_login_attempts', type: 'int', default: 0 }),
    __metadata("design:type", Number)
], CustomerCredentials.prototype, "failedLoginAttempts", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'locked_until', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], CustomerCredentials.prototype, "lockedUntil", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'last_login_at', type: 'timestamp', nullable: true }),
    __metadata("design:type", Date)
], CustomerCredentials.prototype, "lastLoginAt", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'last_login_ip', length: 45, nullable: true }),
    __metadata("design:type", String)
], CustomerCredentials.prototype, "lastLoginIp", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'two_factor_enabled', type: 'tinyint', default: 0 }),
    __metadata("design:type", Boolean)
], CustomerCredentials.prototype, "twoFactorEnabled", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'two_factor_secret', length: 255, nullable: true }),
    __metadata("design:type", String)
], CustomerCredentials.prototype, "twoFactorSecret", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], CustomerCredentials.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], CustomerCredentials.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => customer_entity_1.Customer, { onDelete: 'CASCADE' }),
    (0, typeorm_1.JoinColumn)({ name: 'customer_id' }),
    __metadata("design:type", customer_entity_1.Customer)
], CustomerCredentials.prototype, "customer", void 0);
exports.CustomerCredentials = CustomerCredentials = __decorate([
    (0, typeorm_1.Entity)('customer_credentials')
], CustomerCredentials);
//# sourceMappingURL=customer-credentials.entity.js.map