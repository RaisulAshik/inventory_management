import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProductCategory } from '@entities/tenant/inventory/product-category.entity';

export class CategoryResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  categoryCode: string;

  @ApiProperty()
  categoryName: string;

  @ApiPropertyOptional()
  parentId?: string;

  @ApiProperty()
  level: number;

  @ApiPropertyOptional()
  path?: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  imageUrl?: string;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  sortOrder: number;

  @ApiPropertyOptional({ type: () => CategoryResponseDto })
  parent?: CategoryResponseDto;

  @ApiPropertyOptional({ type: [CategoryResponseDto] })
  children?: CategoryResponseDto[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  constructor(category: ProductCategory) {
    this.id = category.id;
    this.categoryCode = category.categoryCode;
    this.categoryName = category.categoryName;
    this.parentId = category.parentId;
    this.level = category.level;
    this.path = category.path;
    this.description = category.description;
    this.imageUrl = category.imageUrl;
    this.isActive = category.isActive;
    this.sortOrder = category.sortOrder;
    this.createdAt = category.createdAt;
    this.updatedAt = category.updatedAt;

    if (category.parent) {
      this.parent = new CategoryResponseDto(category.parent);
    }

    if (category.children && category.children.length > 0) {
      this.children = category.children.map(
        (child: any) => new CategoryResponseDto(child),
      );
    }
  }
}
