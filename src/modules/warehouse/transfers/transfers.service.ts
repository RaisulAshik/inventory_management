import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import {
  Repository,
  DataSource,
  FindOptionsWhere,
  IsNull,
  DeepPartial,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { TenantConnectionManager } from '@database/tenant-connection.manager';
import { PaginatedResult } from '@common/interfaces';
import { paginate } from '@common/utils/pagination.util';
import { getNextSequence } from '@common/utils/sequence.util';
import { StockMovementType } from '@common/enums';
import {
  WarehouseTransfer,
  TransferStatus,
  WarehouseTransferItem,
  InventoryStock,
  StockMovement,
} from '@entities/tenant';
import { CreateTransferDto } from './dto/create-transfer.dto';
import { TransferFilterDto } from './dto/transfer-filter.dto';
import { UpdateTransferDto } from './dto/update-transfer.dto';

@Injectable()
export class TransfersService {
  constructor(
    private readonly tenantConnectionManager: TenantConnectionManager,
  ) {}

  private async getTransferRepository(): Promise<
    Repository<WarehouseTransfer>
  > {
    return this.tenantConnectionManager.getRepository(WarehouseTransfer);
  }

  /**
   * Create a new transfer
   */
  async create(
    createTransferDto: CreateTransferDto,
    createdBy: string,
  ): Promise<WarehouseTransfer> {
    const transferRepo = await this.getTransferRepository();
    const dataSource = await this.tenantConnectionManager.getDataSource();

    // Validate warehouses are different
    if (createTransferDto.fromWarehouseId === createTransferDto.toWarehouseId) {
      throw new BadRequestException(
        'Source and destination warehouses must be different',
      );
    }

    // Generate transfer number
    const transferNumber = await getNextSequence(dataSource, 'TRANSFER');

    const transfer = transferRepo.create({
      id: uuidv4(),
      transferNumber,
      ...createTransferDto,
      status: TransferStatus.DRAFT,
      createdBy,
    });

    const savedTransfer = await transferRepo.save(transfer);

    // Create items
    if (createTransferDto.items && createTransferDto.items.length > 0) {
      await this.createItems(
        savedTransfer.id,
        createTransferDto.items,
        dataSource,
      );
    }

    return this.findById(savedTransfer.id);
  }

  /**
   * Create transfer items
   */
  private async createItems(
    transferId: string,
    items: any[],
    dataSource: DataSource,
  ): Promise<void> {
    const itemRepo = dataSource.getRepository(WarehouseTransferItem);

    for (const itemDto of items) {
      const item = itemRepo.create({
        id: uuidv4(),
        warehouseTransferId: transferId,
        ...itemDto,
      });

      await itemRepo.save(item);
    }
  }

  /**
   * Find all transfers with filters and pagination
   */
  async findAll(
    filterDto: TransferFilterDto,
  ): Promise<PaginatedResult<WarehouseTransfer>> {
    const transferRepo = await this.getTransferRepository();

    const queryBuilder = transferRepo
      .createQueryBuilder('transfer')
      .leftJoinAndSelect('transfer.fromWarehouse', 'fromWarehouse')
      .leftJoinAndSelect('transfer.toWarehouse', 'toWarehouse')
      .leftJoinAndSelect('transfer.items', 'items')
      .leftJoinAndSelect('items.product', 'product');

    // Apply filters
    if (filterDto.status) {
      queryBuilder.andWhere('transfer.status = :status', {
        status: filterDto.status,
      });
    }

    if (filterDto.fromWarehouseId) {
      queryBuilder.andWhere('transfer.fromWarehouseId = :fromWarehouseId', {
        fromWarehouseId: filterDto.fromWarehouseId,
      });
    }

    if (filterDto.toWarehouseId) {
      queryBuilder.andWhere('transfer.toWarehouseId = :toWarehouseId', {
        toWarehouseId: filterDto.toWarehouseId,
      });
    }

    if (filterDto.fromDate) {
      queryBuilder.andWhere('transfer.transferDate >= :fromDate', {
        fromDate: filterDto.fromDate,
      });
    }

    if (filterDto.toDate) {
      queryBuilder.andWhere('transfer.transferDate <= :toDate', {
        toDate: filterDto.toDate,
      });
    }

    // Apply search
    if (filterDto.search) {
      queryBuilder.andWhere(
        '(transfer.transferNumber LIKE :search OR transfer.trackingNumber LIKE :search)',
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
   * Find transfer by ID
   */
  async findById(id: string): Promise<WarehouseTransfer> {
    const transferRepo = await this.getTransferRepository();

    const transfer = await transferRepo.findOne({
      where: { id },
      relations: [
        'fromWarehouse',
        'toWarehouse',
        'items',
        'items.product',
        'items.variant',
        'items.fromLocation',
        'items.toLocation',
      ],
    });

    if (!transfer) {
      throw new NotFoundException(`Transfer with ID ${id} not found`);
    }

    return transfer;
  }

  /**
   * Update transfer
   */
  async update(
    id: string,
    updateTransferDto: UpdateTransferDto,
  ): Promise<WarehouseTransfer> {
    const transferRepo = await this.getTransferRepository();
    const transfer = await this.findById(id);

    if (transfer.status !== TransferStatus.DRAFT) {
      throw new BadRequestException('Only draft transfers can be updated');
    }

    Object.assign(transfer, updateTransferDto);
    await transferRepo.save(transfer);

    return this.findById(id);
  }

  /**
   * Submit transfer for approval
   */
  async submitForApproval(
    id: string,
    userId: string,
  ): Promise<WarehouseTransfer> {
    const transferRepo = await this.getTransferRepository();
    const transfer = await this.findById(id);

    if (transfer.status !== TransferStatus.DRAFT) {
      throw new BadRequestException(
        'Only draft transfers can be submitted for approval',
      );
    }

    if (!transfer.items || transfer.items.length === 0) {
      throw new BadRequestException('Transfer must have at least one item');
    }

    transfer.status = TransferStatus.PENDING_APPROVAL;
    await transferRepo.save(transfer);

    return this.findById(id);
  }

  /**
   * Approve transfer
   */
  async approve(id: string, approvedBy: string): Promise<WarehouseTransfer> {
    const transferRepo = await this.getTransferRepository();
    const transfer = await this.findById(id);

    if (transfer.status !== TransferStatus.PENDING_APPROVAL) {
      throw new BadRequestException('Only pending transfers can be approved');
    }

    // Validate stock availability
    await this.validateStockAvailability(transfer);

    transfer.status = TransferStatus.APPROVED;
    transfer.approvedBy = approvedBy;
    transfer.approvedAt = new Date();
    await transferRepo.save(transfer);

    return this.findById(id);
  }

  /**
   * Validate stock availability for transfer
   */
  private async validateStockAvailability(
    transfer: WarehouseTransfer,
  ): Promise<void> {
    const dataSource = await this.tenantConnectionManager.getDataSource();
    const stockRepo = dataSource.getRepository(InventoryStock);

    for (const item of transfer.items) {
      const whereClause: FindOptionsWhere<InventoryStock> = {
        productId: item.productId,
        warehouseId: transfer.fromWarehouseId,
      };

      if (item.variantId) {
        whereClause.variantId = item.variantId;
      } else {
        whereClause.variantId = IsNull();
      }

      const stock = await stockRepo.findOne({
        where: whereClause,
      });

      const available = stock
        ? stock.quantityOnHand - stock.quantityReserved
        : 0;

      if (available < item.quantityRequested) {
        throw new BadRequestException(
          `Insufficient stock for product ${item.product?.productName}. Available: ${available}, Requested: ${item.quantityRequested}`,
        );
      }
    }
  }

  /**
   * Reject transfer
   */
  async reject(
    id: string,
    rejectedBy: string,
    reason: string,
  ): Promise<WarehouseTransfer> {
    const transferRepo = await this.getTransferRepository();
    const transfer = await this.findById(id);

    if (transfer.status !== TransferStatus.PENDING_APPROVAL) {
      throw new BadRequestException('Only pending transfers can be rejected');
    }

    transfer.status = TransferStatus.CANCELLED;
    transfer.notes = `Rejected by: ${rejectedBy}. Reason: ${reason}`;
    await transferRepo.save(transfer);

    return this.findById(id);
  }

  /**
   * Ship transfer (mark as in transit)
   */
  async ship(
    id: string,
    shippedBy: string,
    trackingNumber?: string,
  ): Promise<WarehouseTransfer> {
    const dataSource = await this.tenantConnectionManager.getDataSource();
    const transfer = await this.findById(id);

    if (transfer.status !== TransferStatus.APPROVED) {
      throw new BadRequestException('Only approved transfers can be shipped');
    }

    await dataSource.transaction(async (manager) => {
      const stockRepo = manager.getRepository(InventoryStock);
      const movementRepo = manager.getRepository(StockMovement);
      const itemRepo = manager.getRepository(WarehouseTransferItem);

      // Process each item
      for (const item of transfer.items) {
        // Build where clause for source stock
        const whereClause: FindOptionsWhere<InventoryStock> = {
          productId: item.productId,
          warehouseId: transfer.fromWarehouseId,
        };

        if (item.variantId) {
          whereClause.variantId = item.variantId;
        } else {
          whereClause.variantId = IsNull();
        }

        // Reduce stock from source warehouse
        const sourceStock = await stockRepo.findOne({
          where: whereClause,
          lock: { mode: 'pessimistic_write' },
        });

        if (sourceStock) {
          sourceStock.quantityOnHand -= item.quantityRequested;
          sourceStock.quantityOutgoing -= item.quantityRequested;
          await stockRepo.save(sourceStock);
        }

        // Record movement out
        const movementOut = movementRepo.create({
          id: uuidv4(),
          movementNumber: await getNextSequence(dataSource, 'STOCK_MOVEMENT'),
          movementType: StockMovementType.TRANSFER_OUT,
          movementDate: new Date(),
          productId: item.productId,
          variantId: item.variantId,
          fromWarehouseId: transfer.fromWarehouseId,
          toWarehouseId: transfer.toWarehouseId,
          quantity: item.quantityRequested,
          uomId: item.uomId,
          referenceType: 'WAREHOUSE_TRANSFER',
          referenceId: transfer.id,
          referenceNumber: transfer.transferNumber,
          createdBy: shippedBy,
        } as DeepPartial<StockMovement>);
        await movementRepo.save(movementOut);

        // Update item shipped quantity
        item.quantityShipped = item.quantityRequested;
        await itemRepo.save(item);
      }

      // Update transfer status
      transfer.status = TransferStatus.IN_TRANSIT;
      transfer.shippedBy = shippedBy;
      transfer.shippedAt = new Date();
      if (trackingNumber) {
        transfer.trackingNumber = trackingNumber;
      }
      await manager.getRepository(WarehouseTransfer).save(transfer);
    });

    return this.findById(id);
  }

  /**
   * Receive transfer
   */
  async receive(
    id: string,
    receivedBy: string,
    receivedItems: {
      itemId: string;
      quantityReceived: number;
      quantityDamaged?: number;
    }[],
  ): Promise<WarehouseTransfer> {
    const dataSource = await this.tenantConnectionManager.getDataSource();
    const transfer = await this.findById(id);

    if (transfer.status !== TransferStatus.IN_TRANSIT) {
      throw new BadRequestException(
        'Only in-transit transfers can be received',
      );
    }

    await dataSource.transaction(async (manager) => {
      const stockRepo = manager.getRepository(InventoryStock);
      const movementRepo = manager.getRepository(StockMovement);
      const itemRepo = manager.getRepository(WarehouseTransferItem);

      let allFullyReceived = true;

      for (const receivedItem of receivedItems) {
        const item = transfer.items.find(
          (i: any) => i.id === receivedItem.itemId,
        );
        if (!item) continue;

        const quantityReceived = receivedItem.quantityReceived;
        const quantityDamaged = receivedItem.quantityDamaged || 0;
        const netReceived = quantityReceived - quantityDamaged;

        // Build where clause
        const whereClause: FindOptionsWhere<InventoryStock> = {
          productId: item.productId,
          warehouseId: transfer.toWarehouseId,
        };

        if (item.variantId) {
          whereClause.variantId = item.variantId;
        } else {
          whereClause.variantId = IsNull();
        }

        // Get or create stock in destination warehouse
        let destStock = await stockRepo.findOne({
          where: whereClause,
          lock: { mode: 'pessimistic_write' },
        });

        if (!destStock) {
          destStock = stockRepo.create({
            id: uuidv4(),
            productId: item.productId,
            warehouseId: transfer.toWarehouseId,
            variantId: item.variantId,
            quantityOnHand: 0,
            quantityReserved: 0,
            quantityIncoming: 0,
            quantityOutgoing: 0,
          } as DeepPartial<InventoryStock>);
        }

        destStock.quantityOnHand += netReceived;
        destStock.quantityIncoming -= item.quantityShipped;
        await stockRepo.save(destStock);

        // Record movement in
        const movementIn = movementRepo.create({
          id: uuidv4(),
          movementNumber: await getNextSequence(dataSource, 'STOCK_MOVEMENT'),
          movementType: StockMovementType.TRANSFER_IN,
          movementDate: new Date(),
          productId: item.productId,
          variantId: item.variantId,
          fromWarehouseId: transfer.fromWarehouseId,
          toWarehouseId: transfer.toWarehouseId,
          quantity: netReceived,
          uomId: item.uomId,
          referenceType: 'WAREHOUSE_TRANSFER',
          referenceId: transfer.id,
          referenceNumber: transfer.transferNumber,
          createdBy: receivedBy,
        } as DeepPartial<StockMovement>);
        await movementRepo.save(movementIn);

        // Update item
        item.quantityReceived = (item.quantityReceived || 0) + quantityReceived;
        item.quantityDamaged = (item.quantityDamaged || 0) + quantityDamaged;
        await itemRepo.save(item);

        if (item.quantityReceived < item.quantityShipped) {
          allFullyReceived = false;
        }
      }

      // Update transfer status
      transfer.status = allFullyReceived
        ? TransferStatus.RECEIVED
        : TransferStatus.PARTIALLY_RECEIVED;
      transfer.receivedBy = receivedBy;
      transfer.receivedAt = new Date();
      await manager.getRepository(WarehouseTransfer).save(transfer);
    });

    return this.findById(id);
  }

  /**
   * Cancel transfer
   */
  async cancel(
    id: string,
    cancelledBy: string,
    reason: string,
  ): Promise<WarehouseTransfer> {
    const transferRepo = await this.getTransferRepository();
    const transfer = await this.findById(id);

    if (
      ![
        TransferStatus.DRAFT,
        TransferStatus.PENDING_APPROVAL,
        TransferStatus.APPROVED,
      ].includes(transfer.status)
    ) {
      throw new BadRequestException(
        'Only draft, pending, or approved transfers can be cancelled',
      );
    }

    transfer.status = TransferStatus.CANCELLED;
    transfer.notes = `Cancelled by: ${cancelledBy}. Reason: ${reason}`;
    await transferRepo.save(transfer);

    return this.findById(id);
  }

  /**
   * Add item to transfer
   */
  async addItem(
    transferId: string,
    itemDto: Partial<WarehouseTransferItem>,
  ): Promise<WarehouseTransferItem> {
    const transfer = await this.findById(transferId);

    if (transfer.status !== TransferStatus.DRAFT) {
      throw new BadRequestException(
        'Items can only be added to draft transfers',
      );
    }

    const dataSource = await this.tenantConnectionManager.getDataSource();
    const itemRepo = dataSource.getRepository(WarehouseTransferItem);

    const item = itemRepo.create({
      id: uuidv4(),
      warehouseTransferId: transferId,
      ...itemDto,
    } as DeepPartial<WarehouseTransferItem>);

    const saved = await itemRepo.save(item);
    return Array.isArray(saved) ? saved[0] : saved;
  }

  /**
   * Update transfer item
   */
  async updateItem(
    itemId: string,
    itemDto: any,
  ): Promise<WarehouseTransferItem> {
    const dataSource = await this.tenantConnectionManager.getDataSource();
    const itemRepo = dataSource.getRepository(WarehouseTransferItem);

    const item = await itemRepo.findOne({
      where: { id: itemId },
      relations: ['warehouseTransfer'],
    });

    if (!item) {
      throw new NotFoundException(`Transfer item with ID ${itemId} not found`);
    }

    if (item.warehouseTransfer.status !== TransferStatus.DRAFT) {
      throw new BadRequestException(
        'Items can only be updated in draft transfers',
      );
    }

    Object.assign(item, itemDto);
    return itemRepo.save(item);
  }

  /**
   * Remove transfer item
   */
  async removeItem(itemId: string): Promise<void> {
    const dataSource = await this.tenantConnectionManager.getDataSource();
    const itemRepo = dataSource.getRepository(WarehouseTransferItem);

    const item = await itemRepo.findOne({
      where: { id: itemId },
      relations: ['warehouseTransfer'],
    });

    if (!item) {
      throw new NotFoundException(`Transfer item with ID ${itemId} not found`);
    }

    if (item.warehouseTransfer.status !== TransferStatus.DRAFT) {
      throw new BadRequestException(
        'Items can only be removed from draft transfers',
      );
    }

    await itemRepo.delete(itemId);
  }

  /**
   * Delete transfer
   */
  async remove(id: string): Promise<void> {
    const transferRepo = await this.getTransferRepository();
    const transfer = await this.findById(id);

    if (transfer.status !== TransferStatus.DRAFT) {
      throw new BadRequestException('Only draft transfers can be deleted');
    }

    await transferRepo.delete(id);
  }
}
