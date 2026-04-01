// src/modules/quotations/quotations.service.ts

import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { Repository, DeepPartial } from 'typeorm';
import { Readable } from 'stream';
import * as ExcelJS from 'exceljs';
import * as fastCsv from 'fast-csv';
import { TenantConnectionManager } from '@/database/tenant-connection.manager';
import {
  Quotation,
  QuotationItem,
  QuotationStatus,
  Product,
  SalesOrder,
  SalesOrderItem,
} from '@/entities/tenant';
import { User } from '@/entities/tenant/user/user.entity';
import { getNextSequence } from '@/common/utils/sequence.util';
import { CreateQuotationDto } from './dto/create-quotation.dto';
import { QuotationFilterDto } from './dto/quotation-filter.dto';
import { UpdateQuotationDto } from './dto/update-quotation.dto';
import { SalesOrderStatus } from '@/common/enums';

@Injectable()
export class QuotationsService {
  sequenceService: any;
  constructor(
    private readonly tenantConnectionManager: TenantConnectionManager,
  ) {}

  // ─── Repositories ──────────────────────────────────────────────────
  private async getRepo<T>(entity: any): Promise<Repository<any>> {
    return this.tenantConnectionManager.getRepository(entity);
  }

  private async getQuotationItemRepository(): Promise<
    Repository<QuotationItem>
  > {
    return this.tenantConnectionManager.getRepository(QuotationItem);
  }

  // ─── CRUD ──────────────────────────────────────────────────────────

  async create(dto: CreateQuotationDto, userId: string): Promise<Quotation> {
    const tenantId = this.tenantConnectionManager.getTenantId();
    const dataSource = await this.tenantConnectionManager.getDataSource();
    const quotationNumber = await getNextSequence(dataSource, 'QTN');

    const productRepo = await this.getRepo<Product>(Product);
    const quotationRepo = await this.getRepo<Quotation>(Quotation);
    const userRepo = await this.getRepo<User>(User);

    // Validate salesPersonId — silently strip if user doesn't exist
    if (dto.salesPersonId) {
      const userExists = await userRepo.findOne({
        where: { id: dto.salesPersonId },
      });
      if (!userExists) dto.salesPersonId = undefined;
    }

    // Build items with product details and calculations
    const items: Partial<QuotationItem>[] = [];
    let subtotal = 0;

    for (const itemDto of dto.items) {
      const product = await productRepo.findOne({
        where: { id: itemDto.productId },
      });
      if (!product)
        throw new NotFoundException(`Product ${itemDto.productId} not found`);

      const grossAmount = itemDto.quantity * itemDto.unitPrice;
      let itemDiscountAmount = 0;

      if (itemDto.discountType === 'PERCENTAGE') {
        itemDiscountAmount = grossAmount * ((itemDto.discountValue || 0) / 100);
      } else {
        itemDiscountAmount = itemDto.discountValue || 0;
      }

      const afterDiscount = grossAmount - itemDiscountAmount;
      const taxRate = product.taxRate ?? 0;
      const taxAmount = afterDiscount * (taxRate / 100);
      const lineTotal = afterDiscount + taxAmount;
      subtotal += lineTotal;

      items.push({
        ...itemDto,
        productName: product.productName,
        sku: product.sku,
        discountAmount: itemDiscountAmount,
        taxRate,
        taxAmount,
        lineTotal,
      });
    }

    // Order-level calculations
    let orderDiscountAmount = 0;
    if (dto.discountType === 'PERCENTAGE') {
      orderDiscountAmount = subtotal * ((dto.discountValue || 0) / 100);
    } else {
      orderDiscountAmount = dto.discountValue || 0;
    }

    const totalTax = items.reduce((sum, i) => sum + (i.taxAmount || 0), 0);
    const shippingAmount = dto.shippingAmount || 0;
    const totalAmount = subtotal - orderDiscountAmount + shippingAmount;

    const quotation = quotationRepo.create({
      ...dto,
      quotationNumber,
      status: QuotationStatus.DRAFT,
      tenantId,
      createdById: userId,
      subtotal,
      taxAmount: totalTax,
      discountAmount: orderDiscountAmount,
      totalAmount,
      items: items as QuotationItem[],
    } as DeepPartial<Quotation>);

    return quotationRepo.save(quotation);
  }

  async findAll(
    filterDto: QuotationFilterDto,
  ): Promise<{ data: Quotation[]; meta: any }> {
    const {
      status,
      customerId,
      warehouseId,
      fromDate,
      toDate,
      page = 1,
      limit = 10,
      sortField = 'createdAt',
    } = filterDto;

    const quotationRepo = await this.getRepo<Quotation>(Quotation);
    const qb = quotationRepo
      .createQueryBuilder('q')
      .leftJoinAndSelect('q.customer', 'customer')
      .leftJoinAndSelect('q.items', 'items');

    if (filterDto.search) {
      qb.andWhere(
        '(q.quotationNumber LIKE :search OR customer.name LIKE :search)',
        { search: `%${filterDto.search}%` },
      );
    }
    if (filterDto.quotationNumber) {
      qb.andWhere('q.quotationNumber LIKE :quotationNumber', {
        quotationNumber: `%${filterDto.quotationNumber}%`,
      });
    }
    if (status) qb.andWhere('q.status = :status', { status });
    if (customerId) qb.andWhere('q.customerId = :customerId', { customerId });
    if (warehouseId)
      qb.andWhere('q.warehouseId = :warehouseId', { warehouseId });
    if (fromDate && toDate) {
      qb.andWhere('q.quotationDate BETWEEN :fromDate AND :toDate', {
        fromDate,
        toDate,
      });
    }

    const total = await qb.getCount();
    const data = await qb
      .orderBy(`q.${sortField}`)
      .skip((page - 1) * limit)
      .take(limit)
      .getMany();

    return {
      data,
      meta: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<Quotation> {
    const quotationRepo = await this.getRepo<Quotation>(Quotation);
    const quotation = await quotationRepo.findOne({
      where: { id },
      relations: ['customer', 'items', 'warehouse'],
    });

    if (!quotation) throw new NotFoundException('Quotation not found');
    return quotation;
  }

  async findByNumber(quotationNumber: string): Promise<Quotation | null> {
    const quotationRepo = await this.getRepo<Quotation>(Quotation);
    const quotation = await quotationRepo.findOne({
      where: { quotationNumber },
      relations: ['customer', 'items', 'warehouse'],
    });
    if (!quotation) throw new NotFoundException('Quotation not found');
    return quotation;
  }

  async update(id: string, dto: UpdateQuotationDto): Promise<Quotation> {
    const quotationRepo = await this.getRepo<Quotation>(Quotation);
    const quotationItemRepo = await this.getRepo<QuotationItem>(QuotationItem);
    const productRepo = await this.getRepo<Product>(Product);

    const quotation = await this.findOne(id);
    if (quotation.status !== QuotationStatus.DRAFT) {
      throw new BadRequestException('Only DRAFT quotations can be edited');
    }

    // If items are being updated, recalculate
    if (dto.items) {
      await quotationItemRepo.delete({ quotationId: id });
      // Rebuild items (same logic as create)
      const items: Partial<QuotationItem>[] = [];
      let subtotal = 0;

      for (const itemDto of dto.items) {
        const product = await productRepo.findOne({
          where: { id: itemDto.productId },
        });
        if (!product)
          throw new NotFoundException(`Product ${itemDto.productId} not found`);

        const quantity = itemDto.quantity;
        const unitPrice = itemDto.unitPrice;
        const grossAmount = quantity * unitPrice;

        let itemDiscountAmount = 0;
        if (itemDto.discountType === 'PERCENTAGE' && itemDto.discountValue) {
          itemDiscountAmount = grossAmount * (itemDto.discountValue / 100);
        } else if (itemDto.discountType === 'FIXED' && itemDto.discountValue) {
          itemDiscountAmount = itemDto.discountValue;
        }

        const afterDiscount = grossAmount - itemDiscountAmount;
        const taxRate = product.taxRate ?? 0;
        const taxAmount = afterDiscount * (taxRate / 100);
        const lineTotal = afterDiscount + taxAmount;
        subtotal += lineTotal;

        items.push({
          quotationId: id,
          productId: itemDto.productId,
          variantId: itemDto.variantId,
          productName: product.productName,
          sku: product.sku,
          quantity,
          unitPrice,
          discountType: itemDto.discountType || 'FIXED',
          discountValue: itemDto.discountValue || 0,
          discountAmount: itemDiscountAmount,
          taxRate,
          taxAmount,
          lineTotal,
          notes: itemDto.notes,
        });
      }

      await quotationItemRepo.save(items as QuotationItem[]);

      let orderDiscountAmount = 0;
      const discType = dto.discountType ?? quotation.discountType;
      const discVal = dto.discountValue ?? quotation.discountValue;
      if (discType === 'PERCENTAGE' && discVal) {
        orderDiscountAmount = subtotal * (discVal / 100);
      } else if (discType === 'FIXED' && discVal) {
        orderDiscountAmount = discVal;
      }

      const shippingAmount = dto.shippingAmount ?? quotation.shippingAmount;
      const totalTax = items.reduce((sum, i) => sum + (i.taxAmount || 0), 0);
      const totalAmount =
        subtotal - orderDiscountAmount + Number(shippingAmount);

      Object.assign(quotation, {
        subtotal,
        taxAmount: totalTax,
        discountAmount: orderDiscountAmount,
        totalAmount,
      });
    }

    // Update non-item fields
    const updateFields = [
      'customerId',
      'warehouseId',
      'quotationDate',
      'validUntil',
      'billingAddressId',
      'shippingAddressId',
      'paymentTermsId',
      'salesPersonId',
      'referenceNumber',
      'notes',
      'internalNotes',
      'termsAndConditions',
      'discountType',
      'discountValue',
      'shippingAmount',
    ];
    for (const field of updateFields) {
      if ((dto as any)[field] !== undefined)
        (quotation as any)[field] = (dto as any)[field];
    }

    return quotationRepo.save(quotation);
  }

  async remove(id: string): Promise<void> {
    const quotationRepo = await this.getRepo<Quotation>(Quotation);
    const quotation = await this.findOne(id);

    if (quotation.status !== QuotationStatus.DRAFT) {
      throw new BadRequestException('Only DRAFT quotations can be deleted');
    }
    await quotationRepo.remove(quotation);
  }

  // ─── WORKFLOW ─────────────────────────────────────────────────────

  async send(id: string, userId?: any): Promise<Quotation> {
    const quotationRepo = await this.getRepo<Quotation>(Quotation);
    const quotation = await this.findOne(id);

    if (quotation.status !== QuotationStatus.DRAFT) {
      throw new BadRequestException('Only DRAFT quotations can be sent');
    }

    quotation.status = QuotationStatus.SENT;
    quotation.updatedBy = userId;
    return quotationRepo.save(quotation);
  }

  async accept(id: string, userId: string): Promise<Quotation> {
    const quotationRepo = await this.getRepo<Quotation>(Quotation);
    const quotation = await this.findOne(id);

    if (
      ![QuotationStatus.SENT, QuotationStatus.DRAFT].includes(quotation.status)
    ) {
      throw new BadRequestException(
        `Cannot accept a quotation in '${quotation.status}' status`,
      );
    }

    if (quotation.validUntil && new Date() > new Date(quotation.validUntil)) {
      throw new BadRequestException('This quotation has expired');
    }

    quotation.status = QuotationStatus.ACCEPTED;
    quotation.updatedBy = userId;
    return quotationRepo.save(quotation);
  }
  async reject(id: string, userId: string, reason: string): Promise<Quotation> {
    const quotationRepo = await this.getRepo<Quotation>(Quotation);
    const quotation = await this.findOne(id);
    if (
      ![QuotationStatus.SENT, QuotationStatus.DRAFT].includes(quotation.status)
    ) {
      throw new BadRequestException(
        'Only DRAFT or SENT quotations can be rejected',
      );
    }
    quotation.status = QuotationStatus.REJECTED;
    quotation.rejectionReason = reason;
    quotation.updatedBy = userId;
    return quotationRepo.save(quotation);
  }

  async cancel(id: string, userId: string, reason: string): Promise<Quotation> {
    const quotationRepo = await this.getRepo<Quotation>(Quotation);
    const quotation = await this.findOne(id);
    if (
      [QuotationStatus.CONVERTED, QuotationStatus.CANCELLED].includes(
        quotation.status,
      )
    ) {
      throw new BadRequestException(
        'Cannot cancel a converted or already cancelled quotation',
      );
    }
    quotation.status = QuotationStatus.CANCELLED;
    quotation.rejectionReason = reason;
    quotation.updatedBy = userId;
    return quotationRepo.save(quotation);
  }
  async convertToSalesOrder(
    id: string,
    userId: string,
  ): Promise<{ quotation: Quotation; salesOrder: SalesOrder }> {
    const quotation = await this.findOne(id);
    const dataSource = await this.tenantConnectionManager.getDataSource();
    const queryRunner = dataSource.createQueryRunner();

    if (quotation.salesOrderId)
      throw new ConflictException('Already converted');

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const orderNumber = await getNextSequence(dataSource, 'SALES_ORDER');

      const salesOrder = queryRunner.manager.create(SalesOrder, {
        ...quotation,
        id: undefined, // New ID
        orderNumber,
        orderDate: quotation.createdAt,
        status: SalesOrderStatus.DRAFT,
        createdBy: userId,
        notes: `Converted from ${quotation.quotationNumber}`,
      } as DeepPartial<SalesOrder>);

      const savedOrder = await queryRunner.manager.save(SalesOrder, salesOrder);

      const items = quotation.items.map((item) =>
        queryRunner.manager.create(SalesOrderItem, {
          ...item,
          id: undefined,
          quantityOrdered: item.quantity,
          salesOrderId: savedOrder.id,
        }),
      );

      await queryRunner.manager.save(SalesOrderItem, items);

      quotation.status = QuotationStatus.CONVERTED;
      quotation.salesOrderId = savedOrder.id;

      await queryRunner.manager.save(Quotation, quotation);

      await queryRunner.commitTransaction();
      return { quotation, salesOrder: savedOrder };
    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  // ─── Bulk Item Import ───────────────────────────────────────────────

  async importItems(
    quotationId: string,
    file: Express.Multer.File,
    userId: string,
  ): Promise<{
    added: number;
    failed: number;
    errors: { row: number; field: string; message: string }[];
  }> {
    const quotation = await this.findOne(quotationId);
    if (quotation.status !== QuotationStatus.DRAFT) {
      throw new BadRequestException(
        'Items can only be imported into DRAFT quotations',
      );
    }

    const isXlsx =
      file.mimetype ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.originalname.toLowerCase().endsWith('.xlsx');

    const rawRows = isXlsx
      ? await this.parseItemsXlsx(file.buffer)
      : await this.parseItemsCsv(file.buffer);

    if (rawRows.length === 0) {
      return { added: 0, failed: 0, errors: [] };
    }

    const productRepo = await this.getRepo<Product>(Product);
    const quotationItemRepo = await this.getQuotationItemRepository();
    const quotationRepo = await this.getRepo<Quotation>(Quotation);

    // Pre-load product map: sku.toLowerCase() → Product
    const allProducts = await productRepo.find({
      select: ['id', 'sku', 'productName', 'sellingPrice', 'taxRate'],
    });
    const skuMap = new Map(allProducts.map((p) => [p.sku?.toLowerCase(), p]));

    const newItems: Partial<QuotationItem>[] = [];
    const errors: { row: number; field: string; message: string }[] = [];

    for (const row of rawRows) {
      const rowIndex = Number(row.__rowIndex);

      const sku = row.sku?.trim();
      if (!sku) {
        errors.push({
          row: rowIndex,
          field: 'sku',
          message: 'sku is required',
        });
        continue;
      }

      const product = skuMap.get(sku.toLowerCase());
      if (!product) {
        errors.push({
          row: rowIndex,
          field: 'sku',
          message: `Product with SKU '${sku}' not found`,
        });
        continue;
      }

      const quantity = parseFloat(row.quantity?.trim() || '0');
      if (!quantity || quantity <= 0) {
        errors.push({
          row: rowIndex,
          field: 'quantity',
          message: 'quantity must be greater than 0',
        });
        continue;
      }

      const unitPrice =
        parseFloat(row.unit_price?.trim() || '') ||
        Number(product.sellingPrice) ||
        0;
      const discountType =
        (row.discount_type?.trim().toUpperCase() as 'PERCENTAGE' | 'FIXED') ||
        'FIXED';
      const discountValue = parseFloat(row.discount_value?.trim() || '0') || 0;

      const grossAmount = quantity * unitPrice;
      let discountAmount = 0;
      if (discountType === 'PERCENTAGE') {
        discountAmount = grossAmount * (discountValue / 100);
      } else {
        discountAmount = discountValue;
      }
      const afterDiscount = grossAmount - discountAmount;
      const taxRate = Number(product.taxRate) || 0;
      const taxAmount = afterDiscount * (taxRate / 100);
      const lineTotal = afterDiscount + taxAmount;

      newItems.push({
        quotationId,
        productId: product.id,
        productName: product.productName,
        sku: product.sku,
        quantity,
        unitPrice,
        discountType,
        discountValue,
        discountAmount,
        taxRate,
        taxAmount,
        lineTotal,
        notes: row.notes?.trim() || undefined,
      });
    }

    if (newItems.length > 0) {
      await quotationItemRepo.save(newItems as QuotationItem[]);

      // Recalculate quotation totals (existing items + new items)
      const allItems = await quotationItemRepo.find({ where: { quotationId } });
      const subtotal = allItems.reduce((s, i) => s + Number(i.lineTotal), 0);
      const totalTax = allItems.reduce((s, i) => s + Number(i.taxAmount), 0);

      let orderDiscountAmount = 0;
      if (quotation.discountType === 'PERCENTAGE' && quotation.discountValue) {
        orderDiscountAmount =
          subtotal * (Number(quotation.discountValue) / 100);
      } else if (
        quotation.discountType === 'FIXED' &&
        quotation.discountValue
      ) {
        orderDiscountAmount = Number(quotation.discountValue);
      }

      const totalAmount =
        subtotal - orderDiscountAmount + Number(quotation.shippingAmount || 0);

      await quotationRepo.update(quotationId, {
        subtotal,
        taxAmount: totalTax,
        discountAmount: orderDiscountAmount,
        totalAmount,
        updatedBy: userId,
      } as any);
    }

    return {
      added: newItems.length,
      failed: errors.length,
      errors,
    };
  }

  async downloadItemsTemplate(): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();
    const sheet = workbook.addWorksheet('Quotation Items');

    const headers = [
      'sku',
      'quantity',
      'unit_price',
      'discount_type',
      'discount_value',
      'notes',
    ];

    const headerRow = sheet.addRow(headers);
    headerRow.font = { bold: true };
    headerRow.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFD9E1F2' },
    };
    sheet.columns = headers.map((h) => ({
      key: h,
      width: h === 'notes' ? 30 : 18,
    }));

    // Sample rows
    sheet.addRow(['PRD-001', 10, 500, 'FIXED', 0, 'Sample item 1']);
    sheet.addRow([
      'PRD-002',
      5,
      1200,
      'PERCENTAGE',
      10,
      'Sample item 2 (10% discount)',
    ]);
    sheet.addRow(['PRD-003', 2, 300, '', '', '']);

    const ab = await workbook.xlsx.writeBuffer();
    return Buffer.from(ab as ArrayBuffer);
  }

  // ─── File Parsers (Items) ───────────────────────────────────────────

  private async parseItemsCsv(
    buffer: Buffer,
  ): Promise<Record<string, string>[]> {
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

  private async parseItemsXlsx(
    buffer: Buffer,
  ): Promise<Record<string, string>[]> {
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
}
