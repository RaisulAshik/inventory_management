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
exports.PriceListsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const uuid_1 = require("uuid");
const tenant_connection_manager_1 = require("../../../database/tenant-connection.manager");
const pagination_util_1 = require("../../../common/utils/pagination.util");
const tenant_1 = require("../../../entities/tenant");
let PriceListsService = class PriceListsService {
    tenantConnectionManager;
    constructor(tenantConnectionManager) {
        this.tenantConnectionManager = tenantConnectionManager;
    }
    async getPriceListRepository() {
        return this.tenantConnectionManager.getRepository(tenant_1.PriceList);
    }
    async create(createPriceListDto, createdBy) {
        const priceListRepo = await this.getPriceListRepository();
        const existingPriceList = await priceListRepo.findOne({
            where: { priceListCode: createPriceListDto.priceListCode },
        });
        if (existingPriceList) {
            throw new common_1.BadRequestException(`Price list with code ${createPriceListDto.priceListCode} already exists`);
        }
        if (createPriceListDto.isDefault) {
            await priceListRepo.update({ priceListType: createPriceListDto.priceListType, isDefault: true }, { isDefault: false });
        }
        const priceList = priceListRepo.create({
            id: (0, uuid_1.v4)(),
            ...createPriceListDto,
            createdBy,
        });
        const savedPriceList = await priceListRepo.save(priceList);
        if (createPriceListDto.items && createPriceListDto.items.length > 0) {
            const dataSource = await this.tenantConnectionManager.getDataSource();
            await this.createItems(savedPriceList.id, createPriceListDto.items, dataSource);
        }
        return this.findById(savedPriceList.id);
    }
    async createItems(priceListId, items, dataSource) {
        const itemRepo = dataSource.getRepository(tenant_1.PriceListItem);
        for (const itemDto of items) {
            const item = itemRepo.create({
                id: (0, uuid_1.v4)(),
                priceListId,
                ...itemDto,
            });
            await itemRepo.save(item);
        }
    }
    async findAll(paginationDto) {
        const priceListRepo = await this.getPriceListRepository();
        const queryBuilder = priceListRepo.createQueryBuilder('priceList');
        if (paginationDto.search) {
            queryBuilder.where('(priceList.priceListCode LIKE :search OR priceList.priceListName LIKE :search)', { search: `%${paginationDto.search}%` });
        }
        if (!paginationDto.sortBy) {
            paginationDto.sortBy = 'priceListName';
            paginationDto.sortOrder = 'ASC';
        }
        return (0, pagination_util_1.paginate)(queryBuilder, paginationDto);
    }
    async findAllActive() {
        const priceListRepo = await this.getPriceListRepository();
        return priceListRepo.find({
            where: { isActive: true },
            order: { priceListName: 'ASC' },
        });
    }
    async findByType(type) {
        const priceListRepo = await this.getPriceListRepository();
        return priceListRepo.find({
            where: { priceListType: type, isActive: true },
            order: { priority: 'DESC', priceListName: 'ASC' },
        });
    }
    async getDefault(type) {
        const priceListRepo = await this.getPriceListRepository();
        return priceListRepo.findOne({
            where: { priceListType: type, isDefault: true, isActive: true },
        });
    }
    async findById(id) {
        const priceListRepo = await this.getPriceListRepository();
        const priceList = await priceListRepo.findOne({
            where: { id },
            relations: ['items', 'items.product', 'items.variant', 'items.uom'],
        });
        if (!priceList) {
            throw new common_1.NotFoundException(`Price list with ID ${id} not found`);
        }
        return priceList;
    }
    async update(id, updatePriceListDto) {
        const priceListRepo = await this.getPriceListRepository();
        const priceList = await this.findById(id);
        if (updatePriceListDto.priceListCode &&
            updatePriceListDto.priceListCode !== priceList.priceListCode) {
            const existingCode = await priceListRepo.findOne({
                where: { priceListCode: updatePriceListDto.priceListCode },
            });
            if (existingCode) {
                throw new common_1.BadRequestException(`Price list with code ${updatePriceListDto.priceListCode} already exists`);
            }
        }
        if (updatePriceListDto.isDefault && !priceList.isDefault) {
            await priceListRepo.update({ priceListType: priceList.priceListType, isDefault: true }, { isDefault: false });
        }
        Object.assign(priceList, updatePriceListDto);
        await priceListRepo.save(priceList);
        return this.findById(id);
    }
    async remove(id) {
        const priceListRepo = await this.getPriceListRepository();
        const dataSource = await this.tenantConnectionManager.getDataSource();
        const customerCount = await dataSource
            .createQueryBuilder()
            .select('COUNT(*)', 'count')
            .from('customers', 'c')
            .where('c.price_list_id = :id', { id })
            .andWhere('c.deleted_at IS NULL')
            .getRawOne();
        if (parseInt(customerCount.count) > 0) {
            throw new common_1.BadRequestException('Cannot delete price list assigned to customers');
        }
        await priceListRepo.delete(id);
    }
    async getProductPrice(priceListId, productId, quantity = 1, variantId) {
        const dataSource = await this.tenantConnectionManager.getDataSource();
        const itemRepo = dataSource.getRepository(tenant_1.PriceListItem);
        const queryBuilder = itemRepo
            .createQueryBuilder('item')
            .where('item.priceListId = :priceListId', { priceListId })
            .andWhere('item.productId = :productId', { productId })
            .andWhere('item.minQuantity <= :quantity', { quantity })
            .andWhere('(item.maxQuantity IS NULL OR item.maxQuantity >= :quantity)', {
            quantity,
        })
            .andWhere('(item.effectiveFrom IS NULL OR item.effectiveFrom <= CURDATE())')
            .andWhere('(item.effectiveTo IS NULL OR item.effectiveTo >= CURDATE())')
            .orderBy('item.minQuantity', 'DESC');
        if (variantId) {
            queryBuilder.andWhere('(item.variantId = :variantId OR item.variantId IS NULL)', { variantId });
        }
        const item = await queryBuilder.getOne();
        if (!item) {
            return null;
        }
        let price = Number(item.price);
        if (item.discountPercentage > 0) {
            price = price * (1 - Number(item.discountPercentage) / 100);
        }
        if (item.discountAmount > 0) {
            price = price - Number(item.discountAmount);
        }
        return Math.max(0, price);
    }
    async addItem(priceListId, itemDto) {
        const dataSource = await this.tenantConnectionManager.getDataSource();
        const itemRepo = dataSource.getRepository(tenant_1.PriceListItem);
        await this.findById(priceListId);
        const whereClause = {
            priceListId,
            productId: itemDto.productId,
            minQuantity: itemDto.minQuantity || 1,
        };
        if (itemDto.variantId) {
            whereClause.variantId = itemDto.variantId;
        }
        else {
            whereClause.variantId = (0, typeorm_1.IsNull)();
        }
        const existing = await itemRepo.findOne({
            where: whereClause,
        });
        if (existing) {
            throw new common_1.BadRequestException('Price list item already exists for this product/variant/quantity range');
        }
        const item = itemRepo.create({
            id: (0, uuid_1.v4)(),
            priceListId,
            ...itemDto,
        });
        const saved = await itemRepo.save(item);
        return Array.isArray(saved) ? saved[0] : saved;
    }
    async updateItem(itemId, itemDto) {
        const dataSource = await this.tenantConnectionManager.getDataSource();
        const itemRepo = dataSource.getRepository(tenant_1.PriceListItem);
        const item = await itemRepo.findOne({ where: { id: itemId } });
        if (!item) {
            throw new common_1.NotFoundException(`Price list item with ID ${itemId} not found`);
        }
        Object.assign(item, itemDto);
        return itemRepo.save(item);
    }
    async removeItem(itemId) {
        const dataSource = await this.tenantConnectionManager.getDataSource();
        const itemRepo = dataSource.getRepository(tenant_1.PriceListItem);
        await itemRepo.delete(itemId);
    }
    async getItems(priceListId) {
        const dataSource = await this.tenantConnectionManager.getDataSource();
        const itemRepo = dataSource.getRepository(tenant_1.PriceListItem);
        return itemRepo
            .createQueryBuilder('item')
            .leftJoinAndSelect('item.product', 'product')
            .leftJoinAndSelect('item.variant', 'variant')
            .leftJoinAndSelect('item.uom', 'uom')
            .where('item.priceListId = :priceListId', { priceListId })
            .orderBy('product.productName', 'ASC')
            .getMany();
    }
    async bulkAddItems(priceListId, items) {
        const dataSource = await this.tenantConnectionManager.getDataSource();
        const itemRepo = dataSource.getRepository(tenant_1.PriceListItem);
        await this.findById(priceListId);
        let added = 0;
        let skipped = 0;
        for (const itemDto of items) {
            try {
                const whereClause = {
                    priceListId,
                    productId: itemDto.productId,
                    minQuantity: itemDto.minQuantity || 1,
                };
                if (itemDto.variantId) {
                    whereClause.variantId = itemDto.variantId;
                }
                else {
                    whereClause.variantId = (0, typeorm_1.IsNull)();
                }
                const existing = await itemRepo.findOne({
                    where: whereClause,
                });
                if (existing) {
                    skipped++;
                    continue;
                }
                const item = itemRepo.create({
                    id: (0, uuid_1.v4)(),
                    priceListId,
                    ...itemDto,
                });
                await itemRepo.save(item);
                added++;
            }
            catch (error) {
                console.log(error);
                skipped++;
            }
        }
        return { added, skipped };
    }
    async copyPriceList(sourceId, newCode, newName, createdBy) {
        const source = await this.findById(sourceId);
        const dataSource = await this.tenantConnectionManager.getDataSource();
        const newPriceList = await this.create({
            priceListCode: newCode,
            priceListName: newName,
            priceListType: source.priceListType,
            description: `Copied from ${source.priceListName}`,
            currency: source.currency,
            isTaxInclusive: source.isTaxInclusive,
            discountPercentage: source.discountPercentage,
            isDefault: false,
            isActive: true,
        }, createdBy);
        const itemRepo = dataSource.getRepository(tenant_1.PriceListItem);
        const sourceItems = await itemRepo.find({
            where: { priceListId: sourceId },
        });
        for (const sourceItem of sourceItems) {
            const newItem = itemRepo.create({
                id: (0, uuid_1.v4)(),
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
};
exports.PriceListsService = PriceListsService;
exports.PriceListsService = PriceListsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tenant_connection_manager_1.TenantConnectionManager])
], PriceListsService);
//# sourceMappingURL=price-lists.service.js.map