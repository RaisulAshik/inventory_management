import { AddressType } from '@common/enums';
export declare class CreateCustomerAddressDto {
    addressLabel?: string;
    addressType: AddressType;
    contactName: string;
    contactPhone?: string;
    addressLine1: string;
    addressLine2?: string;
    landmark?: string;
    city: string;
    state: string;
    country?: string;
    postalCode: string;
    isDefault?: boolean;
}
