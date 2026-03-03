import { Warehouse } from '../warehouse/warehouse.entity';
export declare enum WorkstationType {
    ASSEMBLY = "ASSEMBLY",
    MACHINING = "MACHINING",
    PACKAGING = "PACKAGING",
    QUALITY_CHECK = "QUALITY_CHECK",
    PAINTING = "PAINTING",
    WELDING = "WELDING",
    CUTTING = "CUTTING",
    MOLDING = "MOLDING",
    FINISHING = "FINISHING",
    OTHER = "OTHER"
}
export declare enum WorkstationStatus {
    AVAILABLE = "AVAILABLE",
    IN_USE = "IN_USE",
    MAINTENANCE = "MAINTENANCE",
    BREAKDOWN = "BREAKDOWN",
    INACTIVE = "INACTIVE"
}
export declare class Workstation {
    id: string;
    workstationCode: string;
    workstationName: string;
    workstationType: WorkstationType;
    warehouseId: string;
    description: string;
    status: WorkstationStatus;
    hourlyRate: number;
    operatingCostPerHour: number;
    capacityPerHour: number;
    workingHoursPerDay: number;
    efficiencyPercentage: number;
    setupTimeMinutes: number;
    cleanupTimeMinutes: number;
    lastMaintenanceDate: Date;
    nextMaintenanceDate: Date;
    isActive: boolean;
    notes: string;
    createdAt: Date;
    updatedAt: Date;
    warehouse: Warehouse;
    get effectiveCapacityPerDay(): number;
    get needsMaintenance(): boolean;
}
