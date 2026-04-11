import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Repository, DataSource, DeepPartial } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import * as ExcelJS from 'exceljs';
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
  ProductVariant,
  UnitOfMeasure,
  SupplierDue,
  TaxRate,
} from '@entities/tenant';
import {
  BulkItemRow,
  BulkUploadResult,
  BulkRowError,
  BulkValidateItemInput,
  BulkValidateItemResult,
  BulkValidateResponse,
} from './dto/bulk-upload-items.dto';
import {
  CreatePurchaseOrderDto,
  CreatePurchaseOrderItemDto,
} from './dto/create-purchase-order.dto';
import { PurchaseOrderFilterDto } from './dto/purchase-order-filter.dto';
import { UpdatePurchaseOrderDto } from './dto/update-purchase-order.dto';
import { UpdatePurchaseOrderItemDto } from './dto/update-purchase-order-item.dto';

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
      createDto.taxRateId,
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
      taxRateId: createDto.taxRateId,
      taxPercentage: calculatedTotals.taxPercentage,
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
      const lineTotal = grossAmount - lineDiscount;

      const item = itemRepo.create({
        id: uuidv4(),
        purchaseOrderId,
        productId: itemDto.productId,
        variantId: itemDto.variantId,
        productName: product.productName,
        productSku: product.sku,
        quantityOrdered: quantityOrdered,
        uomId: itemDto.uomId || product.baseUomId,
        unitPrice,
        discountPercentage: discountPercent,
        discountAmount: lineDiscount,
        taxPercentage: 0,
        taxAmount: 0,
        lineTotal,
        notes: itemDto.notes,
      } as DeepPartial<PurchaseOrderItem>);

      await itemRepo.save(item);
    }
  }

  /**
   * Recalculate PO header totals from its current saved line items.
   * Tax is order-level (from po.taxRateId), not per line item.
   */
  private async recalculateTotals(
    purchaseOrderId: string,
    dataSource: DataSource,
  ): Promise<void> {
    const poRepo = dataSource.getRepository(PurchaseOrder);
    const itemRepo = dataSource.getRepository(PurchaseOrderItem);

    const po = await poRepo.findOne({ where: { id: purchaseOrderId } });
    if (!po) return;

    const items = await itemRepo.find({ where: { purchaseOrderId } });

    // subtotal = sum of (lineTotal) — items have no tax built in
    const subtotal = items.reduce((sum, i) => sum + Number(i.lineTotal), 0);
    const discountedSubtotal = subtotal - Number(po.discountAmount ?? 0);

    // Apply order-level tax rate
    let taxPercentage = 0;
    let taxAmount = 0;
    if (po.taxRateId) {
      const taxRate = await dataSource
        .getRepository(TaxRate)
        .findOne({ where: { id: po.taxRateId } });
      if (taxRate) {
        taxPercentage = Number(taxRate.ratePercentage);
        taxAmount = (discountedSubtotal * taxPercentage) / 100;
      }
    }

    const totalAmount =
      discountedSubtotal +
      taxAmount +
      Number(po.shippingAmount ?? 0) +
      Number(po.otherCharges ?? 0);

    await poRepo.update(purchaseOrderId, {
      subtotal,
      taxPercentage,
      taxAmount,
      totalAmount,
    });
  }

  /**
   * Calculate order totals.
   * Tax is applied at order level on (subtotal − discount), not per line item.
   */
  private async calculateOrderTotals(
    items: any[],
    dataSource: DataSource,
    orderDiscountPercent: number = 0,
    orderDiscountAmount: number = 0,
    taxRateId?: string,
  ): Promise<{
    subtotal: number;
    discountAmount: number;
    taxPercentage: number;
    taxAmount: number;
    totalAmount: number;
  }> {
    let subtotal = 0;

    const productRepo = dataSource.getRepository(Product);

    for (const itemDto of items) {
      const product = await productRepo.findOne({
        where: { id: itemDto.productId },
      });

      if (!product) continue;

      const unitPrice = itemDto.unitPrice || Number(product.costPrice);
      const quantityOrdered = itemDto.quantityOrdered;
      const discountPercent = itemDto.discountPercentage || 0;
      const discountAmt = itemDto.discountAmount || 0;

      const grossAmount = quantityOrdered * unitPrice;
      const lineDiscount = (grossAmount * discountPercent) / 100 + discountAmt;
      subtotal += grossAmount - lineDiscount;
    }

    // Apply order-level discount
    const orderDiscount =
      (subtotal * orderDiscountPercent) / 100 + orderDiscountAmount;
    const discountedSubtotal = subtotal - orderDiscount;

    // Apply order-level tax on discounted subtotal
    let taxPercentage = 0;
    let taxAmount = 0;
    if (taxRateId) {
      const taxRate = await dataSource
        .getRepository(TaxRate)
        .findOne({ where: { id: taxRateId } });
      if (taxRate) {
        taxPercentage = Number(taxRate.ratePercentage);
        taxAmount = (discountedSubtotal * taxPercentage) / 100;
      }
    }

    return {
      subtotal,
      discountAmount: orderDiscount,
      taxPercentage,
      taxAmount,
      totalAmount: discountedSubtotal + taxAmount,
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
    if (filterDto.poNumber) {
      queryBuilder.andWhere('po.poNumber LIKE :poNumber', {
        poNumber: `%${filterDto.poNumber}%`,
      });
    }

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

    const needsRecalc =
      updateDto.taxRateId !== undefined ||
      updateDto.discountPercentage !== undefined ||
      updateDto.discountAmount !== undefined;

    Object.assign(po, updateDto);
    await poRepo.save(po);

    if (needsRecalc) {
      const dataSource = await this.tenantConnectionManager.getDataSource();
      await this.recalculateTotals(id, dataSource);
    }

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
  /**
   * Add a new line item to an existing purchase order
   */
  async addItem(
    purchaseOrderId: string,
    dto: CreatePurchaseOrderItemDto,
  ): Promise<PurchaseOrderItem> {
    const po = await this.findById(purchaseOrderId);

    if (
      ![
        PurchaseOrderStatus.DRAFT,
        PurchaseOrderStatus.PENDING_APPROVAL,
      ].includes(po.status)
    ) {
      throw new BadRequestException(
        'Only draft or pending approval orders can be modified',
      );
    }

    const dataSource = await this.tenantConnectionManager.getDataSource();
    const itemRepo = dataSource.getRepository(PurchaseOrderItem);
    const productRepo = dataSource.getRepository(Product);

    const product = await productRepo.findOne({
      where: { id: dto.productId },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID ${dto.productId} not found`);
    }

    const quantityOrdered = dto.quantityOrdered;
    const unitPrice = dto.unitPrice ?? Number(product.costPrice);
    const discountPercent = dto.discountPercentage ?? 0;
    const discountAmt = dto.discountAmount ?? 0;

    const grossAmount = quantityOrdered * unitPrice;
    const lineDiscount = (grossAmount * discountPercent) / 100 + discountAmt;
    const lineTotal = grossAmount - lineDiscount;

    const item = itemRepo.create({
      id: uuidv4(),
      purchaseOrderId,
      productId: dto.productId,
      variantId: dto.variantId,
      productName: product.productName,
      productSku: product.sku,
      quantityOrdered,
      uomId: dto.uomId ?? product.baseUomId,
      unitPrice,
      discountPercentage: discountPercent,
      discountAmount: lineDiscount,
      taxPercentage: 0,
      taxAmount: 0,
      lineTotal,
      notes: dto.notes,
    } as DeepPartial<PurchaseOrderItem>);

    const saved = await itemRepo.save(item);
    await this.recalculateTotals(purchaseOrderId, dataSource);
    return saved;
  }

  /**
   * Update a single line item on a purchase order
   */
  async updateItem(
    purchaseOrderId: string,
    itemId: string,
    dto: UpdatePurchaseOrderItemDto,
  ): Promise<PurchaseOrderItem> {
    const po = await this.findById(purchaseOrderId);

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

    const dataSource = await this.tenantConnectionManager.getDataSource();
    const itemRepo = dataSource.getRepository(PurchaseOrderItem);

    const item = await itemRepo.findOne({
      where: { id: itemId, purchaseOrderId },
    });

    if (!item) {
      throw new NotFoundException(
        `Item ${itemId} not found on purchase order ${purchaseOrderId}`,
      );
    }

    const quantityOrdered = dto.quantityOrdered ?? Number(item.quantityOrdered);
    const unitPrice = dto.unitPrice ?? Number(item.unitPrice);
    const discountPercent =
      dto.discountPercentage ?? Number(item.discountPercentage);
    const discountAmt = dto.discountAmount ?? 0;

    const grossAmount = quantityOrdered * unitPrice;
    const lineDiscount = (grossAmount * discountPercent) / 100 + discountAmt;
    const lineTotal = grossAmount - lineDiscount;

    Object.assign(item, {
      ...(dto.uomId && { uomId: dto.uomId }),
      quantityOrdered,
      unitPrice,
      discountPercentage: discountPercent,
      discountAmount: lineDiscount,
      taxPercentage: 0,
      taxAmount: 0,
      lineTotal,
      notes: dto.notes ?? item.notes,
    });

    const saved = await itemRepo.save(item);
    await this.recalculateTotals(purchaseOrderId, dataSource);
    return saved;
  }

  /**
   * Remove a line item from a purchase order
   */
  async removeItem(purchaseOrderId: string, itemId: string): Promise<void> {
    const po = await this.findById(purchaseOrderId);

    if (
      ![
        PurchaseOrderStatus.DRAFT,
        PurchaseOrderStatus.PENDING_APPROVAL,
      ].includes(po.status)
    ) {
      throw new BadRequestException(
        'Only draft or pending approval orders can be modified',
      );
    }

    const dataSource = await this.tenantConnectionManager.getDataSource();
    const itemRepo = dataSource.getRepository(PurchaseOrderItem);

    const item = await itemRepo.findOne({
      where: { id: itemId, purchaseOrderId },
    });

    if (!item) {
      throw new NotFoundException(
        `Item ${itemId} not found on purchase order ${purchaseOrderId}`,
      );
    }

    await itemRepo.delete(itemId);
    await this.recalculateTotals(purchaseOrderId, dataSource);
  }

  // ── Bulk validate ──────────────────────────────────────────────────────

  /**
   * Validate a batch of SKUs without touching the database (read-only).
   * Used by the frontend before the user confirms a bulk import.
   */
  async bulkValidateItems(
    inputs: BulkValidateItemInput[],
  ): Promise<BulkValidateResponse> {
    const dataSource = await this.tenantConnectionManager.getDataSource();
    const productRepo = dataSource.getRepository(Product);
    const variantRepo = dataSource.getRepository(ProductVariant);
    const uomRepo = dataSource.getRepository(UnitOfMeasure);

    const items: BulkValidateItemResult[] = await Promise.all(
      inputs.map(async (input) => {
        const sku = (input.product_sku ?? '').trim();
        if (!sku) {
          return {
            product_sku: sku,
            status: 'not_found' as const,
            statusMsg: 'product_sku is required',
          };
        }

        const product = await productRepo.findOne({
          where: { sku },
          relations: ['baseUom'],
        });

        if (!product) {
          return {
            product_sku: sku,
            status: 'not_found' as const,
            statusMsg: `SKU "${sku}" not found`,
          };
        }

        if (!product.isPurchasable) {
          return {
            product_sku: sku,
            status: 'not_found' as const,
            statusMsg: `Product "${sku}" is not purchasable`,
          };
        }

        // Resolve UOM
        let uomId: string | null = product.baseUomId ?? null;
        let uomName: string | null = (product as any).baseUom?.uomName ?? null;

        if (input.uom_code) {
          const uom = await uomRepo.findOne({
            where: { uomCode: input.uom_code.toUpperCase() },
          });
          if (uom) {
            uomId = uom.id;
            uomName = uom.uomName;
          }
        }

        // Validate variant if provided
        if (input.variant_sku) {
          const variant = await variantRepo.findOne({
            where: { variantSku: input.variant_sku, productId: product.id },
          });
          if (!variant) {
            return {
              product_sku: sku,
              status: 'not_found' as const,
              statusMsg: `Variant SKU "${input.variant_sku}" not found for product "${sku}"`,
            };
          }
        }

        const resolvedUnitPrice =
          input.unit_price ?? Number(product.costPrice ?? 0);

        return {
          product_sku: sku,
          status: 'found' as const,
          productId: product.id,
          productName: product.productName,
          resolvedUnitPrice,
          uomId,
          uomName,
        };
      }),
    );

    return { items };
  }

  // ── Bulk upload ────────────────────────────────────────────────────────

  /**
   * Parse an uploaded Excel (.xlsx) or CSV (.csv) file and add all valid rows
   * as line items to the purchase order.
   *
   * Returns a summary: { total, succeeded, failed, errors[] }
   */
  async bulkUploadItems(
    purchaseOrderId: string,
    file: Express.Multer.File,
  ): Promise<BulkUploadResult> {
    const po = await this.findById(purchaseOrderId);

    if (
      ![
        PurchaseOrderStatus.DRAFT,
        PurchaseOrderStatus.PENDING_APPROVAL,
      ].includes(po.status)
    ) {
      throw new BadRequestException(
        'Items can only be bulk-uploaded to DRAFT or PENDING_APPROVAL orders',
      );
    }

    const rows = await this.parseUploadFile(file);
    const dataSource = await this.tenantConnectionManager.getDataSource();

    const productRepo = dataSource.getRepository(Product);
    const variantRepo = dataSource.getRepository(ProductVariant);
    const uomRepo = dataSource.getRepository(UnitOfMeasure);
    const itemRepo = dataSource.getRepository(PurchaseOrderItem);

    const errors: BulkRowError[] = [];
    let succeeded = 0;

    for (const row of rows) {
      try {
        // 1. Look up product by SKU
        const product = await productRepo.findOne({
          where: { sku: row.productSku },
          relations: ['taxCategory', 'taxCategory.taxRates'],
        });

        if (!product) {
          throw new Error(`Product SKU "${row.productSku}" not found`);
        }

        if (!product.isPurchasable) {
          throw new Error(`Product "${row.productSku}" is not purchasable`);
        }

        // 2. Look up variant (optional)
        let variantId: string | undefined;
        if (row.variantSku) {
          const variant = await variantRepo.findOne({
            where: { variantSku: row.variantSku, productId: product.id },
          });
          if (!variant) {
            throw new Error(
              `Variant SKU "${row.variantSku}" not found for product "${row.productSku}"`,
            );
          }
          variantId = variant.id;
        }

        // 3. Resolve UOM (optional — falls back to product base UOM)
        let uomId = product.baseUomId;
        if (row.uomCode) {
          const uom = await uomRepo.findOne({
            where: { uomCode: row.uomCode.toUpperCase() },
          });
          if (!uom) {
            throw new Error(`UOM code "${row.uomCode}" not found`);
          }
          uomId = uom.id;
        }

        // 4. Calculate amounts (same logic as addItem)
        const unitPrice = row.unitPrice ?? Number(product.costPrice ?? 0);
        const discountPercent = row.discountPercent ?? 0;
        const grossAmount = row.quantity * unitPrice;
        const lineDiscount = (grossAmount * discountPercent) / 100;
        const taxableAmount = grossAmount - lineDiscount;

        let taxAmount = 0;
        let taxPercentage = 0;
        if (product.taxCategory?.taxRates) {
          const activeRate = product.taxCategory.taxRates.find(
            (r) => r.isActive,
          );
          if (activeRate) {
            taxPercentage = Number(activeRate.ratePercentage);
            taxAmount = (taxableAmount * taxPercentage) / 100;
          }
        }

        const lineTotal = taxableAmount + taxAmount;

        // 5. Save item
        const item = itemRepo.create({
          id: uuidv4(),
          purchaseOrderId,
          productId: product.id,
          variantId,
          productName: product.productName,
          productSku: product.sku,
          quantityOrdered: row.quantity,
          uomId,
          unitPrice,
          discountPercentage: discountPercent,
          discountAmount: lineDiscount,
          taxPercentage,
          taxAmount,
          lineTotal,
          notes: row.notes,
        } as DeepPartial<PurchaseOrderItem>);

        await itemRepo.save(item);
        succeeded++;
      } catch (err) {
        errors.push({
          row: row.rowNumber,
          productSku: row.productSku,
          error: (err as Error).message,
        });
      }
    }

    // Recalculate PO totals once after all inserts
    if (succeeded > 0) {
      await this.recalculateTotals(purchaseOrderId, dataSource);
    }

    return {
      total: rows.length,
      succeeded,
      failed: errors.length,
      errors,
    };
  }

  /**
   * Generate and return a filled Excel template buffer so users know
   * the exact column format expected.
   */
  async generateUploadTemplate(): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('PO Items');

    // Column headers
    sheet.columns = [
      { header: 'product_sku', key: 'product_sku', width: 20 },
      { header: 'variant_sku', key: 'variant_sku', width: 20 },
      { header: 'quantity', key: 'quantity', width: 12 },
      { header: 'unit_price', key: 'unit_price', width: 14 },
      { header: 'uom_code', key: 'uom_code', width: 14 },
      { header: 'discount_percent', key: 'discount_percent', width: 18 },
      { header: 'notes', key: 'notes', width: 30 },
    ];

    // Style header row
    const headerRow = sheet.getRow(1);
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD9E1F2' },
    };

    // Sample row
    sheet.addRow({
      product_sku: 'PROD-001',
      variant_sku: '',
      quantity: 10,
      unit_price: 250.0,
      uom_code: 'PCS',
      discount_percent: 5,
      notes: 'Sample note',
    });

    // Instructions sheet
    const info = workbook.addWorksheet('Instructions');
    info.getColumn(1).width = 25;
    info.getColumn(2).width = 60;
    const instructions = [
      ['Column', 'Description'],
      ['product_sku', 'Required. The unique SKU of the product.'],
      ['variant_sku', 'Optional. Leave blank if the product has no variants.'],
      ['quantity', 'Required. Quantity to order (must be > 0).'],
      ['unit_price', 'Optional. Overrides the product cost price if provided.'],
      [
        'uom_code',
        'Optional. Unit of measure code (e.g. PCS, KG). Defaults to product base UOM.',
      ],
      [
        'discount_percent',
        'Optional. Discount percentage 0-100. Default is 0.',
      ],
      ['notes', 'Optional. Line item notes.'],
    ];
    instructions.forEach((r, i) => {
      const row = info.addRow(r);
      if (i === 0) row.font = { bold: true };
    });

    return Buffer.from(await workbook.xlsx.writeBuffer());
  }

  // ── Private: file parser ────────────────────────────────────────────────

  private async parseUploadFile(
    file: Express.Multer.File,
  ): Promise<BulkItemRow[]> {
    const ext = file.originalname.split('.').pop()?.toLowerCase();

    if (!ext || !['xlsx', 'xls', 'csv'].includes(ext)) {
      throw new BadRequestException(
        'Unsupported file type. Please upload an .xlsx or .csv file.',
      );
    }

    const workbook = new ExcelJS.Workbook();

    if (ext === 'csv') {
      const { Readable } = await import('stream');
      const stream = Readable.from(file.buffer);
      await workbook.csv.read(stream);
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      await workbook.xlsx.load(file.buffer as any);
    }

    const sheet = workbook.worksheets[0];
    if (!sheet) {
      throw new BadRequestException(
        'The uploaded file contains no worksheets.',
      );
    }

    // Safely extract a plain string from any ExcelJS CellValue type
    const cellText = (v: ExcelJS.CellValue): string => {
      if (v === null || v === undefined) return '';
      if (v instanceof Date) return v.toISOString();
      if (typeof v !== 'object') return String(v);
      if ('richText' in v) return v.richText.map((rt) => rt.text).join('');
      if ('result' in v) {
        const res = v.result;
        if (res === null || res === undefined) return '';
        if (typeof res === 'object') return '';
        return String(res);
      }
      return '';
    };

    // Normalise header names: lowercase, replace spaces/hyphens with underscore
    const normalise = (s: string) =>
      s
        .trim()
        .toLowerCase()
        .replace(/[\s-]+/g, '_');

    const headerRow = sheet.getRow(1);
    const colMap: Record<string, number> = {};
    headerRow.eachCell((cell, col) => {
      colMap[normalise(cellText(cell.value))] = col;
    });

    const required = ['product_sku', 'quantity'];
    for (const col of required) {
      if (!colMap[col]) {
        throw new BadRequestException(
          `Missing required column: "${col}". ` +
            'Download the template from GET /purchase-orders/bulk-upload/template',
        );
      }
    }

    const rows: BulkItemRow[] = [];

    sheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return; // skip header

      const get = (key: string): string =>
        cellText(row.getCell(colMap[key] ?? 0).value).trim();

      const productSku = get('product_sku');
      if (!productSku) return; // skip blank rows

      const qty = parseFloat(get('quantity'));
      if (isNaN(qty) || qty <= 0) {
        rows.push({
          rowNumber,
          productSku,
          quantity: 0,
          // mark as invalid — caught in the loop above
        });
        // We still push so error reporting includes the row
        rows[rows.length - 1].notes = '__INVALID_QTY__';
        return;
      }

      rows.push({
        rowNumber,
        productSku,
        variantSku: get('variant_sku') || undefined,
        quantity: qty,
        unitPrice: colMap['unit_price']
          ? parseFloat(get('unit_price')) || undefined
          : undefined,
        uomCode: get('uom_code') || undefined,
        discountPercent: colMap['discount_percent']
          ? parseFloat(get('discount_percent')) || 0
          : 0,
        notes: get('notes') || undefined,
      });
    });

    return rows;
  }

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
