// src/modules/sales/customer-dues/customer-dues.controller.ts

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
} from '@nestjs/swagger';
import { Permissions } from '@common/decorators/permissions.decorator';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { JwtPayload } from '@common/interfaces';
import { CustomerDuesService } from './customer-dues.service';
import { DueFilterDto } from './dto/due-filter.dto';
import {
  CreateOpeningBalanceDto,
  AdjustDueDto,
  WriteOffDueDto,
} from './dto/create-opening-balance.dto';

@ApiTags('Customer Dues')
@ApiBearerAuth()
@Controller('customer-dues')
export class CustomerDuesController {
  constructor(private readonly duesService: CustomerDuesService) {}

  @Get()
  @Permissions('customer_dues.read')
  @ApiOperation({ summary: 'List all customer dues with filters' })
  async findAll(@Query() filterDto: DueFilterDto) {
    return this.duesService.findAll(filterDto);
  }

  @Get('overdue')
  @Permissions('customer_dues.read')
  @ApiOperation({ summary: 'Get all overdue dues' })
  async getOverdue() {
    const dues = await this.duesService.getOverdueDues();
    return { data: dues };
  }

  @Get('dashboard')
  @Permissions('customer_dues.read')
  @ApiOperation({ summary: 'Dashboard summary with aging buckets' })
  async getDashboard() {
    return this.duesService.getDashboardSummary();
  }

  @Get('customer/:customerId')
  @Permissions('customer_dues.read')
  @ApiParam({ name: 'customerId', type: 'string', format: 'uuid' })
  @ApiOperation({ summary: 'Dues by customer with summary' })
  async findByCustomer(@Param('customerId', ParseUUIDPipe) customerId: string) {
    return this.duesService.findByCustomer(customerId);
  }

  @Get('customer/:customerId/statement')
  @Permissions('customer_dues.read')
  @ApiOperation({ summary: 'Customer statement for date range' })
  async getStatement(
    @Param('customerId', ParseUUIDPipe) customerId: string,
    @Query('fromDate') fromDate: string,
    @Query('toDate') toDate: string,
  ) {
    return this.duesService.getCustomerStatement(customerId, fromDate, toDate);
  }

  @Get(':id')
  @Permissions('customer_dues.read')
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.duesService.findById(id);
  }

  @Post('opening-balance')
  @Permissions('customer_dues.create')
  @ApiOperation({ summary: 'Create opening balance due' })
  async createOpeningBalance(
    @Body() dto: CreateOpeningBalanceDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.duesService.createOpeningBalance(dto, user.sub);
  }

  @Post(':id/adjust')
  @Permissions('customer_dues.update')
  @ApiOperation({ summary: 'Adjust due (discount/correction)' })
  async adjust(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AdjustDueDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.duesService.adjustDue(id, dto, user.sub);
  }

  @Post(':id/write-off')
  @Permissions('customer_dues.update')
  @ApiOperation({ summary: 'Write off bad debt' })
  async writeOff(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: WriteOffDueDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.duesService.writeOff(id, dto, user.sub);
  }
}
