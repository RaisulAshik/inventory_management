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
exports.CustomerDueCollectionAllocation = void 0;
const openapi = require("@nestjs/swagger");
const typeorm_1 = require("typeorm");
const customer_due_collection_entity_1 = require("./customer-due-collection.entity");
const customer_due_entity_1 = require("./customer-due.entity");
let CustomerDueCollectionAllocation = class CustomerDueCollectionAllocation {
    id;
    collectionId;
    customerDueId;
    allocatedAmount;
    allocationDate;
    notes;
    createdBy;
    createdAt;
    collection;
    customerDue;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, collectionId: { required: true, type: () => String }, customerDueId: { required: true, type: () => String }, allocatedAmount: { required: true, type: () => Number }, allocationDate: { required: true, type: () => Date }, notes: { required: true, type: () => String }, createdBy: { required: true, type: () => String }, createdAt: { required: true, type: () => Date }, collection: { required: true, type: () => require("./customer-due-collection.entity").CustomerDueCollection }, customerDue: { required: true, type: () => require("./customer-due.entity").CustomerDue } };
    }
};
exports.CustomerDueCollectionAllocation = CustomerDueCollectionAllocation;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], CustomerDueCollectionAllocation.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'collection_id' }),
    __metadata("design:type", String)
], CustomerDueCollectionAllocation.prototype, "collectionId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'customer_due_id' }),
    __metadata("design:type", String)
], CustomerDueCollectionAllocation.prototype, "customerDueId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        name: 'allocated_amount',
        type: 'decimal',
        precision: 18,
        scale: 4,
    }),
    __metadata("design:type", Number)
], CustomerDueCollectionAllocation.prototype, "allocatedAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'allocation_date', type: 'date' }),
    __metadata("design:type", Date)
], CustomerDueCollectionAllocation.prototype, "allocationDate", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', nullable: true }),
    __metadata("design:type", String)
], CustomerDueCollectionAllocation.prototype, "notes", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'created_by', nullable: true }),
    __metadata("design:type", String)
], CustomerDueCollectionAllocation.prototype, "createdBy", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ name: 'created_at' }),
    __metadata("design:type", Date)
], CustomerDueCollectionAllocation.prototype, "createdAt", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => customer_due_collection_entity_1.CustomerDueCollection, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'collection_id' }),
    __metadata("design:type", customer_due_collection_entity_1.CustomerDueCollection)
], CustomerDueCollectionAllocation.prototype, "collection", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => customer_due_entity_1.CustomerDue, {
        onDelete: 'CASCADE',
    }),
    (0, typeorm_1.JoinColumn)({ name: 'customer_due_id' }),
    __metadata("design:type", customer_due_entity_1.CustomerDue)
], CustomerDueCollectionAllocation.prototype, "customerDue", void 0);
exports.CustomerDueCollectionAllocation = CustomerDueCollectionAllocation = __decorate([
    (0, typeorm_1.Entity)('customer_due_collection_allocations')
], CustomerDueCollectionAllocation);
//# sourceMappingURL=customer-due-collection-allocation.entity.js.map