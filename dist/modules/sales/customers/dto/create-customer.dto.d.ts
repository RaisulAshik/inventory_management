import { CustomerType } from '@common/enums';
import { CreateCustomerAddressDto } from './create-customer-address.dto';
export declare class CreateCustomerDto {
    customerCode?: string;
    customerType?: CustomerType;
    firstName: string;
    lastName?: string;
    companyName?: string;
    email?: string;
    phone?: string;
    mobile?: string;
    taxId?: string;
    panNumber?: string;
    customerGroupId?: string;
    priceListId?: string;
    paymentTermsDays?: number;
    creditLimit?: number;
    currency?: string;
    isActive?: boolean;
    notes?: string;
    addresses?: CreateCustomerAddressDto[];
    password?: string;
}
