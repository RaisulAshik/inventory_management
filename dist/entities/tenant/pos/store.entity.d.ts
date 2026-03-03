import { Warehouse } from '../warehouse/warehouse.entity';
import { User } from '../user/user.entity';
import { PosTerminal } from './pos-terminal.entity';
import { PriceList } from '../inventory/price-list.entity';
export declare enum StoreType {
    RETAIL = "RETAIL",
    OUTLET = "OUTLET",
    FRANCHISE = "FRANCHISE",
    POPUP = "POPUP",
    KIOSK = "KIOSK"
}
export declare class Store {
    id: string;
    storeCode: string;
    storeName: string;
    storeType: StoreType;
    warehouseId: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    phone: string;
    email: string;
    managerId: string;
    openingTime: string;
    closingTime: string;
    timezone: string;
    taxId: string;
    defaultPriceListId: string;
    receiptHeader: string;
    receiptFooter: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    warehouse: Warehouse;
    manager: User;
    defaultPriceList: PriceList;
    terminals: PosTerminal[];
}
