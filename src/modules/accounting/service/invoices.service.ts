import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { TenantConnectionManager } from '@database/tenant-connection.manager';
import { SalesOrder, OrderPayment } from '@entities/tenant';
import { PaymentMethod } from '@entities/tenant/eCommerce/payment-method.entity';
import {
  OrderPaymentStatus,
} from '@entities/tenant/eCommerce/order-payment.entity';
import { SalesOrderStatus, PaymentStatus } from '@common/enums';
import { paginate } from '@common/utils/pagination.util';
import { PaginatedResult } from '@common/interfaces';
import { v4 as uuidv4 } from 'uuid';
import { InvoiceFilterDto } from '../controller/dto/invoice-filter.dto';
import { RecordPaymentDto } from '../dto/invoices.dto';

@Injectable()
export class InvoicesService {
  constructor(
    private readonly tenantConnectionManager: TenantConnectionManager,
  ) {}

  private readonly INVOICE_STATUSES = [
    SalesOrderStatus.DELIVERED,
    SalesOrderStatus.COMPLETED,
  ];

  /**
   * List invoices (delivered/completed sales orders)
   */
  async findAll(filterDto: InvoiceFilterDto): Promise<PaginatedResult<any>> {
    const ds = await this.tenantConnectionManager.getDataSource();
    const repo = ds.getRepository(SalesOrder);

    const qb = repo
      .createQueryBuilder('order')
      .leftJoinAndSelect('order.customer', 'customer')
      .leftJoinAndSelect('order.items', 'items')
      .leftJoinAndSelect('items.product', 'product')
      .where('order.status IN (:...statuses)', {
        statuses: this.INVOICE_STATUSES,
      });

    if (filterDto.customerId) {
      qb.andWhere('order.customerId = :customerId', {
        customerId: filterDto.customerId,
      });
    }
    if (filterDto.paymentStatus) {
      qb.andWhere('order.paymentStatus = :paymentStatus', {
        paymentStatus: filterDto.paymentStatus,
      });
    }
    if (filterDto.fromDate) {
      qb.andWhere('order.deliveredAt >= :fromDate', {
        fromDate: filterDto.fromDate,
      });
    }
    if (filterDto.toDate) {
      qb.andWhere('order.deliveredAt <= :toDate', {
        toDate: filterDto.toDate,
      });
    }
    if (filterDto.invoiceNumber) {
      qb.andWhere('order.orderNumber LIKE :invoiceNumber', {
        invoiceNumber: `%${filterDto.invoiceNumber}%`,
      });
    }
    const customerName = filterDto.customerName ?? filterDto.customer?.name;
    if (customerName) {
      qb.andWhere(
        '(order.customerName LIKE :customerName OR customer.firstName LIKE :customerName OR customer.lastName LIKE :customerName OR customer.companyName LIKE :customerName)',
        { customerName: `%${customerName}%` },
      );
    }

    if (!filterDto.sortBy) {
      filterDto.sortBy = 'order.deliveredAt';
      filterDto.sortOrder = 'DESC';
    }

    const result = await paginate(qb, filterDto);
    return { ...result, data: result.data.map((o) => this.toInvoice(o)) };
  }

  /**
   * Get single invoice with payments
   */
  async findById(id: string): Promise<any> {
    const ds = await this.tenantConnectionManager.getDataSource();
    const order = await ds.getRepository(SalesOrder).findOne({
      where: { id },
      relations: ['customer', 'items', 'items.product'],
    });

    if (!order) {
      throw new NotFoundException(`Invoice (order) with ID ${id} not found`);
    }

    const payments = await ds
      .getRepository(OrderPayment)
      .find({
        where: { orderId: id },
        relations: ['paymentMethod'],
        order: { paymentDate: 'ASC' },
      });

    return { ...this.toInvoice(order), payments };
  }

  /**
   * Mark invoice as sent — records the intent; no schema change required.
   */
  async send(id: string): Promise<any> {
    const ds = await this.tenantConnectionManager.getDataSource();
    const order = await ds
      .getRepository(SalesOrder)
      .findOne({ where: { id } });

    if (!order) {
      throw new NotFoundException(`Invoice (order) with ID ${id} not found`);
    }

    if (!this.INVOICE_STATUSES.includes(order.status)) {
      throw new BadRequestException(
        'Only delivered or completed orders can have invoices sent',
      );
    }

    // Append sent marker to notes if not already present
    if (!order.notes?.includes('[INVOICE SENT]')) {
      order.notes = [order.notes, '[INVOICE SENT]'].filter(Boolean).join(' | ');
      await ds.getRepository(SalesOrder).save(order);
    }

    return this.findById(id);
  }

  /**
   * Record a payment against an invoice (creates OrderPayment in PENDING state).
   * Call complete() on the payment to transition it to COMPLETED and update paidAmount.
   */
  async recordPayment(
    orderId: string,
    dto: RecordPaymentDto,
    createdBy: string,
  ): Promise<OrderPayment> {
    const ds = await this.tenantConnectionManager.getDataSource();
    const orderRepo = ds.getRepository(SalesOrder);
    const paymentRepo = ds.getRepository(OrderPayment);

    const order = await orderRepo.findOne({ where: { id: orderId } });
    if (!order) {
      throw new NotFoundException(`Invoice (order) with ID ${orderId} not found`);
    }

    if (!this.INVOICE_STATUSES.includes(order.status)) {
      throw new BadRequestException(
        'Payments can only be recorded against delivered or completed orders',
      );
    }

    const balance =
      Number(order.totalAmount) - Number(order.paidAmount);
    if (dto.amount > balance + 0.001) {
      throw new BadRequestException(
        `Payment amount ${dto.amount} exceeds outstanding balance of ${balance.toFixed(2)}`,
      );
    }

    // Resolve payment method
    const paymentMethodId = await this.resolvePaymentMethodId(
      ds,
      dto.paymentMethodId,
      dto.paymentMethod,
    );

    const payment = paymentRepo.create({
      id: uuidv4(),
      orderId,
      paymentMethodId,
      paymentDate: new Date(dto.paymentDate),
      amount: dto.amount,
      currency: order.currency || 'INR',
      status: OrderPaymentStatus.PENDING,
      paymentReference: dto.referenceNumber,
      notes: dto.notes,
      processedBy: createdBy,
    });

    return paymentRepo.save(payment);
  }

  /**
   * Void an invoice — marks as voided in notes.
   * A proper void would require a schema-level status change.
   */
  async void(id: string): Promise<any> {
    const ds = await this.tenantConnectionManager.getDataSource();
    const order = await ds
      .getRepository(SalesOrder)
      .findOne({ where: { id } });

    if (!order) {
      throw new NotFoundException(`Invoice (order) with ID ${id} not found`);
    }

    if (order.paymentStatus === PaymentStatus.PAID) {
      throw new BadRequestException('Cannot void a fully paid invoice');
    }

    order.notes = [order.notes, '[INVOICE VOIDED]'].filter(Boolean).join(' | ');
    await ds.getRepository(SalesOrder).save(order);

    return this.findById(id);
  }

  /**
   * Cancel an invoice — marks as cancelled in notes.
   */
  async cancel(id: string): Promise<any> {
    const ds = await this.tenantConnectionManager.getDataSource();
    const order = await ds
      .getRepository(SalesOrder)
      .findOne({ where: { id } });

    if (!order) {
      throw new NotFoundException(`Invoice (order) with ID ${id} not found`);
    }

    if (order.paymentStatus === PaymentStatus.PAID) {
      throw new BadRequestException('Cannot cancel a fully paid invoice');
    }

    order.notes = [order.notes, '[INVOICE CANCELLED]']
      .filter(Boolean)
      .join(' | ');
    await ds.getRepository(SalesOrder).save(order);

    return this.findById(id);
  }

  // ── Private helpers ───────────────────────────────────────────────────

  /**
   * Resolve PaymentMethod ID — use provided UUID directly, or look up by
   * methodType / methodCode from the string name.
   */
  private async resolvePaymentMethodId(
    ds: any,
    paymentMethodId?: string,
    paymentMethodName?: string,
  ): Promise<string> {
    if (paymentMethodId) return paymentMethodId;

    const repo = ds.getRepository(PaymentMethod);

    // Try exact methodType match first, then methodCode
    const method = await repo
      .createQueryBuilder('pm')
      .where('pm.methodType = :type OR pm.methodCode = :code', {
        type: paymentMethodName?.toUpperCase(),
        code: paymentMethodName?.toUpperCase(),
      })
      .andWhere('pm.isActive = 1')
      .getOne();

    if (method) return method.id;

    // Fall back to first active payment method
    const fallback = await repo.findOne({
      where: { isActive: true },
      order: { sortOrder: 'ASC' },
    });

    if (fallback) return fallback.id;

    throw new BadRequestException(
      `Payment method '${paymentMethodName}' not found. ` +
        'Please configure payment methods or provide a valid paymentMethodId.',
    );
  }

  toInvoice(order: SalesOrder) {
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
      isSent: order.notes?.includes('[INVOICE SENT]') ?? false,
      isVoided: order.notes?.includes('[INVOICE VOIDED]') ?? false,
      isCancelled: order.notes?.includes('[INVOICE CANCELLED]') ?? false,
    };
  }
}
