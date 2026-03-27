import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { TenantConnectionManager } from '@database/tenant-connection.manager';
import { PaginatedResult } from '@common/interfaces';
import { paginate } from '@common/utils/pagination.util';
import { LocationStatus } from '@common/enums';
import { WarehouseLocation, LocationInventory } from '@entities/tenant';
import { CreateLocationDto } from './dto/create-location.dto';
import { LocationFilterDto } from './dto/location-filter.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

@Injectable()
export class LocationsService {
  constructor(
    private readonly tenantConnectionManager: TenantConnectionManager,
  ) {}

  private async getLocationRepository(): Promise<
    Repository<WarehouseLocation>
  > {
    return this.tenantConnectionManager.getRepository(WarehouseLocation);
  }

  /**
   * Create a new location
   */
  async create(
    createLocationDto: CreateLocationDto,
  ): Promise<WarehouseLocation> {
    const locationRepo = await this.getLocationRepository();

    // Check if code already exists in this warehouse
    const existingLocation = await locationRepo.findOne({
      where: {
        warehouseId: createLocationDto.warehouseId,
        locationCode: createLocationDto.locationCode,
      },
    });

    if (existingLocation) {
      throw new BadRequestException(
        `Location with code ${createLocationDto.locationCode} already exists in this warehouse`,
      );
    }

    // Generate barcode if not provided
    const barcode =
      createLocationDto.barcode ||
      `LOC-${createLocationDto.warehouseId.substring(0, 8)}-${createLocationDto.locationCode}`;

    const location = locationRepo.create({
      id: uuidv4(),
      ...createLocationDto,
      barcode,
      status: LocationStatus.AVAILABLE,
    });

    return locationRepo.save(location);
  }

  /**
   * Find all locations with filters and pagination
   */
  async findAll(
    filterDto: LocationFilterDto,
  ): Promise<PaginatedResult<WarehouseLocation>> {
    const locationRepo = await this.getLocationRepository();

    const queryBuilder = locationRepo
      .createQueryBuilder('location')
      .leftJoinAndSelect('location.warehouse', 'warehouse')
      .leftJoinAndSelect('location.zone', 'zone');

    // Apply filters
    if (filterDto.warehouseId) {
      queryBuilder.andWhere('location.warehouseId = :warehouseId', {
        warehouseId: filterDto.warehouseId,
      });
    }

    if (filterDto.zoneId) {
      queryBuilder.andWhere('location.zoneId = :zoneId', {
        zoneId: filterDto.zoneId,
      });
    }

    if (filterDto.locationType) {
      queryBuilder.andWhere('location.locationType = :locationType', {
        locationType: filterDto.locationType,
      });
    }

    if (filterDto.status) {
      queryBuilder.andWhere('location.status = :status', {
        status: filterDto.status,
      });
    }

    if (filterDto.aisle) {
      queryBuilder.andWhere('location.aisle = :aisle', {
        aisle: filterDto.aisle,
      });
    }

    if (filterDto.rack) {
      queryBuilder.andWhere('location.rack = :rack', {
        rack: filterDto.rack,
      });
    }

    // Apply search
    if (filterDto.search) {
      queryBuilder.andWhere(
        '(location.locationCode LIKE :search OR location.locationName LIKE :search OR location.barcode LIKE :search)',
        { search: `%${filterDto.search}%` },
      );
    }

    if (!filterDto.sortBy) {
      filterDto.sortBy = 'locationCode';
      filterDto.sortOrder = 'ASC';
    }

    return paginate(queryBuilder, filterDto);
  }

  /**
   * Get locations by warehouse
   */
  async findByWarehouse(warehouseId: string): Promise<WarehouseLocation[]> {
    const locationRepo = await this.getLocationRepository();

    return locationRepo.find({
      where: { warehouseId },
      relations: ['zone'],
      order: { locationCode: 'ASC' },
    });
  }

  /**
   * Get locations by zone
   */
  async findByZone(zoneId: string): Promise<WarehouseLocation[]> {
    const locationRepo = await this.getLocationRepository();

    return locationRepo.find({
      where: { zoneId },
      order: { locationCode: 'ASC' },
    });
  }

  /**
   * Get available locations for putaway
   */
  async getAvailableLocations(
    warehouseId: string,
    zoneId?: string,
  ): Promise<WarehouseLocation[]> {
    const locationRepo = await this.getLocationRepository();

    const queryBuilder = locationRepo
      .createQueryBuilder('location')
      .where('location.warehouseId = :warehouseId', { warehouseId })
      .andWhere('location.status = :status', {
        status: LocationStatus.AVAILABLE,
      })
      .andWhere(
        '(location.maxUnits IS NULL OR location.currentUnits < location.maxUnits)',
      );

    if (zoneId) {
      queryBuilder.andWhere('location.zoneId = :zoneId', { zoneId });
    }

    queryBuilder.orderBy('location.currentUnits', 'ASC');

    return queryBuilder.getMany();
  }

  /**
   * Find location by ID
   */
  async findById(id: string): Promise<WarehouseLocation> {
    const locationRepo = await this.getLocationRepository();

    const location = await locationRepo.findOne({
      where: { id },
      relations: ['warehouse', 'zone'],
    });

    if (!location) {
      throw new NotFoundException(`Location with ID ${id} not found`);
    }

    return location;
  }

  /**
   * Find location by barcode
   */
  async findByBarcode(barcode: string): Promise<WarehouseLocation | null> {
    const locationRepo = await this.getLocationRepository();

    return locationRepo.findOne({
      where: { barcode },
      relations: ['warehouse', 'zone'],
    });
  }

  /**
   * Update location
   */
  async update(
    id: string,
    updateLocationDto: UpdateLocationDto,
  ): Promise<WarehouseLocation> {
    const locationRepo = await this.getLocationRepository();
    const location = await this.findById(id);

    // Check code uniqueness if being changed
    if (
      updateLocationDto.locationCode &&
      updateLocationDto.locationCode !== location.locationCode
    ) {
      const existingCode = await locationRepo.findOne({
        where: {
          warehouseId: location.warehouseId,
          locationCode: updateLocationDto.locationCode,
        },
      });

      if (existingCode) {
        throw new BadRequestException(
          `Location with code ${updateLocationDto.locationCode} already exists in this warehouse`,
        );
      }
    }

    Object.assign(location, updateLocationDto);
    return locationRepo.save(location);
  }

  /**
   * Delete location
   */
  async remove(id: string): Promise<void> {
    const locationRepo = await this.getLocationRepository();
    //const location = await this.findById(id);

    // Check if has inventory
    const dataSource = await this.tenantConnectionManager.getDataSource();
    const inventoryCount = await dataSource
      .createQueryBuilder()
      .select('COUNT(*)', 'count')
      .from('location_inventory', 'li')
      .where('li.location_id = :id', { id })
      .andWhere('li.quantity > 0')
      .getRawOne();

    if (parseInt(inventoryCount.count) > 0) {
      throw new BadRequestException(
        'Cannot delete location with existing inventory',
      );
    }

    await locationRepo.delete(id);
  }

  /**
   * Update location status
   */
  async updateStatus(
    id: string,
    status: LocationStatus,
  ): Promise<WarehouseLocation> {
    const location = await this.findById(id);
    location.status = status;

    const locationRepo = await this.getLocationRepository();
    return locationRepo.save(location);
  }

  /**
   * Get location inventory
   */
  async getInventory(locationId: string): Promise<LocationInventory[]> {
    const dataSource = await this.tenantConnectionManager.getDataSource();
    const locationInvRepo = dataSource.getRepository(LocationInventory);

    return locationInvRepo.find({
      where: { locationId },
      relations: ['product', 'variant', 'batch'],
    });
  }

  /**
   * Get location utilization
   */
  async getUtilization(locationId: string): Promise<{
    weightUtilization: number | null;
    volumeUtilization: number | null;
    unitsUtilization: number | null;
  }> {
    const location = await this.findById(locationId);

    const weightUtilization = location.maxWeightKg
      ? (Number(location.currentWeightKg) / Number(location.maxWeightKg)) * 100
      : null;

    const volumeUtilization = location.maxVolumeCbm
      ? (Number(location.currentVolumeCbm) / Number(location.maxVolumeCbm)) *
        100
      : null;

    const unitsUtilization = location.maxUnits
      ? (Number(location.currentUnits) / Number(location.maxUnits)) * 100
      : null;

    return {
      weightUtilization,
      volumeUtilization,
      unitsUtilization,
    };
  }

  /**
   * Bulk create locations
   */
  async bulkCreate(
    warehouseId: string,
    zoneId: string,
    config: {
      aisleStart: string;
      aisleEnd: string;
      rackStart: string;
      rackEnd: string;
      shelfStart: number;
      shelfEnd: number;
      binStart?: number;
      binEnd?: number;
      locationType: string;
    },
  ): Promise<{ created: number }> {
    const locationRepo = await this.getLocationRepository();
    let created = 0;

    const aisles = this.generateRange(config.aisleStart, config.aisleEnd);
    const racks = this.generateRange(config.rackStart, config.rackEnd);

    for (const aisle of aisles) {
      for (const rack of racks) {
        for (let shelf = config.shelfStart; shelf <= config.shelfEnd; shelf++) {
          const binStart = config.binStart || 1;
          const binEnd = config.binEnd || 1;

          for (let bin = binStart; bin <= binEnd; bin++) {
            const locationCode = `${aisle}-${rack}-${String(shelf).padStart(2, '0')}-${String(bin).padStart(2, '0')}`;
            const locationName = `Aisle ${aisle}, Rack ${rack}, Shelf ${shelf}, Bin ${bin}`;

            try {
              const location = locationRepo.create({
                id: uuidv4(),
                warehouseId,
                zoneId,
                locationCode,
                locationName,
                aisle,
                rack,
                shelf: String(shelf),
                bin: String(bin),
                locationType: config.locationType as any,
                barcode: `LOC-${locationCode}`,
                status: LocationStatus.AVAILABLE,
              });

              await locationRepo.save(location);
              created++;
            } catch (error) {
              // Skip if already exists
            }
          }
        }
      }
    }

    return { created };
  }

  /**
   * Generate alphabetic or numeric range
   */
  private generateRange(start: string, end: string): string[] {
    const result: string[] = [];

    if (/^\d+$/.test(start) && /^\d+$/.test(end)) {
      // Numeric range
      for (let i = parseInt(start); i <= parseInt(end); i++) {
        result.push(String(i).padStart(start.length, '0'));
      }
    } else {
      // Alphabetic range
      for (let i = start.charCodeAt(0); i <= end.charCodeAt(0); i++) {
        result.push(String.fromCharCode(i));
      }
    }

    return result;
  }

  /**
   * Count locations
   */
  async count(warehouseId?: string): Promise<number> {
    const locationRepo = await this.getLocationRepository();

    if (warehouseId) {
      return locationRepo.count({ where: { warehouseId } });
    }

    return locationRepo.count();
  }
}
