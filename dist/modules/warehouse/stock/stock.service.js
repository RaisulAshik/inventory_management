"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StockService = void 0;
const common_1 = require("@nestjs/common");
const uuid_1 = require("uuid");
const tenant_connection_manager_1 = require("../../../database/tenant-connection.manager");
const pagination_util_1 = require("../../../common/utils/pagination.util");
const enums_1 = require("../../../common/enums");
const sequence_util_1 = require("../../../common/utils/sequence.util");
const tenant_1 = require("../../../entities/tenant");
const typeorm_1 = require("typeorm");
let StockService = class StockService {
    tenantConnectionManager;
    constructor(tenantConnectionManager) {
        this.tenantConnectionManager = tenantConnectionManager;
    }
    async getStock(paginationDto, filterDto) {
        const dataSource = await this.tenantConnectionManager.getDataSource();
        const stockRepo = dataSource.getRepository(tenant_1.InventoryStock);
        const queryBuilder = stockRepo
            .createQueryBuilder('stock')
            .leftJoinAndSelect('stock.product', 'product')
            .leftJoinAndSelect('product.category', 'category')
            .leftJoinAndSelect('stock.variant', 'variant')
            .leftJoinAndSelect('stock.warehouse', 'warehouse')
            .where('product.deletedAt IS NULL');
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
            queryBuilder.andWhere('(stock.quantityOnHand - stock.quantityReserved) <= product.reorderLevel');
        }
        if (filterDto.outOfStock) {
            queryBuilder.andWhere('(stock.quantityOnHand - stock.quantityReserved) <= 0');
        }
        if (paginationDto.search) {
            queryBuilder.andWhere('(product.sku LIKE :search OR product.productName LIKE :search)', { search: `%${paginationDto.search}%` });
        }
        if (!paginationDto.sortBy) {
            paginationDto.sortBy = 'product.productName';
            paginationDto.sortOrder = 'ASC';
        }
        return (0, pagination_util_1.paginate)(queryBuilder, paginationDto);
    }
    async getStockByProduct(productId) {
        const dataSource = await this.tenantConnectionManager.getDataSource();
        const stockRepo = dataSource.getRepository(tenant_1.InventoryStock);
        return stockRepo.find({
            where: { productId },
            relations: ['warehouse', 'variant'],
        });
    }
    async getStockByWarehouse(warehouseId, paginationDto) {
        const dataSource = await this.tenantConnectionManager.getDataSource();
        const stockRepo = dataSource.getRepository(tenant_1.InventoryStock);
        const queryBuilder = stockRepo
            .createQueryBuilder('stock')
            .leftJoinAndSelect('stock.product', 'product')
            .leftJoinAndSelect('stock.variant', 'variant')
            .where('stock.warehouseId = :warehouseId', { warehouseId })
            .andWhere('product.deletedAt IS NULL');
        if (paginationDto.search) {
            queryBuilder.andWhere('(product.sku LIKE :search OR product.productName LIKE :search)', { search: `%${paginationDto.search}%` });
        }
        if (!paginationDto.sortBy) {
            paginationDto.sortBy = 'product.productName';
        }
        return (0, pagination_util_1.paginate)(queryBuilder, paginationDto);
    }
    async getAvailableQuantity(productId, warehouseId, variantId) {
        const dataSource = await this.tenantConnectionManager.getDataSource();
        const stockRepo = dataSource.getRepository(tenant_1.InventoryStock);
        const where = { productId, warehouseId };
        if (variantId) {
            where.variantId = variantId;
        }
        const stock = await stockRepo.findOne({ where });
        if (!stock) {
            return 0;
        }
        return stock.quantityOnHand - stock.quantityReserved;
    }
    async reserveStock(productId, warehouseId, quantity, variantId) {
        const dataSource = await this.tenantConnectionManager.getDataSource();
        await dataSource.transaction(async (manager) => {
            const stockRepo = manager.getRepository(tenant_1.InventoryStock);
            const where = { productId, warehouseId };
            if (variantId) {
                where.variantId = variantId;
            }
            const stock = await stockRepo.findOne({
                where,
                lock: { mode: 'pessimistic_write' },
            });
            if (!stock) {
                throw new common_1.NotFoundException('Stock not found');
            }
            const available = stock.quantityOnHand - stock.quantityReserved;
            if (available < quantity) {
                throw new common_1.BadRequestException(`Insufficient stock. Available: ${available}, Requested: ${quantity}`);
            }
            stock.quantityReserved += quantity;
            await stockRepo.save(stock);
        });
    }
    async releaseStock(productId, warehouseId, quantity, variantId) {
        const dataSource = await this.tenantConnectionManager.getDataSource();
        await dataSource.transaction(async (manager) => {
            const stockRepo = manager.getRepository(tenant_1.InventoryStock);
            const where = { productId, warehouseId };
            if (variantId) {
                where.variantId = variantId;
            }
            const stock = await stockRepo.findOne({
                where,
                lock: { mode: 'pessimistic_write' },
            });
            if (!stock) {
                throw new common_1.NotFoundException('Stock not found');
            }
            stock.quantityReserved = Math.max(0, stock.quantityReserved - quantity);
            await stockRepo.save(stock);
        });
    }
    async recordMovement(movementDto, createdBy) {
        const dataSource = await this.tenantConnectionManager.getDataSource();
        return await dataSource.transaction(async (manager) => {
            const stockRepo = manager.getRepository(tenant_1.InventoryStock);
            const movementRepo = manager.getRepository(tenant_1.StockMovement);
            const movementNumber = await (0, sequence_util_1.getNextSequence)(dataSource, 'STOCK_MOVEMENT');
            const whereClause = {
                productId: movementDto.productId,
                warehouseId: movementDto.warehouseId || movementDto.toWarehouseId,
            };
            if (movementDto.variantId) {
                whereClause.variantId = movementDto.variantId;
            }
            else {
                whereClause.variantId = (0, typeorm_1.IsNull)();
            }
            let stock = await stockRepo.findOne({
                where: whereClause,
            });
            if (!stock) {
                stock = stockRepo.create({
                    id: (0, uuid_1.v4)(),
                    productId: movementDto.productId,
                    warehouseId: movementDto.warehouseId || movementDto.toWarehouseId,
                    variantId: movementDto.variantId,
                    quantityOnHand: 0,
                    quantityReserved: 0,
                    quantityIncoming: 0,
                    quantityOutgoing: 0,
                });
                await stockRepo.save(stock);
            }
            switch (movementDto.movementType) {
                case enums_1.StockMovementType.PURCHASE_RECEIPT:
                case enums_1.StockMovementType.SALES_RETURN:
                case enums_1.StockMovementType.TRANSFER_IN:
                case enums_1.StockMovementType.PRODUCTION_OUTPUT:
                case enums_1.StockMovementType.ADJUSTMENT_IN:
                    stock.quantityOnHand += movementDto.quantity;
                    break;
                case enums_1.StockMovementType.SALES:
                case enums_1.StockMovementType.PURCHASE_RETURN:
                case enums_1.StockMovementType.TRANSFER_OUT:
                case enums_1.StockMovementType.PRODUCTION_CONSUMPTION:
                case enums_1.StockMovementType.ADJUSTMENT_OUT:
                case enums_1.StockMovementType.WRITE_OFF:
                case enums_1.StockMovementType.DAMAGE:
                    stock.quantityOnHand -= movementDto.quantity;
                    break;
            }
            stock.lastStockDate = new Date();
            await stockRepo.save(stock);
            const movement = movementRepo.create({
                id: (0, uuid_1.v4)(),
                movementNumber,
                ...movementDto,
                movementDate: new Date(),
                createdBy,
            });
            const saved = await movementRepo.save(movement);
            return Array.isArray(saved) ? saved[0] : saved;
        });
    }
    async getMovements(paginationDto, filterDto) {
        const dataSource = await this.tenantConnectionManager.getDataSource();
        const movementRepo = dataSource.getRepository(tenant_1.StockMovement);
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
            queryBuilder.andWhere('(movement.fromWarehouseId = :warehouseId OR movement.toWarehouseId = :warehouseId)', { warehouseId: filterDto.warehouseId });
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
        return (0, pagination_util_1.paginate)(queryBuilder, paginationDto);
    }
    async getLowStockProducts(warehouseId) {
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
        if (warehouseId) {
            query += ` AND s.warehouse_id = '${warehouseId}'`;
        }
        query += `
  GROUP BY p.id, p.sku, p.product_name, p.reorder_level, p.reorder_quantity, w.warehouse_name
  HAVING available_quantity <= p.reorder_level
  ORDER BY available_quantity ASC
`;
        return dataSource.query(query);
    }
    async getStockValuation(warehouseId) {
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
        if (warehouseId) {
            query += ` AND s.warehouse_id = '${warehouseId}'`;
        }
        const result = await dataSource.query(query);
        return result[0];
    }
    async getLocationInventory(warehouseId) {
        const dataSource = await this.tenantConnectionManager.getDataSource();
        const locationInvRepo = dataSource.getRepository(tenant_1.LocationInventory);
        return locationInvRepo.find({
            where: { warehouseId },
            relations: ['product', 'variant', 'location', 'batch'],
        });
    }
};
exports.StockService = StockService;
exports.StockService = StockService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tenant_connection_manager_1.TenantConnectionManager])
], StockService);
//# sourceMappingURL=stock.service.js.map