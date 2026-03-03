export declare class CostCenter {
    id: string;
    costCenterCode: string;
    costCenterName: string;
    parentId: string;
    level: number;
    path: string;
    description: string;
    managerId: string;
    budget: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    parent: CostCenter;
    children: CostCenter[];
}
