import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { DeepPartial, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { TenantConnectionManager } from '@database/tenant-connection.manager';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { PaginationDto } from '@common/dto/pagination.dto';
import { PaginatedResult } from '@common/interfaces';
import { paginate } from '@common/utils/pagination.util';
import { Warehouse, WarehouseZone, WarehouseLocation } from '@entities/tenant';

@Injectable()
export class WarehousesService {
  constructor(
    private readonly tenantConnectionManager: TenantConnectionManager,
  ) {}

  private async getWarehouseRepository(): Promise<Repository<Warehouse>> {
    return this.tenantConnectionManager.getRepository(Warehouse);
  }

  /**
   * Create a new warehouse
   */
  async create(
    createWarehouseDto: CreateWarehouseDto,
    createdBy: string,
  ): Promise<Warehouse> {
    const warehouseRepo = await this.getWarehouseRepository();

    // Check if code already exists
    const existingWarehouse = await warehouseRepo.findOne({
      where: { warehouseCode: createWarehouseDto.warehouseCode },
    });

    if (existingWarehouse) {
      throw new BadRequestException(
        `Warehouse with code ${createWarehouseDto.warehouseCode} already exists`,
      );
    }

    // If this is set as default, unset other defaults
    if (createWarehouseDto.isDefault) {
      await warehouseRepo.update({}, { isDefault: false });
    }

    const id = uuidv4();

    const warehouse = warehouseRepo.create({
      id,
      ...createWarehouseDto,
      createdBy,
    } as DeepPartial<Warehouse>);

    await warehouseRepo.save(warehouse);

    // Create zones if provided
    if (createWarehouseDto.zones && createWarehouseDto.zones.length > 0) {
      const dataSource = await this.tenantConnectionManager.getDataSource();
      await this.createZones(id, createWarehouseDto.zones, dataSource);
    }

    return this.findById(id);
  }

  /**
   * Create warehouse zones
   */
  private async createZones(
    warehouseId: string,
    zones: any[],
    dataSource: any,
  ): Promise<void> {
    const zoneRepo = dataSource.getRepository(WarehouseZone);

    for (const zoneDto of zones) {
      const zone = zoneRepo.create({
        id: uuidv4(),
        warehouseId,
        ...zoneDto,
      });

      await zoneRepo.save(zone);
    }
  }

  /**
   * Find all warehouses with pagination
   */
  async findAll(
    paginationDto: PaginationDto,
  ): Promise<PaginatedResult<Warehouse>> {
    const warehouseRepo = await this.getWarehouseRepository();

    const queryBuilder = warehouseRepo
      .createQueryBuilder('warehouse')
      .leftJoinAndSelect('warehouse.zones', 'zones');

    if (paginationDto.search) {
      queryBuilder.where(
        '(warehouse.warehouseCode LIKE :search OR warehouse.warehouseName LIKE :search)',
        { search: `%${paginationDto.search}%` },
      );
    }

    if (!paginationDto.sortBy) {
      paginationDto.sortBy = 'warehouseName';
      paginationDto.sortOrder = 'ASC';
    }

    return paginate(queryBuilder, paginationDto);
  }

  /**
   * Get all active warehouses (for dropdowns)
   */
  async findAllActive(): Promise<Warehouse[]> {
    const warehouseRepo = await this.getWarehouseRepository();

    return warehouseRepo.find({
      where: { isActive: true },
      order: { warehouseName: 'ASC' },
    });
  }

  /**
   * Get default warehouse
   */
  async getDefault(): Promise<Warehouse | null> {
    const warehouseRepo = await this.getWarehouseRepository();
    return warehouseRepo.findOne({
      where: { isDefault: true, isActive: true },
    });
  }

  /**
   * Find warehouse by ID
   */
  async findById(id: string): Promise<Warehouse> {
    const warehouseRepo = await this.getWarehouseRepository();

    const warehouse = await warehouseRepo.findOne({
      where: { id },
      relations: ['zones', 'zones.locations'],
    });

    if (!warehouse) {
      throw new NotFoundException(`Warehouse with ID ${id} not found`);
    }

    return warehouse;
  }

  /**
   * Find warehouse by code
   */
  async findByCode(code: string): Promise<Warehouse | null> {
    const warehouseRepo = await this.getWarehouseRepository();
    return warehouseRepo.findOne({ where: { warehouseCode: code } });
  }

  /**
   * Update warehouse
   */
  async update(
    id: string,
    updateWarehouseDto: UpdateWarehouseDto,
  ): Promise<Warehouse> {
    const warehouseRepo = await this.getWarehouseRepository();
    const warehouse = await this.findById(id);

    // Check code uniqueness if being changed
    if (
      updateWarehouseDto.warehouseCode &&
      updateWarehouseDto.warehouseCode !== warehouse.warehouseCode
    ) {
      const existingCode = await warehouseRepo.findOne({
        where: { warehouseCode: updateWarehouseDto.warehouseCode },
      });

      if (existingCode) {
        throw new BadRequestException(
          `Warehouse with code ${updateWarehouseDto.warehouseCode} already exists`,
        );
      }
    }

    // If this is set as default, unset other defaults
    if (updateWarehouseDto.isDefault && !warehouse.isDefault) {
      await warehouseRepo.update({}, { isDefault: false });
    }

    Object.assign(warehouse, updateWarehouseDto);
    await warehouseRepo.save(warehouse);

    return this.findById(id);
  }

  /**
   * Delete warehouse
   */
  async remove(id: string): Promise<void> {
    const warehouseRepo = await this.getWarehouseRepository();
    //const warehouse = await this.findById(id);

    // Check if has stock
    const dataSource = await this.tenantConnectionManager.getDataSource();
    const stockCount = await dataSource
      .createQueryBuilder()
      .select('COUNT(*)', 'count')
      .from('inventory_stock', 'is')
      .where('is.warehouse_id = :id', { id })
      .andWhere('is.quantity_on_hand > 0')
      .getRawOne();

    if (Number(stockCount.count) > 0) {
      throw new BadRequestException(
        'Cannot delete warehouse with existing stock',
      );
    }

    await warehouseRepo.delete(id);
  }

  /**
   * Get warehouse zones
   */
  async getZones(warehouseId: string): Promise<WarehouseZone[]> {
    const dataSource = await this.tenantConnectionManager.getDataSource();
    const zoneRepo = dataSource.getRepository(WarehouseZone);

    return zoneRepo.find({
      where: { warehouseId },
      relations: ['locations'],
      order: { zoneCode: 'ASC' },
    });
  }

  /**
   * Add zone to warehouse
   */
  async addZone(warehouseId: string, zoneDto: any): Promise<WarehouseZone> {
    const dataSource = await this.tenantConnectionManager.getDataSource();
    const zoneRepo = dataSource.getRepository(WarehouseZone);

    // Verify warehouse exists
    await this.findById(warehouseId);

    // Check if zone code already exists in this warehouse
    const existingZone = await zoneRepo.findOne({
      where: { warehouseId, zoneCode: zoneDto.zoneCode },
    });

    if (existingZone) {
      throw new BadRequestException(
        `Zone with code ${zoneDto.zoneCode} already exists in this warehouse`,
      );
    }

    const zone = zoneRepo.create({
      id: uuidv4(),
      warehouseId,
      ...zoneDto,
    } as WarehouseZone);

    return zoneRepo.save(zone);
  }

  /**
   * Update zone
   */
  async updateZone(zoneId: string, zoneDto: any): Promise<WarehouseZone> {
    const dataSource = await this.tenantConnectionManager.getDataSource();
    const zoneRepo = dataSource.getRepository(WarehouseZone);

    const zone = await zoneRepo.findOne({ where: { id: zoneId } });

    if (!zone) {
      throw new NotFoundException(`Zone with ID ${zoneId} not found`);
    }

    Object.assign(zone, zoneDto);
    return zoneRepo.save(zone);
  }

  /**
   * Delete zone
   */
  async removeZone(zoneId: string): Promise<void> {
    const dataSource = await this.tenantConnectionManager.getDataSource();
    const zoneRepo = dataSource.getRepository(WarehouseZone);
    const locationRepo = dataSource.getRepository(WarehouseLocation);

    // Check if has locations with stock
    const locationCount = await locationRepo
      .createQueryBuilder('loc')
      .innerJoin('location_inventory', 'li', 'li.location_id = loc.id')
      .where('loc.zone_id = :zoneId', { zoneId })
      .andWhere('li.quantity > 0')
      .getCount();

    if (locationCount > 0) {
      throw new BadRequestException(
        'Cannot delete zone with locations containing stock',
      );
    }

    await zoneRepo.delete(zoneId);
  }

  /**
   * Get warehouse stock summary
   */
  async getStockSummary(warehouseId: string): Promise<any> {
    const dataSource = await this.tenantConnectionManager.getDataSource();

    const summary = await dataSource.query(
      `
      SELECT 
        COUNT(DISTINCT product_id) as total_products,
        SUM(quantity_on_hand) as total_quantity,
        SUM(quantity_reserved) as total_reserved,
        SUM(quantity_on_hand - quantity_reserved) as total_available,
        SUM(quantity_on_hand * COALESCE(
          (SELECT cost_price FROM products WHERE id = inventory_stock.product_id), 0
        )) as total_value
      FROM inventory_stock
      WHERE warehouse_id = ?
    `,
      [warehouseId],
    );

    return summary[0];
  }

  /**
   * Count warehouses
   */
  async count(): Promise<number> {
    const warehouseRepo = await this.getWarehouseRepository();
    return warehouseRepo.count();
  }
}
