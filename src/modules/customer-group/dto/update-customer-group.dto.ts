// src/modules/customer-groups/dto/update-customer-group.dto.ts
import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsNumber,
  IsUUID,
  MaxLength,
  Min,
  Max,
} from 'class-validator';

export class UpdateCustomerGroupDto {
  @ApiPropertyOptional({
    description: 'Unique group code',
    example: 'RETAIL',
    maxLength: 50,
  })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  groupCode?: string;

  @ApiPropertyOptional({
    description: 'Group name',
    example: 'Retail Customers',
    maxLength: 100,
  })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  groupName?: string;

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
  paymentTermsDays?: number;

  @ApiPropertyOptional({
    description: 'Price list ID to associate with this group',
    example: 'uuid',
  })
  @IsUUID('4')
  @IsOptional()
  defaultPriceListId?: string;

  @ApiPropertyOptional({
    description: 'Is this the default group for new customers',
    example: false,
  })
  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;

  @ApiPropertyOptional({
    description: 'Is the group active',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
