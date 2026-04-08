import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsEmail,
  IsNumber,
  IsArray,
  ValidateNested,
  MaxLength,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateSupplierContactDto } from './create-supplier-contact.dto';

// class CreateSupplierContactDto {
//   @ApiProperty({ example: 'John Doe' })
//   @IsString()
//   @IsNotEmpty()
//   @MaxLength(200)
//   contactName: string;

//   @ApiPropertyOptional({ example: 'Procurement Manager' })
//   @IsOptional()
//   @IsString()
//   @MaxLength(100)
//   designation?: string;

//   @ApiPropertyOptional({ example: 'Procurement' })
//   @IsOptional()
//   @IsString()
//   @MaxLength(100)
//   department?: string;

//   @ApiPropertyOptional({ example: 'john@example.com' })
//   @IsOptional()
//   @IsEmail()
//   @MaxLength(255)
//   email?: string;

//   @ApiPropertyOptional({ example: '+880-19876543210' })
//   @IsOptional()
//   @IsString()
//   @MaxLength(50)
//   phone?: string;

//   @ApiPropertyOptional({ example: '+880-19876543211' })
//   @IsOptional()
//   @IsString()
//   @MaxLength(50)
//   mobile?: string;

//   @ApiPropertyOptional({ default: false })
//   @IsOptional()
//   @IsBoolean()
//   isPrimary?: boolean;
// }

export class CreateSupplierDto {
  @ApiPropertyOptional({ example: 'SUP-001' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  supplierCode?: string;

  @ApiProperty({ example: 'ABC Suppliers Pvt Ltd' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(300)
  companyName: string;

  @ApiPropertyOptional({ example: 'John Doe' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  contactPerson?: string;

  @ApiPropertyOptional({ example: 'info@abcsuppliers.com' })
  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email?: string;

  @ApiPropertyOptional({ example: '+880-11-12345678' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  phone?: string;

  @ApiPropertyOptional({ example: '+880-11-12345679' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  fax?: string;

  @ApiPropertyOptional({ example: 'https://www.abcsuppliers.com' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  website?: string;

  @ApiPropertyOptional({ example: 'GSTIN1234567890' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  taxId?: string;

  @ApiPropertyOptional({ example: 'ABCDE1234F' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  panNumber?: string;

  @ApiPropertyOptional({ example: '123 Main Street' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  addressLine1?: string;

  @ApiPropertyOptional({ example: 'Industrial Area' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  addressLine2?: string;

  @ApiPropertyOptional({ example: 'Mumbai' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  city?: string;

  @ApiPropertyOptional({ example: 'Maharashtra' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  state?: string;

  @ApiPropertyOptional({ example: 'Bangladesh' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  country?: string;

  @ApiPropertyOptional({ example: '400001' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  postalCode?: string;

  @ApiPropertyOptional({ example: 30 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  paymentTermsDays?: number;

  @ApiPropertyOptional({ example: 100000 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  creditLimit?: number;

  @ApiPropertyOptional({ example: 'INR', default: 'BDT' })
  @IsOptional()
  @IsString()
  @MaxLength(3)
  currency?: string;

  @ApiPropertyOptional({ example: 'HDFC Bank' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  bankName?: string;

  @ApiPropertyOptional({ example: '12345678901234' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  bankAccountNumber?: string;

  @ApiPropertyOptional({ example: 'HDFC0001234' })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  bankIfscCode?: string;

  @ApiPropertyOptional({ example: 'Mumbai Main Branch' })
  @IsOptional()
  @IsString()
  @MaxLength(200)
  bankBranch?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ type: [CreateSupplierContactDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSupplierContactDto)
  contacts?: CreateSupplierContactDto[];
}
