import { Store } from './store.entity';
export declare enum TerminalType {
    DESKTOP = "DESKTOP",
    TABLET = "TABLET",
    MOBILE = "MOBILE",
    SELF_SERVICE = "SELF_SERVICE"
}
export declare class PosTerminal {
    id: string;
    terminalCode: string;
    terminalName: string;
    storeId: string;
    terminalType: TerminalType;
    deviceId: string;
    ipAddress: string;
    isActive: boolean;
    lastSyncAt: Date;
    createdAt: Date;
    updatedAt: Date;
    store: Store;
}
