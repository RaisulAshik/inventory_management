import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Supplier } from '@entities/tenant/inventory/supplier.entity';

class SupplierContactDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  contactName: string;

  @ApiPropertyOptional()
  designation?: string;

  @ApiPropertyOptional()
  department?: string;

  @ApiPropertyOptional()
  email?: string;

  @ApiPropertyOptional()
  phone?: string;

  @ApiPropertyOptional()
  mobile?: string;

  @ApiProperty()
  isPrimary: boolean;

  @ApiProperty()
  isActive: boolean;
}

export class SupplierResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  supplierCode: string;

  @ApiProperty()
  companyName: string;

  @ApiPropertyOptional()
  contactPerson?: string;

  @ApiPropertyOptional()
  email?: string;

  @ApiPropertyOptional()
  phone?: string;

  @ApiPropertyOptional()
  website?: string;

  @ApiPropertyOptional()
  taxId?: string;

  @ApiPropertyOptional()
  panNumber?: string;

  @ApiPropertyOptional()
  addressLine1?: string;

  @ApiPropertyOptional()
  addressLine2?: string;

  @ApiPropertyOptional()
  city?: string;

  @ApiPropertyOptional()
  state?: string;

  @ApiPropertyOptional()
  country?: string;

  @ApiPropertyOptional()
  postalCode?: string;

  @ApiPropertyOptional()
  paymentTermsDays?: number;

  @ApiPropertyOptional()
  creditLimit?: number;

  @ApiProperty()
  currency: string;

  @ApiProperty()
  isActive: boolean;

  @ApiPropertyOptional({ type: [SupplierContactDto] })
  contacts?: SupplierContactDto[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(supplier: Supplier) {
    this.id = supplier.id;
    this.supplierCode = supplier.supplierCode;
    this.companyName = supplier.companyName;
    this.contactPerson = supplier.contactPerson;
    this.email = supplier.email;
    this.phone = supplier.phone;
    this.website = supplier.website;
    this.taxId = supplier.taxId;
    this.panNumber = supplier.panNumber;
    this.addressLine1 = supplier.addressLine1;
    this.addressLine2 = supplier.addressLine2;
    this.city = supplier.city;
    this.state = supplier.state;
    this.country = supplier.country;
    this.postalCode = supplier.postalCode;
    this.paymentTermsDays = supplier.paymentTermsDays;
    this.creditLimit = supplier.creditLimit
      ? Number(supplier.creditLimit)
      : undefined;
    this.currency = supplier.currency;
    this.isActive = supplier.isActive;
    this.createdAt = supplier.createdAt;
    this.updatedAt = supplier.updatedAt;

    if (supplier.contacts) {
      this.contacts = supplier.contacts.map((c: any) => ({
        id: c.id,
        contactName: c.contactName,
        designation: c.designation,
        department: c.department,
        email: c.email,
        phone: c.phone,
        mobile: c.mobile,
        isPrimary: c.isPrimary,
        isActive: c.isActive,
      }));
    }
  }
}
