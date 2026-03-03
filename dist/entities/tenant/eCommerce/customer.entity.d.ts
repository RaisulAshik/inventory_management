import { CustomerAddress } from './customer-address.entity';
import { SalesOrder } from './sales-order.entity';
import { CustomerGroup } from './customer-group.entity';
import { PriceList } from '../inventory/price-list.entity';
export declare enum CustomerType {
    INDIVIDUAL = "INDIVIDUAL",
    BUSINESS = "BUSINESS"
}
export declare enum Gender {
    MALE = "MALE",
    FEMALE = "FEMALE",
    OTHER = "OTHER"
}
export declare class Customer {
    id: string;
    customerCode: string;
    customerType: CustomerType;
    firstName: string;
    lastName: string;
    companyName: string;
    email: string;
    phone: string;
    mobile: string;
    panNumber: string;
    paymentTermsDays: string;
    currency: string;
    taxId: string;
    dateOfBirth: Date;
    gender: Gender;
    customerGroupId: string;
    priceListId: string;
    defaultPaymentTermsDays: number;
    creditLimit: number;
    totalPurchases: number;
    currentBalance: number;
    loyaltyPoints: number;
    totalOrders: number;
    totalSpent: number;
    lastOrderDate: Date;
    notes: string;
    isActive: boolean;
    isVerified: boolean;
    acceptsMarketing: boolean;
    source: string;
    referralCode: string;
    referredBy: string;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date;
    customerGroup: CustomerGroup;
    priceList: PriceList;
    referrer: Customer;
    addresses: CustomerAddress[];
    orders: SalesOrder[];
    get fullName(): string;
    get displayName(): string;
}
