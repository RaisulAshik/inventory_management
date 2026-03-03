import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ProductVariant } from '../inventory/product-variant.entity';
import { Product } from '../inventory/product.entity';
import { GoodsReceivedNote } from '../purchase/goods-received-note.entity';
import { User } from '../user/user.entity';
import { ProductionOutput } from './production-output.entity';

export enum InspectionType {
  INCOMING = 'INCOMING',
  IN_PROCESS = 'IN_PROCESS',
  FINAL = 'FINAL',
  RANDOM = 'RANDOM',
}

export enum InspectionStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  PASSED = 'PASSED',
  FAILED = 'FAILED',
  CONDITIONAL = 'CONDITIONAL',
  CANCELLED = 'CANCELLED',
}

@Entity('quality_inspections')
export class QualityInspection {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'inspection_number', length: 50, unique: true })
  inspectionNumber: string;

  @Column({ name: 'inspection_date', type: 'timestamp' })
  inspectionDate: Date;

  @Column({
    name: 'inspection_type',
    type: 'enum',
    enum: InspectionType,
  })
  inspectionType: InspectionType;

  @Column({
    type: 'enum',
    enum: InspectionStatus,
    default: InspectionStatus.PENDING,
  })
  status: InspectionStatus;

  @Column({ name: 'reference_type', length: 50 })
  referenceType: string;

  @Column({ name: 'reference_id' })
  referenceId: string;

  @Column({ name: 'product_id' })
  productId: string;

  @Column({ name: 'variant_id', nullable: true })
  variantId: string;

  @Column({ name: 'grn_id', nullable: true })
  grnId: string;

  @Column({ name: 'production_output_id', nullable: true })
  productionOutputId: string;

  @Column({ name: 'batch_number', length: 100, nullable: true })
  batchNumber: string;

  @Column({
    name: 'sample_size',
    type: 'decimal',
    precision: 18,
    scale: 4,
  })
  sampleSize: number;

  @Column({
    name: 'inspected_quantity',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  inspectedQuantity: number;

  @Column({
    name: 'passed_quantity',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  passedQuantity: number;

  @Column({
    name: 'failed_quantity',
    type: 'decimal',
    precision: 18,
    scale: 4,
    default: 0,
  })
  failedQuantity: number;

  @Column({ name: 'inspection_results', type: 'json', nullable: true })
  inspectionResults: Record<string, any>[];

  @Column({ name: 'defects_found', type: 'json', nullable: true })
  defectsFound: Record<string, any>[];

  @Column({ type: 'text', nullable: true })
  remarks: string;

  @Column({ name: 'corrective_action', type: 'text', nullable: true })
  correctiveAction: string;

  @Column({ name: 'inspector_id' })
  inspectorId: string;

  @Column({ name: 'approved_by', nullable: true })
  approvedBy: string;

  @Column({ name: 'approved_at', type: 'timestamp', nullable: true })
  approvedAt: Date;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Product)
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => ProductVariant)
  @JoinColumn({ name: 'variant_id' })
  variant: ProductVariant;

  @ManyToOne(() => GoodsReceivedNote)
  @JoinColumn({ name: 'grn_id' })
  grn: GoodsReceivedNote;

  @ManyToOne(() => ProductionOutput)
  @JoinColumn({ name: 'production_output_id' })
  productionOutput: ProductionOutput;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'inspector_id' })
  inspector: User;

  // Computed
  get passRate(): number {
    return this.inspectedQuantity > 0
      ? (this.passedQuantity / this.inspectedQuantity) * 100
      : 0;
  }

  get failRate(): number {
    return this.inspectedQuantity > 0
      ? (this.failedQuantity / this.inspectedQuantity) * 100
      : 0;
  }
}
