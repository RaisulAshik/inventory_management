import {
  Controller,
  Get,
  Param,
  Query,
  ParseUUIDPipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
} from '@nestjs/swagger';
import { TenantConnectionManager } from '@database/tenant-connection.manager';
import { SalesOrder, OrderPayment } from '@entities/tenant';
import { SalesOrderStatus } from '@common/enums';
import { Permissions } from '@common/decorators/permissions.decorator';
import { paginate } from '@common/utils/pagination.util';
import { InvoiceFilterDto } from './dto/invoice-filter.dto';

@ApiTags('Accounting — Invoices')
@ApiBearerAuth()
@Controller('accounting/invoices')
export class InvoicesController {
  constructor(
    private readonly tenantConnectionManager: TenantConnectionManager,
  ) {}

  @Get()
  @Permissions('orders.read')
  @ApiOperation({
    summary: 'List all invoices',
    description:
      'Returns delivered and completed sales orders as invoices with payment status.',
  })
  async findAll(@Query() filterDto: InvoiceFilterDto) {
    const ds = await this.tenantConnectionManager.getDataSource();
    const repo = ds.getRepository(SalesOrder);

    const qb = repo
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.customer', 'customer')
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('items.product', 'product')
      .where('order.status IN (:...statuses)', {
        statuses: [SalesOrderStatus.DELIVERED, SalesOrderStatus.COMPLETED],
      });

    if (filterDto.customerId) {
      qb.andWhere('order.customerId = :customerId', { customerId: filterDto.customerId });
    }
    if (filterDto.paymentStatus) {
      qb.andWhere('order.paymentStatus = :paymentStatus', { paymentStatus: filterDto.paymentStatus });
    }
    if (filterDto.fromDate) {
      qb.andWhere('order.deliveredAt >= :fromDate', { fromDate: filterDto.fromDate });
    }
    if (filterDto.toDate) {
      qb.andWhere('order.deliveredAt <= :toDate', { toDate: filterDto.toDate });
    }

    if (!filterDto.sortBy) {
      filterDto.sortBy = 'order.deliveredAt';
      filterDto.sortOrder = 'DESC';
    }

    const result = await paginate(qb, filterDto);

    return {
      ...result,
      data: result.data.map((order) => this.toInvoice(order)),
    };
  }

  @Get(':id')
  @Permissions('orders.read')
  @ApiOperation({ summary: 'Get invoice by sales order ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const ds = await this.tenantConnectionManager.getDataSource();
    const repo = ds.getRepository(SalesOrder);

    const order = await repo.findOne({
      where: { id },
      relations: ['customer', 'items', 'items.product'],
    });

    if (!order) {
      return { data: null };
    }

    // Load payments separately
    const payments = await ds
      .getRepository(OrderPayment)
      .find({ where: { orderId: id }, order: { paymentDate: 'ASC' } });

    return { data: { ...this.toInvoice(order), payments } };
  }

  private toInvoice(order: SalesOrder) {
    return {
      invoiceNumber: order.orderNumber,
      invoiceDate: order.deliveredAt || order.createdAt,
      orderId: order.id,
      customer: order.customer
        ? {
            id: order.customer.id,
            name:
              order.customer.companyName ||
              `${order.customer.firstName} ${order.customer.lastName || ''}`.trim(),
            email: order.customer.email,
            phone: order.customer.phone,
          }
        : null,
      billingAddress: {
        line1: order.billingAddressLine1,
        line2: order.billingAddressLine2,
      },
      shippingAddress: {
        line1: order.shippingAddressLine1,
        line2: order.shippingAddressLine2,
      },
      items: (order.items || []).map((item) => ({
        productId: item.productId,
        productName: item.product?.productName || item.productName,
        sku: item.product?.sku,
        quantity: Number(item.quantityOrdered),
        unitPrice: Number(item.unitPrice),
        discountAmount: Number(item.discountAmount || 0),
        taxAmount: Number(item.taxAmount || 0),
        lineTotal: Number(item.lineTotal),
      })),
      subtotal: Number(order.subtotal),
      discountAmount: Number(order.discountAmount || 0),
      taxAmount: Number(order.taxAmount || 0),
      shippingAmount: Number(order.shippingAmount || 0),
      totalAmount: Number(order.totalAmount),
      paidAmount: Number(order.paidAmount),
      balanceAmount: Number(order.totalAmount) - Number(order.paidAmount),
      paymentStatus: order.paymentStatus,
      currency: order.currency,
      notes: order.notes,
    };
  }
}
