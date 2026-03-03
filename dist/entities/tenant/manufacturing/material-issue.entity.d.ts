import { WorkOrder } from './work-order.entity';
import { Warehouse } from '../warehouse/warehouse.entity';
import { User } from '../user/user.entity';
import { MaterialIssueItem } from './material-issue-item.entity';
export declare enum MaterialIssueStatus {
    DRAFT = "DRAFT",
    PENDING_APPROVAL = "PENDING_APPROVAL",
    APPROVED = "APPROVED",
    ISSUED = "ISSUED",
    PARTIALLY_RETURNED = "PARTIALLY_RETURNED",
    RETURNED = "RETURNED",
    CANCELLED = "CANCELLED"
}
export declare enum MaterialIssueType {
    PRODUCTION = "PRODUCTION",
    REWORK = "REWORK",
    SAMPLE = "SAMPLE",
    REPLACEMENT = "REPLACEMENT",
    OTHER = "OTHER"
}
export declare class MaterialIssue {
    id: string;
    issueNumber: string;
    issueDate: Date;
    workOrderId: string;
    warehouseId: string;
    issueType: MaterialIssueType;
    status: MaterialIssueStatus;
    totalValue: number;
    reason: string;
    notes: string;
    issuedBy: string;
    issuedAt: Date;
    approvedBy: string;
    approvedAt: Date;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
    workOrder: WorkOrder;
    warehouse: Warehouse;
    issuedByUser: User;
    items: MaterialIssueItem[];
}
