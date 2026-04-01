import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { TenantConnectionManager } from '@database/tenant-connection.manager';
import { SalesOrder, OrderPayment } from '@entities/tenant';
import {
  OrderPaymentStatus,
} from '@entities/tenant/eCommerce/order-payment.entity';
import { PaymentStatus } from '@common/enums';
import { paginate } from '@common/utils/pagination.util';
import { PaginatedResult } from '@common/interfaces';
import {
  PaymentFilterDto,
  CompletePaymentDto,
  RefundPaymentDto,
} from '../dto/payments.dto';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly tenantConnectionManager: TenantConnectionManager,
  ) {}

  /**
   * List payments with filters
   */
  async findAll(
    filterDto: PaymentFilterDto,
  ): Promise<PaginatedResult<OrderPayment>> {
    const ds = await this.tenantConnectionManager.getDataSource();
    const repo = ds.getRepository(OrderPayment);

    const qb = repo
      .createQueryBuilder('payment')
      .leftJoinAndSelect('payment.paymentMethod', 'paymentMethod')
      .leftJoinAndSelect('payment.order', 'order')
      .leftJoinAndSelect('order.customer', 'customer');

    if (filterDto.orderId) {
      qb.andWhere('payment.orderId = :orderId', { orderId: filterDto.orderId });
    }

    if (filterDto.status) {
      qb.andWhere('payment.status = :status', { status: filterDto.status });
    }

    if (filterDto.fromDate) {
      qb.andWhere('payment.paymentDate >= :fromDate', {
        fromDate: filterDto.fromDate,
      });
    }

    if (filterDto.toDate) {
      qb.andWhere('payment.paymentDate <= :toDate', {
        toDate: filterDto.toDate,
      });
    }

    if (!filterDto.sortBy) {
      filterDto.sortBy = 'payment.paymentDate';
      filterDto.sortOrder = 'DESC';
    }

    return paginate(qb, filterDto);
  }

  /**
   * Get single payment
   */
  async findById(id: string): Promise<OrderPayment> {
    const ds = await this.tenantConnectionManager.getDataSource();
    const payment = await ds.getRepository(OrderPayment).findOne({
      where: { id },
      relations: ['paymentMethod', 'order', 'order.customer'],
    });

    if (!payment) {
      throw new NotFoundException(`Payment with ID ${id} not found`);
    }

    return payment;
  }

  /**
   * Complete a pending payment — transitions PENDING → COMPLETED
   * and updates the order's paidAmount + paymentStatus.
   */
  async complete(
    id: string,
    dto: CompletePaymentDto,
    userId: string,
  ): Promise<OrderPayment> {
    const ds = await this.tenantConnectionManager.getDataSource();

    const payment = await this.findById(id);

    if (payment.status !== OrderPaymentStatus.PENDING) {
      throw new BadRequestException(
        `Only PENDING payments can be completed. Current status: ${payment.status}`,
      );
    }

    await ds.transaction(async (manager) => {
      // Update payment
      payment.status = OrderPaymentStatus.COMPLETED;
      payment.transactionId = dto.referenceNumber ?? payment.transactionId;
      if (dto.notes) payment.notes = dto.notes;
      payment.processedBy = userId;
      await manager.getRepository(OrderPayment).save(payment);

      // Update order paidAmount + paymentStatus
      const order = await manager
        .getRepository(SalesOrder)
        .findOne({ where: { id: payment.orderId } });

      if (order) {
        order.paidAmount =
          Number(order.paidAmount) + Number(payment.amount);
        order.paymentStatus = this.calcPaymentStatus(
          order.totalAmount,
          order.paidAmount,
        );
        await manager.getRepository(SalesOrder).save(order);
      }
    });

    return this.findById(id);
  }

  /**
   * Refund a completed payment — transitions COMPLETED → REFUNDED (full)
   * or PARTIALLY_REFUNDED, and decrements the order's paidAmount.
   */
  async refund(
    id: string,
    dto: RefundPaymentDto,
    userId: string,
  ): Promise<OrderPayment> {
    const ds = await this.tenantConnectionManager.getDataSource();
    const payment = await this.findById(id);

    if (payment.status !== OrderPaymentStatus.COMPLETED) {
      throw new BadRequestException(
        `Only COMPLETED payments can be refunded. Current status: ${payment.status}`,
      );
    }

    const refundAmount = dto.amount ?? Number(payment.amount);
    const alreadyRefunded = Number(payment.refundedAmount);
    const available = Number(payment.amount) - alreadyRefunded;

    if (refundAmount > available + 0.001) {
      throw new BadRequestException(
        `Refund amount ${refundAmount} exceeds available amount ${available.toFixed(2)}`,
      );
    }

    await ds.transaction(async (manager) => {
      payment.refundedAmount = alreadyRefunded + refundAmount;
      payment.refundReason = dto.reason ?? payment.refundReason;
      payment.refundedAt = new Date();
      payment.processedBy = userId;
      payment.status =
        payment.refundedAmount >= Number(payment.amount)
          ? OrderPaymentStatus.REFUNDED
          : OrderPaymentStatus.PARTIALLY_REFUNDED;
      await manager.getRepository(OrderPayment).save(payment);

      // Reverse paidAmount on order
      const order = await manager
        .getRepository(SalesOrder)
        .findOne({ where: { id: payment.orderId } });

      if (order) {
        order.paidAmount = Math.max(
          0,
          Number(order.paidAmount) - refundAmount,
        );
        order.paymentStatus = this.calcPaymentStatus(
          order.totalAmount,
          order.paidAmount,
        );
        await manager.getRepository(SalesOrder).save(order);
      }
    });

    return this.findById(id);
  }

  /**
   * Cancel a pending payment.
   */
  async cancel(id: string): Promise<OrderPayment> {
    const ds = await this.tenantConnectionManager.getDataSource();
    const payment = await this.findById(id);

    if (payment.status !== OrderPaymentStatus.PENDING) {
      throw new BadRequestException(
        `Only PENDING payments can be cancelled. Current status: ${payment.status}`,
      );
    }

    payment.status = OrderPaymentStatus.CANCELLED;
    await ds.getRepository(OrderPayment).save(payment);

    return this.findById(id);
  }

  // ── Private helpers ────────────────────────────────────────────────────

  private calcPaymentStatus(
    totalAmount: number | string,
    paidAmount: number | string,
  ): PaymentStatus {
    const total = Number(totalAmount);
    const paid = Number(paidAmount);

    if (paid <= 0) return PaymentStatus.UNPAID;
    if (paid >= total - 0.001) return PaymentStatus.PAID;
    return PaymentStatus.PARTIALLY_PAID;
  }
}
