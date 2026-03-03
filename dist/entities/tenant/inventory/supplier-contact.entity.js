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
exports.SupplierContact = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const supplier_entity_1 = require("./supplier.entity");
let SupplierContact = class SupplierContact {
    id;
    supplierId;
    contactName;
    designation;
    department;
    email;
    phone;
    mobile;
    fax;
    isPrimary;
    isActive;
    notes;
    createdAt;
    updatedAt;
    supplier;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, supplierId: { required: true, type: () => String }, contactName: { required: true, type: () => String }, designation: { required: true, type: () => String }, department: { required: true, type: () => String }, email: { required: true, type: () => String }, phone: { required: true, type: () => String }, mobile: { required: true, type: () => String }, fax: { required: true, type: () => String }, isPrimary: { required: true, type: () => Boolean }, isActive: { required: true, type: () => Boolean }, notes: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, supplier: { required: true, type: () => require("./supplier.entity").Supplier } };
    }
};
exports.SupplierContact = SupplierContact;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], SupplierContact.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'supplier_id' }),
    __metadata("design:type", String)
], SupplierContact.prototype, "supplierId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'contact_name', length: 200 }),
    __metadata("design:type", String)
], SupplierContact.prototype, "contactName", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], SupplierContact.prototype, "designation", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], SupplierContact.prototype, "department", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, nullable: true }),
    __metadata("design:type", String)
], SupplierContact.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, nullable: true }),
    __metadata("design:type", String)
], SupplierContact.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, nullable: true }),
    __metadata("design:type", String)
], SupplierContact.prototype, "mobile", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, nullable: true }),
    __metadata("design:type", String)
], SupplierContact.prototype, "fax", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_primary', type: 'tinyint', default: 0 }),
    __metadata("design:type", Boolean)
], SupplierContact.prototype, "isPrimary", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', type: 'tinyint', default: 1 }),
    __metadata("design:type", Boolean)
], SupplierContact.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], SupplierContact.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], SupplierContact.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], SupplierContact.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => supplier_entity_1.Supplier, (supplier) => supplier.contacts, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'supplier_id' }),
    __metadata("design:type", supplier_entity_1.Supplier)
], SupplierContact.prototype, "supplier", void 0);
exports.SupplierContact = SupplierContact = __decorate([
    (0, typeorm_1.Entity)('supplier_contacts')
], SupplierContact);
//# sourceMappingURL=supplier-contact.entity.js.map