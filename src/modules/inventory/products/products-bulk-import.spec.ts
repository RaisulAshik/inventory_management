import { Test, TestingModule } from '@nestjs/testing';
import * as ExcelJS from 'exceljs';
import { ProductsService } from './products.service';
import { TenantConnectionManager } from '@database/tenant-connection.manager';

// ── Helpers ────────────────────────────────────────────────────────────────

/** Build a minimal multer File object from a string or buffer */
function makeFile(
  content: Buffer | string,
  mimetype: string,
  originalname = 'test.csv',
): Express.Multer.File {
  const buffer = typeof content === 'string' ? Buffer.from(content) : content;
  return {
    buffer,
    mimetype,
    originalname,
    fieldname: 'file',
    encoding: '7bit',
    size: buffer.length,
    stream: null as any,
    destination: '',
    filename: '',
    path: '',
  };
}

/** Build CSV string from header array + data rows */
function buildCsv(headers: string[], rows: string[][]): string {
  const lines = [headers.join(',')];
  for (const row of rows) lines.push(row.join(','));
  return lines.join('\n');
}

/** Build an XLSX buffer in-memory using exceljs */
async function buildXlsx(
  headers: string[],
  rows: string[][],
): Promise<Buffer> {
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('Products');
  ws.addRow(headers);
  for (const row of rows) ws.addRow(row);
  const ab = await wb.xlsx.writeBuffer();
  return Buffer.from(ab as ArrayBuffer);
}

// ── Mock Factories ─────────────────────────────────────────────────────────

const makeProductRepo = (overrides: Partial<any> = {}) => ({
  find: jest.fn().mockResolvedValue([]),
  findOne: jest.fn().mockResolvedValue(null),
  create: jest.fn().mockImplementation((obj) => obj),
  save: jest.fn().mockImplementation((obj) => Promise.resolve({ id: 'prod-uuid-1', ...obj })),
  update: jest.fn().mockResolvedValue({ affected: 1 }),
  createQueryBuilder: jest.fn().mockReturnValue({
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockReturnThis(),
    skip: jest.fn().mockReturnThis(),
    take: jest.fn().mockReturnThis(),
    getManyAndCount: jest.fn().mockResolvedValue([[], 0]),
    getOne: jest.fn().mockResolvedValue(null),
    getCount: jest.fn().mockResolvedValue(0),
  }),
  ...overrides,
});

const makeVariantRepo = (overrides: Partial<any> = {}) => ({
  findOne: jest.fn().mockResolvedValue(null),
  create: jest.fn().mockImplementation((obj) => obj),
  save: jest.fn().mockImplementation((obj) => Promise.resolve({ id: 'var-uuid-1', ...obj })),
  update: jest.fn().mockResolvedValue({ affected: 1 }),
  ...overrides,
});

/** Minimal UOM/Category/Brand/TaxCategory repo that returns empty by default */
const makeLookupRepo = (items: any[] = []) => ({
  find: jest.fn().mockResolvedValue(items),
});

const makeDataSource = (overrides: Partial<any> = {}) => ({
  getRepository: jest.fn().mockImplementation(() => makeLookupRepo()),
  createQueryRunner: jest.fn(),
  ...overrides,
});

const makeTenantManager = (productRepo: any, dataSource: any) => ({
  getRepository: jest.fn().mockResolvedValue(productRepo),
  getDataSource: jest.fn().mockResolvedValue(dataSource),
  getTenantId: jest.fn().mockReturnValue('tenant-1'),
  getTenantDatabase: jest.fn().mockReturnValue('db_tenant_1'),
});

// ── Mock sequence util ─────────────────────────────────────────────────────

jest.mock('@common/utils/sequence.util', () => ({
  getNextSequence: jest.fn().mockResolvedValue('PRD-AUTO-001'),
}));

// ── Test Suite ─────────────────────────────────────────────────────────────

describe('ProductsService – Bulk Import', () => {
  let service: ProductsService;
  let productRepo: ReturnType<typeof makeProductRepo>;
  let dataSource: ReturnType<typeof makeDataSource>;
  let tenantManager: ReturnType<typeof makeTenantManager>;

  const USER_ID = 'user-uuid-1';

  // Standard CSV headers used in all tests
  const CSV_HEADERS = [
    'sku', 'product_name', 'uom', 'category', 'brand',
    'cost_price', 'selling_price', 'mrp',
    'is_stockable', 'is_sellable', 'is_purchasable',
    'track_batch', 'track_serial',
    'variant_sku', 'variant_name', 'variant_selling_price',
  ];

  beforeEach(async () => {
    productRepo = makeProductRepo();
    dataSource = makeDataSource();
    tenantManager = makeTenantManager(productRepo, dataSource);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: TenantConnectionManager,
          useValue: tenantManager,
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  afterEach(() => jest.clearAllMocks());

  // ── Helper accessor for private methods ────────────────────────────────
  const svc = () => service as any;

  // ══════════════════════════════════════════════════════════════════════
  // 1. Type helpers
  // ══════════════════════════════════════════════════════════════════════

  describe('toDecimal()', () => {
    it('returns undefined for empty string', () => {
      expect(svc().toDecimal('')).toBeUndefined();
      expect(svc().toDecimal(undefined)).toBeUndefined();
      expect(svc().toDecimal('  ')).toBeUndefined();
    });

    it('parses valid numbers', () => {
      expect(svc().toDecimal('100')).toBe(100);
      expect(svc().toDecimal('99.99')).toBe(99.99);
      expect(svc().toDecimal(' 0.5 ')).toBe(0.5);
    });

    it('returns undefined for non-numeric strings', () => {
      expect(svc().toDecimal('abc')).toBeUndefined();
      expect(svc().toDecimal('--')).toBeUndefined();
    });
  });

  describe('toBool()', () => {
    it('returns defaultVal when value is empty', () => {
      expect(svc().toBool('', true)).toBe(true);
      expect(svc().toBool(undefined, false)).toBe(false);
    });

    it('recognises truthy strings', () => {
      expect(svc().toBool('true', false)).toBe(true);
      expect(svc().toBool('1', false)).toBe(true);
      expect(svc().toBool('yes', false)).toBe(true);
      expect(svc().toBool('TRUE', false)).toBe(true);
      expect(svc().toBool('YES', false)).toBe(true);
    });

    it('treats any other value as false', () => {
      expect(svc().toBool('false', true)).toBe(false);
      expect(svc().toBool('0', true)).toBe(false);
      expect(svc().toBool('no', true)).toBe(false);
    });
  });

  // ══════════════════════════════════════════════════════════════════════
  // 2. Row grouping
  // ══════════════════════════════════════════════════════════════════════

  describe('groupImportRows()', () => {
    it('groups a single product with no variants into one group', () => {
      const rows = [
        { sku: 'PRD-001', product_name: 'Widget', __rowIndex: '2' },
      ];
      const groups: Map<string, any> = svc().groupImportRows(rows);
      expect(groups.size).toBe(1);
      expect(groups.has('PRD-001')).toBe(true);
      expect(groups.get('PRD-001').allRows).toHaveLength(1);
    });

    it('groups multiple rows with the same SKU into one product group', () => {
      const rows = [
        { sku: 'PRD-001', product_name: 'T-Shirt', uom: 'PCS', __rowIndex: '2', variant_name: 'Small' },
        { sku: 'PRD-001', product_name: '', __rowIndex: '3', variant_name: 'Medium' },
        { sku: 'PRD-001', product_name: '', __rowIndex: '4', variant_name: 'Large' },
      ];
      const groups: Map<string, any> = svc().groupImportRows(rows);
      expect(groups.size).toBe(1);
      expect(groups.get('PRD-001').allRows).toHaveLength(3);
      expect(groups.get('PRD-001').firstRow.product_name).toBe('T-Shirt');
    });

    it('creates separate groups for different SKUs', () => {
      const rows = [
        { sku: 'PRD-001', product_name: 'Product A', __rowIndex: '2' },
        { sku: 'PRD-002', product_name: 'Product B', __rowIndex: '3' },
      ];
      const groups: Map<string, any> = svc().groupImportRows(rows);
      expect(groups.size).toBe(2);
    });

    it('assigns auto-key when no SKU but product_name is present', () => {
      const rows = [
        { sku: '', product_name: 'Widget', __rowIndex: '2' },
        { sku: '', product_name: 'Gadget', __rowIndex: '3' },
      ];
      const groups: Map<string, any> = svc().groupImportRows(rows);
      expect(groups.size).toBe(2);
    });

    it('attaches continuation rows (no sku, no product_name) to last group', () => {
      const rows = [
        { sku: 'PRD-001', product_name: 'T-Shirt', __rowIndex: '2', variant_name: 'Small' },
        // Continuation row — no sku, no product_name
        { sku: '', product_name: '', __rowIndex: '3', variant_name: 'Medium' },
      ];
      const groups: Map<string, any> = svc().groupImportRows(rows);
      expect(groups.size).toBe(1);
      expect(groups.get('PRD-001').allRows).toHaveLength(2);
    });

    it('skips rows before any key is established', () => {
      const rows = [
        // Row with neither sku nor product_name at the start — should be skipped
        { sku: '', product_name: '', __rowIndex: '2', variant_name: 'Orphan' },
        { sku: 'PRD-001', product_name: 'Widget', __rowIndex: '3' },
      ];
      const groups: Map<string, any> = svc().groupImportRows(rows);
      expect(groups.size).toBe(1);
    });
  });

  // ══════════════════════════════════════════════════════════════════════
  // 3. CSV parsing
  // ══════════════════════════════════════════════════════════════════════

  describe('parseCsv()', () => {
    it('parses a valid CSV buffer into row objects', async () => {
      const csv = buildCsv(
        ['sku', 'product_name', 'uom'],
        [['PRD-001', 'Widget', 'PCS'], ['PRD-002', 'Gadget', 'KG']],
      );
      const rows: Record<string, string>[] = await svc().parseCsv(Buffer.from(csv));
      expect(rows).toHaveLength(2);
      expect(rows[0].sku).toBe('PRD-001');
      expect(rows[0].product_name).toBe('Widget');
      expect(rows[0].__rowIndex).toBe('2');
      expect(rows[1].__rowIndex).toBe('3');
    });

    it('returns empty array for CSV with header only', async () => {
      const csv = 'sku,product_name,uom\n';
      const rows = await svc().parseCsv(Buffer.from(csv));
      expect(rows).toHaveLength(0);
    });

    it('trims whitespace from values', async () => {
      const csv = buildCsv(['sku', 'product_name'], [['  PRD-001  ', '  Widget  ']]);
      const rows = await svc().parseCsv(Buffer.from(csv));
      expect(rows[0].sku).toBe('PRD-001');
      expect(rows[0].product_name).toBe('Widget');
    });
  });

  // ══════════════════════════════════════════════════════════════════════
  // 4. XLSX parsing
  // ══════════════════════════════════════════════════════════════════════

  describe('parseXlsx()', () => {
    it('parses a valid XLSX buffer into row objects', async () => {
      const buffer = await buildXlsx(
        ['sku', 'product_name', 'uom'],
        [['PRD-001', 'Widget', 'PCS'], ['PRD-002', 'Gadget', 'KG']],
      );
      const rows: Record<string, string>[] = await svc().parseXlsx(buffer);
      expect(rows).toHaveLength(2);
      expect(rows[0].sku).toBe('PRD-001');
      expect(rows[0].product_name).toBe('Widget');
      expect(rows[0].__rowIndex).toBe('2');
    });

    it('returns empty array for XLSX with header only', async () => {
      const buffer = await buildXlsx(['sku', 'product_name', 'uom'], []);
      const rows = await svc().parseXlsx(buffer);
      expect(rows).toHaveLength(0);
    });

    it('lowercases column headers', async () => {
      const buffer = await buildXlsx(
        ['SKU', 'Product_Name', 'UOM'],
        [['PRD-001', 'Widget', 'PCS']],
      );
      const rows = await svc().parseXlsx(buffer);
      expect(rows[0]).toHaveProperty('sku');
      expect(rows[0]).toHaveProperty('product_name');
      expect(rows[0]).toHaveProperty('uom');
    });
  });

  // ══════════════════════════════════════════════════════════════════════
  // 5. bulkImport() — top-level orchestration
  // ══════════════════════════════════════════════════════════════════════

  describe('bulkImport()', () => {
    it('returns zero counts for an empty CSV file', async () => {
      const file = makeFile('sku,product_name,uom\n', 'text/csv');
      const result = await service.bulkImport(file, 'UPSERT', USER_ID);
      expect(result).toEqual({ total: 0, success: 0, failed: 0, errors: [] });
    });

    it('succeeds for a valid CSV with one new product (no existing SKU)', async () => {
      // UOM map returns pcs
      dataSource.getRepository.mockImplementation((Entity: any) => {
        const name = Entity?.name ?? '';
        if (name === 'UnitOfMeasure') {
          return makeLookupRepo([{ id: 'uom-uuid-1', uomName: 'Pieces', symbol: 'PCS', uomCode: 'PCS' }]);
        }
        return makeLookupRepo();
      });

      const csv = buildCsv(
        CSV_HEADERS,
        [['PRD-001', 'Widget A', 'PCS', '', '', '50', '100', '120', 'true', 'true', 'true', 'false', 'false', '', '', '']],
      );
      const file = makeFile(csv, 'text/csv');
      const result = await service.bulkImport(file, 'INSERT', USER_ID);

      expect(result.total).toBe(1);
      expect(result.success).toBe(1);
      expect(result.failed).toBe(0);
      expect(result.errors).toHaveLength(0);
      expect(productRepo.save).toHaveBeenCalledTimes(1);
    });

    it('succeeds for a valid XLSX file with one new product', async () => {
      dataSource.getRepository.mockImplementation((Entity: any) => {
        const name = Entity?.name ?? '';
        if (name === 'UnitOfMeasure') {
          return makeLookupRepo([{ id: 'uom-uuid-1', uomName: 'Kg', symbol: 'KG', uomCode: 'KG' }]);
        }
        return makeLookupRepo();
      });

      const buffer = await buildXlsx(
        ['sku', 'product_name', 'uom', 'cost_price', 'selling_price'],
        [['PRD-XLSX-001', 'XLSX Product', 'KG', '10', '20']],
      );
      const file = makeFile(buffer, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'products.xlsx');
      const result = await service.bulkImport(file, 'UPSERT', USER_ID);

      expect(result.total).toBe(1);
      expect(result.success).toBe(1);
      expect(result.failed).toBe(0);
    });

    it('processes multiple products in one CSV', async () => {
      dataSource.getRepository.mockImplementation((Entity: any) => {
        const name = Entity?.name ?? '';
        if (name === 'UnitOfMeasure') {
          return makeLookupRepo([{ id: 'uom-1', uomName: 'Pieces', symbol: 'PCS', uomCode: 'PCS' }]);
        }
        return makeLookupRepo();
      });

      const csv = buildCsv(
        ['sku', 'product_name', 'uom'],
        [
          ['PRD-001', 'Product One', 'PCS'],
          ['PRD-002', 'Product Two', 'PCS'],
          ['PRD-003', 'Product Three', 'PCS'],
        ],
      );
      const file = makeFile(csv, 'text/csv');
      const result = await service.bulkImport(file, 'INSERT', USER_ID);

      expect(result.total).toBe(3);
      expect(result.success).toBe(3);
      expect(result.failed).toBe(0);
    });
  });

  // ══════════════════════════════════════════════════════════════════════
  // 6. Validation errors
  // ══════════════════════════════════════════════════════════════════════

  describe('bulkImport() – validation', () => {
    it('reports error for row with missing product_name', async () => {
      dataSource.getRepository.mockImplementation((Entity: any) => {
        const name = Entity?.name ?? '';
        if (name === 'UnitOfMeasure') {
          return makeLookupRepo([{ id: 'uom-1', uomName: 'Pieces', symbol: 'PCS', uomCode: 'PCS' }]);
        }
        return makeLookupRepo();
      });

      const csv = buildCsv(
        ['sku', 'product_name', 'uom'],
        [
          ['PRD-BAD', '', 'PCS'],      // ← missing product_name
          ['PRD-GOOD', 'Widget', 'PCS'],
        ],
      );
      const file = makeFile(csv, 'text/csv');
      const result = await service.bulkImport(file, 'INSERT', USER_ID);

      expect(result.total).toBe(2);
      expect(result.failed).toBe(1);
      expect(result.success).toBe(1);
      const err = result.errors.find((e) => e.field === 'product_name');
      expect(err).toBeDefined();
      expect(err!.row).toBe(2);
    });

    it('reports error for row with missing uom', async () => {
      const csv = buildCsv(
        ['sku', 'product_name', 'uom'],
        [['PRD-001', 'Widget', '']],
      );
      const file = makeFile(csv, 'text/csv');
      const result = await service.bulkImport(file, 'UPSERT', USER_ID);

      expect(result.failed).toBe(1);
      const err = result.errors.find((e) => e.field === 'uom' && !e.message.includes('not found'));
      expect(err).toBeDefined();
    });

    it('reports error for row with unknown uom name', async () => {
      // UOM map is empty — no UOMs in the DB
      dataSource.getRepository.mockImplementation(() => makeLookupRepo([]));

      const csv = buildCsv(
        ['sku', 'product_name', 'uom'],
        [['PRD-001', 'Widget', 'UNKNOWN_UOM']],
      );
      const file = makeFile(csv, 'text/csv');
      const result = await service.bulkImport(file, 'UPSERT', USER_ID);

      expect(result.failed).toBe(1);
      const err = result.errors.find((e) => e.field === 'uom' && e.message.includes('not found'));
      expect(err).toBeDefined();
      expect(err!.message).toContain('UNKNOWN_UOM');
    });

    it('reports non-fatal warning when category name is unknown but continues', async () => {
      dataSource.getRepository.mockImplementation((Entity: any) => {
        const name = Entity?.name ?? '';
        if (name === 'UnitOfMeasure') {
          return makeLookupRepo([{ id: 'uom-1', uomName: 'Pieces', symbol: 'PCS', uomCode: 'PCS' }]);
        }
        return makeLookupRepo([]); // empty category/brand maps
      });

      const csv = buildCsv(
        ['sku', 'product_name', 'uom', 'category'],
        [['PRD-001', 'Widget', 'PCS', 'NonExistentCategory']],
      );
      const file = makeFile(csv, 'text/csv');
      const result = await service.bulkImport(file, 'UPSERT', USER_ID);

      // Product still created (category warning is non-fatal)
      expect(result.success).toBe(1);
      const warn = result.errors.find((e) => e.field === 'category');
      expect(warn).toBeDefined();
      expect(warn!.message).toContain('NonExistentCategory');
    });
  });

  // ══════════════════════════════════════════════════════════════════════
  // 7. INSERT vs UPSERT mode
  // ══════════════════════════════════════════════════════════════════════

  describe('bulkImport() – INSERT mode', () => {
    it('rejects a row whose SKU already exists in INSERT mode', async () => {
      dataSource.getRepository.mockImplementation((Entity: any) => {
        const name = Entity?.name ?? '';
        if (name === 'UnitOfMeasure') {
          return makeLookupRepo([{ id: 'uom-1', uomName: 'Pieces', symbol: 'PCS', uomCode: 'PCS' }]);
        }
        return makeLookupRepo();
      });
      // Simulate existing SKU in DB
      productRepo.find.mockResolvedValue([{ id: 'existing-prod', sku: 'PRD-001' }]);

      const csv = buildCsv(
        ['sku', 'product_name', 'uom'],
        [['PRD-001', 'Widget', 'PCS']],
      );
      const file = makeFile(csv, 'text/csv');
      const result = await service.bulkImport(file, 'INSERT', USER_ID);

      expect(result.failed).toBe(1);
      const err = result.errors.find((e) => e.field === 'sku');
      expect(err).toBeDefined();
      expect(err!.message).toContain('already exists');
      expect(productRepo.save).not.toHaveBeenCalled();
    });
  });

  describe('bulkImport() – UPSERT mode', () => {
    it('calls productRepo.update for an existing SKU in UPSERT mode', async () => {
      dataSource.getRepository.mockImplementation((Entity: any) => {
        const name = Entity?.name ?? '';
        if (name === 'UnitOfMeasure') {
          return makeLookupRepo([{ id: 'uom-1', uomName: 'Pieces', symbol: 'PCS', uomCode: 'PCS' }]);
        }
        return makeLookupRepo();
      });
      productRepo.find.mockResolvedValue([{ id: 'existing-prod', sku: 'PRD-001' }]);

      const csv = buildCsv(
        ['sku', 'product_name', 'uom', 'selling_price'],
        [['PRD-001', 'Widget Updated', 'PCS', '200']],
      );
      const file = makeFile(csv, 'text/csv');
      const result = await service.bulkImport(file, 'UPSERT', USER_ID);

      expect(result.success).toBe(1);
      expect(result.failed).toBe(0);
      expect(productRepo.update).toHaveBeenCalledWith('existing-prod', expect.objectContaining({
        productName: 'Widget Updated',
        sellingPrice: 200,
      }));
      expect(productRepo.save).not.toHaveBeenCalled();
    });

    it('inserts a new product when SKU does not exist in UPSERT mode', async () => {
      dataSource.getRepository.mockImplementation((Entity: any) => {
        const name = Entity?.name ?? '';
        if (name === 'UnitOfMeasure') {
          return makeLookupRepo([{ id: 'uom-1', uomName: 'Pieces', symbol: 'PCS', uomCode: 'PCS' }]);
        }
        return makeLookupRepo();
      });
      productRepo.find.mockResolvedValue([]); // no existing products

      const csv = buildCsv(
        ['sku', 'product_name', 'uom'],
        [['PRD-NEW', 'Brand New Product', 'PCS']],
      );
      const file = makeFile(csv, 'text/csv');
      const result = await service.bulkImport(file, 'UPSERT', USER_ID);

      expect(result.success).toBe(1);
      expect(productRepo.save).toHaveBeenCalledWith(expect.objectContaining({
        sku: 'PRD-NEW',
        productName: 'Brand New Product',
      }));
    });
  });

  // ══════════════════════════════════════════════════════════════════════
  // 8. SKU auto-generation
  // ══════════════════════════════════════════════════════════════════════

  describe('bulkImport() – auto SKU generation', () => {
    it('auto-generates SKU when sku column is empty', async () => {
      dataSource.getRepository.mockImplementation((Entity: any) => {
        const name = Entity?.name ?? '';
        if (name === 'UnitOfMeasure') {
          return makeLookupRepo([{ id: 'uom-1', uomName: 'Pieces', symbol: 'PCS', uomCode: 'PCS' }]);
        }
        return makeLookupRepo();
      });

      const csv = buildCsv(
        ['sku', 'product_name', 'uom'],
        [['', 'Auto SKU Product', 'PCS']],
      );
      const file = makeFile(csv, 'text/csv');
      const result = await service.bulkImport(file, 'UPSERT', USER_ID);

      expect(result.success).toBe(1);
      expect(productRepo.save).toHaveBeenCalledWith(expect.objectContaining({
        sku: 'PRD-AUTO-001',
      }));
    });
  });

  // ══════════════════════════════════════════════════════════════════════
  // 9. Variants
  // ══════════════════════════════════════════════════════════════════════

  describe('bulkImport() – variants', () => {
    let variantRepo: ReturnType<typeof makeVariantRepo>;

    beforeEach(() => {
      variantRepo = makeVariantRepo();
      dataSource.getRepository.mockImplementation((Entity: any) => {
        const name = Entity?.name ?? '';
        if (name === 'UnitOfMeasure') {
          return makeLookupRepo([{ id: 'uom-1', uomName: 'Pieces', symbol: 'PCS', uomCode: 'PCS' }]);
        }
        if (name === 'ProductVariant') return variantRepo;
        return makeLookupRepo();
      });
    });

    it('creates variants for rows with variant_name', async () => {
      const csv = buildCsv(
        ['sku', 'product_name', 'uom', 'variant_sku', 'variant_name', 'variant_selling_price'],
        [
          ['PRD-001', 'T-Shirt', 'PCS', 'VAR-S', 'Small', '250'],
          ['PRD-001', '', '', 'VAR-M', 'Medium', '260'],
          ['PRD-001', '', '', 'VAR-L', 'Large', '270'],
        ],
      );
      const file = makeFile(csv, 'text/csv');
      const result = await service.bulkImport(file, 'INSERT', USER_ID);

      expect(result.total).toBe(1);     // 1 product group
      expect(result.success).toBe(1);
      expect(variantRepo.save).toHaveBeenCalledTimes(3); // 3 variants
      expect(variantRepo.save).toHaveBeenCalledWith(expect.objectContaining({ variantName: 'Small' }));
      expect(variantRepo.save).toHaveBeenCalledWith(expect.objectContaining({ variantName: 'Medium' }));
      expect(variantRepo.save).toHaveBeenCalledWith(expect.objectContaining({ variantName: 'Large' }));
    });

    it('updates existing variant in UPSERT mode (same productId + variantName)', async () => {
      productRepo.find.mockResolvedValue([{ id: 'prod-existing', sku: 'PRD-001' }]);
      variantRepo.findOne.mockResolvedValue({ id: 'var-existing', variantName: 'Small' });

      const csv = buildCsv(
        ['sku', 'product_name', 'uom', 'variant_sku', 'variant_name', 'variant_selling_price'],
        [['PRD-001', 'T-Shirt', 'PCS', 'VAR-S', 'Small', '300']],
      );
      const file = makeFile(csv, 'text/csv');
      await service.bulkImport(file, 'UPSERT', USER_ID);

      expect(variantRepo.update).toHaveBeenCalledWith('var-existing', expect.objectContaining({
        sellingPrice: 300,
      }));
      expect(variantRepo.save).not.toHaveBeenCalled();
    });

    it('does not call variantRepo when no variant_name is present', async () => {
      const csv = buildCsv(
        ['sku', 'product_name', 'uom', 'variant_name'],
        [['PRD-001', 'Plain Product', 'PCS', '']],
      );
      const file = makeFile(csv, 'text/csv');
      await service.bulkImport(file, 'INSERT', USER_ID);

      expect(variantRepo.save).not.toHaveBeenCalled();
    });
  });

  // ══════════════════════════════════════════════════════════════════════
  // 10. Mixed success and failure
  // ══════════════════════════════════════════════════════════════════════

  describe('bulkImport() – partial success', () => {
    it('imports valid rows and reports errors for invalid rows independently', async () => {
      dataSource.getRepository.mockImplementation((Entity: any) => {
        const name = Entity?.name ?? '';
        if (name === 'UnitOfMeasure') {
          return makeLookupRepo([{ id: 'uom-1', uomName: 'Pieces', symbol: 'PCS', uomCode: 'PCS' }]);
        }
        return makeLookupRepo();
      });

      const csv = buildCsv(
        ['sku', 'product_name', 'uom'],
        [
          ['PRD-OK1', 'Good Product 1', 'PCS'],
          ['PRD-BAD', '',              'PCS'],   // missing product_name
          ['PRD-OK2', 'Good Product 2', 'PCS'],
          ['PRD-UOM', 'Bad UOM',        'XXX'],  // unknown UOM
          ['PRD-OK3', 'Good Product 3', 'PCS'],
        ],
      );
      const file = makeFile(csv, 'text/csv');
      const result = await service.bulkImport(file, 'INSERT', USER_ID);

      expect(result.total).toBe(5);
      expect(result.success).toBe(3);
      expect(result.failed).toBe(2);

      const productNameErr = result.errors.find((e) => e.field === 'product_name');
      expect(productNameErr).toBeDefined();

      const uomErr = result.errors.find((e) => e.field === 'uom' && e.message.includes('not found'));
      expect(uomErr).toBeDefined();
    });
  });

  // ══════════════════════════════════════════════════════════════════════
  // 11. downloadTemplate()
  // ══════════════════════════════════════════════════════════════════════

  describe('downloadTemplate()', () => {
    it('returns a non-empty Buffer', async () => {
      const buf = await service.downloadTemplate();
      expect(buf).toBeInstanceOf(Buffer);
      expect(buf.length).toBeGreaterThan(0);
    });

    it('returns a parseable XLSX with the correct headers', async () => {
      const buf = await service.downloadTemplate();
      const wb = new ExcelJS.Workbook();
      await wb.xlsx.load(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer);
      const ws = wb.worksheets[0];
      const headerRow = ws.getRow(1);
      const headers: string[] = [];
      headerRow.eachCell((cell) => headers.push(String(cell.value).toLowerCase()));

      expect(headers).toContain('product_name');
      expect(headers).toContain('sku');
      expect(headers).toContain('uom');
      expect(headers).toContain('cost_price');
      expect(headers).toContain('selling_price');
    });

    it('includes at least 2 sample data rows', async () => {
      const buf = await service.downloadTemplate();
      const wb = new ExcelJS.Workbook();
      await wb.xlsx.load(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength) as ArrayBuffer);
      const ws = wb.worksheets[0];
      // Row 1 = headers, rows 2+ = sample data
      expect(ws.rowCount).toBeGreaterThanOrEqual(3);
    });
  });
});
