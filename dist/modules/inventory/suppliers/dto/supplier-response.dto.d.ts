import { Supplier } from '@entities/tenant/inventory/supplier.entity';
declare class SupplierContactDto {
    id: string;
    contactName: string;
    designation?: string;
    department?: string;
    email?: string;
    phone?: string;
    mobile?: string;
    isPrimary: boolean;
    isActive: boolean;
}
export declare class SupplierResponseDto {
    id: string;
    supplierCode: string;
    companyName: string;
    contactPerson?: string;
    email?: string;
    phone?: string;
    website?: string;
    taxId?: string;
    panNumber?: string;
    addressLine1?: string;
    addressLine2?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
    paymentTermsDays?: number;
    creditLimit?: number;
    currency: string;
    isActive: boolean;
    contacts?: SupplierContactDto[];
    createdAt: Date;
    updatedAt: Date;
    constructor(supplier: Supplier);
}
export {};
