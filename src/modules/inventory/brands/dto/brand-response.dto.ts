import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Brand } from '@entities/tenant/inventory/brand.entity';

export class BrandResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  brandCode: string;

  @ApiProperty()
  brandName: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  logoUrl?: string;

  @ApiPropertyOptional()
  website?: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(brand: Brand) {
    this.id = brand.id;
    this.brandCode = brand.brandCode;
    this.brandName = brand.brandName;
    this.description = brand.description;
    this.logoUrl = brand.logoUrl;
    this.website = brand.website;
    this.isActive = brand.isActive;
    this.createdAt = brand.createdAt;
    this.updatedAt = brand.updatedAt;
  }
}
