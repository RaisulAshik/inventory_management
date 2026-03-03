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
} from '@nestjs/swagger';
import { WarehousesService } from './warehouses.service';
import { CreateWarehouseDto } from './dto/create-warehouse.dto';
import { UpdateWarehouseDto } from './dto/update-warehouse.dto';
import { WarehouseResponseDto } from './dto/warehouse-response.dto';
import { CreateZoneDto } from './dto/create-zone.dto';
import { PaginationDto } from '@common/dto/pagination.dto';
import { Permissions } from '@common/decorators/permissions.decorator';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { ApiPaginatedResponse } from '@common/decorators/api-paginated-response.decorator';
import { JwtPayload } from '@common/interfaces';

@ApiTags('Warehouses')
@ApiBearerAuth()
@Controller('warehouses')
export class WarehousesController {
  constructor(private readonly warehousesService: WarehousesService) {}

  @Post()
  @Permissions('warehouses.create')
  @ApiOperation({ summary: 'Create a new warehouse' })
  @ApiResponse({
    status: 201,
    description: 'Warehouse created successfully',
    type: WarehouseResponseDto,
  })
  async create(
    @Body() createWarehouseDto: CreateWarehouseDto,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    const warehouse = await this.warehousesService.create(
      createWarehouseDto,
      currentUser.sub,
    );
    return new WarehouseResponseDto(warehouse);
  }

  @Get()
  @Permissions('warehouses.read')
  @ApiOperation({ summary: 'Get all warehouses with pagination' })
  @ApiPaginatedResponse(WarehouseResponseDto)
  async findAll(@Query() paginationDto: PaginationDto) {
    const result = await this.warehousesService.findAll(paginationDto);
    return {
      data: result.data.map((w) => new WarehouseResponseDto(w)),
      meta: result.meta,
    };
  }

  @Get('active')
  @Permissions('warehouses.read')
  @ApiOperation({ summary: 'Get all active warehouses (for dropdowns)' })
  async findAllActive() {
    const warehouses = await this.warehousesService.findAllActive();
    return { data: warehouses.map((w) => new WarehouseResponseDto(w)) };
  }

  @Get('default')
  @Permissions('warehouses.read')
  @ApiOperation({ summary: 'Get default warehouse' })
  async getDefault() {
    const warehouse = await this.warehousesService.getDefault();
    return { data: warehouse ? new WarehouseResponseDto(warehouse) : null };
  }

  @Get(':id')
  @Permissions('warehouses.read')
  @ApiOperation({ summary: 'Get warehouse by ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Warehouse found',
    type: WarehouseResponseDto,
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const warehouse = await this.warehousesService.findById(id);
    return new WarehouseResponseDto(warehouse);
  }

  @Get(':id/zones')
  @Permissions('warehouses.read')
  @ApiOperation({ summary: 'Get warehouse zones' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async getZones(@Param('id', ParseUUIDPipe) id: string) {
    const zones = await this.warehousesService.getZones(id);
    return { data: zones };
  }

  @Get(':id/stock-summary')
  @Permissions('warehouses.read')
  @ApiOperation({ summary: 'Get warehouse stock summary' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async getStockSummary(@Param('id', ParseUUIDPipe) id: string) {
    const summary = await this.warehousesService.getStockSummary(id);
    return summary;
  }

  @Patch(':id')
  @Permissions('warehouses.update')
  @ApiOperation({ summary: 'Update warehouse' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateWarehouseDto: UpdateWarehouseDto,
  ) {
    const warehouse = await this.warehousesService.update(
      id,
      updateWarehouseDto,
    );
    return new WarehouseResponseDto(warehouse);
  }

  @Delete(':id')
  @Permissions('warehouses.delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete warehouse' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.warehousesService.remove(id);
  }

  // Zone endpoints
  @Post(':id/zones')
  @Permissions('warehouses.update')
  @ApiOperation({ summary: 'Add zone to warehouse' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async addZone(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() zoneDto: CreateZoneDto,
  ) {
    const zone = await this.warehousesService.addZone(id, zoneDto);
    return zone;
  }

  @Patch('zones/:zoneId')
  @Permissions('warehouses.update')
  @ApiOperation({ summary: 'Update warehouse zone' })
  @ApiParam({ name: 'zoneId', type: 'string', format: 'uuid' })
  async updateZone(
    @Param('zoneId', ParseUUIDPipe) zoneId: string,
    @Body() zoneDto: CreateZoneDto,
  ) {
    const zone = await this.warehousesService.updateZone(zoneId, zoneDto);
    return zone;
  }

  @Delete('zones/:zoneId')
  @Permissions('warehouses.update')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete warehouse zone' })
  @ApiParam({ name: 'zoneId', type: 'string', format: 'uuid' })
  async removeZone(@Param('zoneId', ParseUUIDPipe) zoneId: string) {
    await this.warehousesService.removeZone(zoneId);
  }
}
