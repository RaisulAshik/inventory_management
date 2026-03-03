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
exports.ProductsService = void 0;
const common_1 = require("@nestjs/common");
const uuid_1 = require("uuid");
const tenant_connection_manager_1 = require("../../../database/tenant-connection.manager");
const product_entity_1 = require("../../../entities/tenant/inventory/product.entity");
const product_variant_entity_1 = require("../../../entities/tenant/inventory/product-variant.entity");
const product_image_entity_1 = require("../../../entities/tenant/inventory/product-image.entity");
const pagination_util_1 = require("../../../common/utils/pagination.util");
const sequence_util_1 = require("../../../common/utils/sequence.util");
const tenant_1 = require("../../../entities/tenant");
let ProductsService = class ProductsService {
    tenantConnectionManager;
    constructor(tenantConnectionManager) {
        this.tenantConnectionManager = tenantConnectionManager;
    }
    async getProductRepository() {
        return this.tenantConnectionManager.getRepository(product_entity_1.Product);
    }
    async create(createProductDto, createdBy) {
        const productRepo = await this.getProductRepository();
        const dataSource = await this.tenantConnectionManager.getDataSource();
        if (createProductDto.sku) {
            const existingProduct = await productRepo.findOne({
                where: { sku: createProductDto.sku },
            });
            if (existingProduct) {
                throw new common_1.BadRequestException(`Product with SKU ${createProductDto.sku} already exists`);
            }
        }
        const sku = createProductDto.sku || (await (0, sequence_util_1.getNextSequence)(dataSource, 'PRODUCT'));
        if (createProductDto.barcode) {
            const existingBarcode = await productRepo.findOne({
                where: { barcode: createProductDto.barcode },
            });
            if (existingBarcode) {
                throw new common_1.BadRequestException(`Product with barcode ${createProductDto.barcode} already exists`);
            }
        }
        const product = productRepo.create({
            id: (0, uuid_1.v4)(),
            ...createProductDto,
            sku,
            createdBy,
        });
        const savedProduct = await productRepo.save(product);
        if (createProductDto.variants && createProductDto.variants.length > 0) {
            await this.createVariants(savedProduct.id, createProductDto.variants, dataSource);
        }
        if (createProductDto.images && createProductDto.images.length > 0) {
            await this.createImages(savedProduct.id, createProductDto.images, dataSource);
        }
        return this.findById(savedProduct.id);
    }
    async createVariants(productId, variants, dataSource) {
        const variantRepo = dataSource.getRepository(product_variant_entity_1.ProductVariant);
        for (const variantDto of variants) {
            const variantSku = variantDto.variantSku || (await (0, sequence_util_1.getNextSequence)(dataSource, 'VARIANT'));
            const variant = variantRepo.create({
                id: (0, uuid_1.v4)(),
                productId,
                ...variantDto,
                variantSku,
            });
            await variantRepo.save(variant);
        }
    }
    async createImages(productId, images, dataSource) {
        const imageRepo = dataSource.getRepository(product_image_entity_1.ProductImage);
        for (let i = 0; i < images.length; i++) {
            const imageDto = images[i];
            const image = imageRepo.create({
                id: (0, uuid_1.v4)(),
                productId,
                ...imageDto,
                sortOrder: imageDto.sortOrder ?? i,
                isPrimary: imageDto.isPrimary ?? i === 0,
            });
            await imageRepo.save(image);
        }
    }
    async findAll(paginationDto, filterDto) {
        const productRepo = await this.getProductRepository();
        const queryBuilder = productRepo
            .createQueryBuilder('product')
            .leftJoinAndSelect('product.category', 'category')
            .leftJoinAndSelect('product.brand', 'brand')
            .leftJoinAndSelect('product.baseUom', 'baseUom')
            .leftJoinAndSelect('product.taxCategory', 'taxCategory')
            .leftJoinAndSelect('product.images', 'images')
            .where('product.deletedAt IS NULL');
        this.applyFilters(queryBuilder, filterDto);
        if (paginationDto.search) {
            queryBuilder.andWhere('(product.sku LIKE :search OR product.productName LIKE :search OR product.barcode LIKE :search)', { search: `%${paginationDto.search}%` });
        }
        if (!paginationDto.sortBy) {
            paginationDto.sortBy = 'createdAt';
        }
        return (0, pagination_util_1.paginate)(queryBuilder, paginationDto);
    }
    applyFilters(queryBuilder, filterDto) {
        if (filterDto.categoryId) {
            queryBuilder.andWhere('product.categoryId = :categoryId', {
                categoryId: filterDto.categoryId,
            });
        }
        if (filterDto.brandId) {
            queryBuilder.andWhere('product.brandId = :brandId', {
                brandId: filterDto.brandId,
            });
        }
        if (filterDto.productType) {
            queryBuilder.andWhere('product.productType = :productType', {
                productType: filterDto.productType,
            });
        }
        if (filterDto.isActive !== undefined) {
            queryBuilder.andWhere('product.isActive = :isActive', {
                isActive: filterDto.isActive,
            });
        }
        if (filterDto.isStockable !== undefined) {
            queryBuilder.andWhere('product.isStockable = :isStockable', {
                isStockable: filterDto.isStockable,
            });
        }
        if (filterDto.isSellable !== undefined) {
            queryBuilder.andWhere('product.isSellable = :isSellable', {
                isSellable: filterDto.isSellable,
            });
        }
        if (filterDto.isPurchasable !== undefined) {
            queryBuilder.andWhere('product.isPurchasable = :isPurchasable', {
                isPurchasable: filterDto.isPurchasable,
            });
        }
        if (filterDto.minPrice !== undefined) {
            queryBuilder.andWhere('product.sellingPrice >= :minPrice', {
                minPrice: filterDto.minPrice,
            });
        }
        if (filterDto.maxPrice !== undefined) {
            queryBuilder.andWhere('product.sellingPrice <= :maxPrice', {
                maxPrice: filterDto.maxPrice,
            });
        }
        if (filterDto.trackSerial !== undefined) {
            queryBuilder.andWhere('product.trackSerial = :trackSerial', {
                trackSerial: filterDto.trackSerial,
            });
        }
        if (filterDto.trackBatch !== undefined) {
            queryBuilder.andWhere('product.trackBatch = :trackBatch', {
                trackBatch: filterDto.trackBatch,
            });
        }
    }
    async findById(id) {
        const productRepo = await this.getProductRepository();
        const product = await productRepo.findOne({
            where: { id },
            relations: [
                'category',
                'brand',
                'baseUom',
                'secondaryUom',
                'taxCategory',
                'taxCategory.taxRates',
                'images',
                'variants',
                'variants.attributes',
                'variants.attributes.attribute',
                'variants.attributes.attributeValue',
            ],
        });
        if (!product) {
            throw new common_1.NotFoundException(`Product with ID ${id} not found`);
        }
        return product;
    }
    async findBySku(sku) {
        const productRepo = await this.getProductRepository();
        return productRepo.findOne({
            where: { sku },
            relations: ['category', 'brand', 'baseUom'],
        });
    }
    async findByBarcode(barcode) {
        const productRepo = await this.getProductRepository();
        return productRepo.findOne({
            where: { barcode },
            relations: ['category', 'brand', 'baseUom'],
        });
    }
    async update(id, updateProductDto) {
        const productRepo = await this.getProductRepository();
        const product = await this.findById(id);
        if (updateProductDto.sku && updateProductDto.sku !== product.sku) {
            const existingSku = await productRepo.findOne({
                where: { sku: updateProductDto.sku },
            });
            if (existingSku) {
                throw new common_1.BadRequestException(`Product with SKU ${updateProductDto.sku} already exists`);
            }
        }
        if (updateProductDto.barcode &&
            updateProductDto.barcode !== product.barcode) {
            const existingBarcode = await productRepo.findOne({
                where: { barcode: updateProductDto.barcode },
            });
            if (existingBarcode) {
                throw new common_1.BadRequestException(`Product with barcode ${updateProductDto.barcode} already exists`);
            }
        }
        Object.assign(product, updateProductDto);
        await productRepo.save(product);
        return this.findById(id);
    }
    async remove(id) {
        const productRepo = await this.getProductRepository();
        const product = await this.findById(id);
        product.deletedAt = new Date();
        await productRepo.save(product);
    }
    async getProductStock(productId) {
        const dataSource = await this.tenantConnectionManager.getDataSource();
        const stockRepo = dataSource.getRepository(tenant_1.InventoryStock);
        return stockRepo.find({
            where: { productId },
            relations: ['warehouse', 'variant'],
        });
    }
    async getTotalStock(productId, warehouseId) {
        const dataSource = await this.tenantConnectionManager.getDataSource();
        const stockRepo = dataSource.getRepository(tenant_1.InventoryStock);
        const queryBuilder = stockRepo
            .createQueryBuilder('stock')
            .select('SUM(stock.quantityOnHand - stock.quantityReserved)', 'totalAvailable')
            .where('stock.productId = :productId', { productId });
        if (warehouseId) {
            queryBuilder.andWhere('stock.warehouseId = :warehouseId', {
                warehouseId,
            });
        }
        const result = await queryBuilder.getRawOne();
        return parseFloat(result.totalAvailable) || 0;
    }
    async getLowStockProducts(warehouseId) {
        const dataSource = await this.tenantConnectionManager.getDataSource();
        let query = `
      SELECT p.*, 
             COALESCE(SUM(s.quantity_on_hand - s.quantity_reserved), 0) as available_stock
      FROM products p
      LEFT JOIN inventory_stock s ON p.id = s.product_id
      WHERE p.deleted_at IS NULL
        AND p.is_stockable = 1
    `;
        if (warehouseId) {
            query += ` AND (s.warehouse_id = '${warehouseId}' OR s.warehouse_id IS NULL)`;
        }
        query += `
      GROUP BY p.id
      HAVING available_stock <= p.reorder_level
      ORDER BY available_stock ASC
    `;
        return dataSource.query(query);
    }
    async bulkUpdate(updates) {
        const productRepo = await this.getProductRepository();
        for (const update of updates) {
            await productRepo.update(update.id, update.data);
        }
    }
    async count(filterDto) {
        const productRepo = await this.getProductRepository();
        const queryBuilder = productRepo
            .createQueryBuilder('product')
            .where('product.deletedAt IS NULL');
        if (filterDto) {
            this.applyFilters(queryBuilder, filterDto);
        }
        return queryBuilder.getCount();
    }
};
exports.ProductsService = ProductsService;
exports.ProductsService = ProductsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tenant_connection_manager_1.TenantConnectionManager])
], ProductsService);
//# sourceMappingURL=products.service.js.map