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
import {
  PaymentFilterDto,
  CompletePaymentDto,
  RefundPaymentDto,
} from '../dto/payments.dto';
import { PaymentsService } from '../service/payments.service';

@ApiTags('Accounting — Payments')
@ApiBearerAuth()
@Controller('accounting/payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get()
  @Permissions('orders.read')
  @ApiOperation({
    summary: 'List payments',
    description: 'Filter by orderId, status, date range.',
  })
  async findAll(@Query() filterDto: PaymentFilterDto) {
    return this.paymentsService.findAll(filterDto);
  }

  @Get(':id')
  @Permissions('orders.read')
  @ApiOperation({ summary: 'Get payment by ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return { data: await this.paymentsService.findById(id) };
  }

  @Post(':id/complete')
  @Permissions('orders.update')
  @ApiOperation({
    summary: 'Complete a pending payment',
    description:
      'Transitions PENDING → COMPLETED and updates the order paidAmount.',
  })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async complete(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CompletePaymentDto,
    @Request() req: any,
  ) {
    const userId: string = req.user?.sub ?? req.user?.id ?? 'system';
    return { data: await this.paymentsService.complete(id, dto, userId) };
  }

  @Post(':id/refund')
  @Permissions('orders.update')
  @ApiOperation({
    summary: 'Refund a completed payment',
    description:
      'Partial or full refund. Decrements the order paidAmount accordingly.',
  })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async refund(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: RefundPaymentDto,
    @Request() req: any,
  ) {
    const userId: string = req.user?.sub ?? req.user?.id ?? 'system';
    return { data: await this.paymentsService.refund(id, dto, userId) };
  }

  @Post(':id/cancel')
  @Permissions('orders.update')
  @ApiOperation({ summary: 'Cancel a pending payment' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async cancel(@Param('id', ParseUUIDPipe) id: string) {
    return { data: await this.paymentsService.cancel(id) };
  }
}
