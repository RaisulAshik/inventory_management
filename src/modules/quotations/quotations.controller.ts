// src/modules/quotations/quotations.controller.ts

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
import { QuotationsService } from './quotations.service';
import { Permissions } from '@common/decorators/permissions.decorator';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { ApiPaginatedResponse } from '@common/decorators/api-paginated-response.decorator';
import { JwtPayload } from '@common/interfaces';
import { CreateQuotationDto } from './dto/create-quotation.dto';
import {
  QuotationResponseDto,
  QuotationDetailResponseDto,
} from './dto/quotation-response.dto';
import { UpdateQuotationDto } from './dto/update-quotation.dto';
import { QuotationFilterDto } from './dto/quotation-filter.dto';

@ApiTags('Quotations')
@ApiBearerAuth()
@Controller('quotations')
export class QuotationsController {
  constructor(private readonly quotationsService: QuotationsService) {}

  // ────────────── CREATE ──────────────
  @Post()
  @Permissions('quotations.create')
  @ApiOperation({ summary: 'Create a new quotation' })
  @ApiResponse({
    status: 201,
    description: 'Quotation created',
    type: QuotationResponseDto,
  })
  async create(
    @Body() createDto: CreateQuotationDto,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    const quotation = await this.quotationsService.create(
      createDto,
      currentUser.sub,
    );
    return new QuotationResponseDto(quotation);
  }

  // ────────────── LIST ──────────────
  @Get()
  @Permissions('quotations.read')
  @ApiOperation({ summary: 'Get all quotations with filters and pagination' })
  @ApiPaginatedResponse(QuotationResponseDto)
  async findAll(@Query() filterDto: QuotationFilterDto) {
    const result = await this.quotationsService.findAll(filterDto);
    return {
      data: result.data.map((q) => new QuotationResponseDto(q)),
      meta: result.meta,
    };
  }

  // ────────────── SEARCH BY NUMBER ──────────────
  @Get('search/number/:quotationNumber')
  @Permissions('quotations.read')
  @ApiOperation({ summary: 'Find quotation by number' })
  @ApiParam({ name: 'quotationNumber', type: 'string' })
  async findByNumber(@Param('quotationNumber') quotationNumber: string) {
    const quotation =
      await this.quotationsService.findByNumber(quotationNumber);
    return { data: quotation ? new QuotationResponseDto(quotation) : null };
  }

  // ────────────── GET BY ID ──────────────
  @Get(':id')
  @Permissions('quotations.read')
  @ApiOperation({ summary: 'Get quotation by ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, type: QuotationDetailResponseDto })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const quotation = await this.quotationsService.findOne(id);
    return new QuotationDetailResponseDto(quotation);
  }

  // ────────────── UPDATE ──────────────
  @Patch(':id')
  @Permissions('quotations.update')
  @ApiOperation({ summary: 'Update quotation (DRAFT only)' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateDto: UpdateQuotationDto,
  ) {
    const quotation = await this.quotationsService.update(id, updateDto);
    return new QuotationResponseDto(quotation);
  }

  // ────────────── DELETE ──────────────
  @Delete(':id')
  @Permissions('quotations.delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete quotation (DRAFT only)' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.quotationsService.remove(id);
  }

  // ────────────── WORKFLOW: SEND ──────────────
  @Post(':id/send')
  @Permissions('quotations.update')
  @ApiOperation({ summary: 'Send quotation to customer (DRAFT → SENT)' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async send(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('sendId') sendId: string,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    const quotation = await this.quotationsService.send(id, currentUser.sub);
    return new QuotationResponseDto(quotation);
  }

  // ────────────── WORKFLOW: ACCEPT ──────────────
  @Post(':id/accept')
  @Permissions('quotations.update')
  @ApiOperation({ summary: 'Mark quotation as accepted (SENT → ACCEPTED)' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async accept(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('acceptId') acceptId: string,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    const quotation = await this.quotationsService.accept(id, currentUser.sub);
    return new QuotationResponseDto(quotation);
  }

  // ────────────── WORKFLOW: REJECT ──────────────
  @Post(':id/reject')
  @Permissions('quotations.update')
  @ApiOperation({ summary: 'Reject quotation' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async reject(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('reason') reason: string,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    const quotation = await this.quotationsService.reject(
      id,
      currentUser.sub,
      reason,
    );
    return new QuotationResponseDto(quotation);
  }

  // ────────────── WORKFLOW: CANCEL ──────────────
  @Post(':id/cancel')
  @Permissions('quotations.update')
  @ApiOperation({ summary: 'Cancel quotation' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async cancel(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('reason') reason: string,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    const quotation = await this.quotationsService.cancel(
      id,
      currentUser.sub,
      reason,
    );
    return new QuotationResponseDto(quotation);
  }

  // ══════════════════════════════════════════════════════════════════
  // ██  CONVERT TO SALES ORDER  ██
  // ══════════════════════════════════════════════════════════════════
  @Post(':id/convert-to-sales-order')
  @Permissions('quotations.update', 'sales_orders.create')
  @ApiOperation({
    summary: 'Convert quotation to Sales Order',
    description:
      'Creates a new Sales Order (DRAFT) from the quotation data, copies all items, and marks the quotation as CONVERTED.',
  })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({
    status: 201,
    description: 'Sales Order created from quotation',
    schema: {
      properties: {
        quotation: {
          type: 'object',
          description: 'Updated quotation with CONVERTED status',
        },
        salesOrder: {
          type: 'object',
          description: 'Newly created Sales Order',
        },
      },
    },
  })
  async convertToSalesOrder(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('orderId') orderId: string,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    const result = await this.quotationsService.convertToSalesOrder(
      id,
      currentUser.sub,
    );
    return {
      message: `Quotation converted to Sales Order ${result.salesOrder.orderNumber}`,
      quotation: new QuotationResponseDto(result.quotation),
      salesOrder: {
        id: result.salesOrder.id,
        orderNumber: result.salesOrder.orderNumber,
        status: result.salesOrder.status,
        totalAmount: result.salesOrder.totalAmount,
      },
    };
  }
}
