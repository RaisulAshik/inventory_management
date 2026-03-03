import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { TenantConnectionManager } from '@database/tenant-connection.manager';
import { Brand } from '@entities/tenant/inventory/brand.entity';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { PaginationDto } from '@common/dto/pagination.dto';
import { PaginatedResult } from '@common/interfaces';
import { paginate } from '@common/utils/pagination.util';

@Injectable()
export class BrandsService {
  constructor(
    private readonly tenantConnectionManager: TenantConnectionManager,
  ) {}

  private async getBrandRepository(): Promise<Repository<Brand>> {
    return this.tenantConnectionManager.getRepository(Brand);
  }

  /**
   * Create a new brand
   */
  async create(createBrandDto: CreateBrandDto): Promise<Brand> {
    const brandRepo = await this.getBrandRepository();

    // Check if code already exists
    const existingBrand = await brandRepo.findOne({
      where: { brandCode: createBrandDto.brandCode },
    });

    if (existingBrand) {
      throw new BadRequestException(
        `Brand with code ${createBrandDto.brandCode} already exists`,
      );
    }

    const brand = brandRepo.create({
      id: uuidv4(),
      ...createBrandDto,
    });

    return brandRepo.save(brand);
  }

  /**
   * Find all brands with pagination
   */
  async findAll(paginationDto: PaginationDto): Promise<PaginatedResult<Brand>> {
    const brandRepo = await this.getBrandRepository();

    const queryBuilder = brandRepo.createQueryBuilder('brand');

    if (paginationDto.search) {
      queryBuilder.where(
        '(brand.brandCode LIKE :search OR brand.brandName LIKE :search)',
        { search: `%${paginationDto.search}%` },
      );
    }

    if (!paginationDto.sortBy) {
      paginationDto.sortBy = 'brandName';
      paginationDto.sortOrder = 'ASC';
    }

    return paginate(queryBuilder, paginationDto);
  }

  /**
   * Get all active brands (for dropdowns)
   */
  async findAllActive(): Promise<Brand[]> {
    const brandRepo = await this.getBrandRepository();

    return brandRepo.find({
      where: { isActive: true },
      order: { brandName: 'ASC' },
    });
  }

  /**
   * Find brand by ID
   */
  async findById(id: string): Promise<Brand> {
    const brandRepo = await this.getBrandRepository();

    const brand = await brandRepo.findOne({ where: { id } });

    if (!brand) {
      throw new NotFoundException(`Brand with ID ${id} not found`);
    }

    return brand;
  }

  /**
   * Find brand by code
   */
  async findByCode(code: string): Promise<Brand | null> {
    const brandRepo = await this.getBrandRepository();
    return brandRepo.findOne({ where: { brandCode: code } });
  }

  /**
   * Update brand
   */
  async update(id: string, updateBrandDto: UpdateBrandDto): Promise<Brand> {
    const brandRepo = await this.getBrandRepository();
    const brand = await this.findById(id);

    // Check code uniqueness if being changed
    if (
      updateBrandDto.brandCode &&
      updateBrandDto.brandCode !== brand.brandCode
    ) {
      const existingCode = await brandRepo.findOne({
        where: { brandCode: updateBrandDto.brandCode },
      });

      if (existingCode) {
        throw new BadRequestException(
          `Brand with code ${updateBrandDto.brandCode} already exists`,
        );
      }
    }

    Object.assign(brand, updateBrandDto);
    return brandRepo.save(brand);
  }

  /**
   * Delete brand
   */
  async remove(id: string): Promise<void> {
    const brandRepo = await this.getBrandRepository();
    //const brand = await this.findById(id);

    // Check if has products
    const dataSource = await this.tenantConnectionManager.getDataSource();
    const productCount = await dataSource
      .createQueryBuilder()
      .select('COUNT(*)', 'count')
      .from('products', 'p')
      .where('p.brand_id = :id', { id })
      .andWhere('p.deleted_at IS NULL')
      .getRawOne();

    if (parseInt(productCount.count) > 0) {
      throw new BadRequestException(
        'Cannot delete brand with associated products',
      );
    }

    await brandRepo.delete(id);
  }

  /**
   * Count brands
   */
  async count(): Promise<number> {
    const brandRepo = await this.getBrandRepository();
    return brandRepo.count();
  }
}
