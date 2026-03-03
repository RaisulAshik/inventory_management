import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { TenantConnectionManager } from '@database/tenant-connection.manager';
import { PaginationDto } from '@common/dto/pagination.dto';
import { PaginatedResult } from '@common/interfaces';
import { paginate } from '@common/utils/pagination.util';
import { UnitOfMeasure } from '@entities/tenant';
import { CreateUnitDto } from './dto/create-unit.dto';
import { CreateUomConversionDto } from './dto/create-uom-conversion.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';
import { UomConversion } from '@entities/tenant/inventory/uom-conversion.entity';

@Injectable()
export class UnitsService {
  constructor(
    private readonly tenantConnectionManager: TenantConnectionManager,
  ) {}

  private async getUomRepository(): Promise<Repository<UnitOfMeasure>> {
    return this.tenantConnectionManager.getRepository(UnitOfMeasure);
  }

  /**
   * Create a new unit of measure
   */
  async create(createUnitDto: CreateUnitDto): Promise<UnitOfMeasure> {
    const uomRepo = await this.getUomRepository();

    // Check if code already exists
    const existingUom = await uomRepo.findOne({
      where: { uomCode: createUnitDto.uomCode },
    });

    if (existingUom) {
      throw new BadRequestException(
        `Unit with code ${createUnitDto.uomCode} already exists`,
      );
    }

    const uom = uomRepo.create({
      id: uuidv4(),
      ...createUnitDto,
    });

    return uomRepo.save(uom);
  }

  /**
   * Find all units with pagination
   */
  async findAll(
    paginationDto: PaginationDto,
  ): Promise<PaginatedResult<UnitOfMeasure>> {
    const uomRepo = await this.getUomRepository();

    const queryBuilder = uomRepo.createQueryBuilder('uom');

    if (paginationDto.search) {
      queryBuilder.where(
        '(uom.uomCode LIKE :search OR uom.uomName LIKE :search)',
        { search: `%${paginationDto.search}%` },
      );
    }

    if (!paginationDto.sortBy) {
      paginationDto.sortBy = 'uomName';
      paginationDto.sortOrder = 'ASC';
    }

    return paginate(queryBuilder, paginationDto);
  }

  /**
   * Get all active units (for dropdowns)
   */
  async findAllActive(): Promise<UnitOfMeasure[]> {
    const uomRepo = await this.getUomRepository();

    return uomRepo.find({
      where: { isActive: true },
      order: { uomName: 'ASC' },
    });
  }

  /**
   * Get units by type
   */
  async findByType(uomType: string): Promise<UnitOfMeasure[]> {
    const uomRepo = await this.getUomRepository();

    return uomRepo.find({
      where: { uomType: uomType as any, isActive: true },
      order: { uomName: 'ASC' },
    });
  }

  /**
   * Find unit by ID
   */
  async findById(id: string): Promise<UnitOfMeasure> {
    const uomRepo = await this.getUomRepository();

    const uom = await uomRepo.findOne({
      where: { id },
      relations: ['conversionsFrom', 'conversionsTo'],
    });

    if (!uom) {
      throw new NotFoundException(`Unit with ID ${id} not found`);
    }

    return uom;
  }

  /**
   * Find unit by code
   */
  async findByCode(code: string): Promise<UnitOfMeasure | null> {
    const uomRepo = await this.getUomRepository();
    return uomRepo.findOne({ where: { uomCode: code } });
  }

  /**
   * Update unit
   */
  async update(
    id: string,
    updateUnitDto: UpdateUnitDto,
  ): Promise<UnitOfMeasure> {
    const uomRepo = await this.getUomRepository();
    const uom = await this.findById(id);

    // Check code uniqueness if being changed
    if (updateUnitDto.uomCode && updateUnitDto.uomCode !== uom.uomCode) {
      const existingCode = await uomRepo.findOne({
        where: { uomCode: updateUnitDto.uomCode },
      });

      if (existingCode) {
        throw new BadRequestException(
          `Unit with code ${updateUnitDto.uomCode} already exists`,
        );
      }
    }

    Object.assign(uom, updateUnitDto);
    return uomRepo.save(uom);
  }

  /**
   * Delete unit
   */
  async remove(id: string): Promise<void> {
    const uomRepo = await this.getUomRepository();
    //const uom = await this.findById(id);

    // Check if used in products
    const dataSource = await this.tenantConnectionManager.getDataSource();
    const productCount = await dataSource
      .createQueryBuilder()
      .select('COUNT(*)', 'count')
      .from('products', 'p')
      .where('(p.base_uom_id = :id OR p.secondary_uom_id = :id)', { id })
      .andWhere('p.deleted_at IS NULL')
      .getRawOne();

    if (parseInt(productCount.count) > 0) {
      throw new BadRequestException('Cannot delete unit used by products');
    }

    await uomRepo.delete(id);
  }

  /**
   * Create UoM conversion
   */
  async createConversion(dto: CreateUomConversionDto): Promise<UomConversion> {
    const dataSource = await this.tenantConnectionManager.getDataSource();
    const conversionRepo = dataSource.getRepository(UomConversion);

    // Verify both units exist
    await this.findById(dto.fromUomId);
    await this.findById(dto.toUomId);

    // Check if conversion already exists
    const existing = await conversionRepo.findOne({
      where: {
        fromUomId: dto.fromUomId,
        toUomId: dto.toUomId,
      },
    });

    if (existing) {
      throw new BadRequestException(
        'Conversion between these units already exists',
      );
    }

    const conversion = conversionRepo.create({
      id: uuidv4(),
      ...dto,
    });

    return conversionRepo.save(conversion);
  }

  /**
   * Get conversions for a unit
   */
  async getConversions(uomId: string): Promise<UomConversion[]> {
    const dataSource = await this.tenantConnectionManager.getDataSource();
    const conversionRepo = dataSource.getRepository(UomConversion);

    return conversionRepo.find({
      where: [{ fromUomId: uomId }, { toUomId: uomId }],
      relations: ['fromUom', 'toUom'],
    });
  }

  /**
   * Convert quantity between units
   */
  async convert(
    fromUomId: string,
    toUomId: string,
    quantity: number,
  ): Promise<number> {
    if (fromUomId === toUomId) {
      return quantity;
    }

    const dataSource = await this.tenantConnectionManager.getDataSource();
    const conversionRepo = dataSource.getRepository(UomConversion);

    // Try direct conversion
    let conversion = await conversionRepo.findOne({
      where: { fromUomId, toUomId },
    });

    if (conversion) {
      return quantity * Number(conversion.conversionFactor);
    }

    // Try reverse conversion
    conversion = await conversionRepo.findOne({
      where: { fromUomId: toUomId, toUomId: fromUomId },
    });

    if (conversion) {
      return quantity / Number(conversion.conversionFactor);
    }

    throw new BadRequestException(
      'No conversion factor found between these units',
    );
  }

  /**
   * Update conversion
   */
  async updateConversion(
    conversionId: string,
    conversionFactor: number,
  ): Promise<UomConversion> {
    const dataSource = await this.tenantConnectionManager.getDataSource();
    const conversionRepo = dataSource.getRepository(UomConversion);

    const conversion = await conversionRepo.findOne({
      where: { id: conversionId },
    });

    if (!conversion) {
      throw new NotFoundException(
        `Conversion with ID ${conversionId} not found`,
      );
    }

    conversion.conversionFactor = conversionFactor;
    return conversionRepo.save(conversion);
  }

  /**
   * Delete conversion
   */
  async removeConversion(conversionId: string): Promise<void> {
    const dataSource = await this.tenantConnectionManager.getDataSource();
    const conversionRepo = dataSource.getRepository(UomConversion);

    await conversionRepo.delete(conversionId);
  }

  /**
   * Count units
   */
  async count(): Promise<number> {
    const uomRepo = await this.getUomRepository();
    return uomRepo.count();
  }
}
