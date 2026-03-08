import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Repository, SelectQueryBuilder, DataSource } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Readable } from 'stream';
import * as ExcelJS from 'exceljs';
import * as fastCsv from 'fast-csv';
import { TenantConnectionManager } from '@database/tenant-connection.manager';
import { Product } from '@entities/tenant/inventory/product.entity';
import { ProductVariant } from '@entities/tenant/inventory/product-variant.entity';
import { ProductImage } from '@entities/tenant/inventory/product-image.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductFilterDto } from './dto/product-filter.dto';
import {
  BulkImportResultDto,
  ImportMode,
  ImportRowError,
} from './dto/bulk-import.dto';
import { PaginationDto } from '@common/dto/pagination.dto';
import { PaginatedResult } from '@common/interfaces';
import { paginate } from '@common/utils/pagination.util';
import { getNextSequence } from '@common/utils/sequence.util';
import { InventoryStock } from '@entities/tenant';
import { UnitOfMeasure } from '@entities/tenant/inventory/unit-of-measure.entity';
import { ProductCategory } from '@entities/tenant/inventory/product-category.entity';
import { Brand } from '@entities/tenant/inventory/brand.entity';
import { TaxCategory } from '@entities/tenant/inventory/tax-category.entity';
import { ProductType } from '@common/enums';

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

  // ─── Bulk Import ─────────────────────────────────────────────────────────

  async bulkImport(
    file: Express.Multer.File,
    mode: ImportMode,
    userId: string,
  ): Promise<BulkImportResultDto> {
    const isXlsx =
      file.mimetype ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.originalname.toLowerCase().endsWith('.xlsx');

    const rawRows = isXlsx
      ? await this.parseXlsx(file.buffer)
      : await this.parseCsv(file.buffer);

    if (rawRows.length === 0) {
      return { total: 0, success: 0, failed: 0, errors: [] };
    }

    const dataSource = await this.tenantConnectionManager.getDataSource();
    const productRepo = await this.getProductRepository();

    // Build lookup maps (one DB call each)
    const uomMap = await this.buildUomMap(dataSource);
    const categoryMap = await this.buildCategoryMap(dataSource);
    const brandMap = await this.buildBrandMap(dataSource);
    const taxCategoryMap = await this.buildTaxCategoryMap(dataSource);

    // Build existing SKU → id map for UPSERT / INSERT check
    const existingProducts = await productRepo.find({
      select: ['id', 'sku'],
      withDeleted: false,
    });
    const existingSkuMap = new Map(existingProducts.map((p) => [p.sku, p.id]));

    // Group rows by product (SKU or auto-key)
    const groups = this.groupImportRows(rawRows);

    const result: BulkImportResultDto = {
      total: groups.size,
      success: 0,
      failed: 0,
      errors: [],
    };

    for (const { firstRow, allRows } of groups.values()) {
      const rowIndex = Number(firstRow.__rowIndex);
      try {
        await this.processProductGroup(
          firstRow,
          allRows,
          mode,
          userId,
          productRepo,
          dataSource,
          uomMap,
          categoryMap,
          brandMap,
          taxCategoryMap,
          existingSkuMap,
          result.errors,
          rowIndex,
        );
        if (
          !result.errors.find(
            (e) => e.row === rowIndex && e.field === '__fatal',
          )
        ) {
          result.success++;
        } else {
          result.failed++;
        }
      } catch (err: any) {
        result.failed++;
        result.errors.push({
          row: rowIndex,
          field: 'general',
          message: err.message,
        });
      }
    }

    result.failed = result.total - result.success;
    return result;
  }

  private async processProductGroup(
    firstRow: Record<string, string>,
    allRows: Record<string, string>[],
    mode: ImportMode,
    userId: string,
    productRepo: Repository<Product>,
    dataSource: DataSource,
    uomMap: Map<string, string>,
    categoryMap: Map<string, string>,
    brandMap: Map<string, string>,
    taxCategoryMap: Map<string, string>,
    existingSkuMap: Map<string, string>,
    errors: ImportRowError[],
    rowIndex: number,
  ): Promise<void> {
    // ── Validate required fields ──────────────────────────────────────────
    const productName = firstRow.product_name?.trim();
    if (!productName) {
      errors.push({
        row: rowIndex,
        field: 'product_name',
        message: 'product_name is required',
      });
      errors.push({ row: rowIndex, field: '__fatal', message: '' });
      return;
    }

    const uomKey = firstRow.uom?.trim().toLowerCase();
    if (!uomKey) {
      errors.push({ row: rowIndex, field: 'uom', message: 'uom is required' });
      errors.push({ row: rowIndex, field: '__fatal', message: '' });
      return;
    }
    const baseUomId = uomMap.get(uomKey);
    if (!baseUomId) {
      errors.push({
        row: rowIndex,
        field: 'uom',
        message: `UOM '${firstRow.uom}' not found`,
      });
      errors.push({ row: rowIndex, field: '__fatal', message: '' });
      return;
    }

    // ── Resolve optional lookups ──────────────────────────────────────────
    const sku = firstRow.sku?.trim() || undefined;

    const categoryId = firstRow.category?.trim()
      ? categoryMap.get(firstRow.category.trim().toLowerCase())
      : undefined;

    if (firstRow.category?.trim() && !categoryId) {
      errors.push({
        row: rowIndex,
        field: 'category',
        message: `Category '${firstRow.category}' not found`,
      });
    }

    const brandId = firstRow.brand?.trim()
      ? brandMap.get(firstRow.brand.trim().toLowerCase())
      : undefined;

    if (firstRow.brand?.trim() && !brandId) {
      errors.push({
        row: rowIndex,
        field: 'brand',
        message: `Brand '${firstRow.brand}' not found`,
      });
    }

    const taxCategoryId = firstRow.tax_category?.trim()
      ? taxCategoryMap.get(firstRow.tax_category.trim().toLowerCase())
      : undefined;

    const secondaryUomId = firstRow.secondary_uom?.trim()
      ? uomMap.get(firstRow.secondary_uom.trim().toLowerCase())
      : undefined;

    const productType =
      (firstRow.product_type?.trim().toUpperCase() as ProductType) ||
      ProductType.GOODS;

    // ── Build product data ────────────────────────────────────────────────
    const productData: Partial<Product> = {
      productName,
      shortName: firstRow.short_name?.trim() || undefined,
      description: firstRow.description?.trim() || undefined,
      barcode: firstRow.barcode?.trim() || undefined,
      hsnCode: firstRow.hsn_code?.trim() || undefined,
      baseUomId,
      secondaryUomId,
      categoryId,
      brandId,
      taxCategoryId,
      productType,
      costPrice: this.toDecimal(firstRow.cost_price) ?? 0,
      sellingPrice: this.toDecimal(firstRow.selling_price) ?? 0,
      mrp: this.toDecimal(firstRow.mrp),
      minimumPrice: this.toDecimal(firstRow.minimum_price),
      wholesalePrice: this.toDecimal(firstRow.wholesale_price),
      reorderLevel: this.toDecimal(firstRow.reorder_level) ?? 0,
      reorderQuantity: this.toDecimal(firstRow.reorder_quantity) ?? 0,
      isStockable: this.toBool(firstRow.is_stockable, true),
      isSellable: this.toBool(firstRow.is_sellable, true),
      isPurchasable: this.toBool(firstRow.is_purchasable, true),
      trackBatch: this.toBool(firstRow.track_batch, false),
      trackSerial: this.toBool(firstRow.track_serial, false),
      notes: firstRow.notes?.trim() || undefined,
      createdBy: userId,
    };

    // ── Parse variants from all rows that have variant_name ───────────────
    const variantRows = allRows.filter((r) => r.variant_name?.trim());

    // ── INSERT / UPSERT logic ─────────────────────────────────────────────
    let productId: string;

    if (sku && existingSkuMap.has(sku)) {
      if (mode === 'INSERT') {
        errors.push({
          row: rowIndex,
          field: 'sku',
          message: `SKU '${sku}' already exists (use UPSERT to update)`,
        });
        errors.push({ row: rowIndex, field: '__fatal', message: '' });
        return;
      }
      // UPSERT → update existing
      productId = existingSkuMap.get(sku)!;
      await productRepo.update(productId, { ...productData, sku });
    } else {
      // New product
      const newSku = sku || (await getNextSequence(dataSource, 'PRODUCT'));
      const product = productRepo.create({
        id: uuidv4(),
        sku: newSku,
        ...productData,
      });
      const saved = await productRepo.save(product);
      productId = saved.id;
      if (newSku) existingSkuMap.set(newSku, productId);
    }

    // ── Save variants ─────────────────────────────────────────────────────
    if (variantRows.length > 0) {
      const variantRepo = dataSource.getRepository(ProductVariant);
      for (const vr of variantRows) {
        const variantName = vr.variant_name.trim();
        const variantSku =
          vr.variant_sku?.trim() ||
          (await getNextSequence(dataSource, 'VARIANT'));
        const existing = await variantRepo.findOne({
          where: { productId, variantName },
        });
        if (existing) {
          await variantRepo.update(existing.id, {
            variantSku,
            variantBarcode: vr.variant_barcode?.trim() || undefined,
            costPrice: this.toDecimal(vr.variant_cost_price),
            sellingPrice: this.toDecimal(vr.variant_selling_price),
            mrp: this.toDecimal(vr.variant_mrp),
            weight: this.toDecimal(vr.variant_weight),
          });
        } else {
          const variant = variantRepo.create({
            id: uuidv4(),
            productId,
            variantName,
            variantSku,
            variantBarcode: vr.variant_barcode?.trim() || undefined,
            costPrice: this.toDecimal(vr.variant_cost_price),
            sellingPrice: this.toDecimal(vr.variant_selling_price),
            mrp: this.toDecimal(vr.variant_mrp),
            weight: this.toDecimal(vr.variant_weight),
          });
          await variantRepo.save(variant);
        }
      }
    }
  }

  // ── File Parsers ──────────────────────────────────────────────────────────

  private async parseCsv(buffer: Buffer): Promise<Record<string, string>[]> {
    const rows: Record<string, string>[] = [];
    let rowIndex = 2;
    await new Promise<void>((resolve, reject) => {
      fastCsv
        .parseStream(Readable.from(buffer), { headers: true, trim: true })
        .on('data', (row: Record<string, string>) => {
          rows.push({ ...row, __rowIndex: String(rowIndex++) });
        })
        .on('end', resolve)
        .on('error', reject);
    });
    return rows;
  }

  private async parseXlsx(buffer: Buffer): Promise<Record<string, string>[]> {
    const workbook = new ExcelJS.Workbook();
    const ab = buffer.buffer.slice(
      buffer.byteOffset,
      buffer.byteOffset + buffer.byteLength,
    );
    await workbook.xlsx.load(ab as ArrayBuffer);
    const sheet = workbook.worksheets[0];
    const rows: Record<string, string>[] = [];

    const headerRow = sheet.getRow(1);
    const headers: string[] = [];
    headerRow.eachCell((cell, colIndex) => {
      headers[colIndex] = String(cell.value ?? '')
        .trim()
        .toLowerCase();
    });

    sheet.eachRow((row, rowNumber) => {
      if (rowNumber === 1) return;
      const obj: Record<string, string> = { __rowIndex: String(rowNumber) };
      row.eachCell({ includeEmpty: true }, (cell, colIndex) => {
        const header = headers[colIndex];
        if (header) obj[header] = String(cell.value ?? '').trim();
      });
      rows.push(obj);
    });
    return rows;
  }

  // ── Row Grouping ──────────────────────────────────────────────────────────

  private groupImportRows(
    rows: Record<string, string>[],
  ): Map<
    string,
    { firstRow: Record<string, string>; allRows: Record<string, string>[] }
  > {
    const groups = new Map<
      string,
      { firstRow: Record<string, string>; allRows: Record<string, string>[] }
    >();
    let currentKey = '';
    let autoIdx = 0;

    for (const row of rows) {
      const sku = row.sku?.trim();
      const productName = row.product_name?.trim();

      if (sku) {
        currentKey = sku;
      } else if (productName) {
        currentKey = `__auto_${++autoIdx}`;
      }
      // rows with neither sku nor product_name belong to currentKey (variant continuation)

      if (!currentKey) continue;

      if (!groups.has(currentKey)) {
        groups.set(currentKey, { firstRow: row, allRows: [] });
      }
      groups.get(currentKey)!.allRows.push(row);
    }

    return groups;
  }

  // ── Lookup Map Builders ───────────────────────────────────────────────────

  private async buildUomMap(
    dataSource: DataSource,
  ): Promise<Map<string, string>> {
    const repo = dataSource.getRepository(UnitOfMeasure);
    const items = await repo.find({
      select: ['id', 'uomName', 'symbol', 'uomCode'],
    });
    const map = new Map<string, string>();
    for (const u of items) {
      if (u.uomName) map.set(u.uomName.toLowerCase(), u.id);
      if (u.symbol) map.set(u.symbol.toLowerCase(), u.id);
      if (u.uomCode) map.set(u.uomCode.toLowerCase(), u.id);
    }
    return map;
  }

  private async buildCategoryMap(
    dataSource: DataSource,
  ): Promise<Map<string, string>> {
    const repo = dataSource.getRepository(ProductCategory);
    const items = await repo.find({ select: ['id', 'categoryName'] });
    const map = new Map<string, string>();
    for (const c of items) {
      if (c.categoryName) map.set(c.categoryName.toLowerCase(), c.id);
    }
    return map;
  }

  private async buildBrandMap(
    dataSource: DataSource,
  ): Promise<Map<string, string>> {
    const repo = dataSource.getRepository(Brand);
    const items = await repo.find({ select: ['id', 'brandName'] });
    const map = new Map<string, string>();
    for (const b of items) {
      if (b.brandName) map.set(b.brandName.toLowerCase(), b.id);
    }
    return map;
  }

  private async buildTaxCategoryMap(
    dataSource: DataSource,
  ): Promise<Map<string, string>> {
    const repo = dataSource.getRepository(TaxCategory);
    const items = await repo.find({ select: ['id', 'taxName'] });
    const map = new Map<string, string>();
    for (const t of items) {
      if (t.taxName) map.set(t.taxName.toLowerCase(), t.id);
    }
    return map;
  }

  // ── Type Helpers ──────────────────────────────────────────────────────────

  private toDecimal(val?: string): number | undefined {
    if (!val || val.trim() === '') return undefined;
    const n = parseFloat(val.trim());
    return isNaN(n) ? undefined : n;
  }

  private toBool(val: string | undefined, defaultVal: boolean): boolean {
    if (!val || val.trim() === '') return defaultVal;
    const v = val.trim().toLowerCase();
    return v === 'true' || v === '1' || v === 'yes';
  }

  // ── Template Download ─────────────────────────────────────────────────────

  async downloadTemplate(): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Products');

    const headers = [
      'sku',
      'product_name',
      'barcode',
      'short_name',
      'description',
      'category',
      'brand',
      'uom',
      'secondary_uom',
      'product_type',
      'tax_category',
      'hsn_code',
      'cost_price',
      'selling_price',
      'mrp',
      'minimum_price',
      'wholesale_price',
      'reorder_level',
      'reorder_quantity',
      'is_stockable',
      'is_sellable',
      'is_purchasable',
      'track_batch',
      'track_serial',
      'notes',
      'variant_sku',
      'variant_name',
      'variant_barcode',
      'variant_cost_price',
      'variant_selling_price',
      'variant_mrp',
      'variant_weight',
    ];

    const headerRow = sheet.addRow(headers);
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD9E1F2' },
    };
    headers.forEach((_, i) => {
      sheet.getColumn(i + 1).width = 18;
    });

    // Sample row 1 — product with no variants
    sheet.addRow([
      'PRD-001',
      'Sample Product',
      '1234567890123',
      'Sample',
      'A sample product',
      '',
      '',
      'PCS',
      '',
      'GOODS',
      '',
      '1234',
      '100',
      '150',
      '199',
      '',
      '',
      '10',
      '50',
      'true',
      'true',
      'true',
      'false',
      'false',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
    ]);

    // Sample row 2 — product with variants (row defines product + first variant)
    sheet.addRow([
      'PRD-002',
      'T-Shirt',
      '',
      'Tee',
      'Cotton T-Shirt',
      '',
      '',
      'PCS',
      '',
      'GOODS',
      '',
      '',
      '200',
      '350',
      '399',
      '',
      '',
      '5',
      '20',
      'true',
      'true',
      'true',
      'false',
      'false',
      '',
      'VAR-S',
      'Small',
      '',
      '200',
      '350',
      '399',
      '0.2',
    ]);

    // Sample row 3 — continuation variant for PRD-002
    sheet.addRow([
      'PRD-002',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      '',
      'VAR-M',
      'Medium',
      '',
      '200',
      '350',
      '399',
      '0.25',
    ]);

    const buffer = await workbook.xlsx.writeBuffer();
    return Buffer.from(buffer);
  }
}
