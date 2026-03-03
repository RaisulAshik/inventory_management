import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CustomerType } from '@common/enums';
import { Customer } from '@entities/tenant';

class CustomerAddressDto {
  @ApiProperty()
  id: string;

  @ApiPropertyOptional()
  addressLabel?: string;

  @ApiProperty()
  addressType: string;

  @ApiProperty()
  contactName: string;

  @ApiPropertyOptional()
  contactPhone?: string;

  @ApiProperty()
  addressLine1: string;

  @ApiPropertyOptional()
  addressLine2?: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  state: string;

  @ApiProperty()
  country: string;

  @ApiProperty()
  postalCode: string;

  @ApiProperty()
  isDefault: boolean;
}

class CustomerGroupDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  groupCode: string;

  @ApiProperty()
  groupName: string;
}

export class CustomerResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  customerCode: string;

  @ApiProperty({ enum: CustomerType })
  customerType: CustomerType;

  @ApiProperty()
  firstName: string;

  @ApiPropertyOptional()
  lastName?: string;

  @ApiProperty()
  displayName: string;

  @ApiPropertyOptional()
  companyName?: string;

  @ApiPropertyOptional()
  email?: string;

  @ApiPropertyOptional()
  phone?: string;

  @ApiPropertyOptional()
  mobile?: string;

  @ApiPropertyOptional()
  taxId?: string;

  @ApiPropertyOptional()
  panNumber?: string;

  @ApiPropertyOptional()
  paymentTermsDays?: string;

  @ApiPropertyOptional()
  creditLimit?: number;

  @ApiProperty()
  currency: string;

  @ApiProperty()
  totalPurchases: number;

  @ApiProperty()
  totalOrders: number;

  @ApiPropertyOptional()
  lastOrderDate?: Date;

  @ApiProperty()
  isActive: boolean;

  @ApiPropertyOptional({ type: CustomerGroupDto })
  customerGroup?: CustomerGroupDto;

  @ApiPropertyOptional({ type: [CustomerAddressDto] })
  addresses?: CustomerAddressDto[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(customer: Customer) {
    this.id = customer.id;
    this.customerCode = customer.customerCode;
    this.customerType = customer.customerType;
    this.firstName = customer.firstName;
    this.lastName = customer.lastName;
    this.displayName = customer.displayName;
    this.companyName = customer.companyName;
    this.email = customer.email;
    this.phone = customer.phone;
    this.mobile = customer.mobile;
    this.taxId = customer.taxId;
    this.panNumber = customer.panNumber;
    this.paymentTermsDays = customer.paymentTermsDays;
    this.creditLimit = customer.creditLimit
      ? Number(customer.creditLimit)
      : undefined;
    this.currency = customer.currency;
    this.totalPurchases = Number(customer.totalPurchases) || 0;
    this.totalOrders = customer.totalOrders || 0;
    this.lastOrderDate = customer.lastOrderDate;
    this.isActive = customer.isActive;
    this.createdAt = customer.createdAt;
    this.updatedAt = customer.updatedAt;

    if (customer.customerGroup) {
      this.customerGroup = {
        id: customer.customerGroup.id,
        groupCode: customer.customerGroup.groupCode,
        groupName: customer.customerGroup.groupName,
      };
    }

    if (customer.addresses) {
      this.addresses = customer.addresses.map((addr) => ({
        id: addr.id,
        addressLabel: addr.addressLabel,
        addressType: addr.addressType,
        contactName: addr.contactName,
        contactPhone: addr.contactPhone,
        addressLine1: addr.addressLine1,
        addressLine2: addr.addressLine2,
        city: addr.city,
        state: addr.state,
        country: addr.country,
        postalCode: addr.postalCode,
        isDefault: addr.isDefault,
      }));
    }
  }
}
