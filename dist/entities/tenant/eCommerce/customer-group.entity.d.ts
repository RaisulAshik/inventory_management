import { Customer } from './customer.entity';
import { PriceList } from '../inventory/price-list.entity';
export declare class CustomerGroup {
    id: string;
    groupCode: string;
    groupName: string;
    description: string;
    defaultPriceListId: string;
    discountPercentage: number;
    paymentTermsDays: number;
    creditLimit: number;
    isTaxExempt: boolean;
    loyaltyMultiplier: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    defaultPriceList: PriceList;
    customers: Customer[];
}
