import { CreateSupplierContactDto } from './create-supplier-contact.dto';
export declare class CreateSupplierDto {
    supplierCode?: string;
    companyName: string;
    contactPerson?: string;
    email?: string;
    phone?: string;
    fax?: string;
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
    currency?: string;
    bankName?: string;
    bankAccountNumber?: string;
    bankIfscCode?: string;
    bankBranch?: string;
    isActive?: boolean;
    notes?: string;
    contacts?: CreateSupplierContactDto[];
}
