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
import { UnitsService } from './units.service';
import { PaginationDto } from '@common/dto/pagination.dto';
import { Permissions } from '@common/decorators/permissions.decorator';
import { ApiPaginatedResponse } from '@common/decorators/api-paginated-response.decorator';
import { CreateUnitDto } from './dto/create-unit.dto';
import { CreateUomConversionDto } from './dto/create-uom-conversion.dto';
import { UnitResponseDto } from './dto/unit-response.dto';
import { UpdateUnitDto } from './dto/update-unit.dto';

@ApiTags('Units of Measure')
@ApiBearerAuth()
@Controller('units')
export class UnitsController {
  constructor(private readonly unitsService: UnitsService) {}

  @Post()
  @Permissions('units.create')
  @ApiOperation({ summary: 'Create a new unit of measure' })
  @ApiResponse({
    status: 201,
    description: 'Unit created successfully',
    type: UnitResponseDto,
  })
  async create(@Body() createUnitDto: CreateUnitDto) {
    const unit = await this.unitsService.create(createUnitDto);
    return new UnitResponseDto(unit);
  }

  @Get()
  @Permissions('units.read')
  @ApiOperation({ summary: 'Get all units with pagination' })
  @ApiPaginatedResponse(UnitResponseDto)
  async findAll(@Query() paginationDto: PaginationDto) {
    const result = await this.unitsService.findAll(paginationDto);
    return {
      data: result.data.map((unit) => new UnitResponseDto(unit)),
      meta: result.meta,
    };
  }

  @Get('active')
  @Permissions('units.read')
  @ApiOperation({ summary: 'Get all active units (for dropdowns)' })
  async findAllActive() {
    const units = await this.unitsService.findAllActive();
    return { data: units.map((unit) => new UnitResponseDto(unit)) };
  }

  @Get('type/:type')
  @Permissions('units.read')
  @ApiOperation({ summary: 'Get units by type' })
  @ApiParam({ name: 'type', type: 'string' })
  async findByType(@Param('type') type: string) {
    const units = await this.unitsService.findByType(type);
    return { data: units.map((unit) => new UnitResponseDto(unit)) };
  }

  @Get('convert')
  @Permissions('units.read')
  @ApiOperation({ summary: 'Convert quantity between units' })
  @ApiQuery({ name: 'fromUomId', type: 'string' })
  @ApiQuery({ name: 'toUomId', type: 'string' })
  @ApiQuery({ name: 'quantity', type: 'number' })
  async convert(
    @Query('fromUomId') fromUomId: string,
    @Query('toUomId') toUomId: string,
    @Query('quantity') quantity: number,
  ) {
    const convertedQuantity = await this.unitsService.convert(
      fromUomId,
      toUomId,
      Number(quantity),
    );
    return { convertedQuantity };
  }

  @Get(':id')
  @Permissions('units.read')
  @ApiOperation({ summary: 'Get unit by ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Unit found',
    type: UnitResponseDto,
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const unit = await this.unitsService.findById(id);
    return new UnitResponseDto(unit);
  }

  @Get(':id/conversions')
  @Permissions('units.read')
  @ApiOperation({ summary: 'Get conversions for a unit' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async getConversions(@Param('id', ParseUUIDPipe) id: string) {
    const conversions = await this.unitsService.getConversions(id);
    return { data: conversions };
  }

  @Patch(':id')
  @Permissions('units.update')
  @ApiOperation({ summary: 'Update unit' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUnitDto: UpdateUnitDto,
  ) {
    const unit = await this.unitsService.update(id, updateUnitDto);
    return new UnitResponseDto(unit);
  }

  @Delete(':id')
  @Permissions('units.delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete unit' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.unitsService.remove(id);
  }

  // Conversion endpoints
  @Post('conversions')
  @Permissions('units.update')
  @ApiOperation({ summary: 'Create unit conversion' })
  async createConversion(@Body() dto: CreateUomConversionDto) {
    const conversion = await this.unitsService.createConversion(dto);
    return conversion;
  }

  @Patch('conversions/:conversionId')
  @Permissions('units.update')
  @ApiOperation({ summary: 'Update unit conversion' })
  @ApiParam({ name: 'conversionId', type: 'string', format: 'uuid' })
  async updateConversion(
    @Param('conversionId', ParseUUIDPipe) conversionId: string,
    @Body('conversionFactor') conversionFactor: number,
  ) {
    const conversion = await this.unitsService.updateConversion(
      conversionId,
      conversionFactor,
    );
    return conversion;
  }

  @Delete('conversions/:conversionId')
  @Permissions('units.update')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete unit conversion' })
  @ApiParam({ name: 'conversionId', type: 'string', format: 'uuid' })
  async removeConversion(
    @Param('conversionId', ParseUUIDPipe) conversionId: string,
  ) {
    await this.unitsService.removeConversion(conversionId);
  }
}
