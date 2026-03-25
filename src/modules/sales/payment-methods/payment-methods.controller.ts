import {
  Controller, Get, Post, Patch, Delete,
  Body, Param, Query, HttpCode, HttpStatus, ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation, ApiQuery, ApiParam } from '@nestjs/swagger';
import { PaymentMethodsService, CreatePaymentMethodDto } from './payment-methods.service';
import { Permissions } from '@common/decorators/permissions.decorator';

@ApiTags('Payment Methods')
@ApiBearerAuth()
@Controller('payment-methods')
export class PaymentMethodsController {
  constructor(private readonly paymentMethodsService: PaymentMethodsService) {}

  @Get()
  @Permissions('payment-methods.read')
  @ApiOperation({ summary: 'Get all payment methods' })
  @ApiQuery({ name: 'isActive', type: 'boolean', required: false })
  async findAll(@Query('isActive') isActive?: string) {
    const active = isActive === undefined ? undefined : isActive === 'true';
    return this.paymentMethodsService.findAll(active);
  }

  @Get('dropdown')
  @Permissions('payment-methods.read')
  @ApiOperation({ summary: 'Get active payment methods as dropdown list' })
  getDropdown() {
    return this.paymentMethodsService.getDropdown();
  }

  @Get(':id')
  @Permissions('payment-methods.read')
  @ApiOperation({ summary: 'Get payment method by ID' })
  @ApiParam({ name: 'id', format: 'uuid' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.paymentMethodsService.findOne(id);
  }

  @Post()
  @Permissions('payment-methods.create')
  @ApiOperation({ summary: 'Create a payment method' })
  create(@Body() dto: CreatePaymentMethodDto) {
    return this.paymentMethodsService.create(dto);
  }

  @Patch(':id')
  @Permissions('payment-methods.update')
  @ApiOperation({ summary: 'Update a payment method' })
  @ApiParam({ name: 'id', format: 'uuid' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: Partial<CreatePaymentMethodDto>,
  ) {
    return this.paymentMethodsService.update(id, dto);
  }

  @Delete(':id')
  @Permissions('payment-methods.delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a payment method' })
  @ApiParam({ name: 'id', format: 'uuid' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.paymentMethodsService.remove(id);
  }
}
