import { WarehouseType } from '@common/enums';
import { WarehouseZone } from './warehouse-zone.entity';
import { WarehouseLocation } from './warehouse-location.entity';
import { InventoryStock } from './inventory-stock.entity';
export declare class Warehouse {
    id: string;
    warehouseCode: string;
    warehouseName: string;
    warehouseType: WarehouseType;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    contactPerson: string;
    phone: string;
    email: string;
    totalAreaSqft: number;
    usableAreaSqft: number;
    isActive: boolean;
    isDefault: boolean;
    allowNegativeStock: boolean;
    createdAt: Date;
    updatedAt: Date;
    zones: WarehouseZone[];
    locations: WarehouseLocation[];
    inventoryStocks: InventoryStock[];
}
