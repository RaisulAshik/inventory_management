import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  Repository,
  DataSource,
  DeepPartial,
  IsNull,
  EntityManager,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { TenantConnectionManager } from '@database/tenant-connection.manager';
import { PaginationDto } from '@common/dto/pagination.dto';
import { PaginatedResult } from '@common/interfaces';
import { paginate } from '@common/utils/pagination.util';
import { getNextSequence } from '@common/utils/sequence.util';
import {
  GRNStatus,
  PurchaseOrderStatus,
  StockMovementType,
} from '@common/enums';
import { PurchaseOrdersService } from '../purchase-orders/purchase-orders.service';
import {
  PurchaseOrder,
  GrnItem,
  InventoryStock,
  StockMovement,
  InventoryBatch,
  PurchaseOrderItem,
  GoodsReceivedNote,
} from '@entities/tenant';
import { CreateGrnDto } from './dto/create-grn.dto';
import { GrnFilterDto } from './dto/grn-filter.dto';
import { UpdateGrnDto } from './dto/update-grn.dto';
import { SupplierDuesService } from '@/modules/due-management';
import { StockService } from '@/modules/warehouse/stock/stock.service';

@Injectable()
export class GrnService {
  constructor(
    private readonly tenantConnectionManager: TenantConnectionManager,
    private readonly purchaseOrdersService: PurchaseOrdersService,
    private readonly supplierDuesService: SupplierDuesService,
    private readonly stockService: StockService, // ← Add this
  ) {}

  private async getGrnRepository(): Promise<Repository<GoodsReceivedNote>> {
    return this.tenantConnectionManager.getRepository(GoodsReceivedNote);
  }

  /**
   * Create a new GRN
   */
  async create(
    createDto: CreateGrnDto,
    createdBy: string,
  ): Promise<GoodsReceivedNote> {
    const grnRepo = await this.getGrnRepository();
    const dataSource = await this.tenantConnectionManager.getDataSource();

    // Validate purchase order
    const po = await this.purchaseOrdersService.findById(
      createDto.purchaseOrderId,
    );

    if (
      ![
        PurchaseOrderStatus.SENT,
        PurchaseOrderStatus.ACKNOWLEDGED,
        PurchaseOrderStatus.PARTIALLY_RECEIVED,
      ].includes(po.status)
    ) {
      throw new BadRequestException(
        'Purchase order is not in a receivable status',
      );
    }

    // Validate items
    this.validateGrnItems(po, createDto.items);

    // Generate GRN number
    const grnNumber = await getNextSequence(dataSource, 'GRN');

    // Calculate totals
    const totals = this.calculateGrnTotals(createDto.items);

    const grn = grnRepo.create({
      id: uuidv4(),
      grnNumber,
      grnDate: new Date(),
      purchaseOrderId: createDto.purchaseOrderId,
      supplierId: po.supplierId,
      warehouseId: createDto.warehouseId || po.warehouseId,
      receiptDate: createDto.receiptDate || new Date(),
      status: GRNStatus.DRAFT,
      supplierInvoiceNumber: createDto.supplierInvoiceNumber,
      supplierInvoiceDate: createDto.supplierInvoiceDate,
      currency: po.currency,
      subtotal: totals.subtotal,
      taxAmount: totals.taxAmount,
      totalAmount: totals.totalAmount,
      notes: createDto.notes,
      createdBy,
    } as DeepPartial<GoodsReceivedNote>);

    const savedGrn = await grnRepo.save(grn);

    // Create GRN items
    await this.createGrnItems(savedGrn.id, po, createDto.items, dataSource);

    return this.findById(savedGrn.id);
  }

  /**
   * Validate GRN items against PO
   */
  private validateGrnItems(po: PurchaseOrder, items: any[]) {
    for (const itemDto of items) {
      const poItem = po.items.find(
        (i) =>
          i.productId === itemDto.productId &&
          (!itemDto.variantId || i.variantId === itemDto.variantId),
      );

      if (!poItem) {
        throw new BadRequestException(
          `Product ${itemDto.productId} is not in the purchase order`,
        );
      }

      const pendingQuantity =
        Number(poItem.quantityOrdered) - (Number(poItem.quantityReceived) || 0);

      if (itemDto.receivedQuantity > pendingQuantity) {
        throw new BadRequestException(
          `Cannot receive ${itemDto.receivedQuantity} units of product ${itemDto.productId}. ` +
            `Only ${pendingQuantity} pending.`,
        );
      }
    }
  }

  /**
   * Calculate GRN totals
   */
  private calculateGrnTotals(items: any[]): {
    subtotal: number;
    taxAmount: number;
    totalAmount: number;
  } {
    let subtotal = 0;
    let taxAmount = 0;

    for (const item of items) {
      const lineSubtotal =
        (item.receivedQuantity - (item.rejectedQuantity || 0)) * item.unitPrice;
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
   * Create GRN items
   */
  private async createGrnItems(
    grnId: string,
    po: PurchaseOrder,
    items: any[],
    dataSource: DataSource,
  ): Promise<void> {
    const itemRepo = dataSource.getRepository(GrnItem);

    for (const itemDto of items) {
      const poItem = po.items.find(
        (pi) =>
          pi.productId === itemDto.productId &&
          (!itemDto.variantId || pi.variantId === itemDto.variantId),
      );

      if (!poItem) continue;

      const acceptedQuantity =
        itemDto.receivedQuantity - (itemDto.rejectedQuantity || 0);
      const lineTotal =
        acceptedQuantity * (itemDto.unitPrice || Number(poItem.unitPrice));

      const item = itemRepo.create({
        id: uuidv4(),
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
      } as DeepPartial<GrnItem>);

      await itemRepo.save(item);
    }
  }

  /**
   * Find all GRNs with filters and pagination
   */
  async findAll(
    paginationDto: PaginationDto,
    filterDto: GrnFilterDto,
  ): Promise<PaginatedResult<GoodsReceivedNote>> {
    const grnRepo = await this.getGrnRepository();

    const queryBuilder = grnRepo
      .createQueryBuilder('grn')
      .leftJoinAndSelect('grn.supplier', 'supplier')
      .leftJoinAndSelect('grn.warehouse', 'warehouse')
      .leftJoinAndSelect('grn.purchaseOrder', 'purchaseOrder')
      .leftJoinAndSelect('grn.items', 'items');

    // Apply filters
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

    // Apply search
    if (paginationDto.search) {
      queryBuilder.andWhere(
        '(grn.grnNumber LIKE :search OR grn.supplierInvoiceNumber LIKE :search OR purchaseOrder.poNumber LIKE :search)',
        { search: `%${paginationDto.search}%` },
      );
    }

    if (!paginationDto.sortBy) {
      paginationDto.sortBy = 'receiptDate';
      paginationDto.sortOrder = 'DESC';
    }

    return paginate(queryBuilder, paginationDto);
  }

  /**
   * Find GRN by ID
   */
  async findById(id: string): Promise<GoodsReceivedNote> {
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
      throw new NotFoundException(`GRN with ID ${id} not found`);
    }

    return grn;
  }

  /**
   * Update GRN
   */
  async update(
    id: string,
    updateDto: UpdateGrnDto,
  ): Promise<GoodsReceivedNote> {
    const grnRepo = await this.getGrnRepository();
    const grn = await this.findById(id);

    if (grn.status !== GRNStatus.DRAFT) {
      throw new BadRequestException('Only draft GRNs can be updated');
    }

    Object.assign(grn, updateDto);
    await grnRepo.save(grn);

    return this.findById(id);
  }

  /**
   * Submit GRN for approval
   */
  async submitForApproval(id: string): Promise<GoodsReceivedNote> {
    const grnRepo = await this.getGrnRepository();
    const grn = await this.findById(id);

    if (grn.status !== GRNStatus.DRAFT) {
      throw new BadRequestException('Only draft GRNs can be submitted');
    }

    if (!grn.items || grn.items.length === 0) {
      throw new BadRequestException('GRN must have at least one item');
    }

    grn.status = GRNStatus.PENDING_QC;
    await grnRepo.save(grn);

    return this.findById(id);
  }

  /**
   * Complete quality check
   */
  async completeQc(id: string, qcBy: string): Promise<GoodsReceivedNote> {
    const grnRepo = await this.getGrnRepository();
    const grn = await this.findById(id);

    if (grn.status !== GRNStatus.PENDING_QC) {
      throw new BadRequestException('GRN is not pending QC');
    }

    grn.status = GRNStatus.QC_PASSED;
    grn.qcAt = new Date();
    grn.qcBy = qcBy;
    await grnRepo.save(grn);

    return this.findById(id);
  }

  /**
   * Approve GRN and update stock
   */

  async approve(id: string, userId: string): Promise<GoodsReceivedNote> {
    const dataSource = await this.tenantConnectionManager.getDataSource();
    const grn = await this.findById(id);

    if (grn.status !== GRNStatus.PENDING_QC) {
      throw new BadRequestException('Only pending GRNs can be approved');
    }

    await dataSource.transaction(async (manager) => {
      const grnRepo = manager.getRepository(GoodsReceivedNote);

      // 1. Approve GRN
      grn.status = GRNStatus.ACCEPTED;
      grn.approvedBy = userId;
      grn.approvedAt = new Date();
      await grnRepo.save(grn);

      // 2. Update stock (existing logic)
      for (const item of grn.items) {
        await this.stockService.recordMovement(
          {
            productId: item.productId,
            variantId: item.variantId,
            warehouseId: grn.warehouseId,
            uomId: item.uomId,
            quantity: item.quantityAccepted,
            movementType: StockMovementType.PURCHASE_RECEIPT,
            referenceId: grn.id,
            referenceNumber: grn.grnNumber,
            unitCost: item.unitPrice,
            reason: `GRN Approval: ${grn.grnNumber}`,
          },
          userId,
        );
      }

      // 3. Create SupplierDue for the received amount ← NEW
      if (grn.totalValue > 0) {
        // Calculate due date based on supplier payment terms
        const dueDate = new Date();
        const paymentTermsDays = grn.purchaseOrder?.paymentTermsDays || 30;
        dueDate.setDate(dueDate.getDate() + paymentTermsDays);

        await this.supplierDuesService.createFromGRN(
          grn.supplierId,
          grn.purchaseOrderId,
          grn.grnNumber, // referenceNumber
          Number(grn.totalValue), // amount
          dueDate, // dueDate
          grn.supplierInvoiceNumber, // billNumber (if supplier attached invoice)
          grn.supplierInvoiceDate, // billDate
          grn.currency || '$', // currency
        );
      }

      // 4. Update PO received quantities (existing logic)
      if (grn.purchaseOrderId) {
        await this.updatePurchaseOrderReceived(
          grn.purchaseOrderId,
          grn,
          manager,
        );
      }
    });

    return this.findById(id);
  }

  private async updatePurchaseOrderReceived(
    purchaseOrderId: string,
    grn: GoodsReceivedNote,
    manager: EntityManager,
  ): Promise<void> {
    const poItemRepo = manager.getRepository(PurchaseOrderItem);

    for (const grnItem of grn.items) {
      const poItem = await poItemRepo.findOne({
        where: {
          purchaseOrderId,
          productId: grnItem.productId,
          ...(grnItem.variantId && { variantId: grnItem.variantId }),
        },
      });

      if (!poItem) continue;

      poItem.quantityReceived =
        Number(poItem.quantityReceived) + Number(grnItem.quantityAccepted);

      await poItemRepo.save(poItem);
    }

    // Check if entire PO is now fully/partially received
    const allItems = await poItemRepo.find({ where: { purchaseOrderId } });

    const allFulfilled = allItems.every(
      (item) => Number(item.quantityReceived) >= Number(item.quantityOrdered),
    );
    const anyReceived = allItems.some(
      (item) => Number(item.quantityReceived) > 0,
    );

    if (allFulfilled || anyReceived) {
      const poRepo = manager.getRepository(PurchaseOrder);
      await poRepo.update(purchaseOrderId, {
        status: allFulfilled
          ? PurchaseOrderStatus.RECEIVED
          : PurchaseOrderStatus.PARTIALLY_RECEIVED,
      });
    }
  }
  /**
   * Cancel GRN
   */
  async cancel(
    id: string,
    cancelledBy: string,
    reason: string,
  ): Promise<GoodsReceivedNote> {
    const grnRepo = await this.getGrnRepository();
    const grn = await this.findById(id);

    if (grn.status === GRNStatus.ACCEPTED) {
      throw new BadRequestException('Cannot cancel approved GRN');
    }

    grn.status = GRNStatus.CANCELLED;
    grn.notes = `Cancelled by: ${cancelledBy}. Reason: ${reason}`;
    await grnRepo.save(grn);

    return this.findById(id);
  }

  /**
   * Delete GRN (draft only)
   */
  async remove(id: string): Promise<void> {
    const grnRepo = await this.getGrnRepository();
    const grn = await this.findById(id);

    if (grn.status !== GRNStatus.DRAFT) {
      throw new BadRequestException('Only draft GRNs can be deleted');
    }

    await grnRepo.delete(id);
  }

  /**
   * Get GRNs for a purchase order
   */
  async getGrnsForPurchaseOrder(
    purchaseOrderId: string,
  ): Promise<GoodsReceivedNote[]> {
    const grnRepo = await this.getGrnRepository();

    return grnRepo.find({
      where: { purchaseOrderId },
      relations: ['items'],
      order: { receiptDate: 'DESC' },
    });
  }
}
