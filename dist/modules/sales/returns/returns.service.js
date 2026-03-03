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
exports.ReturnsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const uuid_1 = require("uuid");
const tenant_connection_manager_1 = require("../../../database/tenant-connection.manager");
const sales_return_entity_1 = require("../../../entities/tenant/eCommerce/sales-return.entity");
const sales_return_item_entity_1 = require("../../../entities/tenant/eCommerce/sales-return-item.entity");
const sales_order_entity_1 = require("../../../entities/tenant/eCommerce/sales-order.entity");
const sales_order_item_entity_1 = require("../../../entities/tenant/eCommerce/sales-order-item.entity");
const pagination_util_1 = require("../../../common/utils/pagination.util");
const sequence_util_1 = require("../../../common/utils/sequence.util");
const enums_1 = require("../../../common/enums");
const tenant_1 = require("../../../entities/tenant");
let ReturnsService = class ReturnsService {
    tenantConnectionManager;
    constructor(tenantConnectionManager) {
        this.tenantConnectionManager = tenantConnectionManager;
    }
    async getReturnRepository() {
        return this.tenantConnectionManager.getRepository(sales_return_entity_1.SalesReturn);
    }
    async create(createReturnDto, createdBy) {
        const returnRepo = await this.getReturnRepository();
        const dataSource = await this.tenantConnectionManager.getDataSource();
        const orderRepo = dataSource.getRepository(sales_order_entity_1.SalesOrder);
        const order = await orderRepo.findOne({
            where: { id: createReturnDto.salesOrderId },
            relations: ['items', 'customer'],
        });
        if (!order) {
            throw new common_1.NotFoundException(`Sales order with ID ${createReturnDto.salesOrderId} not found`);
        }
        await this.validateReturnItems(order, createReturnDto.items, dataSource);
        const returnNumber = await (0, sequence_util_1.getNextSequence)(dataSource, 'SALES_RETURN');
        const calculatedTotals = this.calculateReturnTotals(order, createReturnDto.items, createReturnDto.restockingFeePercent || 0);
        const salesReturn = returnRepo.create({
            id: (0, uuid_1.v4)(),
            returnNumber,
            salesOrderId: createReturnDto.salesOrderId,
            customerId: order.customerId,
            warehouseId: createReturnDto.warehouseId || order.warehouseId,
            refundType: createReturnDto.refundType,
            returnDate: createReturnDto.returnDate || new Date(),
            status: sales_return_entity_1.SalesReturnStatus.REQUESTED,
            returnReason: createReturnDto.returnReason,
            reasonDetails: createReturnDto.reasonDetails,
            subtotal: calculatedTotals.subtotal,
            taxAmount: calculatedTotals.taxAmount,
            totalAmount: calculatedTotals.totalAmount,
            refundAmount: 0,
            restockingFee: calculatedTotals.restockingFee,
            internalNotes: createReturnDto.notes,
            createdBy,
        });
        const savedReturn = await returnRepo.save(salesReturn);
        await this.createReturnItems(savedReturn.id, order, createReturnDto.items, dataSource);
        return this.findById(savedReturn.id);
    }
    async validateReturnItems(order, items, dataSource) {
        const existingReturnsRepo = dataSource.getRepository(sales_return_item_entity_1.SalesReturnItem);
        for (const itemDto of items) {
            const orderItem = order.items.find((i) => i.productId === itemDto.productId &&
                (!itemDto.variantId || i.variantId === itemDto.variantId));
            if (!orderItem) {
                throw new common_1.BadRequestException(`Product ${itemDto.productId} was not in the original order`);
            }
            const alreadyReturned = await existingReturnsRepo
                .createQueryBuilder('item')
                .innerJoin('item.salesReturn', 'return')
                .where('return.salesOrderId = :orderId', { orderId: order.id })
                .andWhere('item.productId = :productId', {
                productId: itemDto.productId,
            })
                .andWhere('return.status NOT IN (:...statuses)', {
                statuses: [sales_return_entity_1.SalesReturnStatus.CANCELLED, sales_return_entity_1.SalesReturnStatus.REJECTED],
            })
                .select('SUM(item.quantity)', 'total')
                .getRawOne();
            const returnedQty = parseFloat(alreadyReturned?.total) || 0;
            const availableForReturn = Number(orderItem.quantityOrdered) - returnedQty;
            if (itemDto.quantity > availableForReturn) {
                throw new common_1.BadRequestException(`Cannot return ${itemDto.quantity} units of product ${itemDto.productId}. ` +
                    `Only ${availableForReturn} available for return.`);
            }
        }
    }
    calculateReturnTotals(order, items, restockingFeePercent) {
        let subtotal = 0;
        let taxAmount = 0;
        for (const itemDto of items) {
            const orderItem = order.items.find((i) => i.productId === itemDto.productId &&
                (!itemDto.variantId || i.variantId === itemDto.variantId));
            if (orderItem) {
                const unitPrice = Number(orderItem.unitPrice);
                const quantity = itemDto.quantity;
                const lineSubtotal = unitPrice * quantity;
                const taxRate = Number(orderItem.taxPercentage) || 0;
                const lineTax = (lineSubtotal * taxRate) / 100;
                subtotal += lineSubtotal;
                taxAmount += lineTax;
            }
        }
        const restockingFee = (subtotal * restockingFeePercent) / 100;
        const totalAmount = subtotal + taxAmount - restockingFee;
        return {
            subtotal,
            taxAmount,
            totalAmount,
            restockingFee,
        };
    }
    async createReturnItems(returnId, order, items, dataSource) {
        const itemRepo = dataSource.getRepository(sales_return_item_entity_1.SalesReturnItem);
        for (let i = 0; i < items.length; i++) {
            const itemDto = items[i];
            const orderItem = order.items.find((oi) => oi.productId === itemDto.productId &&
                (!itemDto.variantId || oi.variantId === itemDto.variantId));
            if (!orderItem)
                continue;
            const unitPrice = Number(orderItem.unitPrice);
            const quantity = itemDto.quantity;
            const taxRate = Number(orderItem.taxPercentage) || 0;
            const lineSubtotal = unitPrice * quantity;
            const lineTax = (lineSubtotal * taxRate) / 100;
            const item = itemRepo.create({
                id: (0, uuid_1.v4)(),
                salesReturnId: returnId,
                salesOrderItemId: orderItem.id,
                productId: itemDto.productId,
                variantId: itemDto.variantId,
                quantity,
                uomId: orderItem.uomId,
                unitPrice,
                taxAmount: lineTax,
                lineTotal: lineSubtotal + lineTax,
                reason: itemDto.reason,
                condition: itemDto.condition || sales_return_item_entity_1.ReturnItemCondition.GOOD,
            });
            await itemRepo.save(item);
        }
    }
    async findAll(paginationDto, filterDto) {
        const returnRepo = await this.getReturnRepository();
        const queryBuilder = returnRepo
            .createQueryBuilder('return')
            .leftJoinAndSelect('return.customer', 'customer')
            .leftJoinAndSelect('return.salesOrder', 'salesOrder')
            .leftJoinAndSelect('return.items', 'items');
        if (filterDto.status) {
            queryBuilder.andWhere('return.status = :status', {
                status: filterDto.status,
            });
        }
        if (filterDto.refundType) {
            queryBuilder.andWhere('return.refundType = :refundType', {
                refundType: filterDto.refundType,
            });
        }
        if (filterDto.customerId) {
            queryBuilder.andWhere('return.customerId = :customerId', {
                customerId: filterDto.customerId,
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
            queryBuilder.andWhere('(return.returnNumber LIKE :search OR salesOrder.orderNumber LIKE :search)', { search: `%${paginationDto.search}%` });
        }
        if (!paginationDto.sortBy) {
            paginationDto.sortBy = 'returnDate';
            paginationDto.sortOrder = 'DESC';
        }
        return (0, pagination_util_1.paginate)(queryBuilder, paginationDto);
    }
    async findById(id) {
        const returnRepo = await this.getReturnRepository();
        const salesReturn = await returnRepo.findOne({
            where: { id },
            relations: [
                'customer',
                'salesOrder',
                'warehouse',
                'items',
                'items.product',
                'items.variant',
                'items.salesOrderItem',
            ],
        });
        if (!salesReturn) {
            throw new common_1.NotFoundException(`Return with ID ${id} not found`);
        }
        return salesReturn;
    }
    async update(id, updateReturnDto) {
        const returnRepo = await this.getReturnRepository();
        const salesReturn = await this.findById(id);
        if (salesReturn.status !== sales_return_entity_1.SalesReturnStatus.REQUESTED) {
            throw new common_1.BadRequestException('Only requested returns can be updated');
        }
        Object.assign(salesReturn, updateReturnDto);
        await returnRepo.save(salesReturn);
        return this.findById(id);
    }
    async approve(id, approvedBy) {
        const returnRepo = await this.getReturnRepository();
        const salesReturn = await this.findById(id);
        if (![
            sales_return_entity_1.SalesReturnStatus.REQUESTED,
            sales_return_entity_1.SalesReturnStatus.PENDING_APPROVAL,
        ].includes(salesReturn.status)) {
            throw new common_1.BadRequestException('Only requested or pending approval returns can be approved');
        }
        salesReturn.status = sales_return_entity_1.SalesReturnStatus.APPROVED;
        salesReturn.approvedBy = approvedBy;
        salesReturn.approvedAt = new Date();
        await returnRepo.save(salesReturn);
        return this.findById(id);
    }
    async receive(id, receivedBy) {
        const dataSource = await this.tenantConnectionManager.getDataSource();
        const salesReturn = await this.findById(id);
        if (salesReturn.status !== sales_return_entity_1.SalesReturnStatus.APPROVED) {
            throw new common_1.BadRequestException('Only approved returns can be received');
        }
        await dataSource.transaction(async (manager) => {
            const stockRepo = manager.getRepository(tenant_1.InventoryStock);
            const movementRepo = manager.getRepository(tenant_1.StockMovement);
            const orderItemRepo = manager.getRepository(sales_order_item_entity_1.SalesOrderItem);
            for (const item of salesReturn.items) {
                if (item.condition === sales_return_item_entity_1.ReturnItemCondition.GOOD ||
                    item.condition === sales_return_item_entity_1.ReturnItemCondition.LIKE_NEW) {
                    let stock = await stockRepo.findOne({
                        where: {
                            productId: item.productId,
                            warehouseId: salesReturn.warehouseId,
                            variantId: item.variantId || (0, typeorm_1.IsNull)(),
                        },
                        lock: { mode: 'pessimistic_write' },
                    });
                    if (!stock) {
                        stock = stockRepo.create({
                            id: (0, uuid_1.v4)(),
                            productId: item.productId,
                            warehouseId: salesReturn.warehouseId,
                            variantId: item.variantId,
                            quantityOnHand: 0,
                            quantityReserved: 0,
                            quantityIncoming: 0,
                            quantityOutgoing: 0,
                        });
                    }
                    stock.quantityOnHand += Number(item.quantityReturned);
                    await stockRepo.save(stock);
                    const movement = movementRepo.create({
                        id: (0, uuid_1.v4)(),
                        movementNumber: await (0, sequence_util_1.getNextSequence)(dataSource, 'STOCK_MOVEMENT'),
                        movementType: enums_1.StockMovementType.SALES_RETURN,
                        movementDate: new Date(),
                        productId: item.productId,
                        variantId: item.variantId,
                        toWarehouseId: salesReturn.warehouseId,
                        quantity: Number(item.quantityReturned),
                        uomId: item.uomId,
                        unitCost: item.unitPrice,
                        referenceType: 'SALES_RETURN',
                        referenceId: salesReturn.id,
                        referenceNumber: salesReturn.returnNumber,
                        createdBy: receivedBy,
                    });
                    await movementRepo.save(movement);
                    item.isRestocked = true;
                    item.restockedQuantity = item.quantityReturned;
                    await manager.getRepository(sales_return_item_entity_1.SalesReturnItem).save(item);
                }
                if (item.salesOrderItemId) {
                    const orderItem = await orderItemRepo.findOne({
                        where: { id: item.salesOrderItemId },
                    });
                    if (orderItem) {
                        orderItem.quantityReturned =
                            Number(orderItem.quantityReturned || 0) +
                                Number(item.quantityReturned);
                        await orderItemRepo.save(orderItem);
                    }
                }
            }
            salesReturn.status = sales_return_entity_1.SalesReturnStatus.RECEIVED;
            salesReturn.receivedDate = new Date();
            await manager.getRepository(sales_return_entity_1.SalesReturn).save(salesReturn);
        });
        return this.findById(id);
    }
    async processRefund(id, refundAmount, processedBy) {
        const returnRepo = await this.getReturnRepository();
        const salesReturn = await this.findById(id);
        if (salesReturn.status !== sales_return_entity_1.SalesReturnStatus.RECEIVED) {
            throw new common_1.BadRequestException('Only received returns can be refunded');
        }
        if (refundAmount > Number(salesReturn.totalAmount)) {
            throw new common_1.BadRequestException(`Refund amount cannot exceed total return amount of ${salesReturn.totalAmount}`);
        }
        salesReturn.refundAmount = refundAmount;
        salesReturn.refundedAt = new Date();
        salesReturn.status = sales_return_entity_1.SalesReturnStatus.REFUNDED;
        await returnRepo.save(salesReturn);
        return this.findById(id);
    }
    async complete(id) {
        const returnRepo = await this.getReturnRepository();
        const salesReturn = await this.findById(id);
        if (![sales_return_entity_1.SalesReturnStatus.RECEIVED, sales_return_entity_1.SalesReturnStatus.REFUNDED].includes(salesReturn.status)) {
            throw new common_1.BadRequestException('Return must be received or refunded before completion');
        }
        salesReturn.status = sales_return_entity_1.SalesReturnStatus.COMPLETED;
        await returnRepo.save(salesReturn);
        return this.findById(id);
    }
    async reject(id, rejectedBy, reason) {
        const returnRepo = await this.getReturnRepository();
        const salesReturn = await this.findById(id);
        if (![
            sales_return_entity_1.SalesReturnStatus.REQUESTED,
            sales_return_entity_1.SalesReturnStatus.PENDING_APPROVAL,
        ].includes(salesReturn.status)) {
            throw new common_1.BadRequestException('Only requested or pending approval returns can be rejected');
        }
        salesReturn.status = sales_return_entity_1.SalesReturnStatus.REJECTED;
        salesReturn.internalNotes = reason;
        await returnRepo.save(salesReturn);
        return this.findById(id);
    }
    async cancel(id, cancelledBy, reason) {
        const returnRepo = await this.getReturnRepository();
        const salesReturn = await this.findById(id);
        if ([
            sales_return_entity_1.SalesReturnStatus.RECEIVED,
            sales_return_entity_1.SalesReturnStatus.REFUNDED,
            sales_return_entity_1.SalesReturnStatus.COMPLETED,
        ].includes(salesReturn.status)) {
            throw new common_1.BadRequestException('Cannot cancel return that has been received, refunded, or completed');
        }
        salesReturn.status = sales_return_entity_1.SalesReturnStatus.CANCELLED;
        salesReturn.internalNotes = `Cancelled by: ${cancelledBy}. Reason: ${reason}`;
        await returnRepo.save(salesReturn);
        return this.findById(id);
    }
    async remove(id) {
        const returnRepo = await this.getReturnRepository();
        const salesReturn = await this.findById(id);
        if (salesReturn.status !== sales_return_entity_1.SalesReturnStatus.REQUESTED) {
            throw new common_1.BadRequestException('Only requested returns can be deleted');
        }
        await returnRepo.delete(id);
    }
};
exports.ReturnsService = ReturnsService;
exports.ReturnsService = ReturnsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tenant_connection_manager_1.TenantConnectionManager])
], ReturnsService);
//# sourceMappingURL=returns.service.js.map