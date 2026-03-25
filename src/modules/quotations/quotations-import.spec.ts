// src/modules/quotations/quotations-import.spec.ts
// Functional unit tests for QuotationsService — importItems() & downloadItemsTemplate()

import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import * as ExcelJS from 'exceljs';
import { QuotationsService } from './quotations.service';
import { TenantConnectionManager } from '@database/tenant-connection.manager';
import { QuotationStatus } from '@entities/tenant';

// ─── Test Data Builders ────────────────────────────────────────────────────

const CSV_HEADERS = ['sku', 'quantity', 'unit_price', 'discount_type', 'discount_value', 'notes'];

function buildCsv(headers: string[], rows: (string | number)[][]): string {
  return [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
}

async function buildXlsx(headers: string[], rows: (string | number)[][]): Promise<Buffer> {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('Items');
  ws.addRow(headers);
  for (const row of rows) ws.addRow(row);
  const ab = await wb.xlsx.writeBuffer();
  return Buffer.from(ab as ArrayBuffer);
}

function makeFile(
  content: Buffer | string,
  mimetype = 'text/csv',
  originalname = 'items.csv',
): Express.Multer.File {
  const buffer = typeof content === 'string' ? Buffer.from(content) : content;
  return { buffer, mimetype, originalname, fieldname: 'file', encoding: '7bit', size: buffer.length, stream: null as any, destination: '', filename: '', path: '' };
}

// ─── Mock Factories ────────────────────────────────────────────────────────

const DRAFT_QUOTATION = {
  id: 'qtn-uuid-1',
  quotationNumber: 'QTN-001',
  status: QuotationStatus.DRAFT,
  discountType: 'FIXED',
  discountValue: 0,
  shippingAmount: 0,
  items: [],
};

const PRODUCTS = [
  { id: 'prod-1', sku: 'PRD-001', productName: 'Widget A', sellingPrice: 500, taxRate: 18 },
  { id: 'prod-2', sku: 'PRD-002', productName: 'Gadget B', sellingPrice: 1200, taxRate: 12 },
  { id: 'prod-3', sku: 'PRD-003', productName: 'Item C',   sellingPrice: 300,  taxRate: 0  },
];

const makeQuotationRepo = (quotation = DRAFT_QUOTATION) => ({
  findOne: jest.fn().mockResolvedValue(quotation),
  update: jest.fn().mockResolvedValue({ affected: 1 }),
  save: jest.fn().mockImplementation((obj) => Promise.resolve(obj)),
});

const makeProductRepo = (products = PRODUCTS) => ({
  find: jest.fn().mockResolvedValue(products),
  findOne: jest.fn().mockImplementation(({ where: { id } }: any) =>
    Promise.resolve(products.find((p) => p.id === id) ?? null),
  ),
});

const makeQuotationItemRepo = (existingItems: any[] = []) => ({
  find: jest.fn().mockResolvedValue(existingItems),
  save: jest.fn().mockImplementation((items) => Promise.resolve(Array.isArray(items) ? items : [items])),
  delete: jest.fn().mockResolvedValue({ affected: 1 }),
});

const makeDataSource = () => ({
  createQueryRunner: jest.fn(),
  getRepository: jest.fn(),
});

const makeTenantManager = (quotationRepo: any, productRepo: any, itemRepo: any, dataSource: any) => ({
  getRepository: jest.fn().mockImplementation((Entity: any) => {
    const name = Entity?.name ?? '';
    if (name === 'Quotation') return Promise.resolve(quotationRepo);
    if (name === 'QuotationItem') return Promise.resolve(itemRepo);
    if (name === 'Product') return Promise.resolve(productRepo);
    return Promise.resolve({ find: jest.fn().mockResolvedValue([]) });
  }),
  getDataSource: jest.fn().mockResolvedValue(dataSource),
  getTenantId: jest.fn().mockReturnValue('tenant-1'),
  getTenantDatabase: jest.fn().mockReturnValue('db_tenant_1'),
});

// ─── Test Suite ────────────────────────────────────────────────────────────

describe('QuotationsService – importItems() & downloadItemsTemplate()', () => {
  let service: QuotationsService;
  let quotationRepo: ReturnType<typeof makeQuotationRepo>;
  let productRepo: ReturnType<typeof makeProductRepo>;
  let itemRepo: ReturnType<typeof makeQuotationItemRepo>;

  const USER_ID = 'user-uuid-1';
  const QUOTATION_ID = 'qtn-uuid-1';

  beforeEach(async () => {
    quotationRepo = makeQuotationRepo();
    productRepo = makeProductRepo();
    itemRepo = makeQuotationItemRepo();
    const dataSource = makeDataSource();
    const tenantManager = makeTenantManager(quotationRepo, productRepo, itemRepo, dataSource);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuotationsService,
        { provide: TenantConnectionManager, useValue: tenantManager },
      ],
    }).compile();

    service = module.get<QuotationsService>(QuotationsService);
  });

  afterEach(() => jest.clearAllMocks());

  // ══════════════════════════════════════════════════════════════════════
  // Guard: non-DRAFT quotation
  // ══════════════════════════════════════════════════════════════════════

  describe('status guard', () => {
    it('throws BadRequestException when quotation is not DRAFT', async () => {
      quotationRepo.findOne.mockResolvedValue({ ...DRAFT_QUOTATION, status: QuotationStatus.SENT });
      const file = makeFile(buildCsv(CSV_HEADERS, [['PRD-001', 5, 500, '', '', '']]));
      await expect(service.importItems(QUOTATION_ID, file, USER_ID))
        .rejects.toThrow(BadRequestException);
    });

    it('throws NotFoundException when quotation does not exist', async () => {
      quotationRepo.findOne.mockResolvedValue(null);
      const file = makeFile(buildCsv(CSV_HEADERS, [['PRD-001', 5, 500, '', '', '']]));
      await expect(service.importItems(QUOTATION_ID, file, USER_ID))
        .rejects.toThrow(NotFoundException);
    });
  });

  // ══════════════════════════════════════════════════════════════════════
  // Empty file
  // ══════════════════════════════════════════════════════════════════════

  describe('empty file', () => {
    it('returns zero counts for a CSV with headers only', async () => {
      const file = makeFile(`${CSV_HEADERS.join(',')}\n`);
      const result = await service.importItems(QUOTATION_ID, file, USER_ID);
      expect(result).toEqual({ added: 0, failed: 0, errors: [] });
      expect(itemRepo.save).not.toHaveBeenCalled();
    });

    it('returns zero counts for an empty XLSX', async () => {
      const buffer = await buildXlsx(CSV_HEADERS, []);
      const file = makeFile(buffer, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'items.xlsx');
      const result = await service.importItems(QUOTATION_ID, file, USER_ID);
      expect(result).toEqual({ added: 0, failed: 0, errors: [] });
    });
  });

  // ══════════════════════════════════════════════════════════════════════
  // CSV happy path
  // ══════════════════════════════════════════════════════════════════════

  describe('CSV – happy path', () => {
    it('imports a single valid row with explicit unit_price', async () => {
      const csv = buildCsv(CSV_HEADERS, [['PRD-001', 10, 600, '', '', 'Test note']]);
      const file = makeFile(csv);
      itemRepo.find.mockResolvedValue([{ lineTotal: 6000, taxAmount: 0 }]);

      const result = await service.importItems(QUOTATION_ID, file, USER_ID);

      expect(result.added).toBe(1);
      expect(result.failed).toBe(0);
      expect(result.errors).toHaveLength(0);
      expect(itemRepo.save).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            quotationId: QUOTATION_ID,
            productId: 'prod-1',
            sku: 'PRD-001',
            quantity: 10,
            unitPrice: 600,
          }),
        ]),
      );
    });

    it('falls back to product sellingPrice when unit_price is omitted', async () => {
      const csv = buildCsv(CSV_HEADERS, [['PRD-002', 3, '', '', '', '']]);
      const file = makeFile(csv);
      itemRepo.find.mockResolvedValue([{ lineTotal: 3600, taxAmount: 432 }]);

      await service.importItems(QUOTATION_ID, file, USER_ID);

      expect(itemRepo.save).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ unitPrice: 1200 }), // PRD-002 sellingPrice
        ]),
      );
    });

    it('imports multiple rows in a single CSV', async () => {
      const csv = buildCsv(CSV_HEADERS, [
        ['PRD-001', 5,  500, '', '', ''],
        ['PRD-002', 2, 1200, '', '', ''],
        ['PRD-003', 8,  300, '', '', ''],
      ]);
      const file = makeFile(csv);
      itemRepo.find.mockResolvedValue([]);

      const result = await service.importItems(QUOTATION_ID, file, USER_ID);

      expect(result.added).toBe(3);
      expect(result.failed).toBe(0);
    });
  });

  // ══════════════════════════════════════════════════════════════════════
  // XLSX happy path
  // ══════════════════════════════════════════════════════════════════════

  describe('XLSX – happy path', () => {
    it('imports a valid XLSX file correctly', async () => {
      const buffer = await buildXlsx(
        CSV_HEADERS,
        [['PRD-001', 4, 550, 'FIXED', 0, 'XLSX note']],
      );
      const file = makeFile(buffer, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'items.xlsx');
      itemRepo.find.mockResolvedValue([{ lineTotal: 2200, taxAmount: 396 }]);

      const result = await service.importItems(QUOTATION_ID, file, USER_ID);

      expect(result.added).toBe(1);
      expect(itemRepo.save).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ sku: 'PRD-001', quantity: 4, unitPrice: 550 }),
        ]),
      );
    });

    it('detects XLSX by file extension when mimetype is generic', async () => {
      const buffer = await buildXlsx(CSV_HEADERS, [['PRD-003', 1, 300, '', '', '']]);
      // Force generic mimetype but .xlsx extension
      const file = makeFile(buffer, 'application/octet-stream', 'items.xlsx');
      itemRepo.find.mockResolvedValue([{ lineTotal: 300, taxAmount: 0 }]);

      const result = await service.importItems(QUOTATION_ID, file, USER_ID);
      expect(result.added).toBe(1);
    });
  });

  // ══════════════════════════════════════════════════════════════════════
  // Discount calculations
  // ══════════════════════════════════════════════════════════════════════

  describe('discount and tax calculations', () => {
    it('computes PERCENTAGE discount correctly', async () => {
      // PRD-001: qty=10, price=500, 10% PERCENTAGE discount
      // gross=5000, discount=500, afterDiscount=4500, tax=18%→810, lineTotal=5310
      const csv = buildCsv(CSV_HEADERS, [['PRD-001', 10, 500, 'PERCENTAGE', 10, '']]);
      const file = makeFile(csv);
      itemRepo.find.mockResolvedValue([{ lineTotal: 5310, taxAmount: 810 }]);

      await service.importItems(QUOTATION_ID, file, USER_ID);

      expect(itemRepo.save).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            discountType: 'PERCENTAGE',
            discountValue: 10,
            discountAmount: 500,
            taxRate: 18,
            taxAmount: 810,
            lineTotal: 5310,
          }),
        ]),
      );
    });

    it('computes FIXED discount correctly', async () => {
      // PRD-001: qty=2, price=500, FIXED discount=100
      // gross=1000, discount=100, afterDiscount=900, tax=18%→162, lineTotal=1062
      const csv = buildCsv(CSV_HEADERS, [['PRD-001', 2, 500, 'FIXED', 100, '']]);
      const file = makeFile(csv);
      itemRepo.find.mockResolvedValue([{ lineTotal: 1062, taxAmount: 162 }]);

      await service.importItems(QUOTATION_ID, file, USER_ID);

      expect(itemRepo.save).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            discountType: 'FIXED',
            discountAmount: 100,
            taxAmount: 162,
            lineTotal: 1062,
          }),
        ]),
      );
    });

    it('applies zero tax for products with taxRate=0', async () => {
      // PRD-003 has taxRate=0
      const csv = buildCsv(CSV_HEADERS, [['PRD-003', 5, 300, '', '', '']]);
      const file = makeFile(csv);
      itemRepo.find.mockResolvedValue([{ lineTotal: 1500, taxAmount: 0 }]);

      await service.importItems(QUOTATION_ID, file, USER_ID);

      expect(itemRepo.save).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ taxRate: 0, taxAmount: 0, lineTotal: 1500 }),
        ]),
      );
    });

    it('defaults discount to FIXED 0 when discount columns are empty', async () => {
      const csv = buildCsv(CSV_HEADERS, [['PRD-001', 1, 500, '', '', '']]);
      const file = makeFile(csv);
      itemRepo.find.mockResolvedValue([{ lineTotal: 590, taxAmount: 90 }]);

      await service.importItems(QUOTATION_ID, file, USER_ID);

      expect(itemRepo.save).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ discountType: 'FIXED', discountValue: 0, discountAmount: 0 }),
        ]),
      );
    });
  });

  // ══════════════════════════════════════════════════════════════════════
  // Quotation total recalculation
  // ══════════════════════════════════════════════════════════════════════

  describe('quotation total recalculation', () => {
    it('recalculates quotation totals after import', async () => {
      const csv = buildCsv(CSV_HEADERS, [['PRD-001', 2, 500, '', '', '']]);
      const file = makeFile(csv);
      // Simulate allItems after save includes the new item
      itemRepo.find.mockResolvedValue([
        { lineTotal: 1180, taxAmount: 180 }, // 2×500, 18% tax
      ]);

      await service.importItems(QUOTATION_ID, file, USER_ID);

      expect(quotationRepo.update).toHaveBeenCalledWith(
        QUOTATION_ID,
        expect.objectContaining({
          subtotal: 1180,
          taxAmount: 180,
          updatedBy: USER_ID,
        }),
      );
    });

    it('combines existing items with newly imported items in total calculation', async () => {
      const csv = buildCsv(CSV_HEADERS, [['PRD-002', 1, 1200, '', '', '']]);
      const file = makeFile(csv);
      // Existing item (lineTotal=590) + new item (lineTotal=1344)
      itemRepo.find.mockResolvedValue([
        { lineTotal: 590,  taxAmount: 90  }, // pre-existing
        { lineTotal: 1344, taxAmount: 144 }, // newly imported
      ]);

      await service.importItems(QUOTATION_ID, file, USER_ID);

      expect(quotationRepo.update).toHaveBeenCalledWith(
        QUOTATION_ID,
        expect.objectContaining({ subtotal: 1934, taxAmount: 234 }),
      );
    });

    it('applies order-level PERCENTAGE discount when recalculating', async () => {
      quotationRepo.findOne.mockResolvedValue({
        ...DRAFT_QUOTATION,
        discountType: 'PERCENTAGE',
        discountValue: 10,
        shippingAmount: 0,
      });

      const csv = buildCsv(CSV_HEADERS, [['PRD-003', 10, 300, '', '', '']]);
      const file = makeFile(csv);
      itemRepo.find.mockResolvedValue([{ lineTotal: 3000, taxAmount: 0 }]);

      await service.importItems(QUOTATION_ID, file, USER_ID);

      // subtotal=3000, 10% order discount=300, totalAmount=2700
      expect(quotationRepo.update).toHaveBeenCalledWith(
        QUOTATION_ID,
        expect.objectContaining({
          subtotal: 3000,
          discountAmount: 300,
          totalAmount: 2700,
        }),
      );
    });

    it('adds shippingAmount to totalAmount', async () => {
      quotationRepo.findOne.mockResolvedValue({
        ...DRAFT_QUOTATION,
        discountType: 'FIXED',
        discountValue: 0,
        shippingAmount: 150,
      });

      const csv = buildCsv(CSV_HEADERS, [['PRD-003', 1, 300, '', '', '']]);
      const file = makeFile(csv);
      itemRepo.find.mockResolvedValue([{ lineTotal: 300, taxAmount: 0 }]);

      await service.importItems(QUOTATION_ID, file, USER_ID);

      expect(quotationRepo.update).toHaveBeenCalledWith(
        QUOTATION_ID,
        expect.objectContaining({ totalAmount: 450 }), // 300 + 150 shipping
      );
    });

    it('does NOT call quotationRepo.update when all rows fail validation', async () => {
      const csv = buildCsv(CSV_HEADERS, [
        ['', 5, 500, '', '', ''],    // missing sku
        ['MISSING', 5, 500, '', '', ''], // unknown sku
      ]);
      const file = makeFile(csv);

      const result = await service.importItems(QUOTATION_ID, file, USER_ID);

      expect(result.added).toBe(0);
      expect(quotationRepo.update).not.toHaveBeenCalled();
      expect(itemRepo.save).not.toHaveBeenCalled();
    });
  });

  // ══════════════════════════════════════════════════════════════════════
  // Validation errors
  // ══════════════════════════════════════════════════════════════════════

  describe('validation errors', () => {
    it('reports error for row with missing sku', async () => {
      const csv = buildCsv(CSV_HEADERS, [
        ['', 5, 500, '', '', ''],
        ['PRD-001', 2, 500, '', '', ''],
      ]);
      const file = makeFile(csv);
      itemRepo.find.mockResolvedValue([{ lineTotal: 1000, taxAmount: 180 }]);

      const result = await service.importItems(QUOTATION_ID, file, USER_ID);

      expect(result.added).toBe(1);
      expect(result.failed).toBe(1);
      const err = result.errors.find((e) => e.field === 'sku' && !e.message.includes('not found'));
      expect(err).toBeDefined();
      expect(err!.row).toBe(2);
    });

    it('reports error for row with unknown SKU', async () => {
      const csv = buildCsv(CSV_HEADERS, [['GHOST-SKU', 5, 500, '', '', '']]);
      const file = makeFile(csv);

      const result = await service.importItems(QUOTATION_ID, file, USER_ID);

      expect(result.added).toBe(0);
      expect(result.failed).toBe(1);
      const err = result.errors.find((e) => e.field === 'sku' && e.message.includes('not found'));
      expect(err).toBeDefined();
      expect(err!.message).toContain('GHOST-SKU');
    });

    it('reports error for row with quantity = 0', async () => {
      const csv = buildCsv(CSV_HEADERS, [['PRD-001', 0, 500, '', '', '']]);
      const file = makeFile(csv);

      const result = await service.importItems(QUOTATION_ID, file, USER_ID);

      expect(result.failed).toBe(1);
      const err = result.errors.find((e) => e.field === 'quantity');
      expect(err).toBeDefined();
    });

    it('reports error for row with negative quantity', async () => {
      const csv = buildCsv(CSV_HEADERS, [['PRD-001', -5, 500, '', '', '']]);
      const file = makeFile(csv);

      const result = await service.importItems(QUOTATION_ID, file, USER_ID);

      expect(result.failed).toBe(1);
      expect(result.errors[0].field).toBe('quantity');
    });

    it('reports error for row with missing quantity', async () => {
      const csv = buildCsv(CSV_HEADERS, [['PRD-001', '', 500, '', '', '']]);
      const file = makeFile(csv);

      const result = await service.importItems(QUOTATION_ID, file, USER_ID);

      expect(result.failed).toBe(1);
      expect(result.errors[0].field).toBe('quantity');
    });
  });

  // ══════════════════════════════════════════════════════════════════════
  // Partial success
  // ══════════════════════════════════════════════════════════════════════

  describe('partial success (mixed valid/invalid rows)', () => {
    it('imports valid rows and skips invalid ones independently', async () => {
      const csv = buildCsv(CSV_HEADERS, [
        ['PRD-001',   5,  500, '', '', 'valid'],       // row 2 — OK
        ['',          3,  300, '', '', 'missing sku'], // row 3 — fail
        ['PRD-002',   2, 1200, '', '', 'valid'],       // row 4 — OK
        ['GHOST',     1,  100, '', '', 'unknown sku'], // row 5 — fail
        ['PRD-003',   4,  300, '', '', 'valid'],       // row 6 — OK
      ]);
      const file = makeFile(csv);
      itemRepo.find.mockResolvedValue([
        { lineTotal: 2950, taxAmount: 450 },
        { lineTotal: 2688, taxAmount: 288 },
        { lineTotal: 1200, taxAmount: 0   },
      ]);

      const result = await service.importItems(QUOTATION_ID, file, USER_ID);

      expect(result.added).toBe(3);
      expect(result.failed).toBe(2);
      expect(result.errors).toHaveLength(2);
      expect(result.errors.find((e) => e.row === 3)).toBeDefined();
      expect(result.errors.find((e) => e.row === 5)).toBeDefined();
    });

    it('saves only the valid items batch', async () => {
      const csv = buildCsv(CSV_HEADERS, [
        ['PRD-001', 1, 500, '', '', ''],
        ['', 5, 300, '', '', ''],           // invalid — missing sku
      ]);
      const file = makeFile(csv);
      itemRepo.find.mockResolvedValue([{ lineTotal: 590, taxAmount: 90 }]);

      await service.importItems(QUOTATION_ID, file, USER_ID);

      // Only 1 valid item should be in the save call
      const savedItems = itemRepo.save.mock.calls[0][0];
      expect(savedItems).toHaveLength(1);
      expect(savedItems[0].sku).toBe('PRD-001');
    });
  });

  // ══════════════════════════════════════════════════════════════════════
  // Row numbers in errors
  // ══════════════════════════════════════════════════════════════════════

  describe('error row numbers', () => {
    it('reports correct row numbers (1-indexed, header=1, data starts at 2)', async () => {
      const csv = buildCsv(CSV_HEADERS, [
        ['PRD-001', 1, 500, '', '', ''],   // row 2 — OK
        ['', 3, 300, '', '', ''],           // row 3 — error
        ['GHOST', 2, 100, '', '', ''],     // row 4 — error
      ]);
      const file = makeFile(csv);
      itemRepo.find.mockResolvedValue([{ lineTotal: 590, taxAmount: 90 }]);

      const result = await service.importItems(QUOTATION_ID, file, USER_ID);

      expect(result.errors.find((e) => e.row === 3)).toBeDefined();
      expect(result.errors.find((e) => e.row === 4)).toBeDefined();
    });
  });

  // ══════════════════════════════════════════════════════════════════════
  // notes field
  // ══════════════════════════════════════════════════════════════════════

  describe('notes field', () => {
    it('saves notes when provided', async () => {
      const csv = buildCsv(CSV_HEADERS, [['PRD-001', 1, 500, '', '', 'Special handling required']]);
      const file = makeFile(csv);
      itemRepo.find.mockResolvedValue([{ lineTotal: 590, taxAmount: 90 }]);

      await service.importItems(QUOTATION_ID, file, USER_ID);

      expect(itemRepo.save).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ notes: 'Special handling required' }),
        ]),
      );
    });

    it('sets notes to undefined when notes column is empty', async () => {
      const csv = buildCsv(CSV_HEADERS, [['PRD-001', 1, 500, '', '', '']]);
      const file = makeFile(csv);
      itemRepo.find.mockResolvedValue([{ lineTotal: 590, taxAmount: 90 }]);

      await service.importItems(QUOTATION_ID, file, USER_ID);

      expect(itemRepo.save).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ notes: undefined }),
        ]),
      );
    });
  });

  // ══════════════════════════════════════════════════════════════════════
  // downloadItemsTemplate()
  // ══════════════════════════════════════════════════════════════════════

  describe('downloadItemsTemplate()', () => {
    it('returns a non-empty Buffer', async () => {
      const buf = await service.downloadItemsTemplate();
      expect(buf).toBeInstanceOf(Buffer);
      expect(buf.length).toBeGreaterThan(0);
    });

    it('returns a parseable XLSX with the correct column headers', async () => {
      const buf = await service.downloadItemsTemplate();
      const wb = new ExcelJS.Workbook();
      const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
      await wb.xlsx.load(ab as ArrayBuffer);
      const ws = wb.worksheets[0];
      const headers: string[] = [];
      ws.getRow(1).eachCell((cell) => headers.push(String(cell.value).toLowerCase()));

      expect(headers).toContain('sku');
      expect(headers).toContain('quantity');
      expect(headers).toContain('unit_price');
      expect(headers).toContain('discount_type');
      expect(headers).toContain('discount_value');
      expect(headers).toContain('notes');
    });

    it('includes at least 2 sample data rows', async () => {
      const buf = await service.downloadItemsTemplate();
      const wb = new ExcelJS.Workbook();
      const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
      await wb.xlsx.load(ab as ArrayBuffer);
      const ws = wb.worksheets[0];
      // rowCount includes header row; we need at least 3 (1 header + 2 samples)
      expect(ws.rowCount).toBeGreaterThanOrEqual(3);
    });

    it('sample rows contain valid SKU-like values', async () => {
      const buf = await service.downloadItemsTemplate();
      const wb = new ExcelJS.Workbook();
      const ab = buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength);
      await wb.xlsx.load(ab as ArrayBuffer);
      const ws = wb.worksheets[0];
      const row2 = ws.getRow(2);
      // First cell of row 2 should be a SKU string
      const skuCell = String(row2.getCell(1).value ?? '');
      expect(skuCell.length).toBeGreaterThan(0);
    });
  });
});
