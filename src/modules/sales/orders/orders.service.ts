import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Repository, DataSource, DeepPartial, IsNull } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { TenantConnectionManager } from '@database/tenant-connection.manager';
import {
  PaginatedResult,
  StockCheckResult,
  //PriceCalculationResult,
} from '@common/interfaces';
import { paginate } from '@common/utils/pagination.util';
import { getNextSequence } from '@common/utils/sequence.util';
import {
  SalesOrderStatus,
  StockMovementType,
  PaymentStatus,
  //OrderStatus,
} from '@common/enums';
import { StockService } from '@modules/warehouse/stock/stock.service';
import { PriceListsService } from '@modules/inventory/price-lists/price-lists.service';
import { AccountingIntegrationService } from '@modules/accounting/service/accounting-integration.service';

import {
  SalesOrder,
  Customer,
  SalesOrderItem,
  Product,
  InventoryStock,
  StockMovement,
  CustomerDue,
  OrderPayment,
  //SalesOrderPayment,
} from '@entities/tenant';
import { AddPaymentDto } from './dto/add-payment.dto';
import { CreateOrderDto } from './dto/create-order.dto';
import { OrderFilterDto } from './dto/order-filter.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { CustomerDuesService } from '@/modules/due-management';

@Injectable()
export class OrdersService {
  constructor(
    private readonly tenantConnectionManager: TenantConnectionManager,
    private readonly stockService: StockService,
    private readonly priceListsService: PriceListsService,
    private readonly customerDuesService: CustomerDuesService,
    private readonly accountingIntegration: AccountingIntegrationService,
  ) {}

  private async getOrderRepository(): Promise<Repository<SalesOrder>> {
    return this.tenantConnectionManager.getRepository(SalesOrder);
  }
  /**
   * Sync paymentStatus based on paidAmount vs totalAmount
   */
  private getPaymentStatus(
    paidAmount: number,
    totalAmount: number,
  ): PaymentStatus {
    if (paidAmount <= 0) return PaymentStatus.UNPAID;
    if (paidAmount >= totalAmount) return PaymentStatus.PAID;
    return PaymentStatus.PARTIALLY_PAID;
  }
  /**
   * Create a new sales order
   */
  async create(
    createOrderDto: CreateOrderDto,
    createdBy: string,
  ): Promise<SalesOrder> {
    const orderRepo = await this.getOrderRepository();
    const dataSource = await this.tenantConnectionManager.getDataSource();

    // Validate customer
    const customerRepo = dataSource.getRepository(Customer);
    const customer = await customerRepo.findOne({
      where: { id: createOrderDto.customerId },
      relations: ['addresses'],
    });

    if (!customer) {
      throw new NotFoundException(
        `Customer with ID ${createOrderDto.customerId} not found`,
      );
    }

    // Generate order number
    const orderNumber = await getNextSequence(dataSource, 'SALES_ORDER');

    // Calculate totals
    const calculatedTotals = await this.calculateOrderTotals(
      createOrderDto.items,
      createOrderDto.discountPercentage,
      createOrderDto.discountAmount,
      customer.priceListId,
      dataSource,
    );

    const order = orderRepo.create({
      id: uuidv4(),
      orderNumber,
      customerId: createOrderDto.customerId,
      warehouseId: createOrderDto.warehouseId,
      orderDate: createOrderDto.orderDate || new Date(),
      expectedDeliveryDate: createOrderDto.expectedDeliveryDate,
      status: SalesOrderStatus.PENDING,
      currency: createOrderDto.currency || customer.currency || 'BDT',
      exchangeRate: createOrderDto.exchangeRate || 1,
      subtotal: calculatedTotals.subtotal,
      discountPercentage: createOrderDto.discountPercentage || 0,
      discountAmount: calculatedTotals.discountAmount,
      taxAmount: calculatedTotals.taxAmount,
      shippingAmount: createOrderDto.shippingAmount || 0,
      totalAmount:
        calculatedTotals.totalAmount + (createOrderDto.shippingAmount || 0),
      paidAmount: 0,
      // Billing address
      billingName:
        createOrderDto.billingAddress?.name ||
        createOrderDto.shippingAddress?.name ||
        customer.firstName + ' ' + customer.lastName,
      billingPhone:
        createOrderDto.billingAddress?.phone ||
        createOrderDto.shippingAddress?.phone ||
        customer.phone,
      billingAddressLine1:
        createOrderDto.billingAddress?.addressLine1 ||
        createOrderDto.shippingAddress?.addressLine1 ||
        customer.addresses[0]?.addressLine1,
      billingAddressLine2:
        createOrderDto.billingAddress?.addressLine2 ||
        createOrderDto.shippingAddress?.addressLine2 ||
        customer.addresses[0]?.addressLine2,
      billingCity:
        createOrderDto.billingAddress?.city ||
        createOrderDto.shippingAddress?.city ||
        customer.addresses[0]?.city,
      billingState:
        createOrderDto.billingAddress?.state ||
        createOrderDto.shippingAddress?.state ||
        customer.addresses[0]?.state,
      billingCountry:
        createOrderDto.billingAddress?.country ||
        createOrderDto.shippingAddress?.country ||
        customer.addresses[0]?.country,
      billingPostalCode:
        createOrderDto.billingAddress?.postalCode ||
        createOrderDto.shippingAddress?.postalCode ||
        customer.addresses[0]?.postalCode,
      // Shipping address
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

    // Create order items
    await this.createOrderItems(
      savedOrder.id,
      createOrderDto.items,
      dataSource,
    );

    return this.findById(savedOrder.id);
  }

  /**
   * Create order items
   */
  private async createOrderItems(
    orderId: string,
    items: any[],
    dataSource: DataSource,
  ): Promise<void> {
    const itemRepo = dataSource.getRepository(SalesOrderItem);
    const productRepo = dataSource.getRepository(Product);

    for (const itemDto of items) {
      // Get product details
      const product = await productRepo.findOne({
        where: { id: itemDto.productId },
        relations: ['taxCategory', 'taxCategory.taxRates'],
      });

      if (!product) {
        throw new NotFoundException(
          `Product with ID ${itemDto.productId} not found`,
        );
      }

      // Calculate line totals
      const quantity = itemDto.quantity;
      const unitPrice = itemDto.unitPrice || Number(product.sellingPrice);
      const discountPercent = itemDto.discountPercentage || 0;
      const discountAmt = itemDto.discountAmount || 0;

      const grossAmount = quantity * unitPrice;
      const lineDiscount = (grossAmount * discountPercent) / 100 + discountAmt;
      const taxableAmount = grossAmount - lineDiscount;

      // Calculate tax
      let taxAmount = 0;
      let taxPercentage = 0;
      if (product.taxCategory?.taxRates) {
        const activeTaxRate = product.taxCategory.taxRates.find(
          (r) => r.isActive,
        );
        if (activeTaxRate) {
          taxPercentage = Number(activeTaxRate.ratePercentage);
          taxAmount = (taxableAmount * taxPercentage) / 100;
        }
      }

      const lineTotal = taxableAmount + taxAmount;

      const item = itemRepo.create({
        id: uuidv4(),
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
      } as DeepPartial<SalesOrderItem>);

      await itemRepo.save(item);
    }
  }

  /**
   * Calculate order totals
   */
  private async calculateOrderTotals(
    items: any[],
    orderDiscountPercent: number = 0,
    orderDiscountAmount: number = 0,
    priceListId?: string,
    dataSource?: DataSource | null,
  ): Promise<{
    subtotal: number;
    discountAmount: number;
    taxAmount: number;
    totalAmount: number;
  }> {
    if (!dataSource) {
      throw new Error('DataSource is required for calculating order totals');
    }

    let subtotal = 0;
    let totalTax = 0;

    const productRepo = dataSource.getRepository(Product);

    for (const itemDto of items) {
      const product = await productRepo.findOne({
        where: { id: itemDto.productId },
        relations: ['taxCategory', 'taxCategory.taxRates'],
      });

      if (!product) continue;

      // Get price from price list if available
      let unitPrice = itemDto.unitPrice;
      if (!unitPrice && priceListId) {
        unitPrice = await this.priceListsService.getProductPrice(
          priceListId,
          itemDto.productId,
          itemDto.quantity,
          itemDto.variantId,
        );
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

      // Calculate tax
      if (product.taxCategory?.taxRates) {
        const activeTaxRate = product.taxCategory.taxRates.find(
          (r) => r.isActive,
        );
        if (activeTaxRate) {
          totalTax +=
            (taxableAmount * Number(activeTaxRate.ratePercentage)) / 100;
        }
      }
    }

    // Apply order-level discount
    const orderDiscount =
      (subtotal * orderDiscountPercent) / 100 + orderDiscountAmount;
    const discountedSubtotal = subtotal - orderDiscount;

    // Recalculate tax on discounted amount if order discount applied
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

  /**
   * Find all orders with filters and pagination
   */
  async findAll(
    //paginationDto: PaginationDto,
    filterDto: OrderFilterDto,
  ): Promise<PaginatedResult<SalesOrder>> {
    const orderRepo = await this.getOrderRepository();

    const queryBuilder = orderRepo
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.customer', 'customer')
      .leftJoinAndSelect('order.warehouse', 'warehouse')
      .leftJoinAndSelect('order.items', 'items');

    // Apply filters
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
          queryBuilder.andWhere(
            'order.paidAmount > 0 AND order.paidAmount < order.totalAmount',
          );
          break;
      }
    }

    // Apply search
    if (filterDto.search) {
      queryBuilder.andWhere(
        '(order.orderNumber LIKE :search OR customer.firstName LIKE :search OR customer.lastName LIKE :search OR customer.companyName LIKE :search)',
        { search: `%${filterDto.search}%` },
      );
    }

    if (!filterDto.sortBy) {
      filterDto.sortBy = 'orderDate';
      filterDto.sortOrder = 'DESC';
    }

    return paginate(queryBuilder, filterDto);
  }

  /**
   * Find order by ID
   */
  async findById(id: string): Promise<SalesOrder> {
    const orderRepo = await this.getOrderRepository();

    const order = await orderRepo.findOne({
      where: { id },
      relations: [
        'customer',
        'warehouse',
        // 'billingAddress',
        // 'shippingAddress',
        'items',
        'items.product',
        'items.variant',
        'items.uom',
        'payments',
        'payments.paymentMethod',
      ],
    });

    if (!order) {
      throw new NotFoundException(`Order with ID ${id} not found`);
    }

    return order;
  }

  /**
   * Find order by number
   */
  async findByNumber(orderNumber: string): Promise<SalesOrder | null> {
    const orderRepo = await this.getOrderRepository();

    return orderRepo.findOne({
      where: { orderNumber },
      relations: ['customer', 'items'],
    });
  }

  /**
   * Update order
   */
  async update(
    id: string,
    updateOrderDto: UpdateOrderDto,
  ): Promise<SalesOrder> {
    const orderRepo = await this.getOrderRepository();
    const order = await this.findById(id);

    if (
      ![SalesOrderStatus.DRAFT, SalesOrderStatus.PENDING].includes(order.status)
    ) {
      throw new BadRequestException(
        'Only draft or pending orders can be updated',
      );
    }

    Object.assign(order, updateOrderDto);
    await orderRepo.save(order);

    return this.findById(id);
  }

  /**
   * Confirm order
   */
  async confirm(id: string, userId: string): Promise<SalesOrder> {
    const orderRepo = await this.getOrderRepository();
    const order = await this.findById(id);

    if (
      order.status !== SalesOrderStatus.DRAFT &&
      order.status !== SalesOrderStatus.PENDING
    ) {
      throw new BadRequestException(
        'Only draft or pending orders can be confirmed',
      );
    }

    // Validate stock availability
    const stockIssues = await this.validateStockAvailability(order);
    if (stockIssues.length > 0) {
      throw new BadRequestException({
        message: 'Insufficient stock for some items',
        stockIssues,
      });
    }

    // Reserve stock
    await this.reserveStock(order);

    order.status = SalesOrderStatus.CONFIRMED;
    order.confirmedAt = new Date();
    order.confirmedBy = userId;
    await orderRepo.save(order);

    return this.findById(id);
  }

  /**
   * Validate stock availability for order
   */
  private async validateStockAvailability(
    order: SalesOrder,
  ): Promise<StockCheckResult[]> {
    const issues: StockCheckResult[] = [];

    for (const item of order.items) {
      if (item.product?.isStockable) {
        const available = await this.stockService.getAvailableQuantity(
          item.productId,
          order.warehouseId,
          item.variantId,
        );

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

  /**
   * Reserve stock for order
   */
  private async reserveStock(order: SalesOrder): Promise<void> {
    for (const item of order.items) {
      if (item.product?.isStockable) {
        await this.stockService.reserveStock(
          item.productId,
          order.warehouseId,
          Number(item.quantityOrdered),
          item.variantId,
        );
      }
    }
  }

  /**
   * Process order (mark as processing)
   */
  async process(id: string, userId: string): Promise<SalesOrder> {
    const orderRepo = await this.getOrderRepository();
    const order = await this.findById(id);

    if (order.status !== SalesOrderStatus.CONFIRMED) {
      throw new BadRequestException('Only confirmed orders can be processed');
    }

    order.status = SalesOrderStatus.PROCESSING;
    await orderRepo.save(order);

    return this.findById(id);
  }

  /**
   * Ship order
   */
  async ship(
    id: string,
    userId: string,
    shippingDetails: {
      trackingNumber?: string;
      carrier?: string;
      shippingDate?: Date;
    },
  ): Promise<SalesOrder> {
    const dataSource = await this.tenantConnectionManager.getDataSource();
    const order = await this.findById(id);

    if (
      ![SalesOrderStatus.PROCESSING, SalesOrderStatus.READY_TO_SHIP].includes(
        order.status,
      )
    ) {
      throw new BadRequestException('Order is not ready to be shipped');
    }

    await dataSource.transaction(async (manager) => {
      const stockRepo = manager.getRepository(InventoryStock);
      const movementRepo = manager.getRepository(StockMovement);

      // Deduct stock and record movements
      for (const item of order.items) {
        if (item.product?.isStockable) {
          // Get stock record
          const stock = await stockRepo.findOne({
            where: {
              productId: item.productId,
              warehouseId: order.warehouseId,
              variantId: item.variantId || IsNull(),
            },
            lock: { mode: 'pessimistic_write' },
          });

          if (stock) {
            stock.quantityOnHand -= Number(item.quantityOrdered);
            stock.quantityReserved -= Number(item.quantityOrdered);
            await stockRepo.save(stock);
          }

          // Record stock movement
          const movement = movementRepo.create({
            id: uuidv4(),
            movementNumber: await getNextSequence(dataSource, 'STOCK_MOVEMENT'),
            movementType: StockMovementType.SALES_ISSUE,
            movementDate: new Date(),
            productId: item.productId,
            variantId: item.variantId,
            fromWarehouseId: order.warehouseId,
            quantity: Number(item.quantityOrdered),
            uomId: item.uomId || item.product?.baseUomId,
            unitCost: item.costPrice,
            referenceType: 'SALES_ORDER',
            referenceId: order.id,
            referenceNumber: order.orderNumber,
            createdBy: userId,
          });
          await movementRepo.save(movement);
        }

        // Update item shipped quantity
        item.quantityShipped = item.quantityOrdered;
        await manager.getRepository(SalesOrderItem).save(item);
      }

      // Update order
      order.status = SalesOrderStatus.SHIPPED;
      order.shippedAt = shippingDetails.shippingDate || new Date();
      order.shippedBy = userId;
      if (shippingDetails.trackingNumber) {
        order.trackingNumber = shippingDetails.trackingNumber;
      }
      if (shippingDetails.carrier) {
        order.shippingCarrier = shippingDetails.carrier;
      }
      await manager.getRepository(SalesOrder).save(order);
    });

    const shipped = await this.findById(id);
    // Auto-post COGS: DR Cost of Goods Sold / CR Inventory
    void this.accountingIntegration.postCOGS(shipped);
    return shipped;
  }

  /**
   * Mark order as delivered
   */
  async deliver(id: string, userId: string): Promise<SalesOrder> {
    const dataSource = await this.tenantConnectionManager.getDataSource();
    const order = await this.findById(id);

    if (order.status !== SalesOrderStatus.SHIPPED) {
      throw new BadRequestException(
        'Only shipped orders can be marked as delivered',
      );
    }

    await dataSource.transaction(async (manager) => {
      // Sync payment status
      order.paymentStatus = this.getPaymentStatus(
        Number(order.paidAmount),
        Number(order.totalAmount),
      );

      // Update order
      order.status = SalesOrderStatus.DELIVERED;
      order.deliveredAt = new Date();
      await manager.getRepository(SalesOrder).save(order);

      // Create customer due if not fully paid
      const dueAmount = Number(order.totalAmount) - Number(order.paidAmount);
      if (dueAmount > 0) {
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + (order.paymentTermsDays || 30));

        await this.customerDuesService.createFromOrder(
          order.customerId,
          order.id,
          order.orderNumber,
          dueAmount,
          dueDate,
          order.currency,
          manager,
        );
      }

      // Update customer stats
      const customerRepo = manager.getRepository(Customer);
      await customerRepo.increment({ id: order.customerId }, 'totalOrders', 1);
      await customerRepo.increment(
        { id: order.customerId },
        'totalPurchases',
        Number(order.totalAmount),
      );
      await customerRepo.update(order.customerId, {
        lastOrderDate: order.orderDate,
      });
    });

    const delivered = await this.findById(id);
    // Auto-post Revenue: DR Accounts Receivable / CR Sales Revenue + CR VAT Payable
    void this.accountingIntegration.postSaleDelivery(delivered);
    return delivered;
  }
  /**
   * Complete order
   */
  async complete(id: string): Promise<SalesOrder> {
    const orderRepo = await this.getOrderRepository();
    const order = await this.findById(id);

    if (order.status !== SalesOrderStatus.DELIVERED) {
      throw new BadRequestException('Only delivered orders can be completed');
    }

    order.status = SalesOrderStatus.COMPLETED;
    order.paymentStatus = this.getPaymentStatus(
      Number(order.paidAmount),
      Number(order.totalAmount),
    );

    await orderRepo.save(order);
    return this.findById(id);
  }

  /**
   * Cancel order
   */
  async cancel(
    id: string,
    userId: string,
    reason: string,
  ): Promise<SalesOrder> {
    const orderRepo = await this.getOrderRepository();
    const order = await this.findById(id);

    if (
      [
        SalesOrderStatus.SHIPPED,
        SalesOrderStatus.DELIVERED,
        SalesOrderStatus.COMPLETED,
      ].includes(order.status)
    ) {
      throw new BadRequestException(
        'Shipped, delivered, or completed orders cannot be cancelled',
      );
    }

    // Release reserved stock if order was confirmed
    if (
      [SalesOrderStatus.CONFIRMED, SalesOrderStatus.PROCESSING].includes(
        order.status,
      )
    ) {
      for (const item of order.items) {
        if (item.product?.isStockable) {
          await this.stockService.releaseStock(
            item.productId,
            order.warehouseId,
            Number(item.quantityOrdered),
            item.variantId,
          );
        }
      }
    }

    order.status = SalesOrderStatus.CANCELLED;
    order.cancelledAt = new Date();
    order.cancelledBy = userId;
    order.cancellationReason = reason;
    await orderRepo.save(order);

    return this.findById(id);
  }
  /**
   * @deprecated Use CollectionsService.create() instead for proper allocation tracking
   */
  async addPayment(
    id: string,
    paymentDto: AddPaymentDto,
    userId: string,
  ): Promise<SalesOrder> {
    // Legacy: still works but doesn't create Collection/Allocation records
    // Recommend migrating callers to use CollectionsService
    const dataSource = await this.tenantConnectionManager.getDataSource();
    const order = await this.findById(id);

    const remainingAmount =
      Number(order.totalAmount) - Number(order.paidAmount);
    if (paymentDto.amount > remainingAmount) {
      throw new BadRequestException(
        `Payment amount exceeds remaining balance of ${remainingAmount}`,
      );
    }

    await dataSource.transaction(async (manager) => {
      const paymentRepo = manager.getRepository(OrderPayment);
      const orderRepo = manager.getRepository(SalesOrder);

      const paymentReference = await getNextSequence(dataSource, 'PAYMENT');

      const payment = paymentRepo.create({
        id: uuidv4(),
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
      } as DeepPartial<OrderPayment>);
      await paymentRepo.save(payment);

      // Update order
      const newPaid = Number(order.paidAmount) + paymentDto.amount;
      order.paidAmount = newPaid;
      order.paymentStatus = this.getPaymentStatus(
        newPaid,
        Number(order.totalAmount),
      );

      // Auto-complete if delivered + fully paid
      if (
        order.status === SalesOrderStatus.DELIVERED &&
        newPaid >= Number(order.totalAmount)
      ) {
        order.status = SalesOrderStatus.COMPLETED;
      }
      await orderRepo.save(order);

      // Update customer due if exists
      const dueRepo = manager.getRepository(CustomerDue);
      const due = await dueRepo.findOne({ where: { salesOrderId: id } });
      if (due) {
        await this.customerDuesService.addPayment(
          due.id,
          paymentDto.amount,
          manager,
        );
      }
    });

    const paid = await this.findById(id);
    // Auto-post Payment: DR Bank/Cash / CR Accounts Receivable
    void this.accountingIntegration.postPaymentCollection(
      paid,
      paymentDto.amount,
      paymentDto.paymentDate ? new Date(paymentDto.paymentDate) : new Date(),
    );
    return paid;
  }

  /**
   * Get order payments
   */
  async getPayments(orderId: string): Promise<OrderPayment[]> {
    const dataSource = await this.tenantConnectionManager.getDataSource();
    const paymentRepo = dataSource.getRepository(OrderPayment);

    return paymentRepo.find({
      where: { orderId: orderId },
      relations: ['paymentMethod'],
      order: { paymentDate: 'DESC' },
    });
  }

  /**
   * Delete order (draft only)
   */
  async remove(id: string): Promise<void> {
    const orderRepo = await this.getOrderRepository();
    const order = await this.findById(id);

    if (order.status !== SalesOrderStatus.DRAFT) {
      throw new BadRequestException('Only draft orders can be deleted');
    }

    await orderRepo.delete(id);
  }

  /**
   * Get order statistics
   */
  async getStatistics(
    fromDate?: Date,
    toDate?: Date,
    warehouseId?: string,
  ): Promise<any> {
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

    const params: any[] = [];

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
}
