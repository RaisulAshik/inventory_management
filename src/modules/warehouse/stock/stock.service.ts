import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
//import { Repository, DataSource } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { TenantConnectionManager } from '@database/tenant-connection.manager';
//import { Product } from '@entities/tenant/product.entity';
//import { Warehouse } from '@entities/tenant/warehouse.entity';
import { PaginationDto } from '@common/dto/pagination.dto';
import { PaginatedResult } from '@common/interfaces';
import { paginate } from '@common/utils/pagination.util';
import { StockMovementType } from '@common/enums';
import { getNextSequence } from '@common/utils/sequence.util';
import {
  InventoryStock,
  StockMovement,
  LocationInventory,
} from '@entities/tenant';
import { StockFilterDto } from './dto/stock-filter.dto';
import { StockMovementDto } from './dto/stock-movement.dto';
import { DeepPartial, FindOptionsWhere, IsNull } from 'typeorm';

@Injectable()
export class StockService {
  constructor(
    private readonly tenantConnectionManager: TenantConnectionManager,
  ) {}

  /**
   * Get stock for all products with filters and pagination
   */
  async getStock(
    paginationDto: PaginationDto,
    filterDto: StockFilterDto,
  ): Promise<PaginatedResult<InventoryStock>> {
    const dataSource = await this.tenantConnectionManager.getDataSource();
    const stockRepo = dataSource.getRepository(InventoryStock);

    const queryBuilder = stockRepo
      .createQueryBuilder('stock')
      .leftJoinAndSelect('stock.product', 'product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('stock.variant', 'variant')
      .leftJoinAndSelect('stock.warehouse', 'warehouse')
      .where('product.deletedAt IS NULL');

    // Apply filters
    if (filterDto.warehouseId) {
      queryBuilder.andWhere('stock.warehouseId = :warehouseId', {
        warehouseId: filterDto.warehouseId,
      });
    }

    if (filterDto.productId) {
      queryBuilder.andWhere('stock.productId = :productId', {
        productId: filterDto.productId,
      });
    }

    if (filterDto.categoryId) {
      queryBuilder.andWhere('product.categoryId = :categoryId', {
        categoryId: filterDto.categoryId,
      });
    }

    if (filterDto.lowStock) {
      queryBuilder.andWhere(
        '(stock.quantityOnHand - stock.quantityReserved) <= product.reorderLevel',
      );
    }

    if (filterDto.outOfStock) {
      queryBuilder.andWhere(
        '(stock.quantityOnHand - stock.quantityReserved) <= 0',
      );
    }

    // Apply search (supports ?search=, ?productName=, or ?sku=)
    const searchTerm = paginationDto.search || filterDto.productName;
    if (searchTerm) {
      queryBuilder.andWhere(
        '(product.sku LIKE :search OR product.productName LIKE :search)',
        { search: `%${searchTerm}%` },
      );
    }

    if (filterDto.sku) {
      queryBuilder.andWhere('product.sku LIKE :sku', {
        sku: `%${filterDto.sku}%`,
      });
    }

    if (!paginationDto.sortBy) {
      paginationDto.sortBy = 'product.productName';
      paginationDto.sortOrder = 'ASC';
    }

    return paginate(queryBuilder, paginationDto);
  }

  /**
   * Get stock by product ID
   */
  async getStockByProduct(productId: string): Promise<InventoryStock[]> {
    const dataSource = await this.tenantConnectionManager.getDataSource();
    const stockRepo = dataSource.getRepository(InventoryStock);

    return stockRepo.find({
      where: { productId },
      relations: ['warehouse', 'variant'],
    });
  }

  /**
   * Get stock by warehouse
   */
  async getStockByWarehouse(
    warehouseId: string,
    paginationDto: PaginationDto,
  ): Promise<PaginatedResult<InventoryStock>> {
    const dataSource = await this.tenantConnectionManager.getDataSource();
    const stockRepo = dataSource.getRepository(InventoryStock);

    const queryBuilder = stockRepo
      .createQueryBuilder('stock')
      .leftJoinAndSelect('stock.product', 'product')
      .leftJoinAndSelect('stock.variant', 'variant')
      .where('stock.warehouseId = :warehouseId', { warehouseId })
      .andWhere('product.deletedAt IS NULL');

    if (paginationDto.search) {
      queryBuilder.andWhere(
        '(product.sku LIKE :search OR product.productName LIKE :search)',
        { search: `%${paginationDto.search}%` },
      );
    }

    if (!paginationDto.sortBy) {
      paginationDto.sortBy = 'product.productName';
    }

    return paginate(queryBuilder, paginationDto);
  }

  /**
   * Get available quantity for a product in a warehouse
   */
  async getAvailableQuantity(
    productId: string,
    warehouseId: string,
    variantId?: string,
  ): Promise<number> {
    const dataSource = await this.tenantConnectionManager.getDataSource();
    const stockRepo = dataSource.getRepository(InventoryStock);

    const where: any = { productId, warehouseId };
    if (variantId) {
      where.variantId = variantId;
    }

    const stock = await stockRepo.findOne({ where });

    if (!stock) {
      return 0;
    }

    return stock.quantityOnHand - stock.quantityReserved;
  }

  /**
   * Reserve stock
   */
  async reserveStock(
    productId: string,
    warehouseId: string,
    quantity: number,
    variantId?: string,
  ): Promise<void> {
    const dataSource = await this.tenantConnectionManager.getDataSource();

    await dataSource.transaction(async (manager) => {
      const stockRepo = manager.getRepository(InventoryStock);

      const where: any = { productId, warehouseId };
      if (variantId) {
        where.variantId = variantId;
      }

      const stock = await stockRepo.findOne({
        where,
        lock: { mode: 'pessimistic_write' },
      });

      if (!stock) {
        throw new NotFoundException('Stock not found');
      }

      const available = stock.quantityOnHand - stock.quantityReserved;
      if (available < quantity) {
        throw new BadRequestException(
          `Insufficient stock. Available: ${available}, Requested: ${quantity}`,
        );
      }

      stock.quantityReserved =
        Number(stock.quantityReserved) + Number(quantity);
      await stockRepo.save(stock);
    });
  }

  /**
   * Release reserved stock
   */
  async releaseStock(
    productId: string,
    warehouseId: string,
    quantity: number,
    variantId?: string,
  ): Promise<void> {
    const dataSource = await this.tenantConnectionManager.getDataSource();

    await dataSource.transaction(async (manager) => {
      const stockRepo = manager.getRepository(InventoryStock);

      const where: any = { productId, warehouseId };
      if (variantId) {
        where.variantId = variantId;
      }

      const stock = await stockRepo.findOne({
        where,
        lock: { mode: 'pessimistic_write' },
      });

      if (!stock) {
        throw new NotFoundException('Stock not found');
      }

      stock.quantityReserved = Math.max(
        0,
        Number(stock.quantityReserved) - Number(quantity),
      );
      await stockRepo.save(stock);
    });
  }

  /**
   * Record stock movement
   */
  async recordMovement(
    movementDto: StockMovementDto,
    createdBy: string,
    externalManager?: any,
  ): Promise<StockMovement> {
    const dataSource = await this.tenantConnectionManager.getDataSource();

    const execute = async (manager: any) => {
      const stockRepo = manager.getRepository(InventoryStock);
      const movementRepo = manager.getRepository(StockMovement);

      // Generate movement number
      const movementNumber = await getNextSequence(
        dataSource,
        'STOCK_MOVEMENT',
      );

      // Build where clause
      const whereClause: FindOptionsWhere<InventoryStock> = {
        productId: movementDto.productId,
        warehouseId: movementDto.warehouseId || movementDto.toWarehouseId,
      };

      if (movementDto.variantId) {
        whereClause.variantId = movementDto.variantId;
      } else {
        whereClause.variantId = IsNull();
      }

      // Get or create stock record
      let stock = await stockRepo.findOne({
        where: whereClause,
      });

      if (!stock) {
        stock = stockRepo.create({
          id: uuidv4(),
          productId: movementDto.productId,
          warehouseId: movementDto.warehouseId || movementDto.toWarehouseId,
          variantId: movementDto.variantId,
          quantityOnHand: 0,
          quantityReserved: 0,
          quantityIncoming: 0,
          quantityOutgoing: 0,
        } as DeepPartial<InventoryStock>);
        await stockRepo.save(stock);
      }

      // Update stock based on movement type
      switch (movementDto.movementType) {
        case StockMovementType.PURCHASE_RECEIPT:
        case StockMovementType.RETURN_FROM_CUSTOMER:
        case StockMovementType.TRANSFER_IN:
        case StockMovementType.PRODUCTION_RECEIPT:
        case StockMovementType.ADJUSTMENT_IN:
        case StockMovementType.INTER_LOCATION_IN:
        case StockMovementType.OPENING_STOCK:
          stock.quantityOnHand =
            Number(stock.quantityOnHand) + Number(movementDto.quantity);
          break;

        case StockMovementType.SALES_ISSUE:
        case StockMovementType.RETURN_TO_SUPPLIER:
        case StockMovementType.TRANSFER_OUT:
        case StockMovementType.PRODUCTION_ISSUE:
        case StockMovementType.ADJUSTMENT_OUT:
        case StockMovementType.INTER_LOCATION_OUT:
        case StockMovementType.WRITE_OFF:
        case StockMovementType.DAMAGE:
        case StockMovementType.EXPIRY:
        case StockMovementType.SCRAP:
        case StockMovementType.SAMPLE:
          stock.quantityOnHand =
            Number(stock.quantityOnHand) - Number(movementDto.quantity);
          break;
      }

      stock.lastStockDate = new Date();
      await stockRepo.save(stock);

      // Create movement record
      const movement = movementRepo.create({
        id: uuidv4(),
        movementNumber,
        ...movementDto,
        movementDate: new Date(),
        createdBy,
      } as DeepPartial<StockMovement>);

      const saved = await movementRepo.save(movement);
      return Array.isArray(saved) ? saved[0] : saved;
    };

    if (externalManager) {
      return execute(externalManager);
    }
    return dataSource.transaction(execute);
  }

  /**
   * Get stock movements
   */
  async getMovements(
    paginationDto: PaginationDto,
    filterDto: {
      productId?: string;
      warehouseId?: string;
      movementType?: StockMovementType;
      fromDate?: Date;
      toDate?: Date;
    },
  ): Promise<PaginatedResult<StockMovement>> {
    const dataSource = await this.tenantConnectionManager.getDataSource();
    const movementRepo = dataSource.getRepository(StockMovement);

    const queryBuilder = movementRepo
      .createQueryBuilder('movement')
      .leftJoinAndSelect('movement.product', 'product')
      .leftJoinAndSelect('movement.variant', 'variant')
      .leftJoinAndSelect('movement.uom', 'uom')
      .leftJoinAndSelect('movement.fromWarehouse', 'fromWarehouse')
      .leftJoinAndSelect('movement.toWarehouse', 'toWarehouse');

    if (filterDto.productId) {
      queryBuilder.andWhere('movement.productId = :productId', {
        productId: filterDto.productId,
      });
    }

    if (filterDto.warehouseId) {
      queryBuilder.andWhere(
        '(movement.fromWarehouseId = :warehouseId OR movement.toWarehouseId = :warehouseId)',
        { warehouseId: filterDto.warehouseId },
      );
    }

    if (filterDto.movementType) {
      queryBuilder.andWhere('movement.movementType = :movementType', {
        movementType: filterDto.movementType,
      });
    }

    if (filterDto.fromDate) {
      queryBuilder.andWhere('movement.movementDate >= :fromDate', {
        fromDate: filterDto.fromDate,
      });
    }

    if (filterDto.toDate) {
      queryBuilder.andWhere('movement.movementDate <= :toDate', {
        toDate: filterDto.toDate,
      });
    }

    if (!paginationDto.sortBy) {
      paginationDto.sortBy = 'movementDate';
      paginationDto.sortOrder = 'DESC';
    }

    return paginate(queryBuilder, paginationDto);
  }

  /**
   * Get low stock products
   */
  async getLowStockProducts(warehouseId?: string): Promise<any[]> {
    const dataSource = await this.tenantConnectionManager.getDataSource();

    let query = `
      SELECT
        p.id,
        p.sku,
        p.product_name,
        p.reorder_level,
        p.reorder_quantity,
        COALESCE(SUM(s.quantity_on_hand - s.quantity_reserved), 0) as available_quantity,
        w.warehouse_name
      FROM products p
      LEFT JOIN inventory_stock s ON p.id = s.product_id
      LEFT JOIN warehouses w ON s.warehouse_id = w.id
      WHERE p.deleted_at IS NULL
      AND p.is_stockable = 1
      AND p.is_active = 1`;

    const params: string[] = [];
    if (warehouseId) {
      query += ` AND s.warehouse_id = ?`;
      params.push(warehouseId);
    }

    query += `
  GROUP BY p.id, p.sku, p.product_name, p.reorder_level, p.reorder_quantity, w.warehouse_name
  HAVING available_quantity <= p.reorder_level
  ORDER BY available_quantity ASC
`;

    return dataSource.query(query, params);
  }
  /**

Get stock valuation
*/
  async getStockValuation(warehouseId?: string): Promise<any> {
    const dataSource = await this.tenantConnectionManager.getDataSource();

    let query = `
  SELECT 
    SUM(s.quantity_on_hand * p.cost_price) as total_value,
    SUM(s.quantity_on_hand) as total_quantity,
    COUNT(DISTINCT s.product_id) as total_products
  FROM inventory_stock s
  INNER JOIN products p ON s.product_id = p.id
  WHERE p.deleted_at IS NULL
`;

    const params: string[] = [];
    if (warehouseId) {
      query += ` AND s.warehouse_id = ?`;
      params.push(warehouseId);
    }

    const result = await dataSource.query(query, params);
    return result[0];
  }
  /**

Get location-wise inventory
*/
  async getLocationInventory(
    warehouseId: string,
  ): Promise<LocationInventory[]> {
    const dataSource = await this.tenantConnectionManager.getDataSource();
    const locationInvRepo = dataSource.getRepository(LocationInventory);

    return locationInvRepo.find({
      where: { warehouseId },
      relations: ['product', 'variant', 'location', 'batch'],
    });
  }

  /**
   * Fetch raw stock data for export (no pagination)
   */
  async exportStockData(filterDto: StockFilterDto): Promise<any[]> {
    const dataSource = await this.tenantConnectionManager.getDataSource();

    let query = `
      SELECT
        p.product_name       AS \`Product Name\`,
        p.sku                AS \`SKU\`,
        c.category_name      AS \`Category\`,
        w.warehouse_name     AS \`Warehouse\`,
        v.variant_name       AS \`Variant\`,
        s.quantity_on_hand   AS \`On Hand\`,
        s.quantity_reserved  AS \`Reserved\`,
        (s.quantity_on_hand - s.quantity_reserved) AS \`Available\`,
        COALESCE(p.cost_price, 0) AS \`Unit Cost\`,
        ROUND(s.quantity_on_hand * COALESCE(p.cost_price, 0), 4) AS \`Total Value\`,
        p.reorder_level      AS \`Reorder Level\`,
        s.last_stock_date    AS \`Last Stock Date\`
      FROM inventory_stock s
      INNER JOIN products p ON s.product_id = p.id
      LEFT JOIN product_categories c ON p.category_id = c.id
      LEFT JOIN warehouses w ON s.warehouse_id = w.id
      LEFT JOIN product_variants v ON s.variant_id = v.id
      WHERE p.deleted_at IS NULL
    `;

    const params: any[] = [];

    if (filterDto.warehouseId) {
      query += ` AND s.warehouse_id = ?`;
      params.push(filterDto.warehouseId);
    }
    if (filterDto.categoryId) {
      query += ` AND p.category_id = ?`;
      params.push(filterDto.categoryId);
    }
    if (filterDto.productId) {
      query += ` AND s.product_id = ?`;
      params.push(filterDto.productId);
    }
    if (filterDto.sku) {
      query += ` AND p.sku LIKE ?`;
      params.push(`%${filterDto.sku}%`);
    }
    if (filterDto.lowStock) {
      query += ` AND (s.quantity_on_hand - s.quantity_reserved) <= p.reorder_level`;
    }
    if (filterDto.outOfStock) {
      query += ` AND (s.quantity_on_hand - s.quantity_reserved) <= 0`;
    }

    query += ` ORDER BY w.warehouse_name ASC, p.product_name ASC`;

    return dataSource.query(query, params);
  }

  /**
   * Fetch raw stock movements for export (no pagination)
   */
  async exportMovementsData(filterDto: {
    productId?: string;
    warehouseId?: string;
    movementType?: string;
    fromDate?: string;
    toDate?: string;
  }): Promise<any[]> {
    const dataSource = await this.tenantConnectionManager.getDataSource();

    let query = `
      SELECT
        m.movement_number    AS \`Movement #\`,
        m.movement_date      AS \`Date\`,
        m.movement_type      AS \`Type\`,
        p.product_name       AS \`Product Name\`,
        p.sku                AS \`SKU\`,
        v.variant_name       AS \`Variant\`,
        fw.warehouse_name    AS \`From Warehouse\`,
        tw.warehouse_name    AS \`To Warehouse\`,
        m.quantity           AS \`Quantity\`,
        u.uom_name           AS \`UOM\`,
        m.unit_cost          AS \`Unit Cost\`,
        ROUND(m.quantity * COALESCE(m.unit_cost, 0), 4) AS \`Total Cost\`,
        m.reference_type     AS \`Reference Type\`,
        m.reference_number   AS \`Reference #\`,
        m.created_by         AS \`Created By\`
      FROM stock_movements m
      INNER JOIN products p ON m.product_id = p.id
      LEFT JOIN product_variants v ON m.variant_id = v.id
      LEFT JOIN warehouses fw ON m.from_warehouse_id = fw.id
      LEFT JOIN warehouses tw ON m.to_warehouse_id = tw.id
      LEFT JOIN units_of_measure u ON m.uom_id = u.id
      WHERE 1=1
    `;

    const params: any[] = [];

    if (filterDto.productId) {
      query += ` AND m.product_id = ?`;
      params.push(filterDto.productId);
    }
    if (filterDto.warehouseId) {
      query += ` AND (m.from_warehouse_id = ? OR m.to_warehouse_id = ?)`;
      params.push(filterDto.warehouseId, filterDto.warehouseId);
    }
    if (filterDto.movementType) {
      query += ` AND m.movement_type = ?`;
      params.push(filterDto.movementType);
    }
    if (filterDto.fromDate) {
      query += ` AND DATE(m.movement_date) >= ?`;
      params.push(filterDto.fromDate);
    }
    if (filterDto.toDate) {
      query += ` AND DATE(m.movement_date) <= ?`;
      params.push(filterDto.toDate);
    }

    query += ` ORDER BY m.movement_date DESC`;

    return dataSource.query(query, params);
  }
}
