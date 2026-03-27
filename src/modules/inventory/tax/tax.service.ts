import { TaxCategory, TaxRate } from '@/entities/tenant';
import { Injectable, NotFoundException } from '@nestjs/common';
import { DeepPartial, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { CreateTaxRateDto } from './dto/taxRate.dto';
import { CreateTaxCategoryDto } from './dto/taxCategory.dto';
import { TaxCategoryFilterDto } from './dto/tax-category-filter.dto';
import { TaxRateFilterDto } from './dto/tax-rate-filter.dto';
import { TenantConnectionManager } from '@/database/tenant-connection.manager';
import { paginate } from '@common/utils/pagination.util';

@Injectable()
export class TaxService {
  constructor(
    private readonly tenantConnectionManager: TenantConnectionManager,
  ) {}

  private async getTaxCategoryRepository(): Promise<Repository<TaxCategory>> {
    return this.tenantConnectionManager.getRepository(TaxCategory);
  }

  private async getTaxRateRepository(): Promise<Repository<TaxRate>> {
    return this.tenantConnectionManager.getRepository(TaxRate);
  }

  async createCategory(dto: CreateTaxCategoryDto): Promise<TaxCategory> {
    const categoryRepo = await this.getTaxCategoryRepository();
    const existing = await categoryRepo.findOne({
      where: { taxCode: dto.taxCategoryCode },
    });
    if (existing) {
      throw new Error(`Tax code '${dto.taxCategoryCode}' already exists`);
    }
    const category = categoryRepo.create({
      id: uuidv4(),
      taxCode: dto.taxCategoryCode,
      taxName: dto.taxCategoryName,
      description: dto.description,
      isActive: dto.isActive ?? true,
    } as DeepPartial<TaxCategory>);
    return categoryRepo.save(category);
  }

  async updateCategory(id: string, dto: Partial<CreateTaxCategoryDto>): Promise<TaxCategory> {
    const categoryRepo = await this.getTaxCategoryRepository();
    const category = await categoryRepo.findOne({ where: { id } });
    if (!category) throw new NotFoundException(`Tax category ${id} not found`);
    if (dto.taxCategoryCode !== undefined) category.taxCode = dto.taxCategoryCode;
    if (dto.taxCategoryName !== undefined) category.taxName = dto.taxCategoryName;
    if (dto.description !== undefined) category.description = dto.description;
    if (dto.isActive !== undefined) category.isActive = dto.isActive;
    return categoryRepo.save(category);
  }

  async findAllCategories(filterDto?: TaxCategoryFilterDto) {
    const categoryRepo = await this.getTaxCategoryRepository();

    if (!filterDto) {
      return categoryRepo.find({ relations: ['taxRates'] });
    }

    const qb = categoryRepo
      .createQueryBuilder('category')
      .leftJoinAndSelect('category.taxRates', 'taxRates');

    if (filterDto.taxCode) {
      qb.andWhere('category.taxCode LIKE :taxCode', {
        taxCode: `%${filterDto.taxCode}%`,
      });
    }

    if (filterDto.taxName) {
      qb.andWhere('category.taxName LIKE :taxName', {
        taxName: `%${filterDto.taxName}%`,
      });
    }

    if (filterDto.isActive !== undefined) {
      qb.andWhere('category.isActive = :isActive', {
        isActive: filterDto.isActive,
      });
    }

    if (filterDto.search) {
      qb.andWhere(
        '(category.taxCode LIKE :search OR category.taxName LIKE :search)',
        { search: `%${filterDto.search}%` },
      );
    }

    if (!filterDto.sortBy) {
      filterDto.sortBy = 'taxName';
      filterDto.sortOrder = 'ASC';
    }

    return paginate(qb, filterDto);
  }

  async findCategoriesDropdown() {
    const categoryRepo = await this.getTaxCategoryRepository();
    const categories = await categoryRepo.find({
      where: { isActive: true },
      order: { taxName: 'ASC' },
    });
    return categories.map((c) => ({
      id: c.id,
      label: `${c.taxCode} — ${c.taxName}`,
      taxCode: c.taxCode,
      taxName: c.taxName,
    }));
  }

  async findCategoryByCode(taxCode: string) {
    const categoryRepo = await this.getTaxCategoryRepository();
    const category = await categoryRepo.findOne({
      where: { taxCode },
      relations: ['taxRates'],
    });
    if (!category) throw new NotFoundException(`Tax code ${taxCode} not found`);
    return category;
  }

  async findAllRates(filterDto: TaxRateFilterDto) {
    const rateRepo = await this.getTaxRateRepository();

    const qb = rateRepo
      .createQueryBuilder('rate')
      .leftJoinAndSelect('rate.taxCategory', 'taxCategory');

    if (filterDto.categoryId) {
      qb.andWhere('rate.taxCategoryId = :categoryId', {
        categoryId: filterDto.categoryId,
      });
    }

    if (filterDto.rateName) {
      qb.andWhere('rate.rateName LIKE :rateName', {
        rateName: `%${filterDto.rateName}%`,
      });
    }

    if (filterDto.isActive !== undefined) {
      qb.andWhere('rate.isActive = :isActive', { isActive: filterDto.isActive });
    }

    if (filterDto.search) {
      qb.andWhere('rate.rateName LIKE :search', {
        search: `%${filterDto.search}%`,
      });
    }

    if (!filterDto.sortBy) {
      filterDto.sortBy = 'rateName';
      filterDto.sortOrder = 'ASC';
    }

    return paginate(qb, filterDto);
  }

  async findActiveRates(categoryId?: string) {
    const rateRepo = await this.getTaxRateRepository();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const queryBuilder = rateRepo
      .createQueryBuilder('rate')
      .leftJoinAndSelect('rate.taxCategory', 'category')
      .where('rate.isActive = :isActive', { isActive: true })
      .andWhere('rate.effectiveFrom <= :today', { today })
      .andWhere('(rate.effectiveTo IS NULL OR rate.effectiveTo >= :today)', {
        today,
      })
      .orderBy('category.taxCode', 'ASC')
      .addOrderBy('rate.rateName', 'ASC');

    if (categoryId) {
      queryBuilder.andWhere('rate.taxCategoryId = :categoryId', { categoryId });
    }

    return queryBuilder.getMany();
  }

  async findRateById(id: string) {
    const rateRepo = await this.getTaxRateRepository();
    const rate = await rateRepo.findOne({
      where: { id },
      relations: ['taxCategory'],
    });
    if (!rate) throw new NotFoundException(`Tax rate with ID ${id} not found`);
    return rate;
  }

  async updateRate(id: string, dto: Partial<CreateTaxRateDto>) {
    const rateRepo = await this.getTaxRateRepository();
    const rate = await rateRepo.findOne({ where: { id } });
    if (!rate) throw new NotFoundException(`Tax rate with ID ${id} not found`);
    if (dto.name !== undefined) rate.rateName = dto.name;
    if (dto.rate !== undefined) rate.ratePercentage = dto.rate;
    if (dto.taxType !== undefined) rate.taxType = dto.taxType as any;
    if (dto.effectiveFrom !== undefined) rate.effectiveFrom = new Date(dto.effectiveFrom);
    if (dto.effectiveTo !== undefined)
      rate.effectiveTo = (
        dto.effectiveTo ? new Date(dto.effectiveTo) : null
      ) as Date;
    if (dto.isActive !== undefined) rate.isActive = dto.isActive;
    return rateRepo.save(rate);
  }

  async createRate(dto: CreateTaxRateDto) {
    const rateRepo = await this.getTaxRateRepository();
    const rate = rateRepo.create({
      id: uuidv4(),
      taxCategoryId: dto.taxCategoryId,
      taxType: dto.taxType ?? 'PERCENTAGE',
      rateName: dto.name,
      ratePercentage: dto.rate,
      effectiveFrom: dto.effectiveFrom ?? new Date().toISOString().split('T')[0],
      effectiveTo: dto.effectiveTo ?? null,
      isActive: dto.isActive ?? true,
    } as DeepPartial<TaxRate>);
    return rateRepo.save(rate);
  }
}
