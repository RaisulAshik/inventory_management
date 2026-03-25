import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
  IsEmail,
  IsNumber,
  IsEnum,
  IsUUID,
  IsArray,
  ValidateNested,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { CustomerType } from '@common/enums';
import { CreateCustomerAddressDto } from './create-customer-address.dto';

export class CreateCustomerDto {
  @ApiPropertyOptional({ example: 'CUS-001' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  customerCode?: string;

  @ApiPropertyOptional({ enum: CustomerType, default: CustomerType.INDIVIDUAL })
  @IsOptional()
  @IsEnum(CustomerType)
  customerType?: CustomerType;

  @ApiProperty({ example: 'John' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  firstName: string;

  @ApiPropertyOptional({ example: 'Doe' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  lastName?: string;

  @ApiPropertyOptional({ example: 'ABC Corporation' })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  companyName?: string;

  @ApiPropertyOptional({ example: 'john@example.com' })
  @IsOptional()
  @IsEmail()
  @MaxLength(255)
  email?: string;

  @ApiPropertyOptional({ example: '+880-19876543210' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  phone?: string;

  @ApiPropertyOptional({ example: '+880-19876543211' })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  mobile?: string;

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

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @Transform(({ value }) => value || undefined)
  @IsUUID()
  customerGroupId?: string;

  @ApiPropertyOptional({ format: 'uuid' })
  @IsOptional()
  @Transform(({ value }) => value || undefined)
  @IsUUID()
  priceListId?: string;

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

  @ApiPropertyOptional({ example: 'INR', default: 'INR' })
  @IsOptional()
  @IsString()
  @MaxLength(3)
  currency?: string;

  @ApiPropertyOptional({ default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiPropertyOptional({ type: [CreateCustomerAddressDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateCustomerAddressDto)
  addresses?: CreateCustomerAddressDto[];

  @ApiPropertyOptional({ description: 'Password for e-commerce login' })
  @IsOptional()
  @IsString()
  @MinLength(8)
  password?: string;
}
