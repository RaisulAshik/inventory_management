import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { DeepPartial, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { TenantConnectionManager } from '@database/tenant-connection.manager';
import { ProductCategory } from '@entities/tenant/inventory/product-category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoryFilterDto } from './dto/category-filter.dto';
import { PaginatedResult } from '@common/interfaces';
import { paginate } from '@common/utils/pagination.util';

@Injectable()
export class CategoriesService {
  constructor(
    private readonly tenantConnectionManager: TenantConnectionManager,
  ) {}

  private async getCategoryRepository(): Promise<Repository<ProductCategory>> {
    return this.tenantConnectionManager.getRepository(ProductCategory);
  }

  /**
   * Create a new category
   */
  async create(createCategoryDto: CreateCategoryDto): Promise<ProductCategory> {
    const categoryRepo = await this.getCategoryRepository();

    // Check if code already exists
    const existingCategory = await categoryRepo.findOne({
      where: { categoryCode: createCategoryDto.categoryCode },
    });

    if (existingCategory) {
      throw new BadRequestException(
        `Category with code ${createCategoryDto.categoryCode} already exists`,
      );
    }

    // Calculate level and path if parent exists
    let level = 0;
    let path = '';

    if (createCategoryDto.parentId) {
      const parent = await this.findById(createCategoryDto.parentId);
      level = parent.level + 1;
      path = parent.path ? `${parent.path}/${parent.id}` : parent.id;
    }

    const category = categoryRepo.create({
      id: uuidv4(),
      ...createCategoryDto,
      level,
      path,
    } as DeepPartial<ProductCategory>);

    return categoryRepo.save(category);
  }

  /**
   * Find all categories with pagination
   */
  async findAll(
    filterDto: CategoryFilterDto,
  ): Promise<PaginatedResult<ProductCategory>> {
    const categoryRepo = await this.getCategoryRepository();

    const queryBuilder = categoryRepo
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.parent', 'parent');

    if (filterDto.search) {
      queryBuilder.andWhere(
        '(category.categoryCode LIKE :search OR category.categoryName LIKE :search)',
        { search: `%${filterDto.search}%` },
      );
    }

    if (filterDto.categoryCode) {
      queryBuilder.andWhere('category.categoryCode LIKE :code', {
        code: `%${filterDto.categoryCode}%`,
      });
    }

    if (filterDto.categoryName) {
      queryBuilder.andWhere('category.categoryName LIKE :name', {
        name: `%${filterDto.categoryName}%`,
      });
    }

    if (filterDto.parentId) {
      queryBuilder.andWhere('category.parentId = :parentId', {
        parentId: filterDto.parentId,
      });
    }

    if (filterDto.isActive !== undefined) {
      queryBuilder.andWhere('category.isActive = :isActive', {
        isActive: filterDto.isActive,
      });
    }

    if (!filterDto.sortBy) {
      filterDto.sortBy = 'sortOrder';
      filterDto.sortOrder = 'ASC';
    }

    return paginate(queryBuilder, filterDto);
  }

  /**
   * Get category tree (hierarchical)
   */
  async getTree(): Promise<ProductCategory[]> {
    const categoryRepo = await this.getCategoryRepository();

    const categories = await categoryRepo.find({
      where: { isActive: true },
      order: { sortOrder: 'ASC', categoryName: 'ASC' },
    });

    return this.buildTree(categories);
  }

  /**
   * Build category tree from flat list
   */
  private buildTree(
    categories: ProductCategory[],
    parentId: string | null = null,
  ): ProductCategory[] {
    const tree: ProductCategory[] = [];

    for (const category of categories) {
      if (category.parentId === parentId) {
        const children = this.buildTree(categories, category.id);
        if (children.length > 0) {
          category.children = children;
        }
        tree.push(category);
      }
    }

    return tree;
  }
  /**
   * Get all active categories (for dropdowns)
   */
  async findAllActive(): Promise<ProductCategory[]> {
    const categoryRepo = await this.getCategoryRepository();

    return categoryRepo.find({
      where: { isActive: true },
      order: { categoryName: 'ASC' },
    });
  }
  /**
   * Find category by ID
   */
  async findById(id: string): Promise<ProductCategory> {
    const categoryRepo = await this.getCategoryRepository();

    const category = await categoryRepo.findOne({
      where: { id },
      relations: ['parent', 'children'],
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    return category;
  }

  /**
   * Find category by code
   */
  async findByCode(code: string): Promise<ProductCategory | null> {
    const categoryRepo = await this.getCategoryRepository();

    return categoryRepo.findOne({
      where: { categoryCode: code },
    });
  }

  /**
   * Update category
   */
  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<ProductCategory> {
    const categoryRepo = await this.getCategoryRepository();

    const category = await this.findById(id);

    // Check code uniqueness if being changed
    if (
      updateCategoryDto.categoryCode &&
      updateCategoryDto.categoryCode !== category.categoryCode
    ) {
      const existingCode = await categoryRepo.findOne({
        where: { categoryCode: updateCategoryDto.categoryCode },
      });

      if (existingCode) {
        throw new BadRequestException(
          `Category with code ${updateCategoryDto.categoryCode} already exists`,
        );
      }
    }

    // Update level and path if parent is being changed
    if (updateCategoryDto.parentId !== undefined) {
      if (updateCategoryDto.parentId === id) {
        throw new BadRequestException('Category cannot be its own parent');
      }

      if (updateCategoryDto.parentId) {
        const parent = await this.findById(updateCategoryDto.parentId);

        // Check for circular reference
        if (parent.path && parent.path.includes(id)) {
          throw new BadRequestException('Circular reference detected');
        }

        category.level = parent.level + 1;
        category.path = parent.path ? `${parent.path}/${parent.id}` : parent.id;
      } else {
        category.level = 0;
        category.path = '';
      }
    }

    Object.assign(category, updateCategoryDto);
    return categoryRepo.save(category);
  }

  /**
   * Delete category
   */
  async remove(id: string): Promise<void> {
    const categoryRepo = await this.getCategoryRepository();
    const category = await this.findById(id);

    // Check if has children
    if (category.children && category.children.length > 0) {
      throw new BadRequestException(
        'Cannot delete category with child categories',
      );
    }

    // Check if has products
    const dataSource = await this.tenantConnectionManager.getDataSource();
    const productCount = await dataSource
      .createQueryBuilder()
      .select('COUNT(*)', 'count')
      .from('products', 'p')
      .where('p.category_id = :id', { id })
      .andWhere('p.deleted_at IS NULL')
      .getRawOne();

    if (parseInt(productCount.count) > 0) {
      throw new BadRequestException(
        'Cannot delete category with associated products',
      );
    }

    await categoryRepo.delete(id);
  }

  /**
   * Get children of a category
   */
  async getChildren(parentId: string): Promise<ProductCategory[]> {
    const categoryRepo = await this.getCategoryRepository();

    return categoryRepo.find({
      where: { parentId, isActive: true },
      order: { sortOrder: 'ASC', categoryName: 'ASC' },
    });
  }

  /**
   * Get all descendants of a category
   */
  async getDescendants(id: string): Promise<ProductCategory[]> {
    const categoryRepo = await this.getCategoryRepository();

    return categoryRepo
      .createQueryBuilder('category')
      .where('category.path LIKE :path', { path: `%${id}%` })
      .orWhere('category.parentId = :id', { id })
      .orderBy('category.level', 'ASC')
      .addOrderBy('category.sortOrder', 'ASC')
      .getMany();
  }
}
