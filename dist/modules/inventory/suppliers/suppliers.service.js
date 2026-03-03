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
exports.SuppliersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const uuid_1 = require("uuid");
const tenant_connection_manager_1 = require("../../../database/tenant-connection.manager");
const pagination_util_1 = require("../../../common/utils/pagination.util");
const sequence_util_1 = require("../../../common/utils/sequence.util");
const tenant_1 = require("../../../entities/tenant");
let SuppliersService = class SuppliersService {
    tenantConnectionManager;
    constructor(tenantConnectionManager) {
        this.tenantConnectionManager = tenantConnectionManager;
    }
    async getSupplierRepository() {
        return this.tenantConnectionManager.getRepository(tenant_1.Supplier);
    }
    async create(createSupplierDto, createdBy) {
        const supplierRepo = await this.getSupplierRepository();
        const dataSource = await this.tenantConnectionManager.getDataSource();
        const supplierCode = createSupplierDto.supplierCode ||
            (await (0, sequence_util_1.getNextSequence)(dataSource, 'SUPPLIER'));
        const existingSupplier = await supplierRepo.findOne({
            where: { supplierCode },
        });
        if (existingSupplier) {
            throw new common_1.BadRequestException(`Supplier with code ${supplierCode} already exists`);
        }
        const supplier = supplierRepo.create({
            id: (0, uuid_1.v4)(),
            ...createSupplierDto,
            supplierCode,
            createdBy,
        });
        const savedSupplier = await supplierRepo.save(supplier);
        if (createSupplierDto.contacts && createSupplierDto.contacts.length > 0) {
            await this.createContacts(savedSupplier.id, createSupplierDto.contacts, dataSource);
        }
        return this.findById(savedSupplier.id);
    }
    async createContacts(supplierId, contacts, dataSource) {
        const contactRepo = dataSource.getRepository(tenant_1.SupplierContact);
        for (let i = 0; i < contacts.length; i++) {
            const contactDto = contacts[i];
            const contact = contactRepo.create({
                id: (0, uuid_1.v4)(),
                supplierId,
                ...contactDto,
                isPrimary: contactDto.isPrimary ?? i === 0,
            });
            await contactRepo.save(contact);
        }
    }
    async findAll(paginationDto, filterDto) {
        const supplierRepo = await this.getSupplierRepository();
        const queryBuilder = supplierRepo
            .createQueryBuilder('supplier')
            .leftJoinAndSelect('supplier.contacts', 'contacts')
            .where('supplier.deletedAt IS NULL');
        if (filterDto.isActive !== undefined) {
            queryBuilder.andWhere('supplier.isActive = :isActive', {
                isActive: filterDto.isActive,
            });
        }
        if (filterDto.country) {
            queryBuilder.andWhere('supplier.country = :country', {
                country: filterDto.country,
            });
        }
        if (filterDto.state) {
            queryBuilder.andWhere('supplier.state = :state', {
                state: filterDto.state,
            });
        }
        if (paginationDto.search) {
            queryBuilder.andWhere('(supplier.supplierCode LIKE :search OR supplier.companyName LIKE :search OR supplier.email LIKE :search)', { search: `%${paginationDto.search}%` });
        }
        if (!paginationDto.sortBy) {
            paginationDto.sortBy = 'companyName';
            paginationDto.sortOrder = 'ASC';
        }
        return (0, pagination_util_1.paginate)(queryBuilder, paginationDto);
    }
    async findAllActive() {
        const supplierRepo = await this.getSupplierRepository();
        return supplierRepo.find({
            where: { isActive: true, deletedAt: (0, typeorm_1.IsNull)() },
            order: { companyName: 'ASC' },
        });
    }
    async findById(id) {
        const supplierRepo = await this.getSupplierRepository();
        const supplier = await supplierRepo.findOne({
            where: { id },
            relations: ['contacts', 'supplierProducts', 'supplierProducts.product'],
        });
        if (!supplier) {
            throw new common_1.NotFoundException(`Supplier with ID ${id} not found`);
        }
        return supplier;
    }
    async findByCode(code) {
        const supplierRepo = await this.getSupplierRepository();
        return supplierRepo.findOne({ where: { supplierCode: code } });
    }
    async update(id, updateSupplierDto) {
        const supplierRepo = await this.getSupplierRepository();
        const supplier = await this.findById(id);
        if (updateSupplierDto.supplierCode &&
            updateSupplierDto.supplierCode !== supplier.supplierCode) {
            const existingCode = await supplierRepo.findOne({
                where: { supplierCode: updateSupplierDto.supplierCode },
            });
            if (existingCode) {
                throw new common_1.BadRequestException(`Supplier with code ${updateSupplierDto.supplierCode} already exists`);
            }
        }
        Object.assign(supplier, updateSupplierDto);
        await supplierRepo.save(supplier);
        return this.findById(id);
    }
    async remove(id) {
        const supplierRepo = await this.getSupplierRepository();
        const supplier = await this.findById(id);
        const dataSource = await this.tenantConnectionManager.getDataSource();
        const poCount = await dataSource
            .createQueryBuilder()
            .select('COUNT(*)', 'count')
            .from('purchase_orders', 'po')
            .where('po.supplier_id = :id', { id })
            .andWhere('po.status IN (:...statuses)', {
            statuses: [
                'DRAFT',
                'PENDING_APPROVAL',
                'APPROVED',
                'SENT',
                'PARTIALLY_RECEIVED',
            ],
        })
            .getRawOne();
        if (Number(poCount.count) > 0) {
            throw new common_1.BadRequestException('Cannot delete supplier with pending purchase orders');
        }
        supplier.deletedAt = new Date();
        await supplierRepo.save(supplier);
    }
    async addContact(supplierId, contactDto) {
        const dataSource = await this.tenantConnectionManager.getDataSource();
        const contactRepo = dataSource.getRepository(tenant_1.SupplierContact);
        await this.findById(supplierId);
        const contact = contactRepo.create({
            id: (0, uuid_1.v4)(),
            supplierId,
            ...contactDto,
        });
        const saved = await contactRepo.save(contact);
        return Array.isArray(saved) ? saved[0] : saved;
    }
    async updateContact(contactId, contactDto) {
        const dataSource = await this.tenantConnectionManager.getDataSource();
        const contactRepo = dataSource.getRepository(tenant_1.SupplierContact);
        const contact = await contactRepo.findOne({ where: { id: contactId } });
        if (!contact) {
            throw new common_1.NotFoundException(`Contact with ID ${contactId} not found`);
        }
        Object.assign(contact, contactDto);
        return contactRepo.save(contact);
    }
    async removeContact(contactId) {
        const dataSource = await this.tenantConnectionManager.getDataSource();
        const contactRepo = dataSource.getRepository(tenant_1.SupplierContact);
        await contactRepo.delete(contactId);
    }
    async getSupplierProducts(supplierId) {
        const dataSource = await this.tenantConnectionManager.getDataSource();
        const supplierProductRepo = dataSource.getRepository(tenant_1.SupplierProduct);
        return supplierProductRepo.find({
            where: { supplierId, isActive: true },
            relations: ['product', 'variant', 'purchaseUom'],
        });
    }
    async addProduct(supplierId, productDto) {
        const dataSource = await this.tenantConnectionManager.getDataSource();
        const supplierProductRepo = dataSource.getRepository(tenant_1.SupplierProduct);
        await this.findById(supplierId);
        const whereClause = {
            supplierId,
            productId: productDto.productId,
        };
        if (productDto.variantId) {
            whereClause.variantId = productDto.variantId;
        }
        else {
            whereClause.variantId = (0, typeorm_1.IsNull)();
        }
        const existing = await supplierProductRepo.findOne({
            where: whereClause,
        });
        if (existing) {
            throw new common_1.BadRequestException('Product already exists in supplier catalog');
        }
        const supplierProduct = supplierProductRepo.create({
            id: (0, uuid_1.v4)(),
            supplierId,
            ...productDto,
        });
        const saved = await supplierProductRepo.save(supplierProduct);
        return Array.isArray(saved) ? saved[0] : saved;
    }
    async updateProduct(supplierProductId, productDto) {
        const dataSource = await this.tenantConnectionManager.getDataSource();
        const supplierProductRepo = dataSource.getRepository(tenant_1.SupplierProduct);
        const supplierProduct = await supplierProductRepo.findOne({
            where: { id: supplierProductId },
        });
        if (!supplierProduct) {
            throw new common_1.NotFoundException(`Supplier product with ID ${supplierProductId} not found`);
        }
        Object.assign(supplierProduct, productDto);
        return supplierProductRepo.save(supplierProduct);
    }
    async removeProduct(supplierProductId) {
        const dataSource = await this.tenantConnectionManager.getDataSource();
        const supplierProductRepo = dataSource.getRepository(tenant_1.SupplierProduct);
        await supplierProductRepo.delete(supplierProductId);
    }
    async getOutstandingBalance(supplierId) {
        const dataSource = await this.tenantConnectionManager.getDataSource();
        const result = await dataSource
            .createQueryBuilder()
            .select('SUM(sd.original_amount - sd.paid_amount - sd.adjusted_amount)', 'balance')
            .from('supplier_dues', 'sd')
            .where('sd.supplier_id = :supplierId', { supplierId })
            .andWhere('sd.status IN (:...statuses)', {
            statuses: ['PENDING', 'PARTIALLY_PAID', 'OVERDUE'],
        })
            .getRawOne();
        return Number(result.balance) || 0;
    }
    async count() {
        const supplierRepo = await this.getSupplierRepository();
        return supplierRepo.count({ where: { deletedAt: (0, typeorm_1.IsNull)() } });
    }
};
exports.SuppliersService = SuppliersService;
exports.SuppliersService = SuppliersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tenant_connection_manager_1.TenantConnectionManager])
], SuppliersService);
//# sourceMappingURL=suppliers.service.js.map