export class ImportRowError {
  row: number;
  field: string;
  message: string;
}

export class BulkImportResultDto {
  total: number;
  success: number;
  failed: number;
  errors: ImportRowError[];
}

export type ImportMode = 'INSERT' | 'UPSERT';
