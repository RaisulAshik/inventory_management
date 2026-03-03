import { Warehouse } from './warehouse.entity';
import { StockAdjustmentItem } from './stock-adjustment-item.entity';
export declare enum AdjustmentType {
    INCREASE = "INCREASE",
    DECREASE = "DECREASE",
    WRITE_OFF = "WRITE_OFF",
    OPENING_STOCK = "OPENING_STOCK",
    CYCLE_COUNT = "CYCLE_COUNT",
    DAMAGE = "DAMAGE",
    EXPIRY = "EXPIRY",
    THEFT = "THEFT",
    OTHER = "OTHER"
}
export declare enum AdjustmentStatus {
    DRAFT = "DRAFT",
    PENDING_APPROVAL = "PENDING_APPROVAL",
    APPROVED = "APPROVED",
    REJECTED = "REJECTED",
    CANCELLED = "CANCELLED"
}
export declare class StockAdjustment {
    id: string;
    adjustmentNumber: string;
    adjustmentDate: Date;
    warehouseId: string;
    adjustmentType: AdjustmentType;
    status: AdjustmentStatus;
    reason: string;
    referenceNumber: string;
    totalValueImpact: number;
    notes: string;
    approvedBy: string;
    approvedAt: Date;
    rejectionReason: string;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
    warehouse: Warehouse;
    items: StockAdjustmentItem[];
    get itemCount(): number;
}
