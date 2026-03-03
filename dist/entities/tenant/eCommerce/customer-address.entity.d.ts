import { Customer } from './customer.entity';
export declare enum AddressType {
    BILLING = "BILLING",
    SHIPPING = "SHIPPING",
    BOTH = "BOTH"
}
export declare class CustomerAddress {
    id: string;
    addressLabel: string;
    customerId: string;
    addressType: AddressType;
    isDefault: boolean;
    contactName: string;
    contactPhone: string;
    addressLine1: string;
    addressLine2: string;
    landmark: string;
    city: string;
    state: string;
    country: string;
    postalCode: string;
    latitude: number;
    longitude: number;
    createdAt: Date;
    updatedAt: Date;
    customer: Customer;
    get formattedAddress(): string;
}
