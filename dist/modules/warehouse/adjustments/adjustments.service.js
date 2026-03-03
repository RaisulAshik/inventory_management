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
exports.AdjustmentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const uuid_1 = require("uuid");
const tenant_connection_manager_1 = require("../../../database/tenant-connection.manager");
const pagination_util_1 = require("../../../common/utils/pagination.util");
const sequence_util_1 = require("../../../common/utils/sequence.util");
const enums_1 = require("../../../common/enums");
const tenant_1 = require("../../../entities/tenant");
let AdjustmentsService = class AdjustmentsService {
    tenantConnectionManager;
    constructor(tenantConnectionManager) {
        this.tenantConnectionManager = tenantConnectionManager;
    }
    async getAdjustmentRepository() {
        return this.tenantConnectionManager.getRepository(tenant_1.StockAdjustment);
    }
    async create(createAdjustmentDto, createdBy) {
        const adjustmentRepo = await this.getAdjustmentRepository();
        const dataSource = await this.tenantConnectionManager.getDataSource();
        const adjustmentNumber = await (0, sequence_util_1.getNextSequence)(dataSource, 'ADJUSTMENT');
        const adjustment = adjustmentRepo.create({
            id: (0, uuid_1.v4)(),
            adjustmentNumber,
            ...createAdjustmentDto,
            adjustmentDate: createAdjustmentDto.adjustmentDate || new Date(),
            status: tenant_1.AdjustmentStatus.DRAFT,
            createdBy,
        });
        const savedAdjustment = await adjustmentRepo.save(adjustment);
        if (createAdjustmentDto.items && createAdjustmentDto.items.length > 0) {
            await this.createItems(savedAdjustment.id, createAdjustmentDto.items, dataSource);
        }
        return this.findById(savedAdjustment.id);
    }
    async createItems(adjustmentId, items, dataSource) {
        const itemRepo = dataSource.getRepository(tenant_1.StockAdjustmentItem);
        for (const itemDto of items) {
            const item = itemRepo.create({
                id: (0, uuid_1.v4)(),
                stockAdjustmentId: adjustmentId,
                ...itemDto,
            });
            await itemRepo.save(item);
        }
    }
    async findAll(paginationDto, filterDto) {
        const adjustmentRepo = await this.getAdjustmentRepository();
        const queryBuilder = adjustmentRepo
            .createQueryBuilder('adjustment')
            .leftJoinAndSelect('adjustment.warehouse', 'warehouse')
            .leftJoinAndSelect('adjustment.items', 'items')
            .leftJoinAndSelect('items.product', 'product');
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
        if (paginationDto.search) {
            queryBuilder.andWhere('(adjustment.adjustmentNumber LIKE :search OR adjustment.reason LIKE :search)', { search: `%${paginationDto.search}%` });
        }
        if (!paginationDto.sortBy) {
            paginationDto.sortBy = 'createdAt';
            paginationDto.sortOrder = 'DESC';
        }
        return (0, pagination_util_1.paginate)(queryBuilder, paginationDto);
    }
    async findById(id) {
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
            throw new common_1.NotFoundException(`Adjustment with ID ${id} not found`);
        }
        return adjustment;
    }
    async update(id, updateAdjustmentDto) {
        const adjustmentRepo = await this.getAdjustmentRepository();
        const adjustment = await this.findById(id);
        if (adjustment.status !== tenant_1.AdjustmentStatus.DRAFT) {
            throw new common_1.BadRequestException('Only draft adjustments can be updated');
        }
        Object.assign(adjustment, updateAdjustmentDto);
        await adjustmentRepo.save(adjustment);
        return this.findById(id);
    }
    async submitForApproval(id, userId) {
        const adjustmentRepo = await this.getAdjustmentRepository();
        const adjustment = await this.findById(id);
        if (adjustment.status !== tenant_1.AdjustmentStatus.DRAFT) {
            throw new common_1.BadRequestException('Only draft adjustments can be submitted for approval');
        }
        if (!adjustment.items || adjustment.items.length === 0) {
            throw new common_1.BadRequestException('Adjustment must have at least one item');
        }
        let totalValueImpact = 0;
        for (const item of adjustment.items) {
            totalValueImpact += Number(item.valueImpact) || 0;
        }
        adjustment.status = tenant_1.AdjustmentStatus.PENDING_APPROVAL;
        adjustment.totalValueImpact = totalValueImpact;
        await adjustmentRepo.save(adjustment);
        return this.findById(id);
    }
    async approve(id, approvedBy) {
        const dataSource = await this.tenantConnectionManager.getDataSource();
        const adjustment = await this.findById(id);
        if (adjustment.status !== tenant_1.AdjustmentStatus.PENDING_APPROVAL) {
            throw new common_1.BadRequestException('Only pending adjustments can be approved');
        }
        await dataSource.transaction(async (manager) => {
            const stockRepo = manager.getRepository(tenant_1.InventoryStock);
            const movementRepo = manager.getRepository(tenant_1.StockMovement);
            for (const item of adjustment.items) {
                const whereClause = {
                    productId: item.productId,
                    warehouseId: adjustment.warehouseId,
                };
                if (item.variantId) {
                    whereClause.variantId = item.variantId;
                }
                else {
                    whereClause.variantId = (0, typeorm_1.IsNull)();
                }
                let stock = await stockRepo.findOne({
                    where: whereClause,
                    lock: { mode: 'pessimistic_write' },
                });
                if (!stock) {
                    stock = stockRepo.create({
                        id: (0, uuid_1.v4)(),
                        productId: item.productId,
                        warehouseId: adjustment.warehouseId,
                        variantId: item.variantId,
                        quantityOnHand: 0,
                        quantityReserved: 0,
                        quantityIncoming: 0,
                        quantityOutgoing: 0,
                    });
                }
                stock.quantityOnHand += Number(item.adjustmentQuantity);
                await stockRepo.save(stock);
                const movementType = Number(item.adjustmentQuantity) > 0
                    ? enums_1.StockMovementType.ADJUSTMENT_IN
                    : enums_1.StockMovementType.ADJUSTMENT_OUT;
                const movement = movementRepo.create({
                    id: (0, uuid_1.v4)(),
                    movementNumber: await (0, sequence_util_1.getNextSequence)(dataSource, 'STOCK_MOVEMENT'),
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
                });
                await movementRepo.save(movement);
            }
            adjustment.status = tenant_1.AdjustmentStatus.APPROVED;
            adjustment.approvedBy = approvedBy;
            adjustment.approvedAt = new Date();
            await manager.getRepository(tenant_1.StockAdjustment).save(adjustment);
        });
        return this.findById(id);
    }
    async reject(id, rejectedBy, reason) {
        const adjustmentRepo = await this.getAdjustmentRepository();
        const adjustment = await this.findById(id);
        if (adjustment.status !== tenant_1.AdjustmentStatus.PENDING_APPROVAL) {
            throw new common_1.BadRequestException('Only pending adjustments can be rejected');
        }
        adjustment.status = tenant_1.AdjustmentStatus.REJECTED;
        adjustment.notes = `Rejected by: ${rejectedBy}. Reason: ${reason}`;
        await adjustmentRepo.save(adjustment);
        return this.findById(id);
    }
    async cancel(id, cancelledBy, reason) {
        const adjustmentRepo = await this.getAdjustmentRepository();
        const adjustment = await this.findById(id);
        if (![tenant_1.AdjustmentStatus.DRAFT, tenant_1.AdjustmentStatus.PENDING_APPROVAL].includes(adjustment.status)) {
            throw new common_1.BadRequestException('Only draft or pending adjustments can be cancelled');
        }
        adjustment.status = tenant_1.AdjustmentStatus.CANCELLED;
        adjustment.notes = `Cancelled by: ${cancelledBy}. Reason: ${reason}`;
        await adjustmentRepo.save(adjustment);
        return this.findById(id);
    }
    async addItem(adjustmentId, itemDto) {
        const adjustment = await this.findById(adjustmentId);
        if (adjustment.status !== tenant_1.AdjustmentStatus.DRAFT) {
            throw new common_1.BadRequestException('Items can only be added to draft adjustments');
        }
        const dataSource = await this.tenantConnectionManager.getDataSource();
        const itemRepo = dataSource.getRepository(tenant_1.StockAdjustmentItem);
        const stockRepo = dataSource.getRepository(tenant_1.InventoryStock);
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
            id: (0, uuid_1.v4)(),
            stockAdjustmentId: adjustmentId,
            ...itemDto,
            systemQuantity,
            adjustmentQuantity,
            valueImpact,
        });
        return itemRepo.save(item);
    }
    async updateItem(itemId, itemDto) {
        const dataSource = await this.tenantConnectionManager.getDataSource();
        const itemRepo = dataSource.getRepository(tenant_1.StockAdjustmentItem);
        const item = await itemRepo.findOne({
            where: { id: itemId },
            relations: ['stockAdjustment'],
        });
        if (!item) {
            throw new common_1.NotFoundException(`Adjustment item with ID ${itemId} not found`);
        }
        if (item.stockAdjustment.status !== tenant_1.AdjustmentStatus.DRAFT) {
            throw new common_1.BadRequestException('Items can only be updated in draft adjustments');
        }
        if (itemDto.physicalQuantity !== undefined) {
            itemDto.adjustmentQuantity =
                itemDto.physicalQuantity - Number(item.systemQuantity);
            itemDto.valueImpact =
                itemDto.adjustmentQuantity * (itemDto.unitCost || item.unitCost || 0);
        }
        Object.assign(item, itemDto);
        return itemRepo.save(item);
    }
    async removeItem(itemId) {
        const dataSource = await this.tenantConnectionManager.getDataSource();
        const itemRepo = dataSource.getRepository(tenant_1.StockAdjustmentItem);
        const item = await itemRepo.findOne({
            where: { id: itemId },
            relations: ['stockAdjustment'],
        });
        if (!item) {
            throw new common_1.NotFoundException(`Adjustment item with ID ${itemId} not found`);
        }
        if (item.stockAdjustment.status !== tenant_1.AdjustmentStatus.DRAFT) {
            throw new common_1.BadRequestException('Items can only be removed from draft adjustments');
        }
        await itemRepo.delete(itemId);
    }
    async remove(id) {
        const adjustmentRepo = await this.getAdjustmentRepository();
        const adjustment = await this.findById(id);
        if (adjustment.status !== tenant_1.AdjustmentStatus.DRAFT) {
            throw new common_1.BadRequestException('Only draft adjustments can be deleted');
        }
        await adjustmentRepo.delete(id);
    }
};
exports.AdjustmentsService = AdjustmentsService;
exports.AdjustmentsService = AdjustmentsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tenant_connection_manager_1.TenantConnectionManager])
], AdjustmentsService);
//# sourceMappingURL=adjustments.service.js.map