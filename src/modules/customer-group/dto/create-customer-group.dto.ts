// src/modules/customer-groups/dto/create-customer-group.dto.ts
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsUUID,
  MaxLength,
  Min,
  Max,
} from 'class-validator';

export class CreateCustomerGroupDto {
  @ApiProperty({
    description: 'Unique group code',
    example: 'RETAIL',
    maxLength: 50,
  })
  @IsString()
  @IsNotEmpty({ message: 'Group code is required' })
  @MaxLength(50)
  groupCode: string;

  @ApiProperty({
    description: 'Group name',
    example: 'Retail Customers',
    maxLength: 100,
  })
  @IsString()
  @IsNotEmpty({ message: 'Group name is required' })
  @MaxLength(100)
  groupName: string;

  @ApiPropertyOptional({
    description: 'Group description',
    example: 'Standard retail customers with normal pricing',
  })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({
    description: 'Default discount percentage for this group',
    example: 5,
    minimum: 0,
    maximum: 100,
    default: 0,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsOptional()
  @Min(0)
  @Max(100)
  discountPercentage?: number;

  @ApiPropertyOptional({
    description: 'Credit limit for customers in this group',
    example: 50000,
    minimum: 0,
  })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsOptional()
  @Min(0)
  creditLimit?: number;

  @ApiPropertyOptional({
    description: 'Default payment term days for this group',
    example: 30,
    minimum: 0,
  })
  @IsNumber()
  @IsOptional()
  @Min(0)
  paymentTermDays?: number;

  @ApiPropertyOptional({
    description: 'Price list ID to associate with this group',
    example: 'uuid',
  })
  @IsUUID('4')
  @IsOptional()
  priceListId?: string;

  @ApiPropertyOptional({
    description: 'Is this the default group for new customers',
    example: false,
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;

  @ApiPropertyOptional({
    description: 'Is the group active',
    example: true,
    default: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
