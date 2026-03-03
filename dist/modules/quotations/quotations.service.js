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
exports.QuotationsService = void 0;
const common_1 = require("@nestjs/common");
const tenant_connection_manager_1 = require("../../database/tenant-connection.manager");
const tenant_1 = require("../../entities/tenant");
const sequence_util_1 = require("../../common/utils/sequence.util");
const enums_1 = require("../../common/enums");
let QuotationsService = class QuotationsService {
    tenantConnectionManager;
    sequenceService;
    constructor(tenantConnectionManager) {
        this.tenantConnectionManager = tenantConnectionManager;
    }
    async getRepo(entity) {
        return this.tenantConnectionManager.getRepository(entity);
    }
    async getQuotationItemRepository() {
        return this.tenantConnectionManager.getRepository(tenant_1.QuotationItem);
    }
    async create(dto, userId) {
        const tenantId = this.tenantConnectionManager.getTenantId();
        const dataSource = await this.tenantConnectionManager.getDataSource();
        const quotationNumber = await (0, sequence_util_1.getNextSequence)(dataSource, 'QTN');
        const productRepo = await this.getRepo(tenant_1.Product);
        const quotationRepo = await this.getRepo(tenant_1.Quotation);
        const items = [];
        let subtotal = 0;
        for (const itemDto of dto.items) {
            const product = await productRepo.findOne({
                where: { id: itemDto.productId },
            });
            if (!product)
                throw new common_1.NotFoundException(`Product ${itemDto.productId} not found`);
            const grossAmount = itemDto.quantity * itemDto.unitPrice;
            let itemDiscountAmount = 0;
            if (itemDto.discountType === 'PERCENTAGE') {
                itemDiscountAmount = grossAmount * ((itemDto.discountValue || 0) / 100);
            }
            else {
                itemDiscountAmount = itemDto.discountValue || 0;
            }
            const afterDiscount = grossAmount - itemDiscountAmount;
            const taxRate = product.taxRate ?? 0;
            const taxAmount = afterDiscount * (taxRate / 100);
            const lineTotal = afterDiscount + taxAmount;
            subtotal += lineTotal;
            items.push({
                ...itemDto,
                productName: product.productName,
                sku: product.sku,
                discountAmount: itemDiscountAmount,
                taxRate,
                taxAmount,
                lineTotal,
            });
        }
        let orderDiscountAmount = 0;
        if (dto.discountType === 'PERCENTAGE') {
            orderDiscountAmount = subtotal * ((dto.discountValue || 0) / 100);
        }
        else {
            orderDiscountAmount = dto.discountValue || 0;
        }
        const totalTax = items.reduce((sum, i) => sum + (i.taxAmount || 0), 0);
        const shippingAmount = dto.shippingAmount || 0;
        const totalAmount = subtotal - orderDiscountAmount + shippingAmount;
        const quotation = quotationRepo.create({
            ...dto,
            quotationNumber,
            status: tenant_1.QuotationStatus.DRAFT,
            tenantId,
            createdById: userId,
            subtotal,
            taxAmount: totalTax,
            discountAmount: orderDiscountAmount,
            totalAmount,
            items: items,
        });
        return quotationRepo.save(quotation);
    }
    async findAll(filterDto) {
        const { status, customerId, warehouseId, fromDate, toDate, page = 1, limit = 10, sortField = 'createdAt', } = filterDto;
        const quotationRepo = await this.getRepo(tenant_1.Quotation);
        const qb = quotationRepo
            .createQueryBuilder('q')
            .leftJoinAndSelect('q.customer', 'customer')
            .leftJoinAndSelect('q.items', 'items');
        if (filterDto.search) {
            qb.andWhere('(q.quotationNumber LIKE :search OR customer.name LIKE :search)', { search: `%${filterDto.search}%` });
        }
        if (status)
            qb.andWhere('q.status = :status', { status });
        if (customerId)
            qb.andWhere('q.customerId = :customerId', { customerId });
        if (warehouseId)
            qb.andWhere('q.warehouseId = :warehouseId', { warehouseId });
        if (fromDate && toDate) {
            qb.andWhere('q.quotationDate BETWEEN :fromDate AND :toDate', {
                fromDate,
                toDate,
            });
        }
        const total = await qb.getCount();
        const data = await qb
            .orderBy(`q.${sortField}`)
            .skip((page - 1) * limit)
            .take(limit)
            .getMany();
        return {
            data,
            meta: {
                total,
                page: Number(page),
                limit: Number(limit),
                totalPages: Math.ceil(total / limit),
            },
        };
    }
    async findOne(id) {
        const quotationRepo = await this.getRepo(tenant_1.Quotation);
        const quotation = await quotationRepo.findOne({
            where: { id },
            relations: ['customer', 'items', 'warehouse'],
        });
        if (!quotation)
            throw new common_1.NotFoundException('Quotation not found');
        return quotation;
    }
    async findByNumber(quotationNumber) {
        const quotationRepo = await this.getRepo(tenant_1.Quotation);
        const quotation = await quotationRepo.findOne({
            where: { quotationNumber },
            relations: ['customer', 'items', 'warehouse'],
        });
        if (!quotation)
            throw new common_1.NotFoundException('Quotation not found');
        return quotation;
    }
    async update(id, dto) {
        const quotationRepo = await this.getRepo(tenant_1.Quotation);
        const quotationItemRepo = await this.getRepo(tenant_1.QuotationItem);
        const productRepo = await this.getRepo(tenant_1.Product);
        const quotation = await this.findOne(id);
        if (quotation.status !== tenant_1.QuotationStatus.DRAFT) {
            throw new common_1.BadRequestException('Only DRAFT quotations can be edited');
        }
        if (dto.items) {
            await quotationItemRepo.delete({ quotationId: id });
            const items = [];
            let subtotal = 0;
            for (const itemDto of dto.items) {
                const product = await productRepo.findOne({
                    where: { id: itemDto.productId },
                });
                if (!product)
                    throw new common_1.NotFoundException(`Product ${itemDto.productId} not found`);
                const quantity = itemDto.quantity;
                const unitPrice = itemDto.unitPrice;
                const grossAmount = quantity * unitPrice;
                let itemDiscountAmount = 0;
                if (itemDto.discountType === 'PERCENTAGE' && itemDto.discountValue) {
                    itemDiscountAmount = grossAmount * (itemDto.discountValue / 100);
                }
                else if (itemDto.discountType === 'FIXED' && itemDto.discountValue) {
                    itemDiscountAmount = itemDto.discountValue;
                }
                const afterDiscount = grossAmount - itemDiscountAmount;
                const taxRate = product.taxRate ?? 0;
                const taxAmount = afterDiscount * (taxRate / 100);
                const lineTotal = afterDiscount + taxAmount;
                subtotal += lineTotal;
                items.push({
                    quotationId: id,
                    productId: itemDto.productId,
                    variantId: itemDto.variantId,
                    productName: product.name,
                    sku: product.sku,
                    quantity,
                    unitPrice,
                    discountType: itemDto.discountType || 'FIXED',
                    discountValue: itemDto.discountValue || 0,
                    discountAmount: itemDiscountAmount,
                    taxRate,
                    taxAmount,
                    lineTotal,
                    notes: itemDto.notes,
                });
            }
            await quotationItemRepo.save(items);
            let orderDiscountAmount = 0;
            const discType = dto.discountType ?? quotation.discountType;
            const discVal = dto.discountValue ?? quotation.discountValue;
            if (discType === 'PERCENTAGE' && discVal) {
                orderDiscountAmount = subtotal * (discVal / 100);
            }
            else if (discType === 'FIXED' && discVal) {
                orderDiscountAmount = discVal;
            }
            const shippingAmount = dto.shippingAmount ?? quotation.shippingAmount;
            const totalTax = items.reduce((sum, i) => sum + (i.taxAmount || 0), 0);
            const totalAmount = subtotal - orderDiscountAmount + Number(shippingAmount);
            Object.assign(quotation, {
                subtotal,
                taxAmount: totalTax,
                discountAmount: orderDiscountAmount,
                totalAmount,
            });
        }
        const updateFields = [
            'customerId',
            'warehouseId',
            'quotationDate',
            'validUntil',
            'billingAddressId',
            'shippingAddressId',
            'paymentTermsId',
            'salesPersonId',
            'referenceNumber',
            'notes',
            'internalNotes',
            'termsAndConditions',
            'discountType',
            'discountValue',
            'shippingAmount',
        ];
        for (const field of updateFields) {
            if (dto[field] !== undefined)
                quotation[field] = dto[field];
        }
        return quotationRepo.save(quotation);
    }
    async remove(id) {
        const quotationRepo = await this.getRepo(tenant_1.Quotation);
        const quotation = await this.findOne(id);
        if (quotation.status !== tenant_1.QuotationStatus.DRAFT) {
            throw new common_1.BadRequestException('Only DRAFT quotations can be deleted');
        }
        await quotationRepo.remove(quotation);
    }
    async send(id, userId) {
        const quotationRepo = await this.getRepo(tenant_1.Quotation);
        const quotation = await this.findOne(id);
        if (quotation.status !== tenant_1.QuotationStatus.DRAFT) {
            throw new common_1.BadRequestException('Only DRAFT quotations can be sent');
        }
        quotation.status = tenant_1.QuotationStatus.SENT;
        quotation.updatedBy = userId;
        return quotationRepo.save(quotation);
    }
    async accept(id, userId) {
        const quotationRepo = await this.getRepo(tenant_1.Quotation);
        const quotation = await this.findOne(id);
        if (new Date() > new Date(quotation.validUntil)) {
            throw new common_1.BadRequestException('This quotation has expired');
        }
        quotation.status = tenant_1.QuotationStatus.ACCEPTED;
        quotation.updatedBy = userId;
        return quotationRepo.save(quotation);
    }
    async reject(id, userId, reason) {
        const quotationRepo = await this.getRepo(tenant_1.Quotation);
        const quotation = await this.findOne(id);
        if (![tenant_1.QuotationStatus.SENT, tenant_1.QuotationStatus.DRAFT].includes(quotation.status)) {
            throw new common_1.BadRequestException('Only DRAFT or SENT quotations can be rejected');
        }
        quotation.status = tenant_1.QuotationStatus.REJECTED;
        quotation.rejectionReason = reason;
        quotation.updatedBy = userId;
        return quotationRepo.save(quotation);
    }
    async cancel(id, userId, reason) {
        const quotationRepo = await this.getRepo(tenant_1.Quotation);
        const quotation = await this.findOne(id);
        if ([tenant_1.QuotationStatus.CONVERTED, tenant_1.QuotationStatus.CANCELLED].includes(quotation.status)) {
            throw new common_1.BadRequestException('Cannot cancel a converted or already cancelled quotation');
        }
        quotation.status = tenant_1.QuotationStatus.CANCELLED;
        quotation.rejectionReason = reason;
        quotation.updatedBy = userId;
        return quotationRepo.save(quotation);
    }
    async convertToSalesOrder(id, userId) {
        const quotation = await this.findOne(id);
        const dataSource = await this.tenantConnectionManager.getDataSource();
        const queryRunner = dataSource.createQueryRunner();
        if (quotation.salesOrderId)
            throw new common_1.ConflictException('Already converted');
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const orderNumber = await (0, sequence_util_1.getNextSequence)(dataSource, 'SO');
            const salesOrder = queryRunner.manager.create(tenant_1.SalesOrder, {
                ...quotation,
                id: undefined,
                orderNumber,
                orderDate: quotation.createdAt,
                status: enums_1.SalesOrderStatus.DRAFT,
                createdBy: userId,
                notes: `Converted from ${quotation.quotationNumber}`,
            });
            const savedOrder = await queryRunner.manager.save(tenant_1.SalesOrder, salesOrder);
            const items = quotation.items.map((item) => queryRunner.manager.create(tenant_1.SalesOrderItem, {
                ...item,
                id: undefined,
                quantityOrdered: item.quantity,
                salesOrderId: savedOrder.id,
            }));
            console.log(quotation.items, 'quationsItems');
            console.log(items, 'sales order items');
            await queryRunner.manager.save(tenant_1.SalesOrderItem, items);
            quotation.status = tenant_1.QuotationStatus.CONVERTED;
            quotation.salesOrderId = savedOrder.id;
            console.log(quotation.salesOrderId, 'salesOrderId');
            await queryRunner.manager.save(tenant_1.Quotation, quotation);
            await queryRunner.commitTransaction();
            return { quotation, salesOrder: savedOrder };
        }
        catch (err) {
            await queryRunner.rollbackTransaction();
            throw err;
        }
        finally {
            await queryRunner.release();
        }
    }
};
exports.QuotationsService = QuotationsService;
exports.QuotationsService = QuotationsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tenant_connection_manager_1.TenantConnectionManager])
], QuotationsService);
//# sourceMappingURL=quotations.service.js.map