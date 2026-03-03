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
import { SuppliersService } from './suppliers.service';
import { PaginationDto } from '@common/dto/pagination.dto';
import { Permissions } from '@common/decorators/permissions.decorator';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { ApiPaginatedResponse } from '@common/decorators/api-paginated-response.decorator';
import { JwtPayload } from '@common/interfaces';
import { CreateSupplierDto } from './dto/create-supplier.dto';
import { SupplierFilterDto } from './dto/supplier-filter.dto';
import { SupplierResponseDto } from './dto/supplier-response.dto';
import { UpdateSupplierDto } from './dto/update-supplier.dto';
import { CreateSupplierContactDto } from './dto/create-supplier-contact.dto';
import { CreateSupplierProductDto } from './dto/create-supplier-product.dto';

@ApiTags('Suppliers')
@ApiBearerAuth()
@Controller('suppliers')
export class SuppliersController {
  constructor(private readonly suppliersService: SuppliersService) {}

  @Post()
  @Permissions('suppliers.create')
  @ApiOperation({ summary: 'Create a new supplier' })
  @ApiResponse({
    status: 201,
    description: 'Supplier created successfully',
    type: SupplierResponseDto,
  })
  async create(
    @Body() createSupplierDto: CreateSupplierDto,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    const supplier = await this.suppliersService.create(
      createSupplierDto,
      currentUser.sub,
    );
    return new SupplierResponseDto(supplier);
  }

  @Get()
  @Permissions('suppliers.read')
  @ApiOperation({ summary: 'Get all suppliers with pagination and filters' })
  @ApiPaginatedResponse(SupplierResponseDto)
  async findAll(
    @Query() paginationDto: PaginationDto,
    @Query() filterDto: SupplierFilterDto,
  ) {
    const result = await this.suppliersService.findAll(
      paginationDto,
      filterDto,
    );
    return {
      data: result.data.map((supplier) => new SupplierResponseDto(supplier)),
      meta: result.meta,
    };
  }

  @Get('active')
  @Permissions('suppliers.read')
  @ApiOperation({ summary: 'Get all active suppliers (for dropdowns)' })
  async findAllActive() {
    const suppliers = await this.suppliersService.findAllActive();
    return { data: suppliers.map((s) => new SupplierResponseDto(s)) };
  }

  @Get(':id')
  @Permissions('suppliers.read')
  @ApiOperation({ summary: 'Get supplier by ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Supplier found',
    type: SupplierResponseDto,
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const supplier = await this.suppliersService.findById(id);
    return new SupplierResponseDto(supplier);
  }

  @Get(':id/balance')
  @Permissions('suppliers.read')
  @ApiOperation({ summary: 'Get supplier outstanding balance' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async getOutstandingBalance(@Param('id', ParseUUIDPipe) id: string) {
    const balance = await this.suppliersService.getOutstandingBalance(id);
    return { balance };
  }

  @Get(':id/products')
  @Permissions('suppliers.read')
  @ApiOperation({ summary: 'Get supplier product catalog' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async getProducts(@Param('id', ParseUUIDPipe) id: string) {
    const products = await this.suppliersService.getSupplierProducts(id);
    return { data: products };
  }

  @Patch(':id')
  @Permissions('suppliers.update')
  @ApiOperation({ summary: 'Update supplier' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSupplierDto: UpdateSupplierDto,
  ) {
    const supplier = await this.suppliersService.update(id, updateSupplierDto);
    return new SupplierResponseDto(supplier);
  }

  @Delete(':id')
  @Permissions('suppliers.delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete supplier (soft delete)' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.suppliersService.remove(id);
  }

  // Contact endpoints
  @Post(':id/contacts')
  @Permissions('suppliers.update')
  @ApiOperation({ summary: 'Add contact to supplier' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async addContact(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() contactDto: CreateSupplierContactDto,
  ) {
    const contact = await this.suppliersService.addContact(id, contactDto);
    return contact;
  }

  @Patch('contacts/:contactId')
  @Permissions('suppliers.update')
  @ApiOperation({ summary: 'Update supplier contact' })
  @ApiParam({ name: 'contactId', type: 'string', format: 'uuid' })
  async updateContact(
    @Param('contactId', ParseUUIDPipe) contactId: string,
    @Body() contactDto: CreateSupplierContactDto,
  ) {
    const contact = await this.suppliersService.updateContact(
      contactId,
      contactDto,
    );
    return contact;
  }

  @Delete('contacts/:contactId')
  @Permissions('suppliers.update')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove supplier contact' })
  @ApiParam({ name: 'contactId', type: 'string', format: 'uuid' })
  async removeContact(@Param('contactId', ParseUUIDPipe) contactId: string) {
    await this.suppliersService.removeContact(contactId);
  }

  // Product catalog endpoints
  @Post(':id/products')
  @Permissions('suppliers.update')
  @ApiOperation({ summary: 'Add product to supplier catalog' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async addProduct(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() productDto: CreateSupplierProductDto,
  ) {
    const product = await this.suppliersService.addProduct(id, productDto);
    return product;
  }

  @Patch('products/:productId')
  @Permissions('suppliers.update')
  @ApiOperation({ summary: 'Update supplier product' })
  @ApiParam({ name: 'productId', type: 'string', format: 'uuid' })
  async updateProduct(
    @Param('productId', ParseUUIDPipe) productId: string,
    @Body() productDto: CreateSupplierProductDto,
  ) {
    const product = await this.suppliersService.updateProduct(
      productId,
      productDto,
    );
    return product;
  }

  @Delete('products/:productId')
  @Permissions('suppliers.update')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove product from supplier catalog' })
  @ApiParam({ name: 'productId', type: 'string', format: 'uuid' })
  async removeProduct(@Param('productId', ParseUUIDPipe) productId: string) {
    await this.suppliersService.removeProduct(productId);
  }
}
