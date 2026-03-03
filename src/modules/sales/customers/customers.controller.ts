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
import { CustomersService } from './customers.service';
import { PaginationDto } from '@common/dto/pagination.dto';
import { Permissions } from '@common/decorators/permissions.decorator';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { ApiPaginatedResponse } from '@common/decorators/api-paginated-response.decorator';
import { JwtPayload } from '@common/interfaces';
import { CreateCustomerAddressDto } from './dto/create-customer-address.dto';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { CustomerFilterDto } from './dto/customer-filter.dto';
import { CustomerResponseDto } from './dto/customer-response.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@ApiTags('Customers')
@ApiBearerAuth()
@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  @Permissions('customers.create')
  @ApiOperation({ summary: 'Create a new customer' })
  @ApiResponse({
    status: 201,
    description: 'Customer created successfully',
    type: CustomerResponseDto,
  })
  async create(
    @Body() createCustomerDto: CreateCustomerDto,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    const customer = await this.customersService.create(
      createCustomerDto,
      currentUser.sub,
    );
    return new CustomerResponseDto(customer);
  }

  @Get()
  @Permissions('customers.read')
  @ApiOperation({ summary: 'Get all customers with filters and pagination' })
  @ApiPaginatedResponse(CustomerResponseDto)
  async findAll(
    // @Query() paginationDto: PaginationDto,
    @Query() filterDto: CustomerFilterDto,
  ) {
    const result = await this.customersService.findAll(
      // paginationDto,
      filterDto,
    );
    return {
      data: result.data.map((c) => new CustomerResponseDto(c)),
      meta: result.meta,
    };
  }

  @Get('search/email/:email')
  @Permissions('customers.read')
  @ApiOperation({ summary: 'Find customer by email' })
  @ApiParam({ name: 'email', type: 'string' })
  async findByEmail(@Param('email') email: string) {
    const customer = await this.customersService.findByEmail(email);
    return { data: customer ? new CustomerResponseDto(customer) : null };
  }

  @Get('search/code/:code')
  @Permissions('customers.read')
  @ApiOperation({ summary: 'Find customer by code' })
  @ApiParam({ name: 'code', type: 'string' })
  async findByCode(@Param('code') code: string) {
    const customer = await this.customersService.findByCode(code);
    return { data: customer ? new CustomerResponseDto(customer) : null };
  }

  @Get(':id')
  @Permissions('customers.read')
  @ApiOperation({ summary: 'Get customer by ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Customer found',
    type: CustomerResponseDto,
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const customer = await this.customersService.findById(id);
    return new CustomerResponseDto(customer);
  }

  @Get(':id/balance')
  @Permissions('customers.read')
  @ApiOperation({ summary: 'Get customer outstanding balance' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async getOutstandingBalance(@Param('id', ParseUUIDPipe) id: string) {
    const balance = await this.customersService.getOutstandingBalance(id);
    return { balance };
  }

  @Get(':id/dues')
  @Permissions('customers.read')
  @ApiOperation({ summary: 'Get customer dues' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async getDues(@Param('id', ParseUUIDPipe) id: string) {
    const dues = await this.customersService.getDues(id);
    return { data: dues };
  }

  @Get(':id/orders')
  @Permissions('customers.read')
  @ApiOperation({ summary: 'Get customer order history' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async getOrderHistory(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() paginationDto: PaginationDto,
  ) {
    const result = await this.customersService.getOrderHistory(
      id,
      paginationDto,
    );
    return result;
  }

  @Get(':id/addresses')
  @Permissions('customers.read')
  @ApiOperation({ summary: 'Get customer addresses' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async getAddresses(@Param('id', ParseUUIDPipe) id: string) {
    const addresses = await this.customersService.getAddresses(id);
    return { data: addresses };
  }

  @Get(':id/check-credit')
  @Permissions('customers.read')
  @ApiOperation({ summary: 'Check if order amount is within credit limit' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiQuery({ name: 'amount', type: 'number' })
  async checkCreditLimit(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('amount') amount: number,
  ) {
    const isWithinLimit = await this.customersService.checkCreditLimit(
      id,
      Number(amount),
    );
    return { isWithinLimit };
  }

  @Patch(':id')
  @Permissions('customers.update')
  @ApiOperation({ summary: 'Update customer' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    const customer = await this.customersService.update(id, updateCustomerDto);
    return new CustomerResponseDto(customer);
  }

  @Patch(':id/credit-limit')
  @Permissions('customers.update')
  @ApiOperation({ summary: 'Update customer credit limit' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async updateCreditLimit(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('creditLimit') creditLimit: number,
  ) {
    const customer = await this.customersService.updateCreditLimit(
      id,
      creditLimit,
    );
    return new CustomerResponseDto(customer);
  }

  @Delete(':id')
  @Permissions('customers.delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete customer (soft delete)' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.customersService.remove(id);
  }

  // Address endpoints
  @Post(':id/addresses')
  @Permissions('customers.update')
  @ApiOperation({ summary: 'Add address to customer' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async addAddress(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() addressDto: CreateCustomerAddressDto,
  ) {
    const address = await this.customersService.addAddress(id, addressDto);
    return address;
  }

  @Patch('addresses/:addressId')
  @Permissions('customers.update')
  @ApiOperation({ summary: 'Update customer address' })
  @ApiParam({ name: 'addressId', type: 'string', format: 'uuid' })
  async updateAddress(
    @Param('addressId', ParseUUIDPipe) addressId: string,
    @Body() addressDto: Partial<CreateCustomerAddressDto>,
  ) {
    const address = await this.customersService.updateAddress(
      addressId,
      addressDto,
    );
    return address;
  }

  @Delete('addresses/:addressId')
  @Permissions('customers.update')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remove customer address' })
  @ApiParam({ name: 'addressId', type: 'string', format: 'uuid' })
  async removeAddress(@Param('addressId', ParseUUIDPipe) addressId: string) {
    await this.customersService.removeAddress(addressId);
  }
}
