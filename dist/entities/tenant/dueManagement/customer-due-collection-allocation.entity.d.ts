import { CustomerDueCollection } from './customer-due-collection.entity';
import { CustomerDue } from './customer-due.entity';
export declare class CustomerDueCollectionAllocation {
    id: string;
    collectionId: string;
    customerDueId: string;
    allocatedAmount: number;
    allocationDate: Date;
    notes: string;
    createdBy: string;
    createdAt: Date;
    collection: CustomerDueCollection;
    customerDue: CustomerDue;
}
