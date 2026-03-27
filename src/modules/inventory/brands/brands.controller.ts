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
import { BrandsService } from './brands.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { BrandResponseDto } from './dto/brand-response.dto';
import { BrandFilterDto } from './dto/brand-filter.dto';
import { Permissions } from '@common/decorators/permissions.decorator';
import { ApiPaginatedResponse } from '@common/decorators/api-paginated-response.decorator';

@ApiTags('Brands')
@ApiBearerAuth()
@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Post()
  @Permissions('brands.create')
  @ApiOperation({ summary: 'Create a new brand' })
  @ApiResponse({
    status: 201,
    description: 'Brand created successfully',
    type: BrandResponseDto,
  })
  async create(@Body() createBrandDto: CreateBrandDto) {
    const brand = await this.brandsService.create(createBrandDto);
    return new BrandResponseDto(brand);
  }

  @Get()
  @Permissions('brands.read')
  @ApiOperation({ summary: 'Get all brands with pagination' })
  @ApiPaginatedResponse(BrandResponseDto)
  async findAll(@Query() filterDto: BrandFilterDto) {
    const result = await this.brandsService.findAll(filterDto);
    return {
      data: result.data.map((brand) => new BrandResponseDto(brand)),
      meta: result.meta,
    };
  }

  @Get('active')
  @Permissions('brands.read')
  @ApiOperation({ summary: 'Get all active brands (for dropdowns)' })
  async findAllActive() {
    const brands = await this.brandsService.findAllActive();
    return { data: brands.map((brand) => new BrandResponseDto(brand)) };
  }

  @Get(':id')
  @Permissions('brands.read')
  @ApiOperation({ summary: 'Get brand by ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Brand found',
    type: BrandResponseDto,
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const brand = await this.brandsService.findById(id);
    return new BrandResponseDto(brand);
  }

  @Patch(':id')
  @Permissions('brands.update')
  @ApiOperation({ summary: 'Update brand' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBrandDto: UpdateBrandDto,
  ) {
    const brand = await this.brandsService.update(id, updateBrandDto);
    return new BrandResponseDto(brand);
  }

  @Delete(':id')
  @Permissions('brands.delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete brand' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.brandsService.remove(id);
  }
}
