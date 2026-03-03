// src/modules/purchase/supplier-payments/supplier-payments.controller.ts

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
import { SupplierPaymentsService } from './supplier-payments.service';
import {
  CreateSupplierPaymentDto,
  SupplierPaymentFilterDto,
  AllocatePaymentDto,
} from './dto/supplier-payment.dto';

@ApiTags('Supplier Payments')
@ApiBearerAuth()
@Controller('supplier-payments')
export class SupplierPaymentsController {
  constructor(private readonly paymentsService: SupplierPaymentsService) {}

  @Post()
  @Permissions('supplier_payments.create')
  @ApiOperation({
    summary: 'Create supplier payment (with optional allocation)',
  })
  async create(
    @Body() dto: CreateSupplierPaymentDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.paymentsService.create(dto, user.sub);
  }

  @Get()
  @Permissions('supplier_payments.read')
  @ApiOperation({ summary: 'List supplier payments' })
  async findAll(@Query() filterDto: SupplierPaymentFilterDto) {
    return this.paymentsService.findAll(filterDto);
  }

  @Get(':id')
  @Permissions('supplier_payments.read')
  @ApiParam({ name: 'id', format: 'uuid' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.paymentsService.findById(id);
  }

  @Post(':id/submit')
  @Permissions('supplier_payments.update')
  @ApiOperation({ summary: 'Submit for approval' })
  async submit(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.paymentsService.submitForApproval(id, user.sub);
  }

  @Post(':id/approve')
  @Permissions('supplier_payments.approve')
  @ApiOperation({ summary: 'Approve payment' })
  async approve(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.paymentsService.approve(id, user.sub);
  }

  @Post(':id/process')
  @Permissions('supplier_payments.update')
  @ApiOperation({ summary: 'Process payment (executes + updates dues)' })
  async process(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.paymentsService.process(id, user.sub);
  }

  @Post(':id/complete')
  @Permissions('supplier_payments.update')
  @ApiOperation({ summary: 'Mark payment as completed' })
  async complete(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.paymentsService.complete(id, user.sub);
  }

  @Post(':id/allocate')
  @Permissions('supplier_payments.update')
  @ApiOperation({ summary: 'Allocate unallocated amount to dues' })
  async allocate(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AllocatePaymentDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.paymentsService.allocate(id, dto, user.sub);
  }

  @Post(':id/cancel')
  @Permissions('supplier_payments.update')
  @ApiOperation({ summary: 'Cancel payment' })
  async cancel(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('reason') reason: string,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.paymentsService.cancel(id, reason, user.sub);
  }
}
