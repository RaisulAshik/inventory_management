import { BillOfMaterials } from './bill-of-materials.entity';
import { Workstation } from './workstation.entity';
export declare class BomOperation {
    id: string;
    bomId: string;
    operationNumber: number;
    operationName: string;
    workstationId: string;
    description: string;
    instructions: string;
    setupTimeMinutes: number;
    operationTimeMinutes: number;
    teardownTimeMinutes: number;
    laborCostPerUnit: number;
    overheadCostPerUnit: number;
    totalCostPerUnit: number;
    isOutsourced: boolean;
    outsourcedVendor: string;
    outsourcedCost: number;
    isQualityCheckRequired: boolean;
    qualityParameters: Record<string, any>;
    notes: string;
    createdAt: Date;
    updatedAt: Date;
    bom: BillOfMaterials;
    workstation: Workstation;
    get totalTimeMinutes(): number;
}
