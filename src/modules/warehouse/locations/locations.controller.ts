import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { LocationsService } from './locations.service';
import { Permissions } from '@common/decorators/permissions.decorator';
import { ApiPaginatedResponse } from '@common/decorators/api-paginated-response.decorator';
import { LocationStatus } from '@common/enums';
import { BulkCreateLocationDto } from './dto/bulk-create-location.dto';
import { CreateLocationDto } from './dto/create-location.dto';
import { LocationFilterDto } from './dto/location-filter.dto';
import { LocationResponseDto } from './dto/location-response.dto';
import { UpdateLocationDto } from './dto/update-location.dto';

@ApiTags('Warehouse Locations')
@ApiBearerAuth()
@Controller('locations')
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Post()
  @Permissions('locations.create')
  @ApiOperation({ summary: 'Create a new location' })
  @ApiResponse({
    status: 201,
    description: 'Location created successfully',
    type: LocationResponseDto,
  })
  async create(@Body() createLocationDto: CreateLocationDto) {
    const location = await this.locationsService.create(createLocationDto);
    return new LocationResponseDto(location);
  }

  @Post('bulk')
  @Permissions('locations.create')
  @ApiOperation({ summary: 'Bulk create locations' })
  async bulkCreate(@Body() dto: BulkCreateLocationDto) {
    const result = await this.locationsService.bulkCreate(
      dto.warehouseId,
      dto.zoneId,
      dto.config,
    );
    return result;
  }

  @Get()
  @Permissions('locations.read')
  @ApiOperation({ summary: 'Get all locations with filters and pagination' })
  @ApiPaginatedResponse(LocationResponseDto)
  async findAll(
    @Query() filterDto: LocationFilterDto,
  ) {
    const result = await this.locationsService.findAll(filterDto);
    return {
      data: result.data.map((loc) => new LocationResponseDto(loc)),
      meta: result.meta,
    };
  }

  @Get('warehouse/:warehouseId')
  @Permissions('locations.read')
  @ApiOperation({ summary: 'Get locations by warehouse' })
  @ApiParam({ name: 'warehouseId', type: 'string', format: 'uuid' })
  async findByWarehouse(
    @Param('warehouseId', ParseUUIDPipe) warehouseId: string,
  ) {
    const locations = await this.locationsService.findByWarehouse(warehouseId);
    return { data: locations.map((loc) => new LocationResponseDto(loc)) };
  }

  @Get('zone/:zoneId')
  @Permissions('locations.read')
  @ApiOperation({ summary: 'Get locations by zone' })
  @ApiParam({ name: 'zoneId', type: 'string', format: 'uuid' })
  async findByZone(@Param('zoneId', ParseUUIDPipe) zoneId: string) {
    const locations = await this.locationsService.findByZone(zoneId);
    return { data: locations.map((loc) => new LocationResponseDto(loc)) };
  }

  @Get('available/:warehouseId')
  @Permissions('locations.read')
  @ApiOperation({ summary: 'Get available locations for putaway' })
  @ApiParam({ name: 'warehouseId', type: 'string', format: 'uuid' })
  @ApiQuery({ name: 'zoneId', required: false })
  async getAvailableLocations(
    @Param('warehouseId', ParseUUIDPipe) warehouseId: string,
    @Query('zoneId') zoneId?: string,
  ) {
    const locations = await this.locationsService.getAvailableLocations(
      warehouseId,
      zoneId,
    );
    return { data: locations.map((loc) => new LocationResponseDto(loc)) };
  }

  @Get('barcode/:barcode')
  @Permissions('locations.read')
  @ApiOperation({ summary: 'Find location by barcode' })
  @ApiParam({ name: 'barcode', type: 'string' })
  async findByBarcode(@Param('barcode') barcode: string) {
    const location = await this.locationsService.findByBarcode(barcode);
    return { data: location ? new LocationResponseDto(location) : null };
  }

  @Get(':id')
  @Permissions('locations.read')
  @ApiOperation({ summary: 'Get location by ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Location found',
    type: LocationResponseDto,
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const location = await this.locationsService.findById(id);
    return new LocationResponseDto(location);
  }

  @Get(':id/inventory')
  @Permissions('locations.read')
  @ApiOperation({ summary: 'Get location inventory' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async getInventory(@Param('id', ParseUUIDPipe) id: string) {
    const inventory = await this.locationsService.getInventory(id);
    return { data: inventory };
  }

  @Get(':id/utilization')
  @Permissions('locations.read')
  @ApiOperation({ summary: 'Get location utilization' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async getUtilization(@Param('id', ParseUUIDPipe) id: string) {
    const utilization = await this.locationsService.getUtilization(id);
    return utilization;
  }

  @Patch(':id')
  @Permissions('locations.update')
  @ApiOperation({ summary: 'Update location' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateLocationDto: UpdateLocationDto,
  ) {
    const location = await this.locationsService.update(id, updateLocationDto);
    return new LocationResponseDto(location);
  }

  @Patch(':id/status')
  @Permissions('locations.update')
  @ApiOperation({ summary: 'Update location status' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async updateStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('status') status: LocationStatus,
  ) {
    const location = await this.locationsService.updateStatus(id, status);
    return new LocationResponseDto(location);
  }

  @Delete(':id')
  @Permissions('locations.delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete location' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.locationsService.remove(id);
  }
}
