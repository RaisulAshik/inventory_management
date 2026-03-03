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
exports.OrdersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const uuid_1 = require("uuid");
const tenant_connection_manager_1 = require("../../../database/tenant-connection.manager");
const pagination_util_1 = require("../../../common/utils/pagination.util");
const sequence_util_1 = require("../../../common/utils/sequence.util");
const enums_1 = require("../../../common/enums");
const stock_service_1 = require("../../warehouse/stock/stock.service");
const price_lists_service_1 = require("../../inventory/price-lists/price-lists.service");
const tenant_1 = require("../../../entities/tenant");
const due_management_1 = require("../../due-management");
let OrdersService = class OrdersService {
    tenantConnectionManager;
    stockService;
    priceListsService;
    customerDuesService;
    constructor(tenantConnectionManager, stockService, priceListsService, customerDuesService) {
        this.tenantConnectionManager = tenantConnectionManager;
        this.stockService = stockService;
        this.priceListsService = priceListsService;
        this.customerDuesService = customerDuesService;
    }
    async getOrderRepository() {
        return this.tenantConnectionManager.getRepository(tenant_1.SalesOrder);
    }
    getPaymentStatus(paidAmount, totalAmount) {
        if (paidAmount <= 0)
            return enums_1.PaymentStatus.UNPAID;
        if (paidAmount >= totalAmount)
            return enums_1.PaymentStatus.PAID;
        return enums_1.PaymentStatus.PARTIALLY_PAID;
    }
    async create(createOrderDto, createdBy) {
        const orderRepo = await this.getOrderRepository();
        const dataSource = await this.tenantConnectionManager.getDataSource();
        const customerRepo = dataSource.getRepository(tenant_1.Customer);
        const customer = await customerRepo.findOne({
            where: { id: createOrderDto.customerId },
            relations: ['addresses'],
        });
        if (!customer) {
            throw new common_1.NotFoundException(`Customer with ID ${createOrderDto.customerId} not found`);
        }
        const orderNumber = await (0, sequence_util_1.getNextSequence)(dataSource, 'SALES_ORDER');
        const calculatedTotals = await this.calculateOrderTotals(createOrderDto.items, createOrderDto.discountPercentage, createOrderDto.discountAmount, customer.priceListId, dataSource);
        const order = orderRepo.create({
            id: (0, uuid_1.v4)(),
            orderNumber,
            customerId: createOrderDto.customerId,
            warehouseId: createOrderDto.warehouseId,
            orderDate: createOrderDto.orderDate || new Date(),
            expectedDeliveryDate: createOrderDto.expectedDeliveryDate,
            status: enums_1.SalesOrderStatus.PENDING,
            currency: createOrderDto.currency || customer.currency || 'BDT',
            exchangeRate: createOrderDto.exchangeRate || 1,
            subtotal: calculatedTotals.subtotal,
            discountPercentage: createOrderDto.discountPercentage || 0,
            discountAmount: calculatedTotals.discountAmount,
            taxAmount: calculatedTotals.taxAmount,
            shippingAmount: createOrderDto.shippingAmount || 0,
            totalAmount: calculatedTotals.totalAmount + (createOrderDto.shippingAmount || 0),
            paidAmount: 0,
            billingName: createOrderDto.billingAddress?.name ||
                createOrderDto.shippingAddress?.name ||
                customer.firstName + ' ' + customer.lastName,
            billingPhone: createOrderDto.billingAddress?.phone ||
                createOrderDto.shippingAddress?.phone ||
                customer.phone,
            billingAddressLine1: createOrderDto.billingAddress?.addressLine1 ||
                createOrderDto.shippingAddress?.addressLine1 ||
                customer.addresses[0]?.addressLine1,
            billingAddressLine2: createOrderDto.billingAddress?.addressLine2 ||
                createOrderDto.shippingAddress?.addressLine2 ||
                customer.addresses[0]?.addressLine2,
            billingCity: createOrderDto.billingAddress?.city ||
                createOrderDto.shippingAddress?.city ||
                customer.addresses[0]?.city,
            billingState: createOrderDto.billingAddress?.state ||
                createOrderDto.shippingAddress?.state ||
                customer.addresses[0]?.state,
            billingCountry: createOrderDto.billingAddress?.country ||
                createOrderDto.shippingAddress?.country ||
                customer.addresses[0]?.country,
            billingPostalCode: createOrderDto.billingAddress?.postalCode ||
                createOrderDto.shippingAddress?.postalCode ||
                customer.addresses[0]?.postalCode,
            shippingName: createOrderDto.shippingAddress?.name,
            shippingPhone: createOrderDto.shippingAddress?.phone,
            shippingAddressLine1: createOrderDto.shippingAddress?.addressLine1,
            shippingAddressLine2: createOrderDto.shippingAddress?.addressLine2,
            shippingCity: createOrderDto.shippingAddress?.city,
            shippingState: createOrderDto.shippingAddress?.state,
            shippingCountry: createOrderDto.shippingAddress?.country,
            shippingPostalCode: createOrderDto.shippingAddress?.postalCode,
            customerNotes: createOrderDto.notes,
            internalNotes: createOrderDto.internalNotes,
            createdBy,
        });
        const savedOrder = await orderRepo.save(order);
        await this.createOrderItems(savedOrder.id, createOrderDto.items, dataSource);
        return this.findById(savedOrder.id);
    }
    async createOrderItems(orderId, items, dataSource) {
        const itemRepo = dataSource.getRepository(tenant_1.SalesOrderItem);
        const productRepo = dataSource.getRepository(tenant_1.Product);
        for (const itemDto of items) {
            const product = await productRepo.findOne({
                where: { id: itemDto.productId },
                relations: ['taxCategory', 'taxCategory.taxRates'],
            });
            if (!product) {
                throw new common_1.NotFoundException(`Product with ID ${itemDto.productId} not found`);
            }
            console.log('Processing item: ', product);
            const quantity = itemDto.quantity;
            const unitPrice = itemDto.unitPrice || Number(product.sellingPrice);
            const discountPercent = itemDto.discountPercentage || 0;
            const discountAmt = itemDto.discountAmount || 0;
            const grossAmount = quantity * unitPrice;
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
                salesOrderId: orderId,
                productId: itemDto.productId,
                variantId: itemDto.variantId,
                productName: product.productName,
                sku: product.sku,
                quantityOrdered: quantity,
                uomId: itemDto.uomId || product.baseUomId,
                unitPrice,
                originalPrice: Number(product.sellingPrice),
                costPrice: Number(product.costPrice),
                discountPercentage: discountPercent,
                discountAmount: lineDiscount,
                taxPercentage,
                taxAmount,
                lineTotal,
                notes: itemDto.notes,
            });
            console.log('Saving item: ', item);
            await itemRepo.save(item);
        }
    }
    async calculateOrderTotals(items, orderDiscountPercent = 0, orderDiscountAmount = 0, priceListId, dataSource) {
        if (!dataSource) {
            throw new Error('DataSource is required for calculating order totals');
        }
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
            let unitPrice = itemDto.unitPrice;
            if (!unitPrice && priceListId) {
                unitPrice = await this.priceListsService.getProductPrice(priceListId, itemDto.productId, itemDto.quantity, itemDto.variantId);
            }
            if (!unitPrice) {
                unitPrice = Number(product.sellingPrice);
            }
            const quantity = itemDto.quantity;
            const discountPercent = itemDto.discountPercentage || 0;
            const discountAmt = itemDto.discountAmount || 0;
            const grossAmount = quantity * unitPrice;
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
        const orderRepo = await this.getOrderRepository();
        const queryBuilder = orderRepo
            .createQueryBuilder('order')
            .leftJoinAndSelect('order.customer', 'customer')
            .leftJoinAndSelect('order.warehouse', 'warehouse')
            .leftJoinAndSelect('order.items', 'items');
        if (filterDto.status) {
            queryBuilder.andWhere('order.status = :status', {
                status: filterDto.status,
            });
        }
        if (filterDto.customerId) {
            queryBuilder.andWhere('order.customerId = :customerId', {
                customerId: filterDto.customerId,
            });
        }
        if (filterDto.warehouseId) {
            queryBuilder.andWhere('order.warehouseId = :warehouseId', {
                warehouseId: filterDto.warehouseId,
            });
        }
        if (filterDto.fromDate) {
            queryBuilder.andWhere('order.orderDate >= :fromDate', {
                fromDate: filterDto.fromDate,
            });
        }
        if (filterDto.toDate) {
            queryBuilder.andWhere('order.orderDate <= :toDate', {
                toDate: filterDto.toDate,
            });
        }
        if (filterDto.paymentStatus) {
            switch (filterDto.paymentStatus) {
                case 'PAID':
                    queryBuilder.andWhere('order.paidAmount >= order.totalAmount');
                    break;
                case 'UNPAID':
                    queryBuilder.andWhere('order.paidAmount = 0');
                    break;
                case 'PARTIAL':
                    queryBuilder.andWhere('order.paidAmount > 0 AND order.paidAmount < order.totalAmount');
                    break;
            }
        }
        if (filterDto.search) {
            queryBuilder.andWhere('(order.orderNumber LIKE :search OR customer.firstName LIKE :search OR customer.lastName LIKE :search OR customer.companyName LIKE :search)', { search: `%${filterDto.search}%` });
        }
        if (!filterDto.sortBy) {
            filterDto.sortBy = 'orderDate';
            filterDto.sortOrder = 'DESC';
        }
        return (0, pagination_util_1.paginate)(queryBuilder, filterDto);
    }
    async findById(id) {
        const orderRepo = await this.getOrderRepository();
        const order = await orderRepo.findOne({
            where: { id },
            relations: [
                'customer',
                'warehouse',
                'items',
                'items.product',
                'items.variant',
                'items.uom',
                'payments',
                'payments.paymentMethod',
            ],
        });
        if (!order) {
            throw new common_1.NotFoundException(`Order with ID ${id} not found`);
        }
        return order;
    }
    async findByNumber(orderNumber) {
        const orderRepo = await this.getOrderRepository();
        return orderRepo.findOne({
            where: { orderNumber },
            relations: ['customer', 'items'],
        });
    }
    async update(id, updateOrderDto) {
        const orderRepo = await this.getOrderRepository();
        const order = await this.findById(id);
        if (![enums_1.SalesOrderStatus.DRAFT, enums_1.SalesOrderStatus.PENDING].includes(order.status)) {
            throw new common_1.BadRequestException('Only draft or pending orders can be updated');
        }
        Object.assign(order, updateOrderDto);
        await orderRepo.save(order);
        return this.findById(id);
    }
    async confirm(id, userId) {
        const orderRepo = await this.getOrderRepository();
        const order = await this.findById(id);
        if (order.status !== enums_1.SalesOrderStatus.DRAFT &&
            order.status !== enums_1.SalesOrderStatus.PENDING) {
            throw new common_1.BadRequestException('Only draft or pending orders can be confirmed');
        }
        const stockIssues = await this.validateStockAvailability(order);
        if (stockIssues.length > 0) {
            throw new common_1.BadRequestException({
                message: 'Insufficient stock for some items',
                stockIssues,
            });
        }
        await this.reserveStock(order);
        order.status = enums_1.SalesOrderStatus.CONFIRMED;
        order.confirmedAt = new Date();
        order.confirmedBy = userId;
        await orderRepo.save(order);
        return this.findById(id);
    }
    async validateStockAvailability(order) {
        const issues = [];
        for (const item of order.items) {
            if (item.product?.isStockable) {
                const available = await this.stockService.getAvailableQuantity(item.productId, order.warehouseId, item.variantId);
                if (available < item.quantityOrdered) {
                    issues.push({
                        productId: item.productId,
                        variantId: item.variantId,
                        warehouseId: order.warehouseId,
                        quantityOnHand: available + (item.quantityOrdered - available),
                        quantityReserved: item.quantityOrdered - available,
                        quantityAvailable: available,
                        isAvailable: false,
                        shortfall: item.quantityOrdered - available,
                    });
                }
            }
        }
        return issues;
    }
    async reserveStock(order) {
        for (const item of order.items) {
            if (item.product?.isStockable) {
                await this.stockService.reserveStock(item.productId, order.warehouseId, Number(item.quantityOrdered), item.variantId);
            }
        }
    }
    async process(id, userId) {
        const orderRepo = await this.getOrderRepository();
        const order = await this.findById(id);
        if (order.status !== enums_1.SalesOrderStatus.CONFIRMED) {
            throw new common_1.BadRequestException('Only confirmed orders can be processed');
        }
        order.status = enums_1.SalesOrderStatus.PROCESSING;
        await orderRepo.save(order);
        return this.findById(id);
    }
    async ship(id, userId, shippingDetails) {
        const dataSource = await this.tenantConnectionManager.getDataSource();
        const order = await this.findById(id);
        if (![enums_1.SalesOrderStatus.PROCESSING, enums_1.SalesOrderStatus.READY_TO_SHIP].includes(order.status)) {
            throw new common_1.BadRequestException('Order is not ready to be shipped');
        }
        await dataSource.transaction(async (manager) => {
            const stockRepo = manager.getRepository(tenant_1.InventoryStock);
            const movementRepo = manager.getRepository(tenant_1.StockMovement);
            for (const item of order.items) {
                if (item.product?.isStockable) {
                    const stock = await stockRepo.findOne({
                        where: {
                            productId: item.productId,
                            warehouseId: order.warehouseId,
                            variantId: item.variantId || (0, typeorm_1.IsNull)(),
                        },
                        lock: { mode: 'pessimistic_write' },
                    });
                    if (stock) {
                        stock.quantityOnHand -= Number(item.quantityOrdered);
                        stock.quantityReserved -= Number(item.quantityOrdered);
                        await stockRepo.save(stock);
                    }
                    const movement = movementRepo.create({
                        id: (0, uuid_1.v4)(),
                        movementNumber: await (0, sequence_util_1.getNextSequence)(dataSource, 'STOCK_MOVEMENT'),
                        movementType: enums_1.StockMovementType.SALES,
                        movementDate: new Date(),
                        productId: item.productId,
                        variantId: item.variantId,
                        fromWarehouseId: order.warehouseId,
                        quantity: Number(item.quantityOrdered),
                        uomId: item.uomId,
                        unitCost: item.costPrice,
                        referenceType: 'SALES_ORDER',
                        referenceId: order.id,
                        referenceNumber: order.orderNumber,
                        createdBy: userId,
                    });
                    await movementRepo.save(movement);
                }
                item.quantityShipped = item.quantityOrdered;
                await manager.getRepository(tenant_1.SalesOrderItem).save(item);
            }
            order.status = enums_1.SalesOrderStatus.SHIPPED;
            order.shippedAt = shippingDetails.shippingDate || new Date();
            order.shippedBy = userId;
            if (shippingDetails.trackingNumber) {
                order.trackingNumber = shippingDetails.trackingNumber;
            }
            if (shippingDetails.carrier) {
                order.shippingCarrier = shippingDetails.carrier;
            }
            await manager.getRepository(tenant_1.SalesOrder).save(order);
        });
        return this.findById(id);
    }
    async deliver(id, userId) {
        const dataSource = await this.tenantConnectionManager.getDataSource();
        const order = await this.findById(id);
        if (order.status !== enums_1.SalesOrderStatus.SHIPPED) {
            throw new common_1.BadRequestException('Only shipped orders can be marked as delivered');
        }
        await dataSource.transaction(async (manager) => {
            order.paymentStatus = this.getPaymentStatus(Number(order.paidAmount), Number(order.totalAmount));
            order.status = enums_1.SalesOrderStatus.DELIVERED;
            order.deliveredAt = new Date();
            await manager.getRepository(tenant_1.SalesOrder).save(order);
            const dueAmount = Number(order.totalAmount) - Number(order.paidAmount);
            if (dueAmount > 0) {
                const dueDate = new Date();
                dueDate.setDate(dueDate.getDate() + (order.paymentTermsDays || 30));
                await this.customerDuesService.createFromOrder(order.customerId, order.id, order.orderNumber, dueAmount, dueDate, order.currency);
            }
            const customerRepo = manager.getRepository(tenant_1.Customer);
            await customerRepo.increment({ id: order.customerId }, 'totalOrders', 1);
            await customerRepo.increment({ id: order.customerId }, 'totalPurchases', Number(order.totalAmount));
            await customerRepo.update(order.customerId, {
                lastOrderDate: order.orderDate,
            });
        });
        return this.findById(id);
    }
    async complete(id) {
        const orderRepo = await this.getOrderRepository();
        const order = await this.findById(id);
        if (order.status !== enums_1.SalesOrderStatus.DELIVERED) {
            throw new common_1.BadRequestException('Only delivered orders can be completed');
        }
        order.status = enums_1.SalesOrderStatus.COMPLETED;
        order.paymentStatus = this.getPaymentStatus(Number(order.paidAmount), Number(order.totalAmount));
        await orderRepo.save(order);
        return this.findById(id);
    }
    async cancel(id, userId, reason) {
        const orderRepo = await this.getOrderRepository();
        const order = await this.findById(id);
        if ([
            enums_1.SalesOrderStatus.SHIPPED,
            enums_1.SalesOrderStatus.DELIVERED,
            enums_1.SalesOrderStatus.COMPLETED,
        ].includes(order.status)) {
            throw new common_1.BadRequestException('Shipped, delivered, or completed orders cannot be cancelled');
        }
        if ([enums_1.SalesOrderStatus.CONFIRMED, enums_1.SalesOrderStatus.PROCESSING].includes(order.status)) {
            for (const item of order.items) {
                if (item.product?.isStockable) {
                    await this.stockService.releaseStock(item.productId, order.warehouseId, Number(item.quantityOrdered), item.variantId);
                }
            }
        }
        order.status = enums_1.SalesOrderStatus.CANCELLED;
        order.cancelledAt = new Date();
        order.cancelledBy = userId;
        order.cancellationReason = reason;
        await orderRepo.save(order);
        return this.findById(id);
    }
    async addPayment(id, paymentDto, userId) {
        const dataSource = await this.tenantConnectionManager.getDataSource();
        const order = await this.findById(id);
        const remainingAmount = Number(order.totalAmount) - Number(order.paidAmount);
        if (paymentDto.amount > remainingAmount) {
            throw new common_1.BadRequestException(`Payment amount exceeds remaining balance of ${remainingAmount}`);
        }
        await dataSource.transaction(async (manager) => {
            const paymentRepo = manager.getRepository(tenant_1.OrderPayment);
            const orderRepo = manager.getRepository(tenant_1.SalesOrder);
            const paymentReference = await (0, sequence_util_1.getNextSequence)(dataSource, 'PAYMENT');
            const payment = paymentRepo.create({
                id: (0, uuid_1.v4)(),
                salesOrderId: id,
                paymentMethodId: paymentDto.paymentMethodId,
                amount: paymentDto.amount,
                currency: order.currency,
                paymentDate: paymentDto.paymentDate || new Date(),
                referenceNumber: paymentDto.referenceNumber || paymentReference,
                transactionId: paymentDto.transactionId,
                status: 'COMPLETED',
                notes: paymentDto.notes,
                receivedBy: userId,
            });
            await paymentRepo.save(payment);
            const newPaid = Number(order.paidAmount) + paymentDto.amount;
            order.paidAmount = newPaid;
            order.paymentStatus = this.getPaymentStatus(newPaid, Number(order.totalAmount));
            if (order.status === enums_1.SalesOrderStatus.DELIVERED &&
                newPaid >= Number(order.totalAmount)) {
                order.status = enums_1.SalesOrderStatus.COMPLETED;
            }
            await orderRepo.save(order);
            const dueRepo = manager.getRepository(tenant_1.CustomerDue);
            const due = await dueRepo.findOne({ where: { salesOrderId: id } });
            if (due) {
                await this.customerDuesService.addPayment(due.id, paymentDto.amount, manager);
            }
        });
        return this.findById(id);
    }
    async getPayments(orderId) {
        const dataSource = await this.tenantConnectionManager.getDataSource();
        const paymentRepo = dataSource.getRepository(tenant_1.OrderPayment);
        return paymentRepo.find({
            where: { orderId: orderId },
            relations: ['paymentMethod'],
            order: { paymentDate: 'DESC' },
        });
    }
    async remove(id) {
        const orderRepo = await this.getOrderRepository();
        const order = await this.findById(id);
        if (order.status !== enums_1.SalesOrderStatus.DRAFT) {
            throw new common_1.BadRequestException('Only draft orders can be deleted');
        }
        await orderRepo.delete(id);
    }
    async getStatistics(fromDate, toDate, warehouseId) {
        const dataSource = await this.tenantConnectionManager.getDataSource();
        let query = `
      SELECT 
        COUNT(*) as totalOrders,
        SUM(total_amount) as totalRevenue,
        SUM(paid_amount) as totalCollected,
        SUM(total_amount - paid_amount) as totalOutstanding,
        AVG(total_amount) as averageOrderValue,
        COUNT(CASE WHEN status = 'PENDING' THEN 1 END) as pendingOrders,
        COUNT(CASE WHEN status = 'PROCESSING' THEN 1 END) as processingOrders,
        COUNT(CASE WHEN status = 'SHIPPED' THEN 1 END) as shippedOrders,
        COUNT(CASE WHEN status = 'DELIVERED' THEN 1 END) as deliveredOrders,
        COUNT(CASE WHEN status = 'CANCELLED' THEN 1 END) as cancelledOrders
      FROM sales_orders
      WHERE 1=1
    `;
        const params = [];
        if (fromDate) {
            query += ` AND order_date >= ?`;
            params.push(fromDate);
        }
        if (toDate) {
            query += ` AND order_date <= ?`;
            params.push(toDate);
        }
        if (warehouseId) {
            query += ` AND warehouse_id = ?`;
            params.push(warehouseId);
        }
        const result = await dataSource.query(query, params);
        return result[0];
    }
};
exports.OrdersService = OrdersService;
exports.OrdersService = OrdersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tenant_connection_manager_1.TenantConnectionManager,
        stock_service_1.StockService,
        price_lists_service_1.PriceListsService,
        due_management_1.CustomerDuesService])
], OrdersService);
//# sourceMappingURL=orders.service.js.map