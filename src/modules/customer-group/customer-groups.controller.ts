// src/modules/customer-groups/customer-groups.controller.ts
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { CustomerGroupsService } from './customer-groups.service';
import { CreateCustomerGroupDto } from './dto/create-customer-group.dto';
import { UpdateCustomerGroupDto } from './dto/update-customer-group.dto';
import { PaginationDto } from '@common/dto/pagination.dto';
import { Permissions } from '@common/decorators/permissions.decorator';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { AssignCustomersDto } from './dto/assign-customers.dto';

@ApiTags('Customer Groups')
@ApiBearerAuth()
@Controller('customer-groups')
export class CustomerGroupsController {
  constructor(private readonly customerGroupsService: CustomerGroupsService) {}

  // =====================================================
  // CREATE
  // =====================================================
  @Post()
  @Permissions('customer_groups.create')
  @ApiOperation({ summary: 'Create a new customer group' })
  @ApiResponse({
    status: 201,
    description: 'Customer group created successfully',
  })
  @ApiResponse({ status: 400, description: 'Validation error' })
  @ApiResponse({ status: 409, description: 'Group code already exists' })
  async create(
    @Body() createDto: CreateCustomerGroupDto,
    @CurrentUser('sub') userId: string,
  ) {
    return this.customerGroupsService.create(createDto, userId);
  }

  // =====================================================
  // FIND ALL (Paginated)
  // =====================================================
  @Get()
  @Permissions('customer_groups.read')
  @ApiOperation({ summary: 'Get all customer groups with pagination' })
  @ApiResponse({
    status: 200,
    description: 'Customer groups retrieved successfully',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiQuery({ name: 'sortBy', required: false, type: String })
  @ApiQuery({ name: 'sortOrder', required: false, enum: ['ASC', 'DESC'] })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean })
  async findAll(@Query() paginationDto: PaginationDto) {
    return this.customerGroupsService.findAll(paginationDto);
  }

  // =====================================================
  // FIND ALL (Simple - for dropdowns)
  // =====================================================
  @Get('list')
  @Permissions('customer_groups.read')
  @ApiOperation({ summary: 'Get all active customer groups (for dropdowns)' })
  @ApiResponse({ status: 200, description: 'Customer groups list retrieved' })
  async findAllSimple() {
    return this.customerGroupsService.findAllSimple();
  }

  // =====================================================
  // GET STATISTICS
  // =====================================================
  @Get('statistics')
  @Permissions('customer_groups.read')
  @ApiOperation({ summary: 'Get customer groups statistics' })
  @ApiResponse({
    status: 200,
    description: 'Statistics retrieved successfully',
  })
  async getStatistics() {
    return this.customerGroupsService.getStatistics();
  }

  // =====================================================
  // GET DEFAULT GROUP
  // =====================================================
  @Get('default')
  @Permissions('customer_groups.read')
  @ApiOperation({ summary: 'Get default customer group' })
  @ApiResponse({ status: 200, description: 'Default group retrieved' })
  async findDefault() {
    const defaultGroup = await this.customerGroupsService.findDefault();
    return { data: defaultGroup };
  }

  // =====================================================
  // FIND ONE BY ID
  // =====================================================
  @Get(':id')
  @Permissions('customer_groups.read')
  @ApiOperation({ summary: 'Get customer group by ID' })
  @ApiParam({ name: 'id', description: 'Customer group ID' })
  @ApiResponse({
    status: 200,
    description: 'Customer group retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Customer group not found' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.customerGroupsService.findOne(id);
  }

  // =====================================================
  // FIND BY CODE
  // =====================================================
  @Get('code/:code')
  @Permissions('customer_groups.read')
  @ApiOperation({ summary: 'Get customer group by code' })
  @ApiParam({
    name: 'code',
    description: 'Customer group code',
    example: 'RETAIL',
  })
  @ApiResponse({
    status: 200,
    description: 'Customer group retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Customer group not found' })
  async findByCode(@Param('code') code: string) {
    return this.customerGroupsService.findByCode(code);
  }

  // =====================================================
  // UPDATE
  // =====================================================
  @Put(':id')
  @Permissions('customer_groups.update')
  @ApiOperation({ summary: 'Update customer group' })
  @ApiParam({ name: 'id', description: 'Customer group ID' })
  @ApiResponse({
    status: 200,
    description: 'Customer group updated successfully',
  })
  @ApiResponse({ status: 404, description: 'Customer group not found' })
  @ApiResponse({ status: 409, description: 'Group code already exists' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateCustomerGroupDto,
    @CurrentUser('sub') userId: string,
  ) {
    return this.customerGroupsService.update(id, updateDto, userId);
  }

  // =====================================================
  // DELETE (Soft delete)
  // =====================================================
  @Delete(':id')
  @Permissions('customer_groups.delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete customer group (soft delete)' })
  @ApiParam({ name: 'id', description: 'Customer group ID' })
  @ApiResponse({
    status: 204,
    description: 'Customer group deleted successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Cannot delete - customers assigned',
  })
  @ApiResponse({ status: 404, description: 'Customer group not found' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.customerGroupsService.remove(id);
  }

  // =====================================================
  // GET CUSTOMERS IN GROUP
  // =====================================================
  @Get(':id/customers')
  @Permissions('customer_groups.read', 'customers.read')
  @ApiOperation({ summary: 'Get customers in a group' })
  @ApiParam({ name: 'id', description: 'Customer group ID' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'search', required: false, type: String })
  @ApiResponse({ status: 200, description: 'Customers retrieved successfully' })
  @ApiResponse({ status: 404, description: 'Customer group not found' })
  async getCustomersInGroup(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() paginationDto: PaginationDto,
  ) {
    return this.customerGroupsService.getCustomersInGroup(id, paginationDto);
  }

  // =====================================================
  // GET CUSTOMER COUNT IN GROUP
  // =====================================================
  @Get(':id/customers/count')
  @Permissions('customer_groups.read')
  @ApiOperation({ summary: 'Get customer count in a group' })
  @ApiParam({ name: 'id', description: 'Customer group ID' })
  @ApiResponse({ status: 200, description: 'Count retrieved successfully' })
  async getCustomerCount(@Param('id', ParseUUIDPipe) id: string) {
    const count = await this.customerGroupsService.getCustomerCountByGroup(id);
    return { count };
  }

  // =====================================================
  // ASSIGN CUSTOMERS TO GROUP
  // =====================================================
  @Post(':id/customers')
  @Permissions('customer_groups.update', 'customers.update')
  @ApiOperation({ summary: 'Assign customers to a group' })
  @ApiParam({ name: 'id', description: 'Customer group ID' })
  @ApiResponse({ status: 200, description: 'Customers assigned successfully' })
  @ApiResponse({ status: 404, description: 'Customer group not found' })
  async assignCustomers(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() assignDto: AssignCustomersDto,
  ) {
    return this.customerGroupsService.assignCustomersToGroup(
      id,
      assignDto.customerIds,
    );
  }
}
