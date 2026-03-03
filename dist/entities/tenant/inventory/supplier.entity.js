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
exports.Supplier = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const supplier_contact_entity_1 = require("./supplier-contact.entity");
const supplier_product_entity_1 = require("./supplier-product.entity");
const purchase_order_entity_1 = require("../purchase/purchase-order.entity");
let Supplier = class Supplier {
    id;
    supplierCode;
    companyName;
    contactPerson;
    email;
    phone;
    mobile;
    panNumber;
    fax;
    website;
    taxId;
    paymentTermsDays;
    creditLimit;
    currency;
    addressLine1;
    addressLine2;
    city;
    state;
    country;
    postalCode;
    bankName;
    bankAccountNumber;
    bankIfscCode;
    bankBranch;
    notes;
    isActive;
    createdBy;
    createdAt;
    updatedAt;
    deletedAt;
    contacts;
    supplierProducts;
    purchaseOrders;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, supplierCode: { required: true, type: () => String }, companyName: { required: true, type: () => String }, contactPerson: { required: true, type: () => String }, email: { required: true, type: () => String }, phone: { required: true, type: () => String }, mobile: { required: true, type: () => String }, panNumber: { required: true, type: () => String }, fax: { required: true, type: () => String }, website: { required: true, type: () => String }, taxId: { required: true, type: () => String }, paymentTermsDays: { required: true, type: () => Number }, creditLimit: { required: true, type: () => Number }, currency: { required: true, type: () => String }, addressLine1: { required: true, type: () => String }, addressLine2: { required: true, type: () => String }, city: { required: true, type: () => String }, state: { required: true, type: () => String }, country: { required: true, type: () => String }, postalCode: { required: true, type: () => String }, bankName: { required: true, type: () => String }, bankAccountNumber: { required: true, type: () => String }, bankIfscCode: { required: true, type: () => String }, bankBranch: { required: true, type: () => String }, notes: { required: true, type: () => String }, isActive: { required: true, type: () => Boolean }, createdBy: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, updatedAt: { required: true, type: () => Date }, deletedAt: { required: true, type: () => Date }, contacts: { required: true, type: () => [require("./supplier-contact.entity").SupplierContact] }, supplierProducts: { required: true, type: () => [require("./supplier-product.entity").SupplierProduct] }, purchaseOrders: { required: true, type: () => [require("../purchase/purchase-order.entity").PurchaseOrder] } };
    }
};
exports.Supplier = Supplier;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Supplier.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'supplier_code', length: 50, unique: true }),
    __metadata("design:type", String)
], Supplier.prototype, "supplierCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'company_name', length: 200 }),
    __metadata("design:type", String)
], Supplier.prototype, "companyName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'contact_person', length: 100, nullable: true }),
    __metadata("design:type", String)
], Supplier.prototype, "contactPerson", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, nullable: true }),
    __metadata("design:type", String)
], Supplier.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, nullable: true }),
    __metadata("design:type", String)
], Supplier.prototype, "phone", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, nullable: true }),
    __metadata("design:type", String)
], Supplier.prototype, "mobile", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, nullable: true }),
    __metadata("design:type", String)
], Supplier.prototype, "panNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 50, nullable: true }),
    __metadata("design:type", String)
], Supplier.prototype, "fax", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 255, nullable: true }),
    __metadata("design:type", String)
], Supplier.prototype, "website", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'tax_id', length: 100, nullable: true }),
    __metadata("design:type", String)
], Supplier.prototype, "taxId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'payment_terms_days', type: 'int', default: 30 }),
    __metadata("design:type", Number)
], Supplier.prototype, "paymentTermsDays", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'credit_limit',
        type: 'decimal',
        precision: 18,
        scale: 2,
        default: 0,
    }),
    __metadata("design:type", Number)
], Supplier.prototype, "creditLimit", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 3, default: 'INR' }),
    __metadata("design:type", String)
], Supplier.prototype, "currency", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'address_line1', length: 255, nullable: true }),
    __metadata("design:type", String)
], Supplier.prototype, "addressLine1", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'address_line2', length: 255, nullable: true }),
    __metadata("design:type", String)
], Supplier.prototype, "addressLine2", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], Supplier.prototype, "city", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], Supplier.prototype, "state", void 0);
__decorate([
    (0, typeorm_1.Column)({ length: 100, nullable: true }),
    __metadata("design:type", String)
], Supplier.prototype, "country", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'postal_code', length: 20, nullable: true }),
    __metadata("design:type", String)
], Supplier.prototype, "postalCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'bank_name', length: 200, nullable: true }),
    __metadata("design:type", String)
], Supplier.prototype, "bankName", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'bank_account_number', length: 50, nullable: true }),
    __metadata("design:type", String)
], Supplier.prototype, "bankAccountNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'bank_ifsc_code', length: 20, nullable: true }),
    __metadata("design:type", String)
], Supplier.prototype, "bankIfscCode", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'bank_branch', length: 200, nullable: true }),
    __metadata("design:type", String)
], Supplier.prototype, "bankBranch", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], Supplier.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'is_active', type: 'tinyint', default: 1 }),
    __metadata("design:type", Boolean)
], Supplier.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by', nullable: true }),
    __metadata("design:type", String)
], Supplier.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], Supplier.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' }),
    __metadata("design:type", Date)
], Supplier.prototype, "updatedAt", void 0);
__decorate([
    (0, typeorm_1.DeleteDateColumn)({ name: 'deleted_at' }),
    __metadata("design:type", Date)
], Supplier.prototype, "deletedAt", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => supplier_contact_entity_1.SupplierContact, (contact) => contact.supplier),
    __metadata("design:type", Array)
], Supplier.prototype, "contacts", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => supplier_product_entity_1.SupplierProduct, (sp) => sp.supplier),
    __metadata("design:type", Array)
], Supplier.prototype, "supplierProducts", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => purchase_order_entity_1.PurchaseOrder, (po) => po.supplier),
    __metadata("design:type", Array)
], Supplier.prototype, "purchaseOrders", void 0);
exports.Supplier = Supplier = __decorate([
    (0, typeorm_1.Entity)('suppliers')
], Supplier);
//# sourceMappingURL=supplier.entity.js.map