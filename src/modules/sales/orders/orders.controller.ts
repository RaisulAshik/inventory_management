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
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { OrderFilterDto } from './dto/order-filter.dto';
import { AddPaymentDto } from './dto/add-payment.dto';
import { ShipOrderDto } from './dto/ship-order.dto';
import { OrderResponseDto } from './dto/order-response.dto';
import { Permissions } from '@common/decorators/permissions.decorator';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { ApiPaginatedResponse } from '@common/decorators/api-paginated-response.decorator';
import { JwtPayload } from '@common/interfaces';

@ApiTags('Sales Orders')
@ApiBearerAuth()
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @Permissions('orders.create')
  @ApiOperation({ summary: 'Create a new sales order' })
  @ApiResponse({
    status: 201,
    description: 'Order created successfully',
    type: OrderResponseDto,
  })
  async create(
    @Body() createOrderDto: CreateOrderDto,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    const order = await this.ordersService.create(
      createOrderDto,
      currentUser.sub,
    );
    return new OrderResponseDto(order);
  }

  @Get()
  @Permissions('orders.read')
  @ApiOperation({ summary: 'Get all orders with filters and pagination' })
  @ApiPaginatedResponse(OrderResponseDto)
  async findAll(
    //@Query() paginationDto: PaginationDto,
    @Query() filterDto: OrderFilterDto,
  ) {
    const result = await this.ordersService.findAll(filterDto);
    return {
      data: result.data.map((o) => new OrderResponseDto(o)),
      meta: result.meta,
    };
  }

  @Get('statistics')
  @Permissions('orders.read')
  @ApiOperation({ summary: 'Get order statistics' })
  @ApiQuery({ name: 'fromDate', required: false })
  @ApiQuery({ name: 'toDate', required: false })
  @ApiQuery({ name: 'warehouseId', required: false })
  async getStatistics(
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string,
    @Query('warehouseId') warehouseId?: string,
  ) {
    const stats = await this.ordersService.getStatistics(
      fromDate ? new Date(fromDate) : undefined,
      toDate ? new Date(toDate) : undefined,
      warehouseId,
    );
    return stats;
  }

  @Get('search/number/:orderNumber')
  @Permissions('orders.read')
  @ApiOperation({ summary: 'Find order by number' })
  @ApiParam({ name: 'orderNumber', type: 'string' })
  async findByNumber(@Param('orderNumber') orderNumber: string) {
    const order = await this.ordersService.findByNumber(orderNumber);
    return { data: order ? new OrderResponseDto(order) : null };
  }

  @Get(':id')
  @Permissions('orders.read')
  @ApiOperation({ summary: 'Get order by ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({
    status: 200,
    description: 'Order found',
    type: OrderResponseDto,
  })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const order = await this.ordersService.findById(id);
    return new OrderResponseDto(order);
  }

  @Get(':id/payments')
  @Permissions('orders.read')
  @ApiOperation({ summary: 'Get order payments' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async getPayments(@Param('id', ParseUUIDPipe) id: string) {
    const payments = await this.ordersService.getPayments(id);
    return { data: payments };
  }

  @Patch(':id')
  @Permissions('orders.update')
  @ApiOperation({ summary: 'Update order (draft/pending only)' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateOrderDto: UpdateOrderDto,
  ) {
    const order = await this.ordersService.update(id, updateOrderDto);
    return new OrderResponseDto(order);
  }

  @Post(':id/confirm')
  @Permissions('orders.update')
  @ApiOperation({ summary: 'Confirm order' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async confirm(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    const order = await this.ordersService.confirm(id, currentUser.sub);
    return new OrderResponseDto(order);
  }

  @Post(':id/process')
  @Permissions('orders.update')
  @ApiOperation({ summary: 'Mark order as processing' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async process(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    const order = await this.ordersService.process(id, currentUser.sub);
    return new OrderResponseDto(order);
  }

  @Post(':id/ship')
  @Permissions('orders.update')
  @ApiOperation({ summary: 'Ship order' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async ship(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() shipDto: ShipOrderDto,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    const order = await this.ordersService.ship(id, currentUser.sub, shipDto);
    return new OrderResponseDto(order);
  }

  @Post(':id/deliver')
  @Permissions('orders.update')
  @ApiOperation({ summary: 'Mark order as delivered' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async deliver(
    @Param('id', ParseUUIDPipe) id: string,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    const order = await this.ordersService.deliver(id, currentUser.sub);
    return new OrderResponseDto(order);
  }

  @Post(':id/complete')
  @Permissions('orders.update')
  @ApiOperation({ summary: 'Complete order' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async complete(@Param('id', ParseUUIDPipe) id: string) {
    const order = await this.ordersService.complete(id);
    return new OrderResponseDto(order);
  }

  @Post(':id/cancel')
  @Permissions('orders.update')
  @ApiOperation({ summary: 'Cancel order' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async cancel(
    @Param('id', ParseUUIDPipe) id: string,
    @Body('reason') reason: string,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    const order = await this.ordersService.cancel(id, currentUser.sub, reason);
    return new OrderResponseDto(order);
  }

  @Post(':id/payments')
  @Permissions('orders.payment')
  @ApiOperation({ summary: 'Add payment to order' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async addPayment(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() paymentDto: AddPaymentDto,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    const order = await this.ordersService.addPayment(
      id,
      paymentDto,
      currentUser.sub,
    );
    return new OrderResponseDto(order);
  }

  @Delete(':id')
  @Permissions('orders.delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete order (draft only)' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.ordersService.remove(id);
  }
}
