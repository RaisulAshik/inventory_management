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
exports.PurchaseReturnsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const uuid_1 = require("uuid");
const tenant_connection_manager_1 = require("../../../database/tenant-connection.manager");
const pagination_util_1 = require("../../../common/utils/pagination.util");
const sequence_util_1 = require("../../../common/utils/sequence.util");
const enums_1 = require("../../../common/enums");
const tenant_1 = require("../../../entities/tenant");
let PurchaseReturnsService = class PurchaseReturnsService {
    tenantConnectionManager;
    constructor(tenantConnectionManager) {
        this.tenantConnectionManager = tenantConnectionManager;
    }
    async getPurchaseReturnRepository() {
        return this.tenantConnectionManager.getRepository(tenant_1.PurchaseReturn);
    }
    async create(createDto, createdBy) {
        const returnRepo = await this.getPurchaseReturnRepository();
        const dataSource = await this.tenantConnectionManager.getDataSource();
        let supplierId;
        let warehouseId;
        let currency;
        if (createDto.grnId) {
            const grnRepo = dataSource.getRepository(tenant_1.GoodsReceivedNote);
            const grn = await grnRepo.findOne({
                where: { id: createDto.grnId },
                relations: ['items'],
            });
            if (!grn) {
                throw new common_1.NotFoundException(`GRN with ID ${createDto.grnId} not found`);
            }
            supplierId = grn.supplierId;
            warehouseId = createDto.warehouseId || grn.warehouseId;
            currency = grn.currency;
            this.validateReturnItemsAgainstGrn(grn, createDto.items);
        }
        else if (createDto.purchaseOrderId) {
            const poRepo = dataSource.getRepository(tenant_1.PurchaseOrder);
            const po = await poRepo.findOne({
                where: { id: createDto.purchaseOrderId },
                relations: ['items'],
            });
            if (!po) {
                throw new common_1.NotFoundException(`Purchase order with ID ${createDto.purchaseOrderId} not found`);
            }
            supplierId = po.supplierId;
            warehouseId = createDto.warehouseId || po.warehouseId;
            currency = po.currency;
            await this.validateReturnItemsAgainstPo(po, createDto.items, dataSource);
        }
        else {
            throw new common_1.BadRequestException('Either GRN ID or Purchase Order ID is required');
        }
        const returnNumber = await (0, sequence_util_1.getNextSequence)(dataSource, 'PURCHASE_RETURN');
        const totals = this.calculateReturnTotals(createDto.items);
        const purchaseReturn = returnRepo.create({
            id: (0, uuid_1.v4)(),
            returnNumber,
            purchaseOrderId: createDto.purchaseOrderId,
            grnId: createDto.grnId,
            supplierId,
            warehouseId,
            returnDate: createDto.returnDate || new Date(),
            status: tenant_1.PurchaseReturnStatus.DRAFT,
            returnType: createDto.returnType,
            reason: createDto.reason,
            reasonDetails: createDto.reasonDetails,
            currency,
            subtotal: totals.subtotal,
            taxAmount: totals.taxAmount,
            totalAmount: totals.totalAmount,
            notes: createDto.notes,
            createdBy,
        });
        const savedReturn = await returnRepo.save(purchaseReturn);
        await this.createReturnItems(savedReturn.id, createDto.items, dataSource);
        return this.findById(savedReturn.id);
    }
    validateReturnItemsAgainstGrn(grn, items) {
        for (const itemDto of items) {
            const grnItem = grn.items.find((i) => i.productId === itemDto.productId &&
                (!itemDto.variantId || i.variantId === itemDto.variantId));
            if (!grnItem) {
                throw new common_1.BadRequestException(`Product ${itemDto.productId} was not in the GRN`);
            }
            const returnableQty = Number(grnItem.quantityAccepted) -
                (Number(grnItem.quantityRejected) || 0);
            if (itemDto.quantity > returnableQty) {
                throw new common_1.BadRequestException(`Cannot return ${itemDto.quantity} units of product ${itemDto.productId}. ` +
                    `Only ${returnableQty} available for return.`);
            }
        }
    }
    async validateReturnItemsAgainstPo(po, items, dataSource) {
        const existingReturnsRepo = dataSource.getRepository(tenant_1.PurchaseReturnItem);
        for (const itemDto of items) {
            const poItem = po.items.find((i) => i.productId === itemDto.productId &&
                (!itemDto.variantId || i.variantId === itemDto.variantId));
            if (!poItem) {
                throw new common_1.BadRequestException(`Product ${itemDto.productId} was not in the purchase order`);
            }
            const alreadyReturned = await existingReturnsRepo
                .createQueryBuilder('item')
                .innerJoin('item.purchaseReturn', 'return')
                .where('return.purchaseOrderId = :poId', { poId: po.id })
                .andWhere('item.productId = :productId', {
                productId: itemDto.productId,
            })
                .andWhere('return.status NOT IN (:...statuses)', {
                statuses: [
                    tenant_1.PurchaseReturnStatus.CANCELLED,
                    tenant_1.PurchaseReturnStatus.REJECTED,
                ],
            })
                .select('SUM(item.quantity)', 'total')
                .getRawOne();
            const returnedQty = parseFloat(alreadyReturned?.total) || 0;
            const receivedQty = Number(poItem.quantityReceived) || 0;
            const availableForReturn = receivedQty - returnedQty;
            if (itemDto.quantity > availableForReturn) {
                throw new common_1.BadRequestException(`Cannot return ${itemDto.quantity} units of product ${itemDto.productId}. ` +
                    `Only ${availableForReturn} available for return.`);
            }
        }
    }
    calculateReturnTotals(items) {
        let subtotal = 0;
        let taxAmount = 0;
        for (const item of items) {
            const lineSubtotal = item.quantity * item.unitPrice;
            subtotal += lineSubtotal;
            taxAmount += item.taxAmount || 0;
        }
        return {
            subtotal,
            taxAmount,
            totalAmount: subtotal + taxAmount,
        };
    }
    async createReturnItems(returnId, items, dataSource) {
        const itemRepo = dataSource.getRepository(tenant_1.PurchaseReturnItem);
        for (let i = 0; i < items.length; i++) {
            const itemDto = items[i];
            const lineTotal = itemDto.quantity * itemDto.unitPrice + (itemDto.taxAmount || 0);
            const item = itemRepo.create({
                id: (0, uuid_1.v4)(),
                purchaseReturnId: returnId,
                productId: itemDto.productId,
                variantId: itemDto.variantId,
                quantity: itemDto.quantity,
                uomId: itemDto.uomId,
                unitPrice: itemDto.unitPrice,
                taxAmount: itemDto.taxAmount || 0,
                lineTotal,
                reason: itemDto.reason,
                condition: itemDto.condition || 'DAMAGED',
            });
            await itemRepo.save(item);
        }
    }
    async findAll(paginationDto, filterDto) {
        const returnRepo = await this.getPurchaseReturnRepository();
        const queryBuilder = returnRepo
            .createQueryBuilder('return')
            .leftJoinAndSelect('return.supplier', 'supplier')
            .leftJoinAndSelect('return.warehouse', 'warehouse')
            .leftJoinAndSelect('return.purchaseOrder', 'purchaseOrder')
            .leftJoinAndSelect('return.grn', 'grn')
            .leftJoinAndSelect('return.items', 'items');
        if (filterDto.status) {
            queryBuilder.andWhere('return.status = :status', {
                status: filterDto.status,
            });
        }
        if (filterDto.supplierId) {
            queryBuilder.andWhere('return.supplierId = :supplierId', {
                supplierId: filterDto.supplierId,
            });
        }
        if (filterDto.warehouseId) {
            queryBuilder.andWhere('return.warehouseId = :warehouseId', {
                warehouseId: filterDto.warehouseId,
            });
        }
        if (filterDto.fromDate) {
            queryBuilder.andWhere('return.returnDate >= :fromDate', {
                fromDate: filterDto.fromDate,
            });
        }
        if (filterDto.toDate) {
            queryBuilder.andWhere('return.returnDate <= :toDate', {
                toDate: filterDto.toDate,
            });
        }
        if (paginationDto.search) {
            queryBuilder.andWhere('(return.returnNumber LIKE :search OR purchaseOrder.poNumber LIKE :search OR supplier.companyName LIKE :search)', { search: `%${paginationDto.search}%` });
        }
        if (!paginationDto.sortBy) {
            paginationDto.sortBy = 'returnDate';
            paginationDto.sortOrder = 'DESC';
        }
        return (0, pagination_util_1.paginate)(queryBuilder, paginationDto);
    }
    async findById(id) {
        const returnRepo = await this.getPurchaseReturnRepository();
        const purchaseReturn = await returnRepo.findOne({
            where: { id },
            relations: [
                'supplier',
                'warehouse',
                'purchaseOrder',
                'grn',
                'items',
                'items.product',
                'items.variant',
            ],
        });
        if (!purchaseReturn) {
            throw new common_1.NotFoundException(`Purchase return with ID ${id} not found`);
        }
        return purchaseReturn;
    }
    async update(id, updateDto) {
        const returnRepo = await this.getPurchaseReturnRepository();
        const purchaseReturn = await this.findById(id);
        if (purchaseReturn.status !== tenant_1.PurchaseReturnStatus.DRAFT) {
            throw new common_1.BadRequestException('Only draft returns can be updated');
        }
        Object.assign(purchaseReturn, updateDto);
        await returnRepo.save(purchaseReturn);
        return this.findById(id);
    }
    async submitForApproval(id) {
        const returnRepo = await this.getPurchaseReturnRepository();
        const purchaseReturn = await this.findById(id);
        if (purchaseReturn.status !== tenant_1.PurchaseReturnStatus.DRAFT) {
            throw new common_1.BadRequestException('Only draft returns can be submitted');
        }
        if (!purchaseReturn.items || purchaseReturn.items.length === 0) {
            throw new common_1.BadRequestException('Return must have at least one item');
        }
        purchaseReturn.status = tenant_1.PurchaseReturnStatus.PENDING_APPROVAL;
        await returnRepo.save(purchaseReturn);
        return this.findById(id);
    }
    async approve(id, approvedBy) {
        const returnRepo = await this.getPurchaseReturnRepository();
        const purchaseReturn = await this.findById(id);
        if (purchaseReturn.status !== tenant_1.PurchaseReturnStatus.PENDING_APPROVAL) {
            throw new common_1.BadRequestException('Only pending returns can be approved');
        }
        purchaseReturn.status = tenant_1.PurchaseReturnStatus.APPROVED;
        purchaseReturn.approvedBy = approvedBy;
        purchaseReturn.approvedAt = new Date();
        await returnRepo.save(purchaseReturn);
        return this.findById(id);
    }
    async ship(id, shippedBy, trackingNumber) {
        const dataSource = await this.tenantConnectionManager.getDataSource();
        const purchaseReturn = await this.findById(id);
        if (purchaseReturn.status !== tenant_1.PurchaseReturnStatus.APPROVED) {
            throw new common_1.BadRequestException('Only approved returns can be shipped');
        }
        await dataSource.transaction(async (manager) => {
            const stockRepo = manager.getRepository(tenant_1.InventoryStock);
            const movementRepo = manager.getRepository(tenant_1.StockMovement);
            for (const item of purchaseReturn.items) {
                const stock = await stockRepo.findOne({
                    where: {
                        productId: item.productId,
                        warehouseId: purchaseReturn.warehouseId,
                        variantId: item.variantId || (0, typeorm_1.IsNull)(),
                    },
                    lock: { mode: 'pessimistic_write' },
                });
                if (stock) {
                    if (Number(stock.quantityOnHand) < Number(item.quantity)) {
                        throw new common_1.BadRequestException(`Insufficient stock for product ${item.product?.productName}`);
                    }
                    stock.quantityOnHand -= Number(item.quantity);
                    await stockRepo.save(stock);
                }
                const movement = movementRepo.create({
                    id: (0, uuid_1.v4)(),
                    movementNumber: await (0, sequence_util_1.getNextSequence)(dataSource, 'STOCK_MOVEMENT'),
                    movementType: enums_1.StockMovementType.PURCHASE_RETURN,
                    movementDate: new Date(),
                    productId: item.productId,
                    variantId: item.variantId,
                    fromWarehouseId: purchaseReturn.warehouseId,
                    quantity: Number(item.quantity),
                    uomId: item.uomId,
                    unitCost: item.unitPrice,
                    referenceType: 'PURCHASE_RETURN',
                    referenceId: purchaseReturn.id,
                    referenceNumber: purchaseReturn.returnNumber,
                    createdBy: shippedBy,
                });
                await movementRepo.save(movement);
            }
            purchaseReturn.status = tenant_1.PurchaseReturnStatus.SHIPPED;
            purchaseReturn.shippedBy = shippedBy;
            purchaseReturn.shippedAt = new Date();
            if (trackingNumber) {
                purchaseReturn.trackingNumber = trackingNumber;
            }
            await manager.getRepository(tenant_1.PurchaseReturn).save(purchaseReturn);
        });
        return this.findById(id);
    }
    async confirmReceipt(id) {
        const returnRepo = await this.getPurchaseReturnRepository();
        const purchaseReturn = await this.findById(id);
        if (purchaseReturn.status !== tenant_1.PurchaseReturnStatus.SHIPPED) {
            throw new common_1.BadRequestException('Only shipped returns can be confirmed as received');
        }
        purchaseReturn.status = tenant_1.PurchaseReturnStatus.RECEIVED_BY_SUPPLIER;
        purchaseReturn.receivedBySupplierAt = new Date();
        await returnRepo.save(purchaseReturn);
        return this.findById(id);
    }
    async processCreditNote(id, creditNoteNumber, creditAmount, processedBy) {
        const dataSource = await this.tenantConnectionManager.getDataSource();
        const purchaseReturn = await this.findById(id);
        if (purchaseReturn.status !== tenant_1.PurchaseReturnStatus.RECEIVED_BY_SUPPLIER) {
            throw new common_1.BadRequestException('Credit note can only be processed after supplier receives the return');
        }
        if (creditAmount > Number(purchaseReturn.totalAmount)) {
            throw new common_1.BadRequestException(`Credit amount cannot exceed return total of ${purchaseReturn.totalAmount}`);
        }
        await dataSource.transaction(async (manager) => {
            purchaseReturn.creditNoteNumber = creditNoteNumber;
            purchaseReturn.creditNoteAmount = creditAmount;
            purchaseReturn.creditNoteDate = new Date();
            purchaseReturn.updatedBy = processedBy;
            purchaseReturn.status = tenant_1.PurchaseReturnStatus.CREDIT_NOTE_RECEIVED;
            await manager.getRepository(tenant_1.PurchaseReturn).save(purchaseReturn);
            const dueRepo = manager.getRepository(tenant_1.SupplierDue);
            if (purchaseReturn.purchaseOrderId) {
                const existingDue = await dueRepo.findOne({
                    where: { purchaseOrderId: purchaseReturn.purchaseOrderId },
                });
                if (existingDue) {
                    existingDue.adjustedAmount =
                        Number(existingDue.adjustedAmount) + creditAmount;
                    const remaining = Number(existingDue.originalAmount) -
                        Number(existingDue.paidAmount) -
                        Number(existingDue.adjustedAmount);
                    if (remaining <= 0) {
                        existingDue.status = enums_1.DueStatus.PAID;
                    }
                    await dueRepo.save(existingDue);
                }
            }
        });
        return this.findById(id);
    }
    async complete(id) {
        const returnRepo = await this.getPurchaseReturnRepository();
        const purchaseReturn = await this.findById(id);
        if (purchaseReturn.status !== tenant_1.PurchaseReturnStatus.CREDIT_NOTE_RECEIVED) {
            throw new common_1.BadRequestException('Return must have credit note before completion');
        }
        purchaseReturn.status = tenant_1.PurchaseReturnStatus.COMPLETED;
        await returnRepo.save(purchaseReturn);
        return this.findById(id);
    }
    async reject(id, rejectedBy, reason) {
        const returnRepo = await this.getPurchaseReturnRepository();
        const purchaseReturn = await this.findById(id);
        if (purchaseReturn.status !== tenant_1.PurchaseReturnStatus.PENDING_APPROVAL) {
            throw new common_1.BadRequestException('Only pending returns can be rejected');
        }
        purchaseReturn.status = tenant_1.PurchaseReturnStatus.REJECTED;
        purchaseReturn.rejectionReason = reason;
        await returnRepo.save(purchaseReturn);
        return this.findById(id);
    }
    async cancel(id, cancelledBy, reason) {
        const returnRepo = await this.getPurchaseReturnRepository();
        const purchaseReturn = await this.findById(id);
        if ([
            tenant_1.PurchaseReturnStatus.SHIPPED,
            tenant_1.PurchaseReturnStatus.RECEIVED_BY_SUPPLIER,
            tenant_1.PurchaseReturnStatus.CREDIT_NOTE_RECEIVED,
            tenant_1.PurchaseReturnStatus.COMPLETED,
        ].includes(purchaseReturn.status)) {
            throw new common_1.BadRequestException('Cannot cancel return that has been shipped or completed');
        }
        purchaseReturn.status = tenant_1.PurchaseReturnStatus.CANCELLED;
        purchaseReturn.notes = `Cancelled by: ${cancelledBy}. Reason: ${reason}`;
        await returnRepo.save(purchaseReturn);
        return this.findById(id);
    }
    async remove(id) {
        const returnRepo = await this.getPurchaseReturnRepository();
        const purchaseReturn = await this.findById(id);
        if (purchaseReturn.status !== tenant_1.PurchaseReturnStatus.DRAFT) {
            throw new common_1.BadRequestException('Only draft returns can be deleted');
        }
        await returnRepo.delete(id);
    }
};
exports.PurchaseReturnsService = PurchaseReturnsService;
exports.PurchaseReturnsService = PurchaseReturnsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tenant_connection_manager_1.TenantConnectionManager])
], PurchaseReturnsService);
//# sourceMappingURL=purchase-returns.service.js.map