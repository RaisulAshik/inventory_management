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
exports.TransfersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const uuid_1 = require("uuid");
const tenant_connection_manager_1 = require("../../../database/tenant-connection.manager");
const pagination_util_1 = require("../../../common/utils/pagination.util");
const sequence_util_1 = require("../../../common/utils/sequence.util");
const enums_1 = require("../../../common/enums");
const tenant_1 = require("../../../entities/tenant");
let TransfersService = class TransfersService {
    tenantConnectionManager;
    constructor(tenantConnectionManager) {
        this.tenantConnectionManager = tenantConnectionManager;
    }
    async getTransferRepository() {
        return this.tenantConnectionManager.getRepository(tenant_1.WarehouseTransfer);
    }
    async create(createTransferDto, createdBy) {
        const transferRepo = await this.getTransferRepository();
        const dataSource = await this.tenantConnectionManager.getDataSource();
        if (createTransferDto.fromWarehouseId === createTransferDto.toWarehouseId) {
            throw new common_1.BadRequestException('Source and destination warehouses must be different');
        }
        const transferNumber = await (0, sequence_util_1.getNextSequence)(dataSource, 'TRANSFER');
        const transfer = transferRepo.create({
            id: (0, uuid_1.v4)(),
            transferNumber,
            ...createTransferDto,
            status: tenant_1.TransferStatus.DRAFT,
            createdBy,
        });
        const savedTransfer = await transferRepo.save(transfer);
        if (createTransferDto.items && createTransferDto.items.length > 0) {
            await this.createItems(savedTransfer.id, createTransferDto.items, dataSource);
        }
        return this.findById(savedTransfer.id);
    }
    async createItems(transferId, items, dataSource) {
        const itemRepo = dataSource.getRepository(tenant_1.WarehouseTransferItem);
        for (const itemDto of items) {
            const item = itemRepo.create({
                id: (0, uuid_1.v4)(),
                warehouseTransferId: transferId,
                ...itemDto,
            });
            await itemRepo.save(item);
        }
    }
    async findAll(paginationDto, filterDto) {
        const transferRepo = await this.getTransferRepository();
        const queryBuilder = transferRepo
            .createQueryBuilder('transfer')
            .leftJoinAndSelect('transfer.fromWarehouse', 'fromWarehouse')
            .leftJoinAndSelect('transfer.toWarehouse', 'toWarehouse')
            .leftJoinAndSelect('transfer.items', 'items')
            .leftJoinAndSelect('items.product', 'product');
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
        if (paginationDto.search) {
            queryBuilder.andWhere('(transfer.transferNumber LIKE :search OR transfer.trackingNumber LIKE :search)', { search: `%${paginationDto.search}%` });
        }
        if (!paginationDto.sortBy) {
            paginationDto.sortBy = 'createdAt';
            paginationDto.sortOrder = 'DESC';
        }
        return (0, pagination_util_1.paginate)(queryBuilder, paginationDto);
    }
    async findById(id) {
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
            throw new common_1.NotFoundException(`Transfer with ID ${id} not found`);
        }
        return transfer;
    }
    async update(id, updateTransferDto) {
        const transferRepo = await this.getTransferRepository();
        const transfer = await this.findById(id);
        if (transfer.status !== tenant_1.TransferStatus.DRAFT) {
            throw new common_1.BadRequestException('Only draft transfers can be updated');
        }
        Object.assign(transfer, updateTransferDto);
        await transferRepo.save(transfer);
        return this.findById(id);
    }
    async submitForApproval(id, userId) {
        const transferRepo = await this.getTransferRepository();
        const transfer = await this.findById(id);
        if (transfer.status !== tenant_1.TransferStatus.DRAFT) {
            throw new common_1.BadRequestException('Only draft transfers can be submitted for approval');
        }
        if (!transfer.items || transfer.items.length === 0) {
            throw new common_1.BadRequestException('Transfer must have at least one item');
        }
        transfer.status = tenant_1.TransferStatus.PENDING_APPROVAL;
        await transferRepo.save(transfer);
        return this.findById(id);
    }
    async approve(id, approvedBy) {
        const transferRepo = await this.getTransferRepository();
        const transfer = await this.findById(id);
        if (transfer.status !== tenant_1.TransferStatus.PENDING_APPROVAL) {
            throw new common_1.BadRequestException('Only pending transfers can be approved');
        }
        await this.validateStockAvailability(transfer);
        transfer.status = tenant_1.TransferStatus.APPROVED;
        transfer.approvedBy = approvedBy;
        transfer.approvedAt = new Date();
        await transferRepo.save(transfer);
        return this.findById(id);
    }
    async validateStockAvailability(transfer) {
        const dataSource = await this.tenantConnectionManager.getDataSource();
        const stockRepo = dataSource.getRepository(tenant_1.InventoryStock);
        for (const item of transfer.items) {
            const whereClause = {
                productId: item.productId,
                warehouseId: transfer.fromWarehouseId,
            };
            if (item.variantId) {
                whereClause.variantId = item.variantId;
            }
            else {
                whereClause.variantId = (0, typeorm_1.IsNull)();
            }
            const stock = await stockRepo.findOne({
                where: whereClause,
            });
            const available = stock
                ? stock.quantityOnHand - stock.quantityReserved
                : 0;
            if (available < item.quantityRequested) {
                throw new common_1.BadRequestException(`Insufficient stock for product ${item.product?.productName}. Available: ${available}, Requested: ${item.quantityRequested}`);
            }
        }
    }
    async reject(id, rejectedBy, reason) {
        const transferRepo = await this.getTransferRepository();
        const transfer = await this.findById(id);
        if (transfer.status !== tenant_1.TransferStatus.PENDING_APPROVAL) {
            throw new common_1.BadRequestException('Only pending transfers can be rejected');
        }
        transfer.status = tenant_1.TransferStatus.CANCELLED;
        transfer.notes = `Rejected by: ${rejectedBy}. Reason: ${reason}`;
        await transferRepo.save(transfer);
        return this.findById(id);
    }
    async ship(id, shippedBy, trackingNumber) {
        const dataSource = await this.tenantConnectionManager.getDataSource();
        const transfer = await this.findById(id);
        if (transfer.status !== tenant_1.TransferStatus.APPROVED) {
            throw new common_1.BadRequestException('Only approved transfers can be shipped');
        }
        await dataSource.transaction(async (manager) => {
            const stockRepo = manager.getRepository(tenant_1.InventoryStock);
            const movementRepo = manager.getRepository(tenant_1.StockMovement);
            const itemRepo = manager.getRepository(tenant_1.WarehouseTransferItem);
            for (const item of transfer.items) {
                const whereClause = {
                    productId: item.productId,
                    warehouseId: transfer.fromWarehouseId,
                };
                if (item.variantId) {
                    whereClause.variantId = item.variantId;
                }
                else {
                    whereClause.variantId = (0, typeorm_1.IsNull)();
                }
                const sourceStock = await stockRepo.findOne({
                    where: whereClause,
                    lock: { mode: 'pessimistic_write' },
                });
                if (sourceStock) {
                    sourceStock.quantityOnHand -= item.quantityRequested;
                    sourceStock.quantityOutgoing -= item.quantityRequested;
                    await stockRepo.save(sourceStock);
                }
                const movementOut = movementRepo.create({
                    id: (0, uuid_1.v4)(),
                    movementNumber: await (0, sequence_util_1.getNextSequence)(dataSource, 'STOCK_MOVEMENT'),
                    movementType: enums_1.StockMovementType.TRANSFER_OUT,
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
                });
                await movementRepo.save(movementOut);
                item.quantityShipped = item.quantityRequested;
                await itemRepo.save(item);
            }
            transfer.status = tenant_1.TransferStatus.IN_TRANSIT;
            transfer.shippedBy = shippedBy;
            transfer.shippedAt = new Date();
            if (trackingNumber) {
                transfer.trackingNumber = trackingNumber;
            }
            await manager.getRepository(tenant_1.WarehouseTransfer).save(transfer);
        });
        return this.findById(id);
    }
    async receive(id, receivedBy, receivedItems) {
        const dataSource = await this.tenantConnectionManager.getDataSource();
        const transfer = await this.findById(id);
        if (transfer.status !== tenant_1.TransferStatus.IN_TRANSIT) {
            throw new common_1.BadRequestException('Only in-transit transfers can be received');
        }
        await dataSource.transaction(async (manager) => {
            const stockRepo = manager.getRepository(tenant_1.InventoryStock);
            const movementRepo = manager.getRepository(tenant_1.StockMovement);
            const itemRepo = manager.getRepository(tenant_1.WarehouseTransferItem);
            let allFullyReceived = true;
            for (const receivedItem of receivedItems) {
                const item = transfer.items.find((i) => i.id === receivedItem.itemId);
                if (!item)
                    continue;
                const quantityReceived = receivedItem.quantityReceived;
                const quantityDamaged = receivedItem.quantityDamaged || 0;
                const netReceived = quantityReceived - quantityDamaged;
                const whereClause = {
                    productId: item.productId,
                    warehouseId: transfer.toWarehouseId,
                };
                if (item.variantId) {
                    whereClause.variantId = item.variantId;
                }
                else {
                    whereClause.variantId = (0, typeorm_1.IsNull)();
                }
                let destStock = await stockRepo.findOne({
                    where: whereClause,
                    lock: { mode: 'pessimistic_write' },
                });
                if (!destStock) {
                    destStock = stockRepo.create({
                        id: (0, uuid_1.v4)(),
                        productId: item.productId,
                        warehouseId: transfer.toWarehouseId,
                        variantId: item.variantId,
                        quantityOnHand: 0,
                        quantityReserved: 0,
                        quantityIncoming: 0,
                        quantityOutgoing: 0,
                    });
                }
                destStock.quantityOnHand += netReceived;
                destStock.quantityIncoming -= item.quantityShipped;
                await stockRepo.save(destStock);
                const movementIn = movementRepo.create({
                    id: (0, uuid_1.v4)(),
                    movementNumber: await (0, sequence_util_1.getNextSequence)(dataSource, 'STOCK_MOVEMENT'),
                    movementType: enums_1.StockMovementType.TRANSFER_IN,
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
                });
                await movementRepo.save(movementIn);
                item.quantityReceived = (item.quantityReceived || 0) + quantityReceived;
                item.quantityDamaged = (item.quantityDamaged || 0) + quantityDamaged;
                await itemRepo.save(item);
                if (item.quantityReceived < item.quantityShipped) {
                    allFullyReceived = false;
                }
            }
            transfer.status = allFullyReceived
                ? tenant_1.TransferStatus.RECEIVED
                : tenant_1.TransferStatus.PARTIALLY_RECEIVED;
            transfer.receivedBy = receivedBy;
            transfer.receivedAt = new Date();
            await manager.getRepository(tenant_1.WarehouseTransfer).save(transfer);
        });
        return this.findById(id);
    }
    async cancel(id, cancelledBy, reason) {
        const transferRepo = await this.getTransferRepository();
        const transfer = await this.findById(id);
        if (![
            tenant_1.TransferStatus.DRAFT,
            tenant_1.TransferStatus.PENDING_APPROVAL,
            tenant_1.TransferStatus.APPROVED,
        ].includes(transfer.status)) {
            throw new common_1.BadRequestException('Only draft, pending, or approved transfers can be cancelled');
        }
        transfer.status = tenant_1.TransferStatus.CANCELLED;
        transfer.notes = `Cancelled by: ${cancelledBy}. Reason: ${reason}`;
        await transferRepo.save(transfer);
        return this.findById(id);
    }
    async addItem(transferId, itemDto) {
        const transfer = await this.findById(transferId);
        if (transfer.status !== tenant_1.TransferStatus.DRAFT) {
            throw new common_1.BadRequestException('Items can only be added to draft transfers');
        }
        const dataSource = await this.tenantConnectionManager.getDataSource();
        const itemRepo = dataSource.getRepository(tenant_1.WarehouseTransferItem);
        const item = itemRepo.create({
            id: (0, uuid_1.v4)(),
            warehouseTransferId: transferId,
            ...itemDto,
        });
        const saved = await itemRepo.save(item);
        return Array.isArray(saved) ? saved[0] : saved;
    }
    async updateItem(itemId, itemDto) {
        const dataSource = await this.tenantConnectionManager.getDataSource();
        const itemRepo = dataSource.getRepository(tenant_1.WarehouseTransferItem);
        const item = await itemRepo.findOne({
            where: { id: itemId },
            relations: ['warehouseTransfer'],
        });
        if (!item) {
            throw new common_1.NotFoundException(`Transfer item with ID ${itemId} not found`);
        }
        if (item.warehouseTransfer.status !== tenant_1.TransferStatus.DRAFT) {
            throw new common_1.BadRequestException('Items can only be updated in draft transfers');
        }
        Object.assign(item, itemDto);
        return itemRepo.save(item);
    }
    async removeItem(itemId) {
        const dataSource = await this.tenantConnectionManager.getDataSource();
        const itemRepo = dataSource.getRepository(tenant_1.WarehouseTransferItem);
        const item = await itemRepo.findOne({
            where: { id: itemId },
            relations: ['warehouseTransfer'],
        });
        if (!item) {
            throw new common_1.NotFoundException(`Transfer item with ID ${itemId} not found`);
        }
        if (item.warehouseTransfer.status !== tenant_1.TransferStatus.DRAFT) {
            throw new common_1.BadRequestException('Items can only be removed from draft transfers');
        }
        await itemRepo.delete(itemId);
    }
    async remove(id) {
        const transferRepo = await this.getTransferRepository();
        const transfer = await this.findById(id);
        if (transfer.status !== tenant_1.TransferStatus.DRAFT) {
            throw new common_1.BadRequestException('Only draft transfers can be deleted');
        }
        await transferRepo.delete(id);
    }
};
exports.TransfersService = TransfersService;
exports.TransfersService = TransfersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tenant_connection_manager_1.TenantConnectionManager])
], TransfersService);
//# sourceMappingURL=transfers.service.js.map