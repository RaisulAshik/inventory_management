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
import { TenantsService } from './tenants.service';
import { CreateTenantDto } from './dto/create-tenant.dto';
import { UpdateTenantDto } from './dto/update-tenant.dto';
import { TenantFilterDto } from './dto/tenant-filter.dto';
import { AddTenantUserDto } from './dto/add-tenant-user.dto';
import { TenantResponseDto } from './dto/tenant-response.dto';
import { Permissions } from '@common/decorators/permissions.decorator';
import { ApiPaginatedResponse } from '@common/decorators/api-paginated-response.decorator';

@ApiTags('Tenants (Master)')
@ApiBearerAuth()
@Controller('master/tenants')
export class TenantsController {
  constructor(private readonly tenantsService: TenantsService) {}

  @Post()
  @Permissions('master.tenants.create')
  @ApiOperation({ summary: 'Create a new tenant' })
  @ApiResponse({
    status: 201,
    description: 'Tenant created successfully',
    type: TenantResponseDto,
  })
  async create(@Body() createTenantDto: CreateTenantDto) {
    const tenant = await this.tenantsService.create(createTenantDto);
    return new TenantResponseDto(tenant);
  }

  @Get()
  @Permissions('master.tenants.read')
  @ApiOperation({ summary: 'Get all tenants with filters and pagination' })
  @ApiPaginatedResponse(TenantResponseDto)
  async findAll(
    @Query() filterDto: TenantFilterDto,
  ) {
    const result = await this.tenantsService.findAll(filterDto);
    return {
      data: result.data.map((t) => new TenantResponseDto(t)),
      meta: result.meta,
    };
  }

  @Get('statistics')
  @Permissions('master.tenants.read')
  @ApiOperation({ summary: 'Get tenant statistics' })
  async getStatistics() {
    return this.tenantsService.getStatistics();
  }

  @Get('search/code/:code')
  @Permissions('master.tenants.read')
  @ApiOperation({ summary: 'Find tenant by code' })
  @ApiParam({ name: 'code', type: 'string' })
  async findByCode(@Param('code') code: string) {
    const tenant = await this.tenantsService.findByCode(code);
    return { data: tenant ? new TenantResponseDto(tenant) : null };
  }

  @Get(':id')
  @Permissions('master.tenants.read')
  @ApiOperation({ summary: 'Get tenant by ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Tenant found',
    type: TenantResponseDto,
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const tenant = await this.tenantsService.findById(id);
    return new TenantResponseDto(tenant);
  }

  @Get(':id/users')
  @Permissions('master.tenants.read')
  @ApiOperation({ summary: 'Get tenant users' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async getUsers(@Param('id', ParseUUIDPipe) id: string) {
    const users = await this.tenantsService.getUsers(id);
    return { data: users };
  }

  @Patch(':id')
  @Permissions('master.tenants.update')
  @ApiOperation({ summary: 'Update tenant' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTenantDto: UpdateTenantDto,
  ) {
    const tenant = await this.tenantsService.update(id, updateTenantDto);
    return new TenantResponseDto(tenant);
  }

  @Post(':id/provision')
  @Permissions('master.tenants.update')
  @ApiOperation({ summary: 'Provision tenant database' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async provisionDatabase(@Param('id', ParseUUIDPipe) id: string) {
    await this.tenantsService.provisionDatabase(id);
    return { message: 'Database provisioned successfully' };
  }

  @Post(':id/activate')
  @Permissions('master.tenants.update')
  @ApiOperation({ summary: 'Activate tenant' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async activate(@Param('id', ParseUUIDPipe) id: string) {
    const tenant = await this.tenantsService.activate(id);
    return new TenantResponseDto(tenant);
  }

  @Post(':id/suspend')
  @Permissions('master.tenants.update')
  @ApiOperation({ summary: 'Suspend tenant' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async suspend(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('reason') reason: string,
  ) {
    const tenant = await this.tenantsService.suspend(id, reason);
    return new TenantResponseDto(tenant);
  }

  @Post(':id/reactivate')
  @Permissions('master.tenants.update')
  @ApiOperation({ summary: 'Reactivate suspended tenant' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async reactivate(@Param('id', ParseUUIDPipe) id: string) {
    const tenant = await this.tenantsService.reactivate(id);
    return new TenantResponseDto(tenant);
  }

  @Post(':id/users')
  @Permissions('master.tenants.update')
  @ApiOperation({ summary: 'Add user to tenant' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async addUser(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() userDto: AddTenantUserDto,
  ) {
    const user = await this.tenantsService.addUser(id, userDto);
    return user;
  }

  @Delete(':id')
  @Permissions('master.tenants.delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete tenant (soft delete)' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.tenantsService.remove(id);
  }
}
