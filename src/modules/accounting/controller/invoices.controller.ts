import {
  Controller,
  Get,
  Post,
  Param,
  Query,
  Body,
  ParseUUIDPipe,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { Permissions } from '@common/decorators/permissions.decorator';
import { InvoiceFilterDto } from './dto/invoice-filter.dto';
import { RecordPaymentDto } from '../dto/invoices.dto';
import { InvoicesService } from '../service/invoices.service';

@ApiTags('Accounting — Invoices')
@ApiBearerAuth()
@Controller('accounting/invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Get()
  @Permissions('orders.read')
  @ApiOperation({ summary: 'List all invoices (delivered/completed orders)' })
  async findAll(@Query() filterDto: InvoiceFilterDto) {
    return this.invoicesService.findAll(filterDto);
  }

  @Get(':id')
  @Permissions('orders.read')
  @ApiOperation({ summary: 'Get invoice by sales order ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return { data: await this.invoicesService.findById(id) };
  }

  @Post(':id/send')
  @Permissions('orders.update')
  @ApiOperation({ summary: 'Mark invoice as sent to customer' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async send(@Param('id', ParseUUIDPipe) id: string) {
    return { data: await this.invoicesService.send(id) };
  }

  @Post(':id/record-payment')
  @Permissions('orders.update')
  @ApiOperation({
    summary: 'Record a payment against an invoice',
    description:
      'Creates a PENDING payment. Use POST /accounting/payments/:id/complete to confirm it.',
  })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async recordPayment(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: RecordPaymentDto,
    @Request() req: any,
  ) {
    const userId: string = req.user?.sub ?? req.user?.id ?? 'system';
    return { data: await this.invoicesService.recordPayment(id, dto, userId) };
  }

  @Post(':id/void')
  @Permissions('orders.update')
  @ApiOperation({ summary: 'Void an invoice' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async void(@Param('id', ParseUUIDPipe) id: string) {
    return { data: await this.invoicesService.void(id) };
  }

  @Post(':id/cancel')
  @Permissions('orders.update')
  @ApiOperation({ summary: 'Cancel an invoice' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async cancel(@Param('id', ParseUUIDPipe) id: string) {
    return { data: await this.invoicesService.cancel(id) };
  }
}
