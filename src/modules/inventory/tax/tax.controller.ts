import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
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
import { TaxService } from './tax.service';
import { Permissions } from '@common/decorators/permissions.decorator';
import { CreateTaxRateDto } from './dto/taxRate.dto';
import { CreateTaxCategoryDto } from './dto/taxCategory.dto';
import { TaxCategoryFilterDto } from './dto/tax-category-filter.dto';
import { TaxRateFilterDto } from './dto/tax-rate-filter.dto';

@ApiTags('Tax')
@ApiBearerAuth()
@Controller('tax')
export class TaxController {
  constructor(private readonly taxService: TaxService) {}

  // ─── Categories ───────────────────────────────────────────────────────────

  @Post('categories')
  @Permissions('tax.write')
  @ApiOperation({ summary: 'Create a new tax category' })
  @ApiResponse({
    status: 201,
    description: 'Tax category created successfully',
  })
  createCategory(@Body() dto: CreateTaxCategoryDto) {
    return this.taxService.createCategory(dto);
  }

  @Get('categories')
  @Permissions('tax.read')
  @ApiOperation({ summary: 'Get all tax categories with their rates' })
  getAllCategories(@Query() filterDto: TaxCategoryFilterDto) {
    return this.taxService.findAllCategories(filterDto);
  }

  @Get('categories/dropdown')
  @Permissions('tax.read')
  @ApiOperation({
    summary: 'Get tax categories as id/label pairs for dropdowns',
  })
  getCategoriesDropdown() {
    return this.taxService.findCategoriesDropdown();
  }

  @Patch('categories/:id')
  @Permissions('tax.write')
  @ApiOperation({ summary: 'Update a tax category by ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  updateCategory(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CreateTaxCategoryDto,
  ) {
    return this.taxService.updateCategory(id, dto);
  }

  @Get('categories/:code')
  @Permissions('tax.read')
  @ApiOperation({ summary: 'Get tax category by code' })
  @ApiParam({
    name: 'code',
    type: 'string',
    description: 'Tax code e.g. GST, VAT',
  })
  getCategory(@Param('code') code: string) {
    return this.taxService.findCategoryByCode(code);
  }

  // ─── Rates ────────────────────────────────────────────────────────────────

  @Get('rates')
  @Permissions('tax.read')
  @ApiOperation({ summary: 'Get all tax rates' })
  getAllRates(@Query() filterDto: TaxRateFilterDto) {
    return this.taxService.findAllRates(filterDto);
  }

  @Get('rates/active')
  @Permissions('tax.read')
  @ApiOperation({
    summary: 'Get currently active tax rates (within effective date range)',
  })
  @ApiQuery({
    name: 'categoryId',
    required: false,
    description: 'Filter by tax category ID',
  })
  getActiveRates(@Query('categoryId') categoryId?: string) {
    return this.taxService.findActiveRates(categoryId);
  }

  @Get('rates/:id')
  @Permissions('tax.read')
  @ApiOperation({ summary: 'Get tax rate by ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  getRateById(@Param('id', ParseUUIDPipe) id: string) {
    return this.taxService.findRateById(id);
  }

  @Post('rates')
  @Permissions('tax.write')
  @ApiOperation({ summary: 'Create a new tax rate' })
  @ApiResponse({ status: 201, description: 'Tax rate created successfully' })
  createRate(@Body() createRateDto: CreateTaxRateDto) {
    return this.taxService.createRate(createRateDto);
  }

  @Patch('rates/:id')
  @Permissions('tax.write')
  @ApiOperation({ summary: 'Update a tax rate by ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  updateRate(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: Partial<CreateTaxRateDto>,
  ) {
    return this.taxService.updateRate(id, dto);
  }
}
