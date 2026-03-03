import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { ImportTemplateColumn } from './import-template-column.entity';

export enum ImportEntityType {
  PRODUCTS = 'PRODUCTS',
  CUSTOMERS = 'CUSTOMERS',
  SUPPLIERS = 'SUPPLIERS',
  INVENTORY_STOCK = 'INVENTORY_STOCK',
  PRICE_LIST = 'PRICE_LIST',
  SALES_ORDERS = 'SALES_ORDERS',
  PURCHASE_ORDERS = 'PURCHASE_ORDERS',
  CHART_OF_ACCOUNTS = 'CHART_OF_ACCOUNTS',
  JOURNAL_ENTRIES = 'JOURNAL_ENTRIES',
  OPENING_BALANCES = 'OPENING_BALANCES',
  CATEGORIES = 'CATEGORIES',
  BRANDS = 'BRANDS',
  WAREHOUSES = 'WAREHOUSES',
  LOCATIONS = 'LOCATIONS',
}

@Entity('import_templates')
export class ImportTemplate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'template_code', length: 50, unique: true })
  templateCode: string;

  @Column({ name: 'template_name', length: 200 })
  templateName: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    name: 'entity_type',
    type: 'enum',
    enum: ImportEntityType,
  })
  entityType: ImportEntityType;

  @Column({
    name: 'file_format',
    type: 'enum',
    enum: ['XLSX', 'CSV', 'TSV'],
    default: 'XLSX',
  })
  fileFormat: 'XLSX' | 'CSV' | 'TSV';

  @Column({ name: 'has_header_row', type: 'tinyint', default: 1 })
  hasHeaderRow: boolean;

  @Column({ name: 'header_row_number', type: 'int', default: 1 })
  headerRowNumber: number;

  @Column({ name: 'data_start_row', type: 'int', default: 2 })
  dataStartRow: number;

  @Column({ name: 'sheet_name', length: 100, nullable: true })
  sheetName: string;

  @Column({ name: 'date_format', length: 50, default: 'YYYY-MM-DD' })
  dateFormat: string;

  @Column({ name: 'number_format', length: 50, nullable: true })
  numberFormat: string;

  @Column({ name: 'delimiter', length: 10, nullable: true })
  delimiter: string;

  @Column({ name: 'text_qualifier', length: 10, nullable: true })
  textQualifier: string;

  @Column({ name: 'encoding', length: 50, default: 'UTF-8' })
  encoding: string;

  @Column({ name: 'sample_file_url', length: 500, nullable: true })
  sampleFileUrl: string;

  @Column({ name: 'is_system', type: 'tinyint', default: 0 })
  isSystem: boolean;

  @Column({ name: 'is_active', type: 'tinyint', default: 1 })
  isActive: boolean;

  @Column({ name: 'created_by', nullable: true })
  createdBy: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @OneToMany(() => ImportTemplateColumn, (column) => column.template)
  columns: ImportTemplateColumn[];
}
