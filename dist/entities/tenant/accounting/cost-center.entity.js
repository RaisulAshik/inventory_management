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
exports.CostCenter = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
let CostCenter = class CostCenter {
    id;
    costCenterCode;
    costCenterName;
    parentId;
    level;
    path;
    description;
    managerId;
    budget;
    isActive;
    createdAt;
    updatedAt;
    parent;
    children;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, costCenterCode: { required: true, type: () => String }, costCenterName: { required: true, type: () => String }, parentId: { required: true, type: () => String }, level: { required: true, type: () => Number }, path: { required: true, type: () => String }, description: { required: true, type: () => String }, managerId: { required: true, type: () => String }, budget: { required: true, type: () => Number }, isActive: { required: true, type: () => Boolean }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, parent: { required: true, type: () => require("./cost-center.entity").CostCenter }, children: { required: true, type: () => [require("./cost-center.entity").CostCenter] } };
    }
};
exports.CostCenter = CostCenter;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], CostCenter.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cost_center_code', length: 50, unique: true }),
    __metadata("design:type", String)
], CostCenter.prototype, "costCenterCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'cost_center_name', length: 200 }),
    __metadata("design:type", String)
], CostCenter.prototype, "costCenterName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'parent_id', nullable: true }),
    __metadata("design:type", String)
], CostCenter.prototype, "parentId", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'int', default: 0 }),
    __metadata("design:type", Number)
], CostCenter.prototype, "level", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 500, nullable: true }),
    __metadata("design:type", String)
], CostCenter.prototype, "path", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], CostCenter.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'manager_id', nullable: true }),
    __metadata("design:type", String)
], CostCenter.prototype, "managerId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: 'decimal',
        precision: 18,
        scale: 4,
        default: 0,
        nullable: true,
    }),
    __metadata("design:type", Number)
], CostCenter.prototype, "budget", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', type: 'tinyint', default: 1 }),
    __metadata("design:type", Boolean)
], CostCenter.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], CostCenter.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], CostCenter.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => CostCenter, (cc) => cc.children),
    (0, typeorm_1.JoinColumn)({ name: 'parent_id' }),
    __metadata("design:type", CostCenter)
], CostCenter.prototype, "parent", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => CostCenter, (cc) => cc.parent),
    __metadata("design:type", Array)
], CostCenter.prototype, "children", void 0);
exports.CostCenter = CostCenter = __decorate([
    (0, typeorm_1.Entity)('cost_centers')
], CostCenter);
//# sourceMappingURL=cost-center.entity.js.map