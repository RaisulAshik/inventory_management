import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { TenantConnectionManager } from '@database/tenant-connection.manager';
import { Product } from '@entities/tenant/inventory/product.entity';
import { ProductVariant } from '@entities/tenant/inventory/product-variant.entity';
import { ProductImage } from '@entities/tenant/inventory/product-image.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductFilterDto } from './dto/product-filter.dto';
import { PaginationDto } from '@common/dto/pagination.dto';
import { PaginatedResult } from '@common/interfaces';
import { paginate } from '@common/utils/pagination.util';
import { getNextSequence } from '@common/utils/sequence.util';
import { InventoryStock } from '@entities/tenant';

@Injectable()
export class ProductsService {
  constructor(
    private readonly tenantConnectionManager: TenantConnectionManager,
  ) {}

  private async getProductRepository(): Promise<Repository<Product>> {
    return this.tenantConnectionManager.getRepository(Product);
  }

  /**
   * Create a new product
   */
  async create(
    createProductDto: CreateProductDto,
    createdBy: string,
  ): Promise<Product> {
    const productRepo = await this.getProductRepository();
    const dataSource = await this.tenantConnectionManager.getDataSource();

    // Check if SKU already exists
    if (createProductDto.sku) {
      const existingProduct = await productRepo.findOne({
        where: { sku: createProductDto.sku },
      });

      if (existingProduct) {
        throw new BadRequestException(
          `Product with SKU ${createProductDto.sku} already exists`,
        );
      }
    }

    // Generate SKU if not provided
    const sku =
      createProductDto.sku || (await getNextSequence(dataSource, 'PRODUCT'));

    // Check barcode uniqueness
    if (createProductDto.barcode) {
      const existingBarcode = await productRepo.findOne({
        where: { barcode: createProductDto.barcode },
      });

      if (existingBarcode) {
        throw new BadRequestException(
          `Product with barcode ${createProductDto.barcode} already exists`,
        );
      }
    }

    const product = productRepo.create({
      id: uuidv4(),
      ...createProductDto,
      sku,
      createdBy,
    });

    const savedProduct = await productRepo.save(product);

    // Create variants if provided
    if (createProductDto.variants && createProductDto.variants.length > 0) {
      await this.createVariants(
        savedProduct.id,
        createProductDto.variants,
        dataSource,
      );
    }

    // Create images if provided
    if (createProductDto.images && createProductDto.images.length > 0) {
      await this.createImages(
        savedProduct.id,
        createProductDto.images,
        dataSource,
      );
    }

    return this.findById(savedProduct.id);
  }

  /**
   * Create product variants
   */
  private async createVariants(
    productId: string,
    variants: any[],
    dataSource: any,
  ): Promise<void> {
    const variantRepo = dataSource.getRepository(ProductVariant);

    for (const variantDto of variants) {
      const variantSku =
        variantDto.variantSku || (await getNextSequence(dataSource, 'VARIANT'));

      const variant = variantRepo.create({
        id: uuidv4(),
        productId,
        ...variantDto,
        variantSku,
      });

      await variantRepo.save(variant);
    }
  }

  /**
   * Create product images
   */
  private async createImages(
    productId: string,
    images: any[],
    dataSource: any,
  ): Promise<void> {
    const imageRepo = dataSource.getRepository(ProductImage);

    for (let i = 0; i < images.length; i++) {
      const imageDto = images[i];

      const image = imageRepo.create({
        id: uuidv4(),
        productId,
        ...imageDto,
        sortOrder: imageDto.sortOrder ?? i,
        isPrimary: imageDto.isPrimary ?? i === 0,
      });

      await imageRepo.save(image);
    }
  }

  /**
   * Find all products with filters and pagination
   */
  async findAll(
    paginationDto: PaginationDto,
    filterDto: ProductFilterDto,
  ): Promise<PaginatedResult<Product>> {
    const productRepo = await this.getProductRepository();

    const queryBuilder = productRepo
      .createQueryBuilder('product')
      .leftJoinAndSelect('product.category', 'category')
      .leftJoinAndSelect('product.brand', 'brand')
      .leftJoinAndSelect('product.baseUom', 'baseUom')
      .leftJoinAndSelect('product.taxCategory', 'taxCategory')
      .leftJoinAndSelect('product.images', 'images')
      .where('product.deletedAt IS NULL');

    // Apply filters
    this.applyFilters(queryBuilder, filterDto);

    // Apply search
    if (paginationDto.search) {
      queryBuilder.andWhere(
        '(product.sku LIKE :search OR product.productName LIKE :search OR product.barcode LIKE :search)',
        { search: `%${paginationDto.search}%` },
      );
    }

    // Default sorting
    if (!paginationDto.sortBy) {
      paginationDto.sortBy = 'createdAt';
    }

    return paginate(queryBuilder, paginationDto);
  }

  /**
   * Apply filters to query builder
   */
  private applyFilters(
    queryBuilder: SelectQueryBuilder<Product>,
    filterDto: ProductFilterDto,
  ): void {
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

  /**
   * Find product by ID
   */
  async findById(id: string): Promise<Product> {
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
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    return product;
  }

  /**
   * Find product by SKU
   */
  async findBySku(sku: string): Promise<Product | null> {
    const productRepo = await this.getProductRepository();

    return productRepo.findOne({
      where: { sku },
      relations: ['category', 'brand', 'baseUom'],
    });
  }

  /**
   * Find product by barcode
   */
  async findByBarcode(barcode: string): Promise<Product | null> {
    const productRepo = await this.getProductRepository();

    return productRepo.findOne({
      where: { barcode },
      relations: ['category', 'brand', 'baseUom'],
    });
  }

  /**
   * Update product
   */
  async update(
    id: string,
    updateProductDto: UpdateProductDto,
  ): Promise<Product> {
    const productRepo = await this.getProductRepository();

    const product = await this.findById(id);

    // Check SKU uniqueness if being changed
    if (updateProductDto.sku && updateProductDto.sku !== product.sku) {
      const existingSku = await productRepo.findOne({
        where: { sku: updateProductDto.sku },
      });

      if (existingSku) {
        throw new BadRequestException(
          `Product with SKU ${updateProductDto.sku} already exists`,
        );
      }
    }

    // Check barcode uniqueness if being changed
    if (
      updateProductDto.barcode &&
      updateProductDto.barcode !== product.barcode
    ) {
      const existingBarcode = await productRepo.findOne({
        where: { barcode: updateProductDto.barcode },
      });

      if (existingBarcode) {
        throw new BadRequestException(
          `Product with barcode ${updateProductDto.barcode} already exists`,
        );
      }
    }

    Object.assign(product, updateProductDto);
    await productRepo.save(product);

    return this.findById(id);
  }

  /**
   * Soft delete product
   */
  async remove(id: string): Promise<void> {
    const productRepo = await this.getProductRepository();
    const product = await this.findById(id);

    product.deletedAt = new Date();
    await productRepo.save(product);
  }

  /**
   * Get product stock across all warehouses
   */
  async getProductStock(productId: string): Promise<InventoryStock[]> {
    const dataSource = await this.tenantConnectionManager.getDataSource();
    const stockRepo = dataSource.getRepository(InventoryStock);

    return stockRepo.find({
      where: { productId },
      relations: ['warehouse', 'variant'],
    });
  }

  /**
   * Get total stock quantity for a product
   */
  async getTotalStock(
    productId: string,
    warehouseId?: string,
  ): Promise<number> {
    const dataSource = await this.tenantConnectionManager.getDataSource();
    const stockRepo = dataSource.getRepository(InventoryStock);

    const queryBuilder = stockRepo
      .createQueryBuilder('stock')
      .select(
        'SUM(stock.quantityOnHand - stock.quantityReserved)',
        'totalAvailable',
      )
      .where('stock.productId = :productId', { productId });

    if (warehouseId) {
      queryBuilder.andWhere('stock.warehouseId = :warehouseId', {
        warehouseId,
      });
    }

    const result = await queryBuilder.getRawOne();
    return parseFloat(result.totalAvailable) || 0;
  }

  /**
   * Get low stock products
   */
  async getLowStockProducts(warehouseId?: string): Promise<Product[]> {
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

  /**
   * Bulk update products
   */
  async bulkUpdate(
    updates: { id: string; data: Partial<UpdateProductDto> }[],
  ): Promise<void> {
    const productRepo = await this.getProductRepository();

    for (const update of updates) {
      await productRepo.update(update.id, update.data);
    }
  }

  /**
   * Count products
   */
  async count(filterDto?: ProductFilterDto): Promise<number> {
    const productRepo = await this.getProductRepository();

    const queryBuilder = productRepo
      .createQueryBuilder('product')
      .where('product.deletedAt IS NULL');

    if (filterDto) {
      this.applyFilters(queryBuilder, filterDto);
    }

    return queryBuilder.getCount();
  }
}
