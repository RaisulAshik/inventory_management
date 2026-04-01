import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  Repository,
  DataSource,
  DeepPartial,
  FindOptionsWhere,
  IsNull,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { TenantConnectionManager } from '@database/tenant-connection.manager';
import { PaginatedResult } from '@common/interfaces';
import { paginate } from '@common/utils/pagination.util';
import { getNextSequence } from '@common/utils/sequence.util';
import { StockMovementType } from '@common/enums';
import {
  StockAdjustment,
  AdjustmentStatus,
  StockAdjustmentItem,
  InventoryStock,
  StockMovement,
} from '@entities/tenant';
import { AdjustmentFilterDto } from './dto/adjustment-filter.dto';
import { CreateAdjustmentDto } from './dto/create-adjustment.dto';
import { UpdateAdjustmentDto } from './dto/update-adjustment.dto';
import { AccountingIntegrationService } from '@modules/accounting/service/accounting-integration.service';

@Injectable()
export class AdjustmentsService {
  constructor(
    private readonly tenantConnectionManager: TenantConnectionManager,
    private readonly accountingIntegration: AccountingIntegrationService,
  ) {}

  private async getAdjustmentRepository(): Promise<
    Repository<StockAdjustment>
  > {
    return this.tenantConnectionManager.getRepository(StockAdjustment);
  }

  /**
   * Create a new stock adjustment
   */
  async create(
    createAdjustmentDto: CreateAdjustmentDto,
    createdBy: string,
  ): Promise<StockAdjustment> {
    const adjustmentRepo = await this.getAdjustmentRepository();
    const dataSource = await this.tenantConnectionManager.getDataSource();

    // Generate adjustment number
    const adjustmentNumber = await getNextSequence(dataSource, 'ADJUSTMENT');

    const adjustment = adjustmentRepo.create({
      id: uuidv4(),
      adjustmentNumber,
      ...createAdjustmentDto,
      adjustmentDate: createAdjustmentDto.adjustmentDate || new Date(),
      status: AdjustmentStatus.DRAFT,
      createdBy,
    });

    const savedAdjustment = await adjustmentRepo.save(adjustment);

    // Create items
    if (createAdjustmentDto.items && createAdjustmentDto.items.length > 0) {
      await this.createItems(
        savedAdjustment.id,
        createAdjustmentDto.items,
        dataSource,
      );
    }

    return this.findById(savedAdjustment.id);
  }

  /**
   * Create adjustment items
   */
  private async createItems(
    adjustmentId: string,
    items: any[],
    dataSource: DataSource,
  ): Promise<void> {
    const itemRepo = dataSource.getRepository(StockAdjustmentItem);

    for (const itemDto of items) {
      const item = itemRepo.create({
        id: uuidv4(),
        stockAdjustmentId: adjustmentId,
        ...itemDto,
      });

      await itemRepo.save(item);
    }
  }

  /**
   * Find all adjustments with filters and pagination
   */
  async findAll(
    filterDto: AdjustmentFilterDto,
  ): Promise<PaginatedResult<StockAdjustment>> {
    const adjustmentRepo = await this.getAdjustmentRepository();

    const queryBuilder = adjustmentRepo
      .createQueryBuilder('adjustment')
      .leftJoinAndSelect('adjustment.warehouse', 'warehouse')
      .leftJoinAndSelect('adjustment.items', 'items')
      .leftJoinAndSelect('items.product', 'product');

    // Apply filters
    if (filterDto.status) {
      queryBuilder.andWhere('adjustment.status = :status', {
        status: filterDto.status,
      });
    }

    if (filterDto.adjustmentType) {
      queryBuilder.andWhere('adjustment.adjustmentType = :adjustmentType', {
        adjustmentType: filterDto.adjustmentType,
      });
    }

    if (filterDto.warehouseId) {
      queryBuilder.andWhere('adjustment.warehouseId = :warehouseId', {
        warehouseId: filterDto.warehouseId,
      });
    }

    if (filterDto.fromDate) {
      queryBuilder.andWhere('adjustment.adjustmentDate >= :fromDate', {
        fromDate: filterDto.fromDate,
      });
    }

    if (filterDto.toDate) {
      queryBuilder.andWhere('adjustment.adjustmentDate <= :toDate', {
        toDate: filterDto.toDate,
      });
    }

    // Apply search
    if (filterDto.search) {
      queryBuilder.andWhere(
        '(adjustment.adjustmentNumber LIKE :search OR adjustment.reason LIKE :search)',
        { search: `%${filterDto.search}%` },
      );
    }

    if (!filterDto.sortBy) {
      filterDto.sortBy = 'createdAt';
      filterDto.sortOrder = 'DESC';
    }

    return paginate(queryBuilder, filterDto);
  }

  /**
   * Find adjustment by ID
   */
  async findById(id: string): Promise<StockAdjustment> {
    const adjustmentRepo = await this.getAdjustmentRepository();

    const adjustment = await adjustmentRepo.findOne({
      where: { id },
      relations: [
        'warehouse',
        'items',
        'items.product',
        'items.variant',
        'items.location',
        'items.batch',
      ],
    });

    if (!adjustment) {
      throw new NotFoundException(`Adjustment with ID ${id} not found`);
    }

    return adjustment;
  }

  /**
   * Update adjustment
   */
  async update(
    id: string,
    updateAdjustmentDto: UpdateAdjustmentDto,
  ): Promise<StockAdjustment> {
    const adjustmentRepo = await this.getAdjustmentRepository();
    const adjustment = await this.findById(id);

    if (adjustment.status !== AdjustmentStatus.DRAFT) {
      throw new BadRequestException('Only draft adjustments can be updated');
    }

    Object.assign(adjustment, updateAdjustmentDto);
    await adjustmentRepo.save(adjustment);

    return this.findById(id);
  }

  /**
   * Submit adjustment for approval
   */
  async submitForApproval(
    id: string,
    userId: string,
  ): Promise<StockAdjustment> {
    const adjustmentRepo = await this.getAdjustmentRepository();
    const adjustment = await this.findById(id);

    if (adjustment.status !== AdjustmentStatus.DRAFT) {
      throw new BadRequestException(
        'Only draft adjustments can be submitted for approval',
      );
    }

    if (!adjustment.items || adjustment.items.length === 0) {
      throw new BadRequestException('Adjustment must have at least one item');
    }

    // Calculate total value impact
    let totalValueImpact = 0;
    for (const item of adjustment.items) {
      totalValueImpact += Number(item.valueImpact) || 0;
    }

    adjustment.status = AdjustmentStatus.PENDING_APPROVAL;
    adjustment.totalValueImpact = totalValueImpact;
    await adjustmentRepo.save(adjustment);

    return this.findById(id);
  }

  /**
   * Approve adjustment
   */
  async approve(id: string, approvedBy: string): Promise<StockAdjustment> {
    //const adjustmentRepo = await this.getAdjustmentRepository();
    const dataSource = await this.tenantConnectionManager.getDataSource();
    const adjustment = await this.findById(id);

    if (adjustment.status !== AdjustmentStatus.PENDING_APPROVAL) {
      throw new BadRequestException('Only pending adjustments can be approved');
    }

    await dataSource.transaction(async (manager) => {
      const stockRepo = manager.getRepository(InventoryStock);
      const movementRepo = manager.getRepository(StockMovement);

      for (const item of adjustment.items) {
        // Build where clause
        const whereClause: FindOptionsWhere<InventoryStock> = {
          productId: item.productId,
          warehouseId: adjustment.warehouseId,
        };

        if (item.variantId) {
          whereClause.variantId = item.variantId;
        } else {
          whereClause.variantId = IsNull();
        }

        // Get or create stock record
        let stock = await stockRepo.findOne({
          where: whereClause,
          lock: { mode: 'pessimistic_write' },
        });

        if (!stock) {
          stock = stockRepo.create({
            id: uuidv4(),
            productId: item.productId,
            warehouseId: adjustment.warehouseId,
            variantId: item.variantId,
            quantityOnHand: 0,
            quantityReserved: 0,
            quantityIncoming: 0,
            quantityOutgoing: 0,
          } as DeepPartial<InventoryStock>);
        }

        // Apply adjustment
        stock.quantityOnHand += Number(item.adjustmentQuantity);
        await stockRepo.save(stock);

        // Determine movement type
        const movementType =
          Number(item.adjustmentQuantity) > 0
            ? StockMovementType.ADJUSTMENT_IN
            : StockMovementType.ADJUSTMENT_OUT;

        // Record movement
        const movement = movementRepo.create({
          id: uuidv4(),
          movementNumber: await getNextSequence(dataSource, 'STOCK_MOVEMENT'),
          movementType,
          movementDate: new Date(),
          productId: item.productId,
          variantId: item.variantId,
          toWarehouseId: adjustment.warehouseId,
          toLocationId: item.locationId,
          quantity: Math.abs(Number(item.adjustmentQuantity)),
          uomId: item.uomId,
          unitCost: item.unitCost,
          referenceType: 'STOCK_ADJUSTMENT',
          referenceId: adjustment.id,
          referenceNumber: adjustment.adjustmentNumber,
          reason: item.reason || adjustment.reason,
          createdBy: approvedBy,
        } as DeepPartial<StockMovement>);
        await movementRepo.save(movement);
      }

      // Update adjustment status
      adjustment.status = AdjustmentStatus.APPROVED;
      adjustment.approvedBy = approvedBy;
      adjustment.approvedAt = new Date();
      await manager.getRepository(StockAdjustment).save(adjustment);
    });

    const approved = await this.findById(id);
    void this.accountingIntegration.postInventoryAdjustment(approved);
    return approved;
  }

  /**
   * Reject adjustment
   */
  async reject(
    id: string,
    rejectedBy: string,
    reason: string,
  ): Promise<StockAdjustment> {
    const adjustmentRepo = await this.getAdjustmentRepository();
    const adjustment = await this.findById(id);

    if (adjustment.status !== AdjustmentStatus.PENDING_APPROVAL) {
      throw new BadRequestException('Only pending adjustments can be rejected');
    }

    adjustment.status = AdjustmentStatus.REJECTED;
    adjustment.notes = `Rejected by: ${rejectedBy}. Reason: ${reason}`;
    await adjustmentRepo.save(adjustment);

    return this.findById(id);
  }

  /**
   * Cancel adjustment
   */
  async cancel(
    id: string,
    cancelledBy: string,
    reason: string,
  ): Promise<StockAdjustment> {
    const adjustmentRepo = await this.getAdjustmentRepository();
    const adjustment = await this.findById(id);

    if (
      ![AdjustmentStatus.DRAFT, AdjustmentStatus.PENDING_APPROVAL].includes(
        adjustment.status,
      )
    ) {
      throw new BadRequestException(
        'Only draft or pending adjustments can be cancelled',
      );
    }

    adjustment.status = AdjustmentStatus.CANCELLED;
    adjustment.notes = `Cancelled by: ${cancelledBy}. Reason: ${reason}`;
    await adjustmentRepo.save(adjustment);

    return this.findById(id);
  }

  /**
   * Add item to adjustment
   */
  async addItem(
    adjustmentId: string,
    itemDto: any,
  ): Promise<StockAdjustmentItem> {
    const adjustment = await this.findById(adjustmentId);

    if (adjustment.status !== AdjustmentStatus.DRAFT) {
      throw new BadRequestException(
        'Items can only be added to draft adjustments',
      );
    }

    const dataSource = await this.tenantConnectionManager.getDataSource();
    const itemRepo = dataSource.getRepository(StockAdjustmentItem);

    // Get current stock quantity
    const stockRepo = dataSource.getRepository(InventoryStock);
    const stock = await stockRepo.findOne({
      where: {
        productId: itemDto.productId,
        warehouseId: adjustment.warehouseId,
        variantId: itemDto.variantId || null,
      },
    });

    const systemQuantity = stock ? Number(stock.quantityOnHand) : 0;
    const adjustmentQuantity = itemDto.physicalQuantity - systemQuantity;
    const valueImpact = adjustmentQuantity * (itemDto.unitCost || 0);

    const item = itemRepo.create({
      id: uuidv4(),
      stockAdjustmentId: adjustmentId,
      ...itemDto,
      systemQuantity,
      adjustmentQuantity,
      valueImpact,
    } as DeepPartial<StockAdjustmentItem>);

    return itemRepo.save(item);
  }

  /**
   * Update adjustment item
   */
  async updateItem(itemId: string, itemDto: any): Promise<StockAdjustmentItem> {
    const dataSource = await this.tenantConnectionManager.getDataSource();
    const itemRepo = dataSource.getRepository(StockAdjustmentItem);

    const item = await itemRepo.findOne({
      where: { id: itemId },
      relations: ['stockAdjustment'],
    });

    if (!item) {
      throw new NotFoundException(
        `Adjustment item with ID ${itemId} not found`,
      );
    }

    if (item.stockAdjustment.status !== AdjustmentStatus.DRAFT) {
      throw new BadRequestException(
        'Items can only be updated in draft adjustments',
      );
    }

    // Recalculate adjustment
    if (itemDto.physicalQuantity !== undefined) {
      itemDto.adjustmentQuantity =
        itemDto.physicalQuantity - Number(item.systemQuantity);
      itemDto.valueImpact =
        itemDto.adjustmentQuantity * (itemDto.unitCost || item.unitCost || 0);
    }

    Object.assign(item, itemDto);
    return itemRepo.save(item);
  }

  /**
   * Remove adjustment item
   */
  async removeItem(itemId: string): Promise<void> {
    const dataSource = await this.tenantConnectionManager.getDataSource();
    const itemRepo = dataSource.getRepository(StockAdjustmentItem);

    const item = await itemRepo.findOne({
      where: { id: itemId },
      relations: ['stockAdjustment'],
    });

    if (!item) {
      throw new NotFoundException(
        `Adjustment item with ID ${itemId} not found`,
      );
    }

    if (item.stockAdjustment.status !== AdjustmentStatus.DRAFT) {
      throw new BadRequestException(
        'Items can only be removed from draft adjustments',
      );
    }

    await itemRepo.delete(itemId);
  }

  /**
   * Delete adjustment
   */
  async remove(id: string): Promise<void> {
    const adjustmentRepo = await this.getAdjustmentRepository();
    const adjustment = await this.findById(id);

    if (adjustment.status !== AdjustmentStatus.DRAFT) {
      throw new BadRequestException('Only draft adjustments can be deleted');
    }

    await adjustmentRepo.delete(id);
  }
}
