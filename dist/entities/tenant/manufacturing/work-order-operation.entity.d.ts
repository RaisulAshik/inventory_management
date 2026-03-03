import { WorkOrder } from './work-order.entity';
import { BomOperation } from './bom-operation.entity';
import { Workstation } from './workstation.entity';
import { User } from '../user/user.entity';
export declare enum WorkOrderOperationStatus {
    PENDING = "PENDING",
    READY = "READY",
    IN_PROGRESS = "IN_PROGRESS",
    PAUSED = "PAUSED",
    COMPLETED = "COMPLETED",
    CANCELLED = "CANCELLED"
}
export declare class WorkOrderOperation {
    id: string;
    workOrderId: string;
    bomOperationId: string;
    operationNumber: number;
    operationName: string;
    workstationId: string;
    status: WorkOrderOperationStatus;
    plannedQuantity: number;
    completedQuantity: number;
    rejectedQuantity: number;
    plannedStartTime: Date;
    plannedEndTime: Date;
    actualStartTime: Date;
    actualEndTime: Date;
    plannedDurationMinutes: number;
    actualDurationMinutes: number;
    estimatedLaborCost: number;
    actualLaborCost: number;
    estimatedOverheadCost: number;
    actualOverheadCost: number;
    operatorId: string;
    instructions: string;
    notes: string;
    createdAt: Date;
    updatedAt: Date;
    workOrder: WorkOrder;
    bomOperation: BomOperation;
    workstation: Workstation;
    operator: User;
    get completionPercentage(): number;
    get timeVariance(): number;
}
