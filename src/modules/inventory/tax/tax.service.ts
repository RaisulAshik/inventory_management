import { TaxCategory, TaxRate } from '@/entities/tenant';
import { Injectable, NotFoundException } from '@nestjs/common';
import { DeepPartial, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { CreateTaxRateDto } from './dto/taxRate.dto';
import { CreateTaxCategoryDto } from './dto/taxCategory.dto';
import { TenantConnectionManager } from '@/database/tenant-connection.manager';

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

  async findAllCategories() {
    const categoryRepo = await this.getTaxCategoryRepository();
    return categoryRepo.find({ relations: ['taxRates'] });
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

  async findAllRates(categoryId?: string) {
    const rateRepo = await this.getTaxRateRepository();
    return rateRepo.find({
      where: categoryId ? { taxCategoryId: categoryId } : undefined,
      relations: ['taxCategory'],
      order: { taxCategoryId: 'ASC', rateName: 'ASC' },
    });
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
