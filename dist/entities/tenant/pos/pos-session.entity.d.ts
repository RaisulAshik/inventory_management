import { Store } from './store.entity';
import { PosTerminal } from './pos-terminal.entity';
import { User } from '../user/user.entity';
import { PosTransaction } from './pos-transaction.entity';
export declare enum PosSessionStatus {
    OPEN = "OPEN",
    CLOSED = "CLOSED",
    SUSPENDED = "SUSPENDED"
}
export declare class PosSession {
    id: string;
    sessionNumber: string;
    storeId: string;
    terminalId: string;
    userId: string;
    status: PosSessionStatus;
    openingTime: Date;
    closingTime: Date;
    openingCash: number;
    closingCash: number;
    expectedCash: number;
    cashDifference: number;
    totalSales: number;
    totalReturns: number;
    totalTransactions: number;
    cashSales: number;
    cardSales: number;
    upiSales: number;
    otherSales: number;
    cashIn: number;
    cashOut: number;
    openingNotes: string;
    closingNotes: string;
    closedBy: string;
    createdAt: Date;
    updatedAt: Date;
    store: Store;
    terminal: PosTerminal;
    user: User;
    transactions: PosTransaction[];
    get isOpen(): boolean;
    get netSales(): number;
}
