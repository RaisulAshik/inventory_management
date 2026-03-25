import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { DeepPartial, FindOptionsWhere, IsNull, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { TenantConnectionManager } from '@database/tenant-connection.manager';
import { PaginationDto } from '@common/dto/pagination.dto';
import { PaginatedResult } from '@common/interfaces';
import { paginate } from '@common/utils/pagination.util';
import { PriceList, PriceListItem, PriceListType } from '@entities/tenant';
import { CreatePriceListItemDto } from './dto/create-price-list-item.dto';
import { CreatePriceListDto } from './dto/create-price-list.dto';
import { UpdatePriceListDto } from './dto/update-price-list.dto';

@Injectable()
export class PriceListsService {
  constructor(
    private readonly tenantConnectionManager: TenantConnectionManager,
  ) {}

  private async getPriceListRepository(): Promise<Repository<PriceList>> {
    return this.tenantConnectionManager.getRepository(PriceList);
  }

  /**
   * Create a new price list
   */
  async create(
    createPriceListDto: CreatePriceListDto,
    createdBy: string,
  ): Promise<PriceList> {
    const priceListRepo = await this.getPriceListRepository();

    // Check if code already exists
    const existingPriceList = await priceListRepo.findOne({
      where: { priceListCode: createPriceListDto.priceListCode },
    });

    if (existingPriceList) {
      throw new BadRequestException(
        `Price list with code ${createPriceListDto.priceListCode} already exists`,
      );
    }

    // If setting as default, unset other defaults of same type
    if (createPriceListDto.isDefault) {
      await priceListRepo.update(
        { priceListType: createPriceListDto.priceListType, isDefault: true },
        { isDefault: false },
      );
    }

    const priceList = priceListRepo.create({
      id: uuidv4(),
      ...createPriceListDto,
      createdBy,
    });

    const savedPriceList = await priceListRepo.save(priceList);

    // Create items if provided
    if (createPriceListDto.items && createPriceListDto.items.length > 0) {
      const dataSource = await this.tenantConnectionManager.getDataSource();
      await this.createItems(
        savedPriceList.id,
        createPriceListDto.items,
        dataSource,
      );
    }

    return this.findById(savedPriceList.id);
  }

  /**
   * Create price list items
   */
  private async createItems(
    priceListId: string,
    items: CreatePriceListItemDto[],
    dataSource: any,
  ): Promise<void> {
    const itemRepo = dataSource.getRepository(PriceListItem);

    for (const itemDto of items) {
      const item = itemRepo.create({
        id: uuidv4(),
        priceListId,
        ...itemDto,
      });

      await itemRepo.save(item);
    }
  }

  /**
   * Find all price lists with pagination
   */
  async findAll(
    paginationDto: PaginationDto,
  ): Promise<PaginatedResult<PriceList>> {
    const priceListRepo = await this.getPriceListRepository();

    const queryBuilder = priceListRepo.createQueryBuilder('priceList');

    if (paginationDto.search) {
      queryBuilder.where(
        '(priceList.priceListCode LIKE :search OR priceList.priceListName LIKE :search)',
        { search: `%${paginationDto.search}%` },
      );
    }

    if (!paginationDto.sortBy) {
      paginationDto.sortBy = 'priceListName';
      paginationDto.sortOrder = 'ASC';
    }

    return paginate(queryBuilder, paginationDto);
  }

  /**
   * Get all active price lists (for dropdowns)
   */
  async findAllActive(): Promise<PriceList[]> {
    const priceListRepo = await this.getPriceListRepository();

    return priceListRepo.find({
      where: { isActive: true },
      order: { priceListName: 'ASC' },
    });
  }

  /**
   * Get all active price lists by type
   */
  async findByType(type: PriceListType): Promise<PriceList[]> {
    const priceListRepo = await this.getPriceListRepository();

    return priceListRepo.find({
      where: { priceListType: type, isActive: true },
      order: { priority: 'DESC', priceListName: 'ASC' },
    });
  }

  /**
   * Get default price list by type
   */
  async getDefault(type: PriceListType): Promise<PriceList | null> {
    const priceListRepo = await this.getPriceListRepository();

    return priceListRepo.findOne({
      where: { priceListType: type, isDefault: true, isActive: true },
    });
  }

  /**
   * Find price list by ID
   */
  async findById(id: string): Promise<PriceList> {
    const priceListRepo = await this.getPriceListRepository();

    const priceList = await priceListRepo.findOne({
      where: { id },
      relations: ['items', 'items.product', 'items.variant', 'items.uom'],
    });

    if (!priceList) {
      throw new NotFoundException(`Price list with ID ${id} not found`);
    }

    return priceList;
  }

  /**
   * Update price list
   */
  async update(
    id: string,
    updatePriceListDto: UpdatePriceListDto,
  ): Promise<PriceList> {
    const priceListRepo = await this.getPriceListRepository();
    const priceList = await this.findById(id);

    // Check code uniqueness if being changed
    if (
      updatePriceListDto.priceListCode &&
      updatePriceListDto.priceListCode !== priceList.priceListCode
    ) {
      const existingCode = await priceListRepo.findOne({
        where: { priceListCode: updatePriceListDto.priceListCode },
      });

      if (existingCode) {
        throw new BadRequestException(
          `Price list with code ${updatePriceListDto.priceListCode} already exists`,
        );
      }
    }

    // If setting as default, unset other defaults
    if (updatePriceListDto.isDefault && !priceList.isDefault) {
      await priceListRepo.update(
        { priceListType: priceList.priceListType, isDefault: true },
        { isDefault: false },
      );
    }

    Object.assign(priceList, updatePriceListDto);
    await priceListRepo.save(priceList);

    return this.findById(id);
  }

  /**
   * Delete price list
   */
  async remove(id: string): Promise<void> {
    const priceListRepo = await this.getPriceListRepository();
    //const priceList = await this.findById(id);

    // Check if assigned to customers
    const dataSource = await this.tenantConnectionManager.getDataSource();
    const customerCount = await dataSource
      .createQueryBuilder()
      .select('COUNT(*)', 'count')
      .from('customers', 'c')
      .where('c.price_list_id = :id', { id })
      .andWhere('c.deleted_at IS NULL')
      .getRawOne();

    if (parseInt(customerCount.count) > 0) {
      throw new BadRequestException(
        'Cannot delete price list assigned to customers',
      );
    }

    await priceListRepo.delete(id);
  }

  /**
   * Get price for a product from price list
   */
  async getProductPrice(
    priceListId: string,
    productId: string,
    quantity: number = 1,
    variantId?: string,
  ): Promise<number | null> {
    const dataSource = await this.tenantConnectionManager.getDataSource();
    const itemRepo = dataSource.getRepository(PriceListItem);

    const queryBuilder = itemRepo
      .createQueryBuilder('item')
      .where('item.priceListId = :priceListId', { priceListId })
      .andWhere('item.productId = :productId', { productId })
      .andWhere('item.minQuantity <= :quantity', { quantity })
      .andWhere('(item.maxQuantity IS NULL OR item.maxQuantity >= :quantity)', {
        quantity,
      })
      .andWhere(
        '(item.effectiveFrom IS NULL OR item.effectiveFrom <= CURDATE())',
      )
      .andWhere('(item.effectiveTo IS NULL OR item.effectiveTo >= CURDATE())')
      .orderBy('item.minQuantity', 'DESC');

    if (variantId) {
      queryBuilder.andWhere(
        '(item.variantId = :variantId OR item.variantId IS NULL)',
        { variantId },
      );
    }

    const item = await queryBuilder.getOne();

    if (!item) {
      return null;
    }

    let price = Number(item.price);

    // Apply discounts
    if (item.discountPercentage > 0) {
      price = price * (1 - Number(item.discountPercentage) / 100);
    }

    if (item.discountAmount > 0) {
      price = price - Number(item.discountAmount);
    }

    return Math.max(0, price);
  }

  /**
   * Add item to price list
   */
  async addItem(
    priceListId: string,
    itemDto: CreatePriceListItemDto,
  ): Promise<PriceListItem> {
    const dataSource = await this.tenantConnectionManager.getDataSource();
    const itemRepo = dataSource.getRepository(PriceListItem);

    // Verify price list exists
    await this.findById(priceListId);

    // Build where clause
    const whereClause: FindOptionsWhere<PriceListItem> = {
      priceListId,
      productId: itemDto.productId,
      minQuantity: itemDto.minQuantity || 1,
    };

    if (itemDto.variantId) {
      whereClause.variantId = itemDto.variantId;
    } else {
      whereClause.variantId = IsNull();
    }

    // Check if item already exists for this product/variant/quantity range
    const existing = await itemRepo.findOne({
      where: whereClause,
    });

    if (existing) {
      throw new BadRequestException(
        'Price list item already exists for this product/variant/quantity range',
      );
    }

    const item = itemRepo.create({
      id: uuidv4(),
      priceListId,
      ...itemDto,
    } as DeepPartial<PriceListItem>);

    const saved = await itemRepo.save(item);
    return Array.isArray(saved) ? saved[0] : saved;
  }

  /**
   * Update price list item
   */
  async updateItem(
    itemId: string,
    itemDto: Partial<CreatePriceListItemDto>,
  ): Promise<PriceListItem> {
    const dataSource = await this.tenantConnectionManager.getDataSource();
    const itemRepo = dataSource.getRepository(PriceListItem);

    const item = await itemRepo.findOne({ where: { id: itemId } });

    if (!item) {
      throw new NotFoundException(
        `Price list item with ID ${itemId} not found`,
      );
    }

    Object.assign(item, itemDto);
    return itemRepo.save(item);
  }

  /**
   * Remove price list item
   */
  async removeItem(itemId: string): Promise<void> {
    const dataSource = await this.tenantConnectionManager.getDataSource();
    const itemRepo = dataSource.getRepository(PriceListItem);

    await itemRepo.delete(itemId);
  }

  /**
   * Get items for a price list
   */
  async getItems(priceListId: string): Promise<PriceListItem[]> {
    const dataSource = await this.tenantConnectionManager.getDataSource();
    const itemRepo = dataSource.getRepository(PriceListItem);

    return itemRepo
      .createQueryBuilder('item')
      .leftJoinAndSelect('item.product', 'product')
      .leftJoinAndSelect('item.variant', 'variant')
      .leftJoinAndSelect('item.uom', 'uom')
      .where('item.priceListId = :priceListId', { priceListId })
      .orderBy('product.productName', 'ASC')
      .getMany();
  }

  /**
   * Bulk add items to price list
   */
  async bulkAddItems(
    priceListId: string,
    items: CreatePriceListItemDto[],
  ): Promise<{ added: number; skipped: number }> {
    const dataSource = await this.tenantConnectionManager.getDataSource();
    const itemRepo = dataSource.getRepository(PriceListItem);

    // Verify price list exists
    await this.findById(priceListId);

    let added = 0;
    let skipped = 0;

    for (const itemDto of items) {
      try {
        // Build where clause
        const whereClause: FindOptionsWhere<PriceListItem> = {
          priceListId,
          productId: itemDto.productId,
          minQuantity: itemDto.minQuantity || 1,
        };

        if (itemDto.variantId) {
          whereClause.variantId = itemDto.variantId;
        } else {
          whereClause.variantId = IsNull();
        }

        const existing = await itemRepo.findOne({
          where: whereClause,
        });

        if (existing) {
          skipped++;
          continue;
        }

        const item = itemRepo.create({
          id: uuidv4(),
          priceListId,
          ...itemDto,
        } as DeepPartial<PriceListItem>);

        await itemRepo.save(item);
        added++;
      } catch (error) {
        skipped++;
      }
    }

    return { added, skipped };
  }

  /**
   * Copy price list
   */
  async copyPriceList(
    sourceId: string,
    newCode: string,
    newName: string,
    createdBy: string,
  ): Promise<PriceList> {
    const source = await this.findById(sourceId);
    const dataSource = await this.tenantConnectionManager.getDataSource();

    // Create new price list
    const newPriceList = await this.create(
      {
        priceListCode: newCode,
        priceListName: newName,
        priceListType: source.priceListType,
        description: `Copied from ${source.priceListName}`,
        currency: source.currency,
        isTaxInclusive: source.isTaxInclusive,
        discountPercentage: source.discountPercentage,
        isDefault: false,
        isActive: true,
      },
      createdBy,
    );

    // Copy items
    const itemRepo = dataSource.getRepository(PriceListItem);
    const sourceItems = await itemRepo.find({
      where: { priceListId: sourceId },
    });

    for (const sourceItem of sourceItems) {
      const newItem = itemRepo.create({
        id: uuidv4(),
        priceListId: newPriceList.id,
        productId: sourceItem.productId,
        variantId: sourceItem.variantId,
        uomId: sourceItem.uomId,
        price: sourceItem.price,
        minQuantity: sourceItem.minQuantity,
        maxQuantity: sourceItem.maxQuantity,
        discountPercentage: sourceItem.discountPercentage,
        discountAmount: sourceItem.discountAmount,
      });

      await itemRepo.save(newItem);
    }

    return this.findById(newPriceList.id);
  }
}
