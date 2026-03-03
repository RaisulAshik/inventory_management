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
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductFilterDto } from './dto/product-filter.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { PaginationDto } from '@common/dto/pagination.dto';
import { Permissions } from '@common/decorators/permissions.decorator';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { ApiPaginatedResponse } from '@common/decorators/api-paginated-response.decorator';
import { JwtPayload } from '@common/interfaces';

@ApiTags('Products')
@ApiBearerAuth()
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @Permissions('products.create')
  @ApiOperation({ summary: 'Create a new product' })
  @ApiResponse({
    status: 201,
    description: 'Product created successfully',
    type: ProductResponseDto,
  })
  async create(
    @Body() createProductDto: CreateProductDto,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    const product = await this.productsService.create(
      createProductDto,
      currentUser.sub,
    );
    return new ProductResponseDto(product);
  }

  @Get()
  @Permissions('products.read')
  @ApiOperation({ summary: 'Get all products with pagination and filters' })
  @ApiPaginatedResponse(ProductResponseDto)
  async findAll(
    @Query() paginationDto: PaginationDto,
    @Query() filterDto: ProductFilterDto,
  ) {
    const result = await this.productsService.findAll(paginationDto, filterDto);
    return {
      data: result.data.map((product) => new ProductResponseDto(product)),
      meta: result.meta,
    };
  }

  @Get('low-stock')
  @Permissions('products.read')
  @ApiOperation({ summary: 'Get low stock products' })
  @ApiQuery({ name: 'warehouseId', required: false })
  async getLowStock(@Query('warehouseId') warehouseId?: string) {
    const products =
      await this.productsService.getLowStockProducts(warehouseId);
    return { data: products };
  }

  @Get('search/sku/:sku')
  @Permissions('products.read')
  @ApiOperation({ summary: 'Find product by SKU' })
  @ApiParam({ name: 'sku', type: 'string' })
  async findBySku(@Param('sku') sku: string) {
    const product = await this.productsService.findBySku(sku);
    if (!product) {
      return { data: null };
    }
    return { data: new ProductResponseDto(product) };
  }

  @Get('search/barcode/:barcode')
  @Permissions('products.read')
  @ApiOperation({ summary: 'Find product by barcode' })
  @ApiParam({ name: 'barcode', type: 'string' })
  async findByBarcode(@Param('barcode') barcode: string) {
    const product = await this.productsService.findByBarcode(barcode);
    if (!product) {
      return { data: null };
    }
    return { data: new ProductResponseDto(product) };
  }

  @Get(':id')
  @Permissions('products.read')
  @ApiOperation({ summary: 'Get product by ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Product found',
    type: ProductResponseDto,
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const product = await this.productsService.findById(id);
    return new ProductResponseDto(product);
  }

  @Get(':id/stock')
  @Permissions('products.read')
  @ApiOperation({ summary: 'Get product stock across all warehouses' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async getStock(@Param('id', ParseUUIDPipe) id: string) {
    const stock = await this.productsService.getProductStock(id);
    return { data: stock };
  }

  @Patch(':id')
  @Permissions('products.update')
  @ApiOperation({ summary: 'Update product' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    const product = await this.productsService.update(id, updateProductDto);
    return new ProductResponseDto(product);
  }

  @Delete(':id')
  @Permissions('products.delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete product (soft delete)' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.productsService.remove(id);
  }
}
