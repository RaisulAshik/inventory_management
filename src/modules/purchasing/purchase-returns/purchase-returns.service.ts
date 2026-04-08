import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Repository, DataSource, DeepPartial, IsNull } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { TenantConnectionManager } from '@database/tenant-connection.manager';
import { PaginatedResult } from '@common/interfaces';
import { paginate } from '@common/utils/pagination.util';
import { getNextSequence } from '@common/utils/sequence.util';
import { StockMovementType, DueStatus } from '@common/enums';
import {
  PurchaseReturn,
  PurchaseOrder,
  PurchaseReturnStatus,
  PurchaseReturnItem,
  InventoryStock,
  StockMovement,
  SupplierDue,
  GoodsReceivedNote,
} from '@entities/tenant';
import { CreatePurchaseReturnDto } from './dto/create-purchase-return.dto';
import { PurchaseReturnFilterDto } from './dto/purchase-return-filter.dto';
import { UpdatePurchaseReturnDto } from './dto/update-purchase-return.dto';
import { AccountingIntegrationService } from '@modules/accounting/service/accounting-integration.service';

@Injectable()
export class PurchaseReturnsService {
  constructor(
    private readonly tenantConnectionManager: TenantConnectionManager,
    private readonly accountingIntegration: AccountingIntegrationService,
  ) {}

  private async getPurchaseReturnRepository(): Promise<
    Repository<PurchaseReturn>
  > {
    return this.tenantConnectionManager.getRepository(PurchaseReturn);
  }

  /**
   * Create a new purchase return
   */
  async create(
    createDto: CreatePurchaseReturnDto,
    createdBy: string,
  ): Promise<PurchaseReturn> {
    const returnRepo = await this.getPurchaseReturnRepository();
    const dataSource = await this.tenantConnectionManager.getDataSource();

    // Validate GRN or Purchase Order
    let supplierId: string;
    let warehouseId: string;
    let currency: string;

    if (createDto.grnId) {
      const grnRepo = dataSource.getRepository(GoodsReceivedNote);
      const grn = await grnRepo.findOne({
        where: { id: createDto.grnId },
        relations: ['items'],
      });

      if (!grn) {
        throw new NotFoundException(`GRN with ID ${createDto.grnId} not found`);
      }

      supplierId = grn.supplierId;
      warehouseId = createDto.warehouseId || grn.warehouseId;
      currency = grn.currency;

      // Validate items against GRN
      this.validateReturnItemsAgainstGrn(grn, createDto.items);
    } else if (createDto.purchaseOrderId) {
      const poRepo = dataSource.getRepository(PurchaseOrder);
      const po = await poRepo.findOne({
        where: { id: createDto.purchaseOrderId },
        relations: ['items'],
      });

      if (!po) {
        throw new NotFoundException(
          `Purchase order with ID ${createDto.purchaseOrderId} not found`,
        );
      }

      supplierId = po.supplierId;
      warehouseId = createDto.warehouseId || po.warehouseId;
      currency = po.currency;

      // Validate items against PO
      await this.validateReturnItemsAgainstPo(po, createDto.items, dataSource);
    } else {
      throw new BadRequestException(
        'Either GRN ID or Purchase Order ID is required',
      );
    }

    // Generate return number
    const returnNumber = await getNextSequence(dataSource, 'PURCHASE_RETURN');

    // Calculate totals
    const totals = this.calculateReturnTotals(createDto.items);

    const purchaseReturn = returnRepo.create({
      id: uuidv4(),
      returnNumber,
      purchaseOrderId: createDto.purchaseOrderId,
      grnId: createDto.grnId,
      supplierId,
      warehouseId,
      returnDate: createDto.returnDate || new Date(),
      status: PurchaseReturnStatus.DRAFT,
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

    // Create return items
    await this.createReturnItems(savedReturn.id, createDto.items, dataSource);

    return this.findById(savedReturn.id);
  }

  /**
   * Validate return items against GRN
   */
  private validateReturnItemsAgainstGrn(grn: GoodsReceivedNote, items: any[]) {
    for (const itemDto of items) {
      const grnItem = grn.items.find(
        (i) =>
          i.productId === itemDto.productId &&
          (!itemDto.variantId || i.variantId === itemDto.variantId),
      );

      if (!grnItem) {
        throw new BadRequestException(
          `Product ${itemDto.productId} was not in the GRN`,
        );
      }

      // Check returnable quantity
      const returnableQty =
        Number(grnItem.quantityAccepted) -
        (Number(grnItem.quantityRejected) || 0);
      if (itemDto.quantity > returnableQty) {
        throw new BadRequestException(
          `Cannot return ${itemDto.quantity} units of product ${itemDto.productId}. ` +
            `Only ${returnableQty} available for return.`,
        );
      }
    }
  }

  /**
   * Validate return items against PO
   */
  private async validateReturnItemsAgainstPo(
    po: PurchaseOrder,
    items: any[],
    dataSource: DataSource,
  ): Promise<void> {
    const existingReturnsRepo = dataSource.getRepository(PurchaseReturnItem);

    for (const itemDto of items) {
      const poItem = po.items.find(
        (i) =>
          i.productId === itemDto.productId &&
          (!itemDto.variantId || i.variantId === itemDto.variantId),
      );

      if (!poItem) {
        throw new BadRequestException(
          `Product ${itemDto.productId} was not in the purchase order`,
        );
      }

      // Check already returned quantity
      const alreadyReturned = await existingReturnsRepo
        .createQueryBuilder('item')
        .innerJoin('item.purchaseReturn', 'return')
        .where('return.purchaseOrderId = :poId', { poId: po.id })
        .andWhere('item.productId = :productId', {
          productId: itemDto.productId,
        })
        .andWhere('return.status NOT IN (:...statuses)', {
          statuses: [
            PurchaseReturnStatus.CANCELLED,
            PurchaseReturnStatus.REJECTED,
          ],
        })
        .select('SUM(item.quantity)', 'total')
        .getRawOne();

      const returnedQty = parseFloat(alreadyReturned?.total) || 0;
      const receivedQty = Number(poItem.quantityReceived) || 0;
      const availableForReturn = receivedQty - returnedQty;

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
  private calculateReturnTotals(items: any[]): {
    subtotal: number;
    taxAmount: number;
    totalAmount: number;
  } {
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

  /**
   * Create return items
   */
  private async createReturnItems(
    returnId: string,
    items: any[],
    dataSource: DataSource,
  ): Promise<void> {
    const itemRepo = dataSource.getRepository(PurchaseReturnItem);

    for (let i = 0; i < items.length; i++) {
      const itemDto = items[i];

      const lineTotal =
        itemDto.quantity * itemDto.unitPrice + (itemDto.taxAmount || 0);

      const item = itemRepo.create({
        id: uuidv4(),
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
      } as DeepPartial<PurchaseReturnItem>);

      await itemRepo.save(item);
    }
  }

  /**
   * Find all purchase returns with filters and pagination
   */
  async findAll(
    filterDto: PurchaseReturnFilterDto,
  ): Promise<PaginatedResult<PurchaseReturn>> {
    const returnRepo = await this.getPurchaseReturnRepository();

    const queryBuilder = returnRepo
      .createQueryBuilder('return')
      .leftJoinAndSelect('return.supplier', 'supplier')
      .leftJoinAndSelect('return.warehouse', 'warehouse')
      .leftJoinAndSelect('return.purchaseOrder', 'purchaseOrder')
      .leftJoinAndSelect('return.grn', 'grn')
      .leftJoinAndSelect('return.items', 'items');

    // Apply filters
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

    // Apply search
    if (filterDto.search) {
      queryBuilder.andWhere(
        '(return.returnNumber LIKE :search OR purchaseOrder.poNumber LIKE :search OR supplier.companyName LIKE :search)',
        { search: `%${filterDto.search}%` },
      );
    }

    if (!filterDto.sortBy) {
      filterDto.sortBy = 'returnDate';
      filterDto.sortOrder = 'DESC';
    }

    return paginate(queryBuilder, filterDto);
  }

  /**
   * Find purchase return by ID
   */
  async findById(id: string): Promise<PurchaseReturn> {
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
      throw new NotFoundException(`Purchase return with ID ${id} not found`);
    }

    return purchaseReturn;
  }

  /**
   * Update purchase return
   */
  async update(
    id: string,
    updateDto: UpdatePurchaseReturnDto,
  ): Promise<PurchaseReturn> {
    const returnRepo = await this.getPurchaseReturnRepository();
    const purchaseReturn = await this.findById(id);

    if (purchaseReturn.status !== PurchaseReturnStatus.DRAFT) {
      throw new BadRequestException('Only draft returns can be updated');
    }

    Object.assign(purchaseReturn, updateDto);
    await returnRepo.save(purchaseReturn);

    return this.findById(id);
  }

  /**
   * Submit for approval
   */
  async submitForApproval(id: string): Promise<PurchaseReturn> {
    const returnRepo = await this.getPurchaseReturnRepository();
    const purchaseReturn = await this.findById(id);

    if (purchaseReturn.status !== PurchaseReturnStatus.DRAFT) {
      throw new BadRequestException('Only draft returns can be submitted');
    }

    if (!purchaseReturn.items || purchaseReturn.items.length === 0) {
      throw new BadRequestException('Return must have at least one item');
    }

    purchaseReturn.status = PurchaseReturnStatus.PENDING_APPROVAL;
    await returnRepo.save(purchaseReturn);

    return this.findById(id);
  }

  /**
   * Approve purchase return
   */
  async approve(id: string, approvedBy: string): Promise<PurchaseReturn> {
    const returnRepo = await this.getPurchaseReturnRepository();
    const purchaseReturn = await this.findById(id);

    if (purchaseReturn.status !== PurchaseReturnStatus.PENDING_APPROVAL) {
      throw new BadRequestException('Only pending returns can be approved');
    }

    purchaseReturn.status = PurchaseReturnStatus.APPROVED;
    purchaseReturn.approvedBy = approvedBy;
    purchaseReturn.approvedAt = new Date();
    await returnRepo.save(purchaseReturn);

    // Auto-post: DR AP / CR Inventory (+ CR Input VAT if applicable)
    void this.accountingIntegration.postPurchaseReturn(purchaseReturn);

    return this.findById(id);
  }

  /**
   * Ship return to supplier
   */
  async ship(
    id: string,
    shippedBy: string,
    trackingNumber?: string,
  ): Promise<PurchaseReturn> {
    //const returnRepo = await this.getPurchaseReturnRepository();
    const dataSource = await this.tenantConnectionManager.getDataSource();
    const purchaseReturn = await this.findById(id);

    if (purchaseReturn.status !== PurchaseReturnStatus.APPROVED) {
      throw new BadRequestException('Only approved returns can be shipped');
    }

    await dataSource.transaction(async (manager) => {
      const stockRepo = manager.getRepository(InventoryStock);
      const movementRepo = manager.getRepository(StockMovement);

      for (const item of purchaseReturn.items) {
        // Reduce stock
        const stock = await stockRepo.findOne({
          where: {
            productId: item.productId,
            warehouseId: purchaseReturn.warehouseId,
            variantId: item.variantId || IsNull(),
          },
          lock: { mode: 'pessimistic_write' },
        });

        if (stock) {
          if (Number(stock.quantityOnHand) < Number(item.quantity)) {
            throw new BadRequestException(
              `Insufficient stock for product ${item.product?.productName}`,
            );
          }

          stock.quantityOnHand -= Number(item.quantity);
          await stockRepo.save(stock);
        }

        // Record stock movement
        const movement = movementRepo.create({
          id: uuidv4(),
          movementNumber: await getNextSequence(dataSource, 'STOCK_MOVEMENT'),
          movementType: StockMovementType.RETURN_TO_SUPPLIER,
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

      // Update return status
      purchaseReturn.status = PurchaseReturnStatus.SHIPPED;
      purchaseReturn.shippedBy = shippedBy;
      purchaseReturn.shippedAt = new Date();
      if (trackingNumber) {
        purchaseReturn.trackingNumber = trackingNumber;
      }
      await manager.getRepository(PurchaseReturn).save(purchaseReturn);
    });

    return this.findById(id);
  }

  /**
   * Mark as received by supplier
   */
  async confirmReceipt(id: string): Promise<PurchaseReturn> {
    const returnRepo = await this.getPurchaseReturnRepository();
    const purchaseReturn = await this.findById(id);

    if (purchaseReturn.status !== PurchaseReturnStatus.SHIPPED) {
      throw new BadRequestException(
        'Only shipped returns can be confirmed as received',
      );
    }

    purchaseReturn.status = PurchaseReturnStatus.RECEIVED_BY_SUPPLIER;
    purchaseReturn.receivedBySupplierAt = new Date();
    await returnRepo.save(purchaseReturn);

    return this.findById(id);
  }

  /**
   * Process credit note
   */
  async processCreditNote(
    id: string,
    creditNoteNumber: string,
    creditAmount: number,
    processedBy: string,
  ): Promise<PurchaseReturn> {
    //const returnRepo = await this.getPurchaseReturnRepository();
    const dataSource = await this.tenantConnectionManager.getDataSource();
    const purchaseReturn = await this.findById(id);

    if (purchaseReturn.status !== PurchaseReturnStatus.RECEIVED_BY_SUPPLIER) {
      throw new BadRequestException(
        'Credit note can only be processed after supplier receives the return',
      );
    }

    if (creditAmount > Number(purchaseReturn.totalAmount)) {
      throw new BadRequestException(
        `Credit amount cannot exceed return total of ${purchaseReturn.totalAmount}`,
      );
    }

    await dataSource.transaction(async (manager) => {
      // Update return
      purchaseReturn.creditNoteNumber = creditNoteNumber;
      purchaseReturn.creditNoteAmount = creditAmount;
      purchaseReturn.creditNoteDate = new Date();
      purchaseReturn.updatedBy = processedBy;
      purchaseReturn.status = PurchaseReturnStatus.CREDIT_NOTE_RECEIVED;
      await manager.getRepository(PurchaseReturn).save(purchaseReturn);

      // Create credit adjustment in supplier dues
      const dueRepo = manager.getRepository(SupplierDue);

      // Find existing due for the PO
      if (purchaseReturn.purchaseOrderId) {
        const existingDue = await dueRepo.findOne({
          where: { purchaseOrderId: purchaseReturn.purchaseOrderId },
        });

        if (existingDue) {
          existingDue.adjustedAmount =
            Number(existingDue.adjustedAmount) + creditAmount;

          const remaining =
            Number(existingDue.originalAmount) -
            Number(existingDue.paidAmount) -
            Number(existingDue.adjustedAmount);

          if (remaining <= 0) {
            existingDue.status = DueStatus.PAID;
          }

          await dueRepo.save(existingDue);
        }
      }
    });

    return this.findById(id);
  }

  /**
   * Complete purchase return
   */
  async complete(id: string): Promise<PurchaseReturn> {
    const returnRepo = await this.getPurchaseReturnRepository();
    const purchaseReturn = await this.findById(id);

    if (purchaseReturn.status !== PurchaseReturnStatus.CREDIT_NOTE_RECEIVED) {
      throw new BadRequestException(
        'Return must have credit note before completion',
      );
    }

    purchaseReturn.status = PurchaseReturnStatus.COMPLETED;
    await returnRepo.save(purchaseReturn);

    return this.findById(id);
  }

  /**
   * Reject purchase return
   */
  async reject(
    id: string,
    rejectedBy: string,
    reason: string,
  ): Promise<PurchaseReturn> {
    const returnRepo = await this.getPurchaseReturnRepository();
    const purchaseReturn = await this.findById(id);

    if (purchaseReturn.status !== PurchaseReturnStatus.PENDING_APPROVAL) {
      throw new BadRequestException('Only pending returns can be rejected');
    }

    purchaseReturn.status = PurchaseReturnStatus.REJECTED;
    purchaseReturn.rejectionReason = reason;
    await returnRepo.save(purchaseReturn);

    return this.findById(id);
  }

  /**
   * Cancel purchase return
   */
  async cancel(
    id: string,
    cancelledBy: string,
    reason: string,
  ): Promise<PurchaseReturn> {
    const returnRepo = await this.getPurchaseReturnRepository();
    const purchaseReturn = await this.findById(id);

    if (
      [
        PurchaseReturnStatus.SHIPPED,
        PurchaseReturnStatus.RECEIVED_BY_SUPPLIER,
        PurchaseReturnStatus.CREDIT_NOTE_RECEIVED,
        PurchaseReturnStatus.COMPLETED,
      ].includes(purchaseReturn.status)
    ) {
      throw new BadRequestException(
        'Cannot cancel return that has been shipped or completed',
      );
    }

    purchaseReturn.status = PurchaseReturnStatus.CANCELLED;
    purchaseReturn.notes = `Cancelled by: ${cancelledBy}. Reason: ${reason}`;
    await returnRepo.save(purchaseReturn);

    return this.findById(id);
  }

  /**
   * Delete purchase return (draft only)
   */
  async remove(id: string): Promise<void> {
    const returnRepo = await this.getPurchaseReturnRepository();
    const purchaseReturn = await this.findById(id);

    if (purchaseReturn.status !== PurchaseReturnStatus.DRAFT) {
      throw new BadRequestException('Only draft returns can be deleted');
    }

    await returnRepo.delete(id);
  }
}
