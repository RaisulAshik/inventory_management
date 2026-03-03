import { TaxCategory, TaxRate } from '@/entities/tenant';
import { Injectable, NotFoundException } from '@nestjs/common';
import {
  DeepPartial,
  LessThanOrEqual,
  IsNull,
  MoreThanOrEqual,
  Or,
  Repository,
} from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { CreateTaxRateDto } from './dto/taxRate.dto';
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

  async findAllCategories() {
    const categoryRepo = await this.getTaxCategoryRepository();
    return categoryRepo.find({ relations: ['taxRates'] });
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
      taxType: dto.taxType,
      rateName: dto.rateName,
      ratePercentage: dto.ratePercentage,
      effectiveFrom: dto.effectiveFrom,
      isActive: true,
    } as DeepPartial<TaxRate>);
    return rateRepo.save(rate);
  }
}
