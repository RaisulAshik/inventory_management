import { CustomerType } from '@common/enums';
import { Customer } from '@entities/tenant';
declare class CustomerAddressDto {
    id: string;
    addressLabel?: string;
    addressType: string;
    contactName: string;
    contactPhone?: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    isDefault: boolean;
}
declare class CustomerGroupDto {
    id: string;
    groupCode: string;
    groupName: string;
}
export declare class CustomerResponseDto {
    id: string;
    customerCode: string;
    customerType: CustomerType;
    firstName: string;
    lastName?: string;
    displayName: string;
    companyName?: string;
    email?: string;
    phone?: string;
    mobile?: string;
    taxId?: string;
    panNumber?: string;
    paymentTermsDays?: string;
    creditLimit?: number;
    currency: string;
    totalPurchases: number;
    totalOrders: number;
    lastOrderDate?: Date;
    isActive: boolean;
    customerGroup?: CustomerGroupDto;
    addresses?: CustomerAddressDto[];
    createdAt: Date;
    updatedAt: Date;
    constructor(customer: Customer);
}
export {};
