import { ProductVariant } from '../inventory/product-variant.entity';
import { Product } from '../inventory/product.entity';
import { GoodsReceivedNote } from '../purchase/goods-received-note.entity';
import { User } from '../user/user.entity';
import { ProductionOutput } from './production-output.entity';
export declare enum InspectionType {
    INCOMING = "INCOMING",
    IN_PROCESS = "IN_PROCESS",
    FINAL = "FINAL",
    RANDOM = "RANDOM"
}
export declare enum InspectionStatus {
    PENDING = "PENDING",
    IN_PROGRESS = "IN_PROGRESS",
    PASSED = "PASSED",
    FAILED = "FAILED",
    CONDITIONAL = "CONDITIONAL",
    CANCELLED = "CANCELLED"
}
export declare class QualityInspection {
    id: string;
    inspectionNumber: string;
    inspectionDate: Date;
    inspectionType: InspectionType;
    status: InspectionStatus;
    referenceType: string;
    referenceId: string;
    productId: string;
    variantId: string;
    grnId: string;
    productionOutputId: string;
    batchNumber: string;
    sampleSize: number;
    inspectedQuantity: number;
    passedQuantity: number;
    failedQuantity: number;
    inspectionResults: Record<string, any>[];
    defectsFound: Record<string, any>[];
    remarks: string;
    correctiveAction: string;
    inspectorId: string;
    approvedBy: string;
    approvedAt: Date;
    createdAt: Date;
    updatedAt: Date;
    product: Product;
    variant: ProductVariant;
    grn: GoodsReceivedNote;
    productionOutput: ProductionOutput;
    inspector: User;
    get passRate(): number;
    get failRate(): number;
}
