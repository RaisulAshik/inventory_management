import { ApiProperty } from '@nestjs/swagger';

/**
 * Expected Excel / CSV columns for PO line item bulk upload.
 *
 * Column headers (case-insensitive, underscores/spaces interchangeable):
 *   product_sku      — Required. The product SKU.
 *   variant_sku      — Optional. The variant SKU (leave blank if no variant).
 *   quantity         — Required. Quantity to order (> 0).
 *   unit_price       — Optional. Override unit price; defaults to product cost price.
 *   uom_code         — Optional. Unit-of-measure code; defaults to product base UOM.
 *   discount_percent — Optional. Discount percentage (0–100); default 0.
 *   notes            — Optional. Line item notes.
 */

export interface BulkItemRow {
  rowNumber: number;
  productSku: string;
  variantSku?: string;
  quantity: number;
  unitPrice?: number;
  uomCode?: string;
  discountPercent?: number;
  notes?: string;
}

export interface BulkRowError {
  row: number;
  productSku: string;
  error: string;
}

export interface BulkUploadResult {
  total: number;
  succeeded: number;
  failed: number;
  errors: BulkRowError[];
}

export class BulkUploadFileDto {
  @ApiProperty({
    type: 'string',
    format: 'binary',
    description:
      'Excel (.xlsx) or CSV (.csv) file. ' +
      'Required columns: product_sku, quantity. ' +
      'Optional: variant_sku, unit_price, uom_code, discount_percent, notes.',
  })
  file: Express.Multer.File;
}

// ── Bulk validate (pre-creation SKU check) ───────────────────────────────────

export interface BulkValidateItemInput {
  product_sku: string;
  variant_sku?: string;
  quantity?: number;
  unit_price?: number;
  uom_code?: string;
  discount_percent?: number;
  notes?: string;
}

export interface BulkValidateItemResult {
  product_sku: string;
  status: 'found' | 'not_found';
  productId?: string;
  productName?: string;
  resolvedUnitPrice?: number;
  uomId?: string | null;
  uomName?: string | null;
  statusMsg?: string;
}

export interface BulkValidateResponse {
  items: BulkValidateItemResult[];
}
