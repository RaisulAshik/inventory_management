import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Repository, DataSource, IsNull, DeepPartial } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { TenantConnectionManager } from '@database/tenant-connection.manager';
import {
  SalesReturn,
  SalesReturnStatus,
} from '@entities/tenant/eCommerce/sales-return.entity';
import {
  SalesReturnItem,
  ReturnItemCondition,
} from '@entities/tenant/eCommerce/sales-return-item.entity';
import { SalesOrder } from '@entities/tenant/eCommerce/sales-order.entity';
import { SalesOrderItem } from '@entities/tenant/eCommerce/sales-order-item.entity';
import { PaginationDto } from '@common/dto/pagination.dto';
import { PaginatedResult } from '@common/interfaces';
import { paginate } from '@common/utils/pagination.util';
import { getNextSequence } from '@common/utils/sequence.util';
import { StockMovementType } from '@common/enums';
import { InventoryStock, StockMovement } from '@entities/tenant';
import { CreateReturnDto } from './dto/create-return.dto';
import { ReturnFilterDto } from './dto/return-filter.dto';
import { UpdateReturnDto } from './dto/update-return.dto';

@Injectable()
export class ReturnsService {
  constructor(
    private readonly tenantConnectionManager: TenantConnectionManager,
  ) {}

  private async getReturnRepository(): Promise<Repository<SalesReturn>> {
    return this.tenantConnectionManager.getRepository(SalesReturn);
  }

  /**
   * Create a new sales return
   */
  async create(
    createReturnDto: CreateReturnDto,
    createdBy: string,
  ): Promise<SalesReturn> {
    const returnRepo = await this.getReturnRepository();
    const dataSource = await this.tenantConnectionManager.getDataSource();

    // Validate sales order
    const orderRepo = dataSource.getRepository(SalesOrder);
    const order = await orderRepo.findOne({
      where: { id: createReturnDto.salesOrderId },
      relations: ['items', 'customer'],
    });

    if (!order) {
      throw new NotFoundException(
        `Sales order with ID ${createReturnDto.salesOrderId} not found`,
      );
    }

    // Validate items and quantities
    await this.validateReturnItems(order, createReturnDto.items, dataSource);

    // Generate return number
    const returnNumber = await getNextSequence(dataSource, 'SALES_RETURN');

    // Calculate totals
    const calculatedTotals = this.calculateReturnTotals(
      order,
      createReturnDto.items,
      createReturnDto.restockingFeePercent || 0,
    );

    const salesReturn = returnRepo.create({
      id: uuidv4(),
      returnNumber,
      salesOrderId: createReturnDto.salesOrderId,
      customerId: order.customerId,
      warehouseId: createReturnDto.warehouseId || order.warehouseId,
      refundType: createReturnDto.refundType,
      returnDate: createReturnDto.returnDate || new Date(),
      status: SalesReturnStatus.REQUESTED,
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

    // Create return items
    await this.createReturnItems(
      savedReturn.id,
      order,
      createReturnDto.items,
      dataSource,
    );

    return this.findById(savedReturn.id);
  }

  /**
   * Validate return items
   */
  private async validateReturnItems(
    order: SalesOrder,
    items: any[],
    dataSource: DataSource,
  ): Promise<void> {
    const existingReturnsRepo = dataSource.getRepository(SalesReturnItem);

    for (const itemDto of items) {
      const orderItem = order.items.find(
        (i) =>
          i.productId === itemDto.productId &&
          (!itemDto.variantId || i.variantId === itemDto.variantId),
      );

      if (!orderItem) {
        throw new BadRequestException(
          `Product ${itemDto.productId} was not in the original order`,
        );
      }

      // Check already returned quantity
      const alreadyReturned = await existingReturnsRepo
        .createQueryBuilder('item')
        .innerJoin('item.salesReturn', 'return')
        .where('return.salesOrderId = :orderId', { orderId: order.id })
        .andWhere('item.productId = :productId', {
          productId: itemDto.productId,
        })
        .andWhere('return.status NOT IN (:...statuses)', {
          statuses: [SalesReturnStatus.CANCELLED, SalesReturnStatus.REJECTED],
        })
        .select('SUM(item.quantity)', 'total')
        .getRawOne();

      const returnedQty = parseFloat(alreadyReturned?.total) || 0;
      const availableForReturn =
        Number(orderItem.quantityOrdered) - returnedQty;

      if (itemDto.quantity > availableForReturn) {
        throw new BadRequestException(
          `Cannot return ${itemDto.quantity} units of product ${itemDto.productId}. ` +
            `Only ${availableForReturn} available for return.`,
        );
      }
    }
  }

  /**
   * Calculate return totals
   */
  private calculateReturnTotals(
    order: SalesOrder,
    items: any[],
    restockingFeePercent: number,
  ): {
    subtotal: number;
    taxAmount: number;
    totalAmount: number;
    restockingFee: number;
  } {
    let subtotal = 0;
    let taxAmount = 0;

    for (const itemDto of items) {
      const orderItem = order.items.find(
        (i) =>
          i.productId === itemDto.productId &&
          (!itemDto.variantId || i.variantId === itemDto.variantId),
      );

      if (orderItem) {
        const unitPrice = Number(orderItem.unitPrice);
        const quantity = itemDto.quantity;
        const lineSubtotal = unitPrice * quantity;

        // Proportional tax
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

  /**
   * Create return items
   */
  private async createReturnItems(
    returnId: string,
    order: SalesOrder,
    items: any[],
    dataSource: DataSource,
  ): Promise<void> {
    const itemRepo = dataSource.getRepository(SalesReturnItem);

    for (let i = 0; i < items.length; i++) {
      const itemDto = items[i];

      const orderItem = order.items.find(
        (oi) =>
          oi.productId === itemDto.productId &&
          (!itemDto.variantId || oi.variantId === itemDto.variantId),
      );

      if (!orderItem) continue;

      const unitPrice = Number(orderItem.unitPrice);
      const quantity = itemDto.quantity;
      const taxRate = Number(orderItem.taxPercentage) || 0;
      const lineSubtotal = unitPrice * quantity;
      const lineTax = (lineSubtotal * taxRate) / 100;

      const item = itemRepo.create({
        id: uuidv4(),
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
        condition: itemDto.condition || ReturnItemCondition.GOOD,
      } as DeepPartial<SalesReturnItem>);

      await itemRepo.save(item);
    }
  }

  /**
   * Find all returns with filters and pagination
   */
  async findAll(
    paginationDto: PaginationDto,
    filterDto: ReturnFilterDto,
  ): Promise<PaginatedResult<SalesReturn>> {
    const returnRepo = await this.getReturnRepository();

    const queryBuilder = returnRepo
      .createQueryBuilder('return')
      .leftJoinAndSelect('return.customer', 'customer')
      .leftJoinAndSelect('return.salesOrder', 'salesOrder')
      .leftJoinAndSelect('return.items', 'items');

    // Apply filters
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

    // Apply search
    if (paginationDto.search) {
      queryBuilder.andWhere(
        '(return.returnNumber LIKE :search OR salesOrder.orderNumber LIKE :search)',
        { search: `%${paginationDto.search}%` },
      );
    }

    if (!paginationDto.sortBy) {
      paginationDto.sortBy = 'returnDate';
      paginationDto.sortOrder = 'DESC';
    }

    return paginate(queryBuilder, paginationDto);
  }

  /**
   * Find return by ID
   */
  async findById(id: string): Promise<SalesReturn> {
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
      throw new NotFoundException(`Return with ID ${id} not found`);
    }

    return salesReturn;
  }

  /**
   * Update return
   */
  async update(
    id: string,
    updateReturnDto: UpdateReturnDto,
  ): Promise<SalesReturn> {
    const returnRepo = await this.getReturnRepository();
    const salesReturn = await this.findById(id);

    if (salesReturn.status !== SalesReturnStatus.REQUESTED) {
      throw new BadRequestException('Only requested returns can be updated');
    }

    Object.assign(salesReturn, updateReturnDto);
    await returnRepo.save(salesReturn);

    return this.findById(id);
  }

  /**
   * Approve return
   */
  async approve(id: string, approvedBy: string): Promise<SalesReturn> {
    const returnRepo = await this.getReturnRepository();
    const salesReturn = await this.findById(id);

    if (
      ![
        SalesReturnStatus.REQUESTED,
        SalesReturnStatus.PENDING_APPROVAL,
      ].includes(salesReturn.status)
    ) {
      throw new BadRequestException(
        'Only requested or pending approval returns can be approved',
      );
    }

    salesReturn.status = SalesReturnStatus.APPROVED;
    salesReturn.approvedBy = approvedBy;
    salesReturn.approvedAt = new Date();
    await returnRepo.save(salesReturn);

    return this.findById(id);
  }

  /**
   * Receive returned items
   */
  async receive(id: string, receivedBy: string): Promise<SalesReturn> {
    //const returnRepo = await this.getReturnRepository();
    const dataSource = await this.tenantConnectionManager.getDataSource();
    const salesReturn = await this.findById(id);

    if (salesReturn.status !== SalesReturnStatus.APPROVED) {
      throw new BadRequestException('Only approved returns can be received');
    }

    await dataSource.transaction(async (manager) => {
      const stockRepo = manager.getRepository(InventoryStock);
      const movementRepo = manager.getRepository(StockMovement);
      const orderItemRepo = manager.getRepository(SalesOrderItem);

      for (const item of salesReturn.items) {
        // Only restock items in good condition
        if (
          item.condition === ReturnItemCondition.GOOD ||
          item.condition === ReturnItemCondition.LIKE_NEW
        ) {
          // Get or create stock record
          let stock = await stockRepo.findOne({
            where: {
              productId: item.productId,
              warehouseId: salesReturn.warehouseId,
              variantId: item.variantId || IsNull(),
            },
            lock: { mode: 'pessimistic_write' },
          });

          if (!stock) {
            stock = stockRepo.create({
              id: uuidv4(),
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

          // Record stock movement
          const movement = movementRepo.create({
            id: uuidv4(),
            movementNumber: await getNextSequence(dataSource, 'STOCK_MOVEMENT'),
            movementType: StockMovementType.RETURN_FROM_CUSTOMER,
            movementDate: new Date(),
            productId: item.productId,
            variantId: item.variantId,
            toWarehouseId: salesReturn.warehouseId,
            quantity: Number(item.quantityReturned),
            uomId: item.uomId || item.product?.baseUomId,
            unitCost: item.unitPrice,
            referenceType: 'SALES_RETURN',
            referenceId: salesReturn.id,
            referenceNumber: salesReturn.returnNumber,
            createdBy: receivedBy,
          });
          await movementRepo.save(movement);

          // Update item status
          item.isRestocked = true;
          item.restockedQuantity = item.quantityReturned;
          await manager.getRepository(SalesReturnItem).save(item);
        }

        // Update order item returned quantity
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

      // Update return status
      salesReturn.status = SalesReturnStatus.RECEIVED;
      salesReturn.receivedDate = new Date();
      await manager.getRepository(SalesReturn).save(salesReturn);
    });

    return this.findById(id);
  }

  /**
   * Process refund
   */
  async processRefund(
    id: string,
    refundAmount: number,
    processedBy: string,
  ): Promise<SalesReturn> {
    const returnRepo = await this.getReturnRepository();
    const salesReturn = await this.findById(id);

    if (salesReturn.status !== SalesReturnStatus.RECEIVED) {
      throw new BadRequestException('Only received returns can be refunded');
    }

    if (refundAmount > Number(salesReturn.totalAmount)) {
      throw new BadRequestException(
        `Refund amount cannot exceed total return amount of ${salesReturn.totalAmount}`,
      );
    }

    salesReturn.refundAmount = refundAmount;
    salesReturn.refundedAt = new Date();
    salesReturn.status = SalesReturnStatus.REFUNDED;
    await returnRepo.save(salesReturn);

    return this.findById(id);
  }

  /**
   * Complete return
   */
  async complete(id: string): Promise<SalesReturn> {
    const returnRepo = await this.getReturnRepository();
    const salesReturn = await this.findById(id);

    if (
      ![SalesReturnStatus.RECEIVED, SalesReturnStatus.REFUNDED].includes(
        salesReturn.status,
      )
    ) {
      throw new BadRequestException(
        'Return must be received or refunded before completion',
      );
    }

    salesReturn.status = SalesReturnStatus.COMPLETED;
    await returnRepo.save(salesReturn);

    return this.findById(id);
  }

  /**
   * Reject return
   */
  async reject(
    id: string,
    rejectedBy: string,
    reason: string,
  ): Promise<SalesReturn> {
    const returnRepo = await this.getReturnRepository();
    const salesReturn = await this.findById(id);

    if (
      ![
        SalesReturnStatus.REQUESTED,
        SalesReturnStatus.PENDING_APPROVAL,
      ].includes(salesReturn.status)
    ) {
      throw new BadRequestException(
        'Only requested or pending approval returns can be rejected',
      );
    }

    salesReturn.status = SalesReturnStatus.REJECTED;
    salesReturn.internalNotes = reason;
    await returnRepo.save(salesReturn);

    return this.findById(id);
  }

  /**
   * Cancel return
   */
  async cancel(
    id: string,
    cancelledBy: string,
    reason: string,
  ): Promise<SalesReturn> {
    const returnRepo = await this.getReturnRepository();
    const salesReturn = await this.findById(id);

    if (
      [
        SalesReturnStatus.RECEIVED,
        SalesReturnStatus.REFUNDED,
        SalesReturnStatus.COMPLETED,
      ].includes(salesReturn.status)
    ) {
      throw new BadRequestException(
        'Cannot cancel return that has been received, refunded, or completed',
      );
    }

    salesReturn.status = SalesReturnStatus.CANCELLED;
    salesReturn.internalNotes = `Cancelled by: ${cancelledBy}. Reason: ${reason}`;
    await returnRepo.save(salesReturn);

    return this.findById(id);
  }

  /**
   * Delete return (requested only)
   */
  async remove(id: string): Promise<void> {
    const returnRepo = await this.getReturnRepository();
    const salesReturn = await this.findById(id);

    if (salesReturn.status !== SalesReturnStatus.REQUESTED) {
      throw new BadRequestException('Only requested returns can be deleted');
    }

    await returnRepo.delete(id);
  }
}
