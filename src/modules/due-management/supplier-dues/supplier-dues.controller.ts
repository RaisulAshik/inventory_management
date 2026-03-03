// src/modules/purchase/supplier-dues/supplier-dues.controller.ts

import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { Permissions } from '@common/decorators/permissions.decorator';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { JwtPayload } from '@common/interfaces';
import { SupplierDuesService } from './supplier-dues.service';
import {
  SupplierDueFilterDto,
  CreateSupplierOpeningBalanceDto,
  AdjustSupplierDueDto,
} from './dto/supplier-due.dto';

@ApiTags('Supplier Dues')
@ApiBearerAuth()
@Controller('supplier-dues')
export class SupplierDuesController {
  constructor(private readonly duesService: SupplierDuesService) {}

  @Get()
  @Permissions('supplier_dues.read')
  @ApiOperation({ summary: 'List supplier dues with filters' })
  async findAll(@Query() filterDto: SupplierDueFilterDto) {
    return this.duesService.findAll(filterDto);
  }

  @Get('dashboard')
  @Permissions('supplier_dues.read')
  @ApiOperation({ summary: 'Payables dashboard with aging' })
  async getDashboard() {
    return this.duesService.getDashboardSummary();
  }

  @Get('upcoming')
  @Permissions('supplier_dues.read')
  @ApiOperation({ summary: 'Supplier dues coming up in next N days' })
  @ApiQuery({ name: 'days', required: false, type: Number })
  async getUpcoming(@Query('days') days?: number) {
    return this.duesService.getUpcomingPayments(days || 7);
  }

  @Get('supplier/:supplierId')
  @Permissions('supplier_dues.read')
  @ApiOperation({ summary: 'Dues by supplier with summary' })
  async findBySupplier(@Param('supplierId', ParseUUIDPipe) supplierId: string) {
    return this.duesService.findBySupplier(supplierId);
  }

  @Get(':id')
  @Permissions('supplier_dues.read')
  @ApiParam({ name: 'id', format: 'uuid' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.duesService.findById(id);
  }

  @Post('opening-balance')
  @Permissions('supplier_dues.create')
  @ApiOperation({ summary: 'Create opening balance' })
  async createOpeningBalance(
    @Body() dto: CreateSupplierOpeningBalanceDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.duesService.createOpeningBalance(dto, user.sub);
  }

  @Post(':id/adjust')
  @Permissions('supplier_dues.update')
  @ApiOperation({ summary: 'Adjust supplier due' })
  async adjust(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AdjustSupplierDueDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.duesService.adjustDue(id, dto, user.sub);
  }
}
