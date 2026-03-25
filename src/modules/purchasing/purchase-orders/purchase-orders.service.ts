import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Repository, DataSource, DeepPartial } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { TenantConnectionManager } from '@database/tenant-connection.manager';
import { PaginatedResult } from '@common/interfaces';
import { paginate } from '@common/utils/pagination.util';
import { getNextSequence } from '@common/utils/sequence.util';
import { DueStatus, PurchaseOrderStatus } from '@common/enums';
import {
  PurchaseOrder,
  Supplier,
  PurchaseOrderItem,
  Product,
  SupplierDue,
} from '@entities/tenant';
import { CreatePurchaseOrderDto } from './dto/create-purchase-order.dto';
import { PurchaseOrderFilterDto } from './dto/purchase-order-filter.dto';
import { UpdatePurchaseOrderDto } from './dto/update-purchase-order.dto';

@Injectable()
export class PurchaseOrdersService {
  constructor(
    private readonly tenantConnectionManager: TenantConnectionManager,
  ) {}

  private async getPurchaseOrderRepository(): Promise<
    Repository<PurchaseOrder>
  > {
    return this.tenantConnectionManager.getRepository(PurchaseOrder);
  }

  /**
   * Create a new purchase order
   */
  async create(
    createDto: CreatePurchaseOrderDto,
    createdBy: string,
  ): Promise<PurchaseOrder> {
    const poRepo = await this.getPurchaseOrderRepository();
    const dataSource = await this.tenantConnectionManager.getDataSource();

    // Validate supplier
    const supplierRepo = dataSource.getRepository(Supplier);
    const supplier = await supplierRepo.findOne({
      where: { id: createDto.supplierId },
    });

    if (!supplier) {
      throw new NotFoundException(
        `Supplier with ID ${createDto.supplierId} not found`,
      );
    }

    // Generate PO number
    const poNumber = await getNextSequence(dataSource, 'PURCHASE_ORDER');

    // Calculate totals
    const calculatedTotals = await this.calculateOrderTotals(
      createDto.items,
      dataSource,
      createDto.discountPercentage,
      createDto.discountAmount,
    );

    const purchaseOrder = poRepo.create({
      id: uuidv4(),
      poNumber,
      supplierId: createDto.supplierId,
      warehouseId: createDto.warehouseId,
      orderDate: createDto.orderDate || new Date(),
      poDate: createDto.poDate || new Date(),
      expectedDeliveryDate: createDto.expectedDeliveryDate,
      status: PurchaseOrderStatus.DRAFT,
      currency: createDto.currency || supplier.currency || 'INR',
      exchangeRate: createDto.exchangeRate || 1,
      subtotal: calculatedTotals.subtotal,
      discountPercentage: createDto.discountPercentage || 0,
      discountAmount: calculatedTotals.discountAmount,
      taxAmount: calculatedTotals.taxAmount,
      shippingAmount: createDto.shippingAmount || 0,
      otherCharges: createDto.otherCharges || 0,
      totalAmount:
        calculatedTotals.totalAmount +
        (createDto.shippingAmount || 0) +
        (createDto.otherCharges || 0),
      paymentTermsDays:
        createDto.paymentTermsDays || supplier.paymentTermsDays || 0,
      notes: createDto.notes,
      internalNotes: createDto.internalNotes,
      createdBy,
    } as DeepPartial<PurchaseOrder>);

    const savedPO = await poRepo.save(purchaseOrder);

    // Create order items
    await this.createOrderItems(savedPO.id, createDto.items, dataSource);

    return this.findById(savedPO.id);
  }

  /**
   * Create purchase order items
   */
  private async createOrderItems(
    purchaseOrderId: string,
    items: any[],
    dataSource: DataSource,
  ): Promise<void> {
    const itemRepo = dataSource.getRepository(PurchaseOrderItem);
    const productRepo = dataSource.getRepository(Product);

    for (let i = 0; i < items.length; i++) {
      const itemDto = items[i];

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
      const quantityOrdered = itemDto.quantityOrdered;
      const unitPrice = itemDto.unitPrice || Number(product.costPrice);
      const discountPercent = itemDto.discountPercentage || 0;
      const discountAmt = itemDto.discountAmount || 0;

      const grossAmount = quantityOrdered * unitPrice;
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
      } as DeepPartial<PurchaseOrderItem>);

      await itemRepo.save(item);
    }
  }

  /**
   * Calculate order totals
   */
  private async calculateOrderTotals(
    items: any[],
    dataSource: DataSource,
    orderDiscountPercent: number = 0,
    orderDiscountAmount: number = 0,
  ): Promise<{
    subtotal: number;
    discountAmount: number;
    taxAmount: number;
    totalAmount: number;
  }> {
    let subtotal = 0;
    let totalTax = 0;

    const productRepo = dataSource.getRepository(Product);

    for (const itemDto of items) {
      const product = await productRepo.findOne({
        where: { id: itemDto.productId },
        relations: ['taxCategory', 'taxCategory.taxRates'],
      });

      if (!product) continue;

      const unitPrice = itemDto.unitPrice || Number(product.costPrice);
      const quantityOrdered = itemDto.quantityOrdered;
      const discountPercent = itemDto.discountPercentage || 0;
      const discountAmt = itemDto.discountAmount || 0;

      const grossAmount = quantityOrdered * unitPrice;
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

    // Recalculate tax on discounted amount
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
   * Find all purchase orders with filters and pagination
   */
  async findAll(
    //paginationDto: PaginationDto,
    filterDto: PurchaseOrderFilterDto,
  ): Promise<PaginatedResult<PurchaseOrder>> {
    const poRepo = await this.getPurchaseOrderRepository();

    const queryBuilder = poRepo
      .createQueryBuilder('po')
      .leftJoinAndSelect('po.supplier', 'supplier')
      .leftJoinAndSelect('po.warehouse', 'warehouse')
      .leftJoinAndSelect('po.items', 'items')
      .leftJoinAndSelect('items.product', 'product');

    // Apply filters
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

    // Apply search
    if (filterDto.search) {
      queryBuilder.andWhere(
        '(po.poNumber LIKE :search OR supplier.companyName LIKE :search)',
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
   * Find purchase order by ID
   */
  async findById(id: string): Promise<PurchaseOrder> {
    const poRepo = await this.getPurchaseOrderRepository();

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
      throw new NotFoundException(`Purchase order with ID ${id} not found`);
    }
    return po;
  }

  /**
   * Find purchase order by number
   */
  async findByNumber(poNumber: string): Promise<PurchaseOrder | null> {
    const poRepo = await this.getPurchaseOrderRepository();

    return poRepo.findOne({
      where: { poNumber },
      relations: ['supplier', 'items'],
    });
  }

  /**
   * Update purchase order
   */
  async update(
    id: string,
    updateDto: UpdatePurchaseOrderDto,
  ): Promise<PurchaseOrder> {
    const poRepo = await this.getPurchaseOrderRepository();
    const po = await this.findById(id);

    if (
      ![
        PurchaseOrderStatus.DRAFT,
        PurchaseOrderStatus.PENDING_APPROVAL,
      ].includes(po.status)
    ) {
      throw new BadRequestException(
        'Only draft or pending approval orders can be updated',
      );
    }

    Object.assign(po, updateDto);
    await poRepo.save(po);

    return this.findById(id);
  }

  /**
   * Submit for approval
   */
  async submitForApproval(
    id: string,
    approvalId: string,
    userId: string,
  ): Promise<PurchaseOrder> {
    const poRepo = await this.getPurchaseOrderRepository();
    const po = await this.findById(id);

    if (po.status !== PurchaseOrderStatus.DRAFT) {
      throw new BadRequestException(
        'Only draft orders can be submitted for approval',
      );
    }

    if (!po.items || po.items.length === 0) {
      throw new BadRequestException(
        'Purchase order must have at least one item',
      );
    }

    po.approvedBy = userId;
    po.status = PurchaseOrderStatus.PENDING_APPROVAL;
    await poRepo.save(po);

    return this.findById(id);
  }

  /**
   * Approve purchase order
   */
  async approve(
    id: string,
    approverId: string,
    approvedBy: string,
  ): Promise<PurchaseOrder> {
    const poRepo = await this.getPurchaseOrderRepository();
    const po = await this.findById(id);

    if (po.status !== PurchaseOrderStatus.PENDING_APPROVAL) {
      throw new BadRequestException(
        'Only pending approval orders can be approved',
      );
    }

    po.status = PurchaseOrderStatus.APPROVED;
    po.approvedBy = approvedBy;
    po.approvedAt = new Date();
    await poRepo.save(po);

    return this.findById(id);
  }

  /**
   * Reject purchase order
   */
  async reject(
    id: string,
    rejectedBy: string,
    reason: string,
  ): Promise<PurchaseOrder> {
    const poRepo = await this.getPurchaseOrderRepository();
    const po = await this.findById(id);

    if (po.status !== PurchaseOrderStatus.PENDING_APPROVAL) {
      throw new BadRequestException(
        'Only pending approval orders can be rejected',
      );
    }

    po.status = PurchaseOrderStatus.CANCELLED;
    po.notes = `Rejected by: ${rejectedBy}. Reason: ${reason}`;
    await poRepo.save(po);

    return this.findById(id);
  }

  /**
   * Send to supplier
   */
  async sendToSupplier(
    id: string,
    senderId: string,
    userId: string,
  ): Promise<PurchaseOrder> {
    const poRepo = await this.getPurchaseOrderRepository();
    const po = await this.findById(id);

    if (po.status !== PurchaseOrderStatus.APPROVED) {
      throw new BadRequestException(
        'Only approved orders can be sent to supplier',
      );
    }

    po.status = PurchaseOrderStatus.SENT;
    po.sentAt = new Date();
    po.sentBy = userId;
    await poRepo.save(po);

    return this.findById(id);
  }

  /**
   * Mark as acknowledged by supplier
   */
  async acknowledge(
    id: string,
    acknowledgementNumber?: string,
  ): Promise<PurchaseOrder> {
    const poRepo = await this.getPurchaseOrderRepository();
    const po = await this.findById(id);

    if (po.status !== PurchaseOrderStatus.SENT) {
      throw new BadRequestException('Only sent orders can be acknowledged');
    }

    po.status = PurchaseOrderStatus.ACKNOWLEDGED;
    po.acknowledgedAt = new Date();
    if (acknowledgementNumber) {
      po.supplierReferenceNumber = acknowledgementNumber;
    }
    await poRepo.save(po);

    return this.findById(id);
  }

  /**
   * Update received quantities (called by GRN service)
   */
  async updateReceivedQuantities(id: string): Promise<PurchaseOrder> {
    const poRepo = await this.getPurchaseOrderRepository();
    const dataSource = await this.tenantConnectionManager.getDataSource();
    const po = await this.findById(id);

    // Check if all items are fully received
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
      po.status = PurchaseOrderStatus.RECEIVED;

      // Create supplier due
      const dueAmount = Number(po.totalAmount) - Number(po.paidAmount);
      if (dueAmount > 0) {
        const dueDate = new Date();
        dueDate.setDate(dueDate.getDate() + (po.paymentTermsDays || 0));

        const dueRepo = dataSource.getRepository(SupplierDue);
        const due = dueRepo.create({
          id: uuidv4(),
          supplierId: po.supplierId,
          purchaseOrderId: po.id,
          dueDate,
          originalAmount: dueAmount,
          paidAmount: 0,
          adjustedAmount: 0,
          currency: po.currency,
          status: DueStatus.PENDING,
        } as DeepPartial<SupplierDue>);
        await dueRepo.save(due);
      }
    } else if (partiallyReceived) {
      po.status = PurchaseOrderStatus.PARTIALLY_RECEIVED;
    }

    await poRepo.save(po);
    return this.findById(id);
  }

  /**
   * Close purchase order
   */
  async close(id: string): Promise<PurchaseOrder> {
    const poRepo = await this.getPurchaseOrderRepository();
    const po = await this.findById(id);

    if (
      ![
        PurchaseOrderStatus.RECEIVED,
        PurchaseOrderStatus.PARTIALLY_RECEIVED,
      ].includes(po.status)
    ) {
      throw new BadRequestException('Only received orders can be closed');
    }

    po.status = PurchaseOrderStatus.CLOSED;
    await poRepo.save(po);

    return this.findById(id);
  }

  /**
   * Cancel purchase order
   */
  async cancel(
    id: string,
    cancelledBy: string,
    reason: string,
  ): Promise<PurchaseOrder> {
    const poRepo = await this.getPurchaseOrderRepository();
    const po = await this.findById(id);

    if (
      [
        PurchaseOrderStatus.RECEIVED,
        PurchaseOrderStatus.CLOSED,
        PurchaseOrderStatus.CANCELLED,
      ].includes(po.status)
    ) {
      throw new BadRequestException(
        'Cannot cancel received, closed, or already cancelled orders',
      );
    }

    // Check if any items have been received
    const hasReceivedItems = po.items?.some(
      (item) => Number(item.quantityReceived) > 0,
    );
    if (hasReceivedItems) {
      throw new BadRequestException('Cannot cancel order with received items');
    }

    po.status = PurchaseOrderStatus.CANCELLED;
    po.cancelledAt = new Date();
    po.cancelledBy = cancelledBy;
    po.cancellationReason = reason;
    await poRepo.save(po);

    return this.findById(id);
  }

  /**
   * Delete purchase order (draft only)
   */
  async remove(id: string): Promise<void> {
    const poRepo = await this.getPurchaseOrderRepository();
    const po = await this.findById(id);

    if (po.status !== PurchaseOrderStatus.DRAFT) {
      throw new BadRequestException('Only draft orders can be deleted');
    }

    await poRepo.delete(id);
  }

  /**
   * Get pending orders for supplier
   */
  async getPendingOrdersForSupplier(
    supplierId: string,
  ): Promise<PurchaseOrder[]> {
    const poRepo = await this.getPurchaseOrderRepository();

    return poRepo.find({
      where: {
        supplierId,
        status: PurchaseOrderStatus.SENT,
      },
      relations: ['items'],
      order: { expectedDate: 'ASC' },
    });
  }

  /**
   * Get overdue orders
   */
  async getOverdueOrders(): Promise<PurchaseOrder[]> {
    const poRepo = await this.getPurchaseOrderRepository();
    const today = new Date();

    return poRepo
      .createQueryBuilder('po')
      .leftJoinAndSelect('po.supplier', 'supplier')
      .where('po.status IN (:...statuses)', {
        statuses: [
          PurchaseOrderStatus.SENT,
          PurchaseOrderStatus.ACKNOWLEDGED,
          PurchaseOrderStatus.PARTIALLY_RECEIVED,
        ],
      })
      .andWhere('po.expectedDeliveryDate < :today', { today })
      .orderBy('po.expectedDeliveryDate', 'ASC')
      .getMany();
  }
}
