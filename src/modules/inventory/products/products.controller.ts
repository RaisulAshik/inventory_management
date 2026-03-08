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
  UseInterceptors,
  UploadedFile,
  Res,
  BadRequestException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
  ApiConsumes,
  ApiBody,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { Response } from 'express';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductFilterDto } from './dto/product-filter.dto';
import { ProductResponseDto } from './dto/product-response.dto';
import { BulkImportResultDto, ImportMode } from './dto/bulk-import.dto';
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

  @Post('import')
  @Permissions('products.create')
  @UseInterceptors(FileInterceptor('file', { storage: memoryStorage() }))
  @ApiOperation({ summary: 'Bulk import products from CSV or XLSX' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  @ApiQuery({ name: 'mode', enum: ['INSERT', 'UPSERT'], required: false })
  @ApiResponse({ status: 200, description: 'Import result summary' })
  async bulkImport(
    @UploadedFile() file: Express.Multer.File,
    @Query('mode') mode: ImportMode = 'UPSERT',
    @CurrentUser() currentUser: JwtPayload,
  ): Promise<BulkImportResultDto> {
    if (!file) {
      throw new BadRequestException('No file uploaded');
    }
    return this.productsService.bulkImport(file, mode, currentUser.sub);
  }

  @Get('import/template')
  @Permissions('products.read')
  @ApiOperation({ summary: 'Download product import template (XLSX)' })
  @ApiResponse({ status: 200, description: 'XLSX template file' })
  async downloadTemplate(@Res() res: Response): Promise<void> {
    const buffer = await this.productsService.downloadTemplate();
    res.set({
      'Content-Type':
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition':
        'attachment; filename="product-import-template.xlsx"',
      'Content-Length': buffer.length,
    });
    res.end(buffer);
  }

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
