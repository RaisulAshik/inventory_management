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
exports.PurchaseOrdersService = void 0;
const common_1 = require("@nestjs/common");
const uuid_1 = require("uuid");
const tenant_connection_manager_1 = require("../../../database/tenant-connection.manager");
const pagination_util_1 = require("../../../common/utils/pagination.util");
const sequence_util_1 = require("../../../common/utils/sequence.util");
const enums_1 = require("../../../common/enums");
const tenant_1 = require("../../../entities/tenant");
let PurchaseOrdersService = class PurchaseOrdersService {
    tenantConnectionManager;
    constructor(tenantConnectionManager) {
        this.tenantConnectionManager = tenantConnectionManager;
    }
    async getPurchaseOrderRepository() {
        return this.tenantConnectionManager.getRepository(tenant_1.PurchaseOrder);
    }
    async create(createDto, createdBy) {
        const poRepo = await this.getPurchaseOrderRepository();
        const dataSource = await this.tenantConnectionManager.getDataSource();
        const supplierRepo = dataSource.getRepository(tenant_1.Supplier);
        const supplier = await supplierRepo.findOne({
            where: { id: createDto.supplierId },
        });
        if (!supplier) {
            throw new common_1.NotFoundException(`Supplier with ID ${createDto.supplierId} not found`);
        }
        const poNumber = await (0, sequence_util_1.getNextSequence)(dataSource, 'PURCHASE_ORDER');
        const calculatedTotals = await this.calculateOrderTotals(createDto.items, dataSource, createDto.discountPercentage, createDto.discountAmount);
        const purchaseOrder = poRepo.create({
            id: (0, uuid_1.v4)(),
            poNumber,
            supplierId: createDto.supplierId,
            warehouseId: createDto.warehouseId,
            orderDate: createDto.orderDate || new Date(),
            poDate: createDto.poDate || new Date(),
            expectedDeliveryDate: createDto.expectedDeliveryDate,
            status: enums_1.PurchaseOrderStatus.DRAFT,
            currency: createDto.currency || supplier.currency || 'INR',
            exchangeRate: createDto.exchangeRate || 1,
            subtotal: calculatedTotals.subtotal,
            discountPercentage: createDto.discountPercentage || 0,
            discountAmount: calculatedTotals.discountAmount,
            taxAmount: calculatedTotals.taxAmount,
            shippingAmount: createDto.shippingAmount || 0,
            otherCharges: createDto.otherCharges || 0,
            totalAmount: calculatedTotals.totalAmount +
                (createDto.shippingAmount || 0) +
                (createDto.otherCharges || 0),
            paymentTermsDays: createDto.paymentTermsDays || supplier.paymentTermsDays || 0,
            notes: createDto.notes,
            internalNotes: createDto.internalNotes,
            createdBy,
        });
        const savedPO = await poRepo.save(purchaseOrder);
        await this.createOrderItems(savedPO.id, createDto.items, dataSource);
        return this.findById(savedPO.id);
    }
    async createOrderItems(purchaseOrderId, items, dataSource) {
        const itemRepo = dataSource.getRepository(tenant_1.PurchaseOrderItem);
        const productRepo = dataSource.getRepository(tenant_1.Product);
        for (let i = 0; i < items.length; i++) {
            const itemDto = items[i];
            const product = await productRepo.findOne({
                where: { id: itemDto.productId },
                relations: ['taxCategory', 'taxCategory.taxRates'],
            });
            if (!product) {
                throw new common_1.NotFoundException(`Product with ID ${itemDto.productId} not found`);
            }
            const quantityOrdered = itemDto.quantityOrdered;
            const unitPrice = itemDto.unitPrice || Number(product.costPrice);
            const discountPercent = itemDto.discountPercentage || 0;
            const discountAmt = itemDto.discountAmount || 0;
            const grossAmount = quantityOrdered * unitPrice;
            const lineDiscount = (grossAmount * discountPercent) / 100 + discountAmt;
            const taxableAmount = grossAmount - lineDiscount;
            let taxAmount = 0;
            let taxPercentage = 0;
            if (product.taxCategory?.taxRates) {
                const activeTaxRate = product.taxCategory.taxRates.find((r) => r.isActive);
                if (activeTaxRate) {
                    taxPercentage = Number(activeTaxRate.ratePercentage);
                    taxAmount = (taxableAmount * taxPercentage) / 100;
                }
            }
            const lineTotal = taxableAmount + taxAmount;
            const item = itemRepo.create({
                id: (0, uuid_1.v4)(),
                purchaseOrderId,
                lineNumber: i + 1,
                productId: itemDto.productId,
                variantId: itemDto.variantId,
                productName: product.productName,
                productSku: product.sku,
                quantityOrdered: quantityOrdered,
                uomId: itemDto.uomId || product.baseUomId,
                unitPrice,
                discountPercentage: discountPercent,
                discountAmount: lineDiscount,
                taxPercentage,
                taxAmount,
                lineTotal,
                notes: itemDto.notes,
            });
            await itemRepo.save(item);
        }
    }
    async calculateOrderTotals(items, dataSource, orderDiscountPercent = 0, orderDiscountAmount = 0) {
        let subtotal = 0;
        let totalTax = 0;
        const productRepo = dataSource.getRepository(tenant_1.Product);
        for (const itemDto of items) {
            const product = await productRepo.findOne({
                where: { id: itemDto.productId },
                relations: ['taxCategory', 'taxCategory.taxRates'],
            });
            if (!product)
                continue;
            const unitPrice = itemDto.unitPrice || Number(product.costPrice);
            const quantityOrdered = itemDto.quantityOrdered;
            const discountPercent = itemDto.discountPercentage || 0;
            const discountAmt = itemDto.discountAmount || 0;
            const grossAmount = quantityOrdered * unitPrice;
            const lineDiscount = (grossAmount * discountPercent) / 100 + discountAmt;
            const taxableAmount = grossAmount - lineDiscount;
            subtotal += taxableAmount;
            if (product.taxCategory?.taxRates) {
                const activeTaxRate = product.taxCategory.taxRates.find((r) => r.isActive);
                if (activeTaxRate) {
                    totalTax +=
                        (taxableAmount * Number(activeTaxRate.ratePercentage)) / 100;
                }
            }
        }
        const orderDiscount = (subtotal * orderDiscountPercent) / 100 + orderDiscountAmount;
        const discountedSubtotal = subtotal - orderDiscount;
        if (orderDiscount > 0) {
            const discountRatio = discountedSubtotal / subtotal;
            totalTax = totalTax * discountRatio;
        }
        return {
            subtotal,
            discountAmount: orderDiscount,
            taxAmount: totalTax,
            totalAmount: discountedSubtotal + totalTax,
        };
    }
    async findAll(filterDto) {
        const poRepo = await this.getPurchaseOrderRepository();
        const queryBuilder = poRepo
            .createQueryBuilder('po')
            .leftJoinAndSelect('po.supplier', 'supplier')
            .leftJoinAndSelect('po.warehouse', 'warehouse')
            .leftJoinAndSelect('po.items', 'items')
            .leftJoinAndSelect('items.product', 'product');
        if (filterDto.status) {
            queryBuilder.andWhere('po.status = :status', {
                status: filterDto.status,
            });
        }
        if (filterDto.supplierId) {
            queryBuilder.andWhere('po.supplierId = :supplierId', {
                supplierId: filterDto.supplierId,
            });
        }
        if (filterDto.warehouseId) {
            queryBuilder.andWhere('po.warehouseId = :warehouseId', {
                warehouseId: filterDto.warehouseId,
            });
        }
        if (filterDto.fromDate) {
            queryBuilder.andWhere('po.orderDate >= :fromDate', {
                fromDate: filterDto.fromDate,
            });
        }
        if (filterDto.toDate) {
            queryBuilder.andWhere('po.orderDate <= :toDate', {
                toDate: filterDto.toDate,
            });
        }
        if (filterDto.search) {
            queryBuilder.andWhere('(po.poNumber LIKE :search OR supplier.companyName LIKE :search)', { search: `%${filterDto.search}%` });
        }
        if (!filterDto.sortBy) {
            filterDto.sortBy = 'orderDate';
            filterDto.sortOrder = 'DESC';
        }
        return (0, pagination_util_1.paginate)(queryBuilder, filterDto);
    }
    async findById(id) {
        const poRepo = await this.getPurchaseOrderRepository();
        console.log(`Finding purchase order by ID: ${id}`, {
            po: poRepo,
        });
        const po = await poRepo.findOne({
            where: { id },
            relations: [
                'supplier',
                'warehouse',
                'items',
                'items.product',
                'items.variant',
                'items.uom',
            ],
        });
        if (!po) {
            throw new common_1.NotFoundException(`Purchase order with ID ${id} not found`);
        }
        console.log('Found purchase order', { po: po.items });
        return po;
    }
    async findByNumber(poNumber) {
        const poRepo = await this.getPurchaseOrderRepository();
        return poRepo.findOne({
            where: { poNumber },
            relations: ['supplier', 'items'],
        });
    }
    async update(id, updateDto) {
        const poRepo = await this.getPurchaseOrderRepository();
        const po = await this.findById(id);
        if (![
            enums_1.PurchaseOrderStatus.DRAFT,
            enums_1.PurchaseOrderStatus.PENDING_APPROVAL,
        ].includes(po.status)) {
            throw new common_1.BadRequestException('Only draft or pending approval orders can be updated');
        }
        Object.assign(po, updateDto);
        await poRepo.save(po);
        return this.findById(id);
    }
    async submitForApproval(id, approvalId, userId) {
        const poRepo = await this.getPurchaseOrderRepository();
        const po = await this.findById(id);
        if (po.status !== enums_1.PurchaseOrderStatus.DRAFT) {
            throw new common_1.BadRequestException('Only draft orders can be submitted for approval');
        }
        if (!po.items || po.items.length === 0) {
            throw new common_1.BadRequestException('Purchase order must have at least one item');
        }
        po.approvedBy = userId;
        po.status = enums_1.PurchaseOrderStatus.PENDING_APPROVAL;
        await poRepo.save(po);
        return this.findById(id);
    }
    async approve(id, approverId, approvedBy) {
        const poRepo = await this.getPurchaseOrderRepository();
        const po = await this.findById(id);
        if (po.status !== enums_1.PurchaseOrderStatus.PENDING_APPROVAL) {
            throw new common_1.BadRequestException('Only pending approval orders can be approved');
        }
        po.status = enums_1.PurchaseOrderStatus.APPROVED;
        po.approvedBy = approvedBy;
        po.approvedAt = new Date();
        await poRepo.save(po);
        return this.findById(id);
    }
    async reject(id, rejectedBy, reason) {
        const poRepo = await this.getPurchaseOrderRepository();
        const po = await this.findById(id);
        if (po.status !== enums_1.PurchaseOrderStatus.PENDING_APPROVAL) {
            throw new common_1.BadRequestException('Only pending approval orders can be rejected');
        }
        po.status = enums_1.PurchaseOrderStatus.CANCELLED;
        po.notes = `Rejected by: ${rejectedBy}. Reason: ${reason}`;
        await poRepo.save(po);
        return this.findById(id);
    }
    async sendToSupplier(id, senderId, userId) {
        const poRepo = await this.getPurchaseOrderRepository();
        const po = await this.findById(id);
        if (po.status !== enums_1.PurchaseOrderStatus.APPROVED) {
            throw new common_1.BadRequestException('Only approved orders can be sent to supplier');
        }
        po.status = enums_1.PurchaseOrderStatus.SENT;
        po.sentAt = new Date();
        po.sentBy = userId;
        await poRepo.save(po);
        return this.findById(id);
    }
    async acknowledge(id, acknowledgementNumber) {
        const poRepo = await this.getPurchaseOrderRepository();
        const po = await this.findById(id);
        if (po.status !== enums_1.PurchaseOrderStatus.SENT) {
            throw new common_1.BadRequestException('Only sent orders can be acknowledged');
        }
        po.status = enums_1.PurchaseOrderStatus.ACKNOWLEDGED;
        po.acknowledgedAt = new Date();
        if (acknowledgementNumber) {
            po.supplierReferenceNumber = acknowledgementNumber;
        }
        await poRepo.save(po);
        return this.findById(id);
    }
    async updateReceivedQuantities(id) {
        const poRepo = await this.getPurchaseOrderRepository();
        const dataSource = await this.tenantConnectionManager.getDataSource();
        const po = await this.findById(id);
        let allReceived = true;
        let partiallyReceived = false;
        for (const item of po.items) {
            if (Number(item.quantityReceived) < Number(item.quantityOrdered)) {
                allReceived = false;
            }
            if (Number(item.quantityReceived) > 0) {
                partiallyReceived = true;
            }
        }
        if (allReceived) {
            po.status = enums_1.PurchaseOrderStatus.RECEIVED;
            const dueAmount = Number(po.totalAmount) - Number(po.paidAmount);
            if (dueAmount > 0) {
                const dueDate = new Date();
                dueDate.setDate(dueDate.getDate() + (po.paymentTermsDays || 0));
                const dueRepo = dataSource.getRepository(tenant_1.SupplierDue);
                const due = dueRepo.create({
                    id: (0, uuid_1.v4)(),
                    supplierId: po.supplierId,
                    purchaseOrderId: po.id,
                    dueDate,
                    originalAmount: dueAmount,
                    paidAmount: 0,
                    adjustedAmount: 0,
                    currency: po.currency,
                    status: enums_1.DueStatus.PENDING,
                });
                await dueRepo.save(due);
            }
        }
        else if (partiallyReceived) {
            po.status = enums_1.PurchaseOrderStatus.PARTIALLY_RECEIVED;
        }
        await poRepo.save(po);
        return this.findById(id);
    }
    async close(id) {
        const poRepo = await this.getPurchaseOrderRepository();
        const po = await this.findById(id);
        if (![
            enums_1.PurchaseOrderStatus.RECEIVED,
            enums_1.PurchaseOrderStatus.PARTIALLY_RECEIVED,
        ].includes(po.status)) {
            throw new common_1.BadRequestException('Only received orders can be closed');
        }
        po.status = enums_1.PurchaseOrderStatus.CLOSED;
        await poRepo.save(po);
        return this.findById(id);
    }
    async cancel(id, cancelledBy, reason) {
        const poRepo = await this.getPurchaseOrderRepository();
        const po = await this.findById(id);
        if ([
            enums_1.PurchaseOrderStatus.RECEIVED,
            enums_1.PurchaseOrderStatus.CLOSED,
            enums_1.PurchaseOrderStatus.CANCELLED,
        ].includes(po.status)) {
            throw new common_1.BadRequestException('Cannot cancel received, closed, or already cancelled orders');
        }
        const hasReceivedItems = po.items?.some((item) => Number(item.quantityReceived) > 0);
        if (hasReceivedItems) {
            throw new common_1.BadRequestException('Cannot cancel order with received items');
        }
        po.status = enums_1.PurchaseOrderStatus.CANCELLED;
        po.cancelledAt = new Date();
        po.cancelledBy = cancelledBy;
        po.cancellationReason = reason;
        await poRepo.save(po);
        return this.findById(id);
    }
    async remove(id) {
        const poRepo = await this.getPurchaseOrderRepository();
        const po = await this.findById(id);
        if (po.status !== enums_1.PurchaseOrderStatus.DRAFT) {
            throw new common_1.BadRequestException('Only draft orders can be deleted');
        }
        await poRepo.delete(id);
    }
    async getPendingOrdersForSupplier(supplierId) {
        const poRepo = await this.getPurchaseOrderRepository();
        return poRepo.find({
            where: {
                supplierId,
                status: enums_1.PurchaseOrderStatus.SENT,
            },
            relations: ['items'],
            order: { expectedDate: 'ASC' },
        });
    }
    async getOverdueOrders() {
        const poRepo = await this.getPurchaseOrderRepository();
        const today = new Date();
        return poRepo
            .createQueryBuilder('po')
            .leftJoinAndSelect('po.supplier', 'supplier')
            .where('po.status IN (:...statuses)', {
            statuses: [
                enums_1.PurchaseOrderStatus.SENT,
                enums_1.PurchaseOrderStatus.ACKNOWLEDGED,
                enums_1.PurchaseOrderStatus.PARTIALLY_RECEIVED,
            ],
        })
            .andWhere('po.expectedDeliveryDate < :today', { today })
            .orderBy('po.expectedDeliveryDate', 'ASC')
            .getMany();
    }
};
exports.PurchaseOrdersService = PurchaseOrdersService;
exports.PurchaseOrdersService = PurchaseOrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tenant_connection_manager_1.TenantConnectionManager])
], PurchaseOrdersService);
//# sourceMappingURL=purchase-orders.service.js.map