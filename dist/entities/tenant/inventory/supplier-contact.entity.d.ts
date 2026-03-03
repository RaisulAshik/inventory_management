import { Supplier } from './supplier.entity';
export declare class SupplierContact {
    id: string;
    supplierId: string;
    contactName: string;
    designation: string;
    department: string;
    email: string;
    phone: string;
    mobile: string;
    fax: string;
    isPrimary: boolean;
    isActive: boolean;
    notes: string;
    createdAt: Date;
    updatedAt: Date;
    supplier: Supplier;
}
