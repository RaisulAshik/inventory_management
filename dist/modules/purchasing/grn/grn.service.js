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
exports.GrnService = void 0;
const common_1 = require("@nestjs/common");
const uuid_1 = require("uuid");
const tenant_connection_manager_1 = require("../../../database/tenant-connection.manager");
const pagination_util_1 = require("../../../common/utils/pagination.util");
const sequence_util_1 = require("../../../common/utils/sequence.util");
const enums_1 = require("../../../common/enums");
const purchase_orders_service_1 = require("../purchase-orders/purchase-orders.service");
const tenant_1 = require("../../../entities/tenant");
const due_management_1 = require("../../due-management");
const stock_service_1 = require("../../warehouse/stock/stock.service");
let GrnService = class GrnService {
    tenantConnectionManager;
    purchaseOrdersService;
    supplierDuesService;
    stockService;
    constructor(tenantConnectionManager, purchaseOrdersService, supplierDuesService, stockService) {
        this.tenantConnectionManager = tenantConnectionManager;
        this.purchaseOrdersService = purchaseOrdersService;
        this.supplierDuesService = supplierDuesService;
        this.stockService = stockService;
    }
    async getGrnRepository() {
        return this.tenantConnectionManager.getRepository(tenant_1.GoodsReceivedNote);
    }
    async create(createDto, createdBy) {
        const grnRepo = await this.getGrnRepository();
        const dataSource = await this.tenantConnectionManager.getDataSource();
        const po = await this.purchaseOrdersService.findById(createDto.purchaseOrderId);
        if (![
            enums_1.PurchaseOrderStatus.SENT,
            enums_1.PurchaseOrderStatus.ACKNOWLEDGED,
            enums_1.PurchaseOrderStatus.PARTIALLY_RECEIVED,
        ].includes(po.status)) {
            throw new common_1.BadRequestException('Purchase order is not in a receivable status');
        }
        this.validateGrnItems(po, createDto.items);
        const grnNumber = await (0, sequence_util_1.getNextSequence)(dataSource, 'GRN');
        const totals = this.calculateGrnTotals(createDto.items);
        const grn = grnRepo.create({
            id: (0, uuid_1.v4)(),
            grnNumber,
            grnDate: new Date(),
            purchaseOrderId: createDto.purchaseOrderId,
            supplierId: po.supplierId,
            warehouseId: createDto.warehouseId || po.warehouseId,
            receiptDate: createDto.receiptDate || new Date(),
            status: enums_1.GRNStatus.DRAFT,
            supplierInvoiceNumber: createDto.supplierInvoiceNumber,
            supplierInvoiceDate: createDto.supplierInvoiceDate,
            currency: po.currency,
            subtotal: totals.subtotal,
            taxAmount: totals.taxAmount,
            totalAmount: totals.totalAmount,
            notes: createDto.notes,
            createdBy,
        });
        const savedGrn = await grnRepo.save(grn);
        await this.createGrnItems(savedGrn.id, po, createDto.items, dataSource);
        return this.findById(savedGrn.id);
    }
    validateGrnItems(po, items) {
        for (const itemDto of items) {
            const poItem = po.items.find((i) => i.productId === itemDto.productId &&
                (!itemDto.variantId || i.variantId === itemDto.variantId));
            if (!poItem) {
                throw new common_1.BadRequestException(`Product ${itemDto.productId} is not in the purchase order`);
            }
            const pendingQuantity = Number(poItem.quantityOrdered) - (Number(poItem.quantityReceived) || 0);
            if (itemDto.receivedQuantity > pendingQuantity) {
                throw new common_1.BadRequestException(`Cannot receive ${itemDto.receivedQuantity} units of product ${itemDto.productId}. ` +
                    `Only ${pendingQuantity} pending.`);
            }
        }
    }
    calculateGrnTotals(items) {
        let subtotal = 0;
        let taxAmount = 0;
        for (const item of items) {
            const lineSubtotal = (item.receivedQuantity - (item.rejectedQuantity || 0)) * item.unitPrice;
            subtotal += lineSubtotal;
            taxAmount += item.taxAmount || 0;
        }
        return {
            subtotal,
            taxAmount,
            totalAmount: subtotal + taxAmount,
        };
    }
    async createGrnItems(grnId, po, items, dataSource) {
        const itemRepo = dataSource.getRepository(tenant_1.GrnItem);
        for (const itemDto of items) {
            const poItem = po.items.find((pi) => pi.productId === itemDto.productId &&
                (!itemDto.variantId || pi.variantId === itemDto.variantId));
            if (!poItem)
                continue;
            const acceptedQuantity = itemDto.receivedQuantity - (itemDto.rejectedQuantity || 0);
            const lineTotal = acceptedQuantity * (itemDto.unitPrice || Number(poItem.unitPrice));
            const item = itemRepo.create({
                id: (0, uuid_1.v4)(),
                grnId,
                purchaseOrderItemId: poItem.id,
                productId: itemDto.productId,
                variantId: itemDto.variantId,
                quantityReceived: itemDto.receivedQuantity,
                quantityAccepted: acceptedQuantity,
                quantityRejected: itemDto.rejectedQuantity || 0,
                uomId: poItem.uomId,
                unitPrice: itemDto.unitPrice || poItem.unitPrice,
                taxAmount: itemDto.taxAmount || 0,
                lineTotal,
                batchNumber: itemDto.batchNumber,
                manufacturingDate: itemDto.manufacturingDate,
                expiryDate: itemDto.expiryDate,
                locationId: itemDto.locationId,
                rejectionReason: itemDto.rejectionReason,
                notes: itemDto.notes,
            });
            await itemRepo.save(item);
        }
    }
    async findAll(paginationDto, filterDto) {
        const grnRepo = await this.getGrnRepository();
        const queryBuilder = grnRepo
            .createQueryBuilder('grn')
            .leftJoinAndSelect('grn.supplier', 'supplier')
            .leftJoinAndSelect('grn.warehouse', 'warehouse')
            .leftJoinAndSelect('grn.purchaseOrder', 'purchaseOrder')
            .leftJoinAndSelect('grn.items', 'items');
        if (filterDto.status) {
            queryBuilder.andWhere('grn.status = :status', {
                status: filterDto.status,
            });
        }
        if (filterDto.supplierId) {
            queryBuilder.andWhere('grn.supplierId = :supplierId', {
                supplierId: filterDto.supplierId,
            });
        }
        if (filterDto.warehouseId) {
            queryBuilder.andWhere('grn.warehouseId = :warehouseId', {
                warehouseId: filterDto.warehouseId,
            });
        }
        if (filterDto.purchaseOrderId) {
            queryBuilder.andWhere('grn.purchaseOrderId = :purchaseOrderId', {
                purchaseOrderId: filterDto.purchaseOrderId,
            });
        }
        if (filterDto.fromDate) {
            queryBuilder.andWhere('grn.receiptDate >= :fromDate', {
                fromDate: filterDto.fromDate,
            });
        }
        if (filterDto.toDate) {
            queryBuilder.andWhere('grn.receiptDate <= :toDate', {
                toDate: filterDto.toDate,
            });
        }
        if (paginationDto.search) {
            queryBuilder.andWhere('(grn.grnNumber LIKE :search OR grn.supplierInvoiceNumber LIKE :search OR purchaseOrder.poNumber LIKE :search)', { search: `%${paginationDto.search}%` });
        }
        if (!paginationDto.sortBy) {
            paginationDto.sortBy = 'receiptDate';
            paginationDto.sortOrder = 'DESC';
        }
        return (0, pagination_util_1.paginate)(queryBuilder, paginationDto);
    }
    async findById(id) {
        const grnRepo = await this.getGrnRepository();
        const grn = await grnRepo.findOne({
            where: { id },
            relations: [
                'supplier',
                'warehouse',
                'purchaseOrder',
                'items',
                'items.product',
                'items.variant',
                'items.location',
                'items.poItem',
            ],
        });
        if (!grn) {
            throw new common_1.NotFoundException(`GRN with ID ${id} not found`);
        }
        return grn;
    }
    async update(id, updateDto) {
        const grnRepo = await this.getGrnRepository();
        const grn = await this.findById(id);
        if (grn.status !== enums_1.GRNStatus.DRAFT) {
            throw new common_1.BadRequestException('Only draft GRNs can be updated');
        }
        Object.assign(grn, updateDto);
        await grnRepo.save(grn);
        return this.findById(id);
    }
    async submitForApproval(id) {
        const grnRepo = await this.getGrnRepository();
        const grn = await this.findById(id);
        if (grn.status !== enums_1.GRNStatus.DRAFT) {
            throw new common_1.BadRequestException('Only draft GRNs can be submitted');
        }
        if (!grn.items || grn.items.length === 0) {
            throw new common_1.BadRequestException('GRN must have at least one item');
        }
        grn.status = enums_1.GRNStatus.PENDING_QC;
        await grnRepo.save(grn);
        return this.findById(id);
    }
    async completeQc(id, qcBy) {
        const grnRepo = await this.getGrnRepository();
        const grn = await this.findById(id);
        if (grn.status !== enums_1.GRNStatus.PENDING_QC) {
            throw new common_1.BadRequestException('GRN is not pending QC');
        }
        grn.status = enums_1.GRNStatus.QC_PASSED;
        grn.qcAt = new Date();
        grn.qcBy = qcBy;
        await grnRepo.save(grn);
        return this.findById(id);
    }
    async approve(id, userId) {
        const dataSource = await this.tenantConnectionManager.getDataSource();
        const grn = await this.findById(id);
        if (grn.status !== enums_1.GRNStatus.PENDING_QC) {
            throw new common_1.BadRequestException('Only pending GRNs can be approved');
        }
        await dataSource.transaction(async (manager) => {
            const grnRepo = manager.getRepository(tenant_1.GoodsReceivedNote);
            grn.status = enums_1.GRNStatus.ACCEPTED;
            grn.approvedBy = userId;
            grn.approvedAt = new Date();
            await grnRepo.save(grn);
            for (const item of grn.items) {
                await this.stockService.recordMovement({
                    productId: item.productId,
                    variantId: item.variantId,
                    warehouseId: grn.warehouseId,
                    uomId: item.uomId,
                    quantity: item.quantityAccepted,
                    movementType: enums_1.StockMovementType.PURCHASE_RECEIPT,
                    referenceId: grn.id,
                    referenceNumber: grn.grnNumber,
                    unitCost: item.unitPrice,
                    reason: `GRN Approval: ${grn.grnNumber}`,
                }, userId);
            }
            if (grn.totalValue > 0) {
                const dueDate = new Date();
                const paymentTermsDays = grn.purchaseOrder?.paymentTermsDays || 30;
                dueDate.setDate(dueDate.getDate() + paymentTermsDays);
                await this.supplierDuesService.createFromGRN(grn.supplierId, grn.purchaseOrderId, grn.grnNumber, Number(grn.totalValue), dueDate, grn.supplierInvoiceNumber, grn.supplierInvoiceDate, grn.currency || '$');
            }
            if (grn.purchaseOrderId) {
                await this.updatePurchaseOrderReceived(grn.purchaseOrderId, grn, manager);
            }
        });
        return this.findById(id);
    }
    async updatePurchaseOrderReceived(purchaseOrderId, grn, manager) {
        const poItemRepo = manager.getRepository(tenant_1.PurchaseOrderItem);
        for (const grnItem of grn.items) {
            const poItem = await poItemRepo.findOne({
                where: {
                    purchaseOrderId,
                    productId: grnItem.productId,
                    ...(grnItem.variantId && { variantId: grnItem.variantId }),
                },
            });
            if (!poItem)
                continue;
            poItem.quantityReceived =
                Number(poItem.quantityReceived) + Number(grnItem.quantityAccepted);
            await poItemRepo.save(poItem);
        }
        const allItems = await poItemRepo.find({ where: { purchaseOrderId } });
        const allFulfilled = allItems.every((item) => Number(item.quantityReceived) >= Number(item.quantityOrdered));
        const anyReceived = allItems.some((item) => Number(item.quantityReceived) > 0);
        if (allFulfilled || anyReceived) {
            const poRepo = manager.getRepository(tenant_1.PurchaseOrder);
            await poRepo.update(purchaseOrderId, {
                status: allFulfilled
                    ? enums_1.PurchaseOrderStatus.RECEIVED
                    : enums_1.PurchaseOrderStatus.PARTIALLY_RECEIVED,
            });
        }
    }
    async cancel(id, cancelledBy, reason) {
        const grnRepo = await this.getGrnRepository();
        const grn = await this.findById(id);
        if (grn.status === enums_1.GRNStatus.ACCEPTED) {
            throw new common_1.BadRequestException('Cannot cancel approved GRN');
        }
        grn.status = enums_1.GRNStatus.CANCELLED;
        grn.notes = `Cancelled by: ${cancelledBy}. Reason: ${reason}`;
        await grnRepo.save(grn);
        return this.findById(id);
    }
    async remove(id) {
        const grnRepo = await this.getGrnRepository();
        const grn = await this.findById(id);
        if (grn.status !== enums_1.GRNStatus.DRAFT) {
            throw new common_1.BadRequestException('Only draft GRNs can be deleted');
        }
        await grnRepo.delete(id);
    }
    async getGrnsForPurchaseOrder(purchaseOrderId) {
        const grnRepo = await this.getGrnRepository();
        return grnRepo.find({
            where: { purchaseOrderId },
            relations: ['items'],
            order: { receiptDate: 'DESC' },
        });
    }
};
exports.GrnService = GrnService;
exports.GrnService = GrnService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tenant_connection_manager_1.TenantConnectionManager,
        purchase_orders_service_1.PurchaseOrdersService,
        due_management_1.SupplierDuesService,
        stock_service_1.StockService])
], GrnService);
//# sourceMappingURL=grn.service.js.map