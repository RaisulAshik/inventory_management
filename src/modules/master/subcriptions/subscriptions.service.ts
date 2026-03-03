import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { Subscription } from '@entities/master/subscription.entity';
import { SubscriptionPlan } from '@entities/master/subscription-plan.entity';
import { BillingHistory } from '@entities/master/billing-history.entity';
import { Tenant } from '@entities/master/tenant.entity';
import { PaginationDto } from '@common/dto/pagination.dto';
import { PaginatedResult } from '@common/interfaces';
import { SubscriptionStatus, BillingCycle } from '@common/enums';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';

@Injectable()
export class SubscriptionsService {
  constructor(
    @InjectRepository(Subscription, 'master')
    private readonly subscriptionRepository: Repository<Subscription>,
    @InjectRepository(SubscriptionPlan, 'master')
    private readonly planRepository: Repository<SubscriptionPlan>,
    @InjectRepository(BillingHistory, 'master')
    private readonly billingHistoryRepository: Repository<BillingHistory>,
    @InjectRepository(Tenant, 'master')
    private readonly tenantRepository: Repository<Tenant>,
  ) {}

  /**
   * Create a new subscription
   */
  async create(createDto: CreateSubscriptionDto): Promise<Subscription> {
    // Verify tenant exists
    const tenant = await this.tenantRepository.findOne({
      where: { id: createDto.tenantId },
    });

    if (!tenant) {
      throw new NotFoundException(
        `Tenant with ID ${createDto.tenantId} not found`,
      );
    }

    // Verify plan exists
    const plan = await this.planRepository.findOne({
      where: { id: createDto.planId },
    });

    if (!plan) {
      throw new NotFoundException(`Plan with ID ${createDto.planId} not found`);
    }

    // Check for existing active subscription
    const existingSubscription = await this.subscriptionRepository.findOne({
      where: {
        tenantId: createDto.tenantId,
        status: SubscriptionStatus.ACTIVE,
      },
    });

    if (existingSubscription) {
      throw new BadRequestException(
        'Tenant already has an active subscription',
      );
    }

    // Calculate period dates
    const startDate = createDto.startDate || new Date();
    const billingCycle = createDto.billingCycle || BillingCycle.MONTHLY;
    const periodEnd = this.calculatePeriodEnd(startDate, billingCycle);

    // Calculate trial end if applicable
    let trialEndDate: Date | null = null;
    if (createDto.includeTrip && plan.trialDays > 0) {
      trialEndDate = new Date(startDate);
      trialEndDate.setDate(trialEndDate.getDate() + plan.trialDays);
    }
    const unitPrice =
      billingCycle === BillingCycle.ANNUAL
        ? plan.yearlyPrice
        : plan.monthlyPrice;

    const subscription = this.subscriptionRepository.create({
      id: uuidv4(),
      tenantId: createDto.tenantId,
      planId: createDto.planId,
      status: trialEndDate
        ? SubscriptionStatus.TRIAL
        : SubscriptionStatus.ACTIVE,
      startDate,
      trialEndDate,
      currentPeriodStart: startDate,
      currentPeriodEnd: periodEnd,
      quantity: createDto.quantity || 1,
      unitPrice,
      //currency: createDto.currency || 'BDT',
      billingCycle,
      autoRenew: createDto.autoRenew ?? true,
    } as DeepPartial<Subscription>);

    return this.subscriptionRepository.save(subscription);
  }

  /**
   * Calculate period end date based on billing cycle
   */
  private calculatePeriodEnd(
    startDate: Date,
    billingCycle: BillingCycle,
  ): Date {
    const endDate = new Date(startDate);

    switch (billingCycle) {
      case BillingCycle.MONTHLY:
        endDate.setMonth(endDate.getMonth() + 1);
        break;
      case BillingCycle.QUARTERLY:
        endDate.setMonth(endDate.getMonth() + 3);
        break;
      case BillingCycle.SEMI_ANNUAL:
        endDate.setMonth(endDate.getMonth() + 6);
        break;
      case BillingCycle.ANNUAL:
        endDate.setFullYear(endDate.getFullYear() + 1);
        break;
    }

    return endDate;
  }

  /**
   * Find all subscriptions with pagination
   */
  async findAll(
    paginationDto: PaginationDto,
  ): Promise<PaginatedResult<Subscription>> {
    const queryBuilder = this.subscriptionRepository
      .createQueryBuilder('subscription')
      .leftJoinAndSelect('subscription.tenant', 'tenant')
      .leftJoinAndSelect('subscription.plan', 'plan');

    // Apply sorting
    const sortBy = paginationDto.sortBy || 'createdAt';
    const sortOrder =
      paginationDto.sortOrder?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    queryBuilder.orderBy(`subscription.${sortBy}`, sortOrder);

    // Get total count
    const total = await queryBuilder.getCount();

    // Apply pagination
    const page = paginationDto.page || 1;
    const limit = paginationDto.limit || 20;
    queryBuilder.skip((page - 1) * limit).take(limit);

    const data = await queryBuilder.getMany();

    return {
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPreviousPage: page > 1,
      },
    };
  }

  /**
   * Find subscription by ID
   */
  async findById(id: string): Promise<Subscription> {
    const subscription = await this.subscriptionRepository.findOne({
      where: { id },
      relations: ['tenant', 'plan', 'plan.features'],
    });

    if (!subscription) {
      throw new NotFoundException(`Subscription with ID ${id} not found`);
    }

    return subscription;
  }

  /**
   * Find subscription by tenant ID
   */
  async findByTenantId(tenantId: string): Promise<Subscription | null> {
    return this.subscriptionRepository.findOne({
      where: { tenantId },
      relations: ['plan', 'plan.features'],
    });
  }

  /**
   * Update subscription
   */
  async update(
    id: string,
    updateDto: UpdateSubscriptionDto,
  ): Promise<Subscription> {
    const subscription = await this.findById(id);

    Object.assign(subscription, updateDto);
    await this.subscriptionRepository.save(subscription);

    return this.findById(id);
  }

  /**
   * Change subscription plan
   */
  async changePlan(
    id: string,
    newPlanId: string,
    billingCycle?: BillingCycle,
  ): Promise<Subscription> {
    const subscription = await this.findById(id);
    const newPlan = await this.planRepository.findOne({
      where: { id: newPlanId },
    });

    if (!newPlan) {
      throw new NotFoundException(`Plan with ID ${newPlanId} not found`);
    }

    // Use provided billing cycle, or keep the existing one from subscription
    const newBillingCycle = billingCycle || subscription.billingCycle;

    // Get the correct price based on billing cycle
    const newPlanPrice =
      newBillingCycle === BillingCycle.ANNUAL
        ? Number(newPlan.yearlyPrice)
        : Number(newPlan.monthlyPrice);

    // Calculate prorated amount (simplified)
    const remainingDays = Math.ceil(
      (subscription.currentPeriodEnd.getTime() - new Date().getTime()) /
        (1000 * 60 * 60 * 24),
    );
    const totalDays = Math.ceil(
      (subscription.currentPeriodEnd.getTime() -
        subscription.currentPeriodStart.getTime()) /
        (1000 * 60 * 60 * 24),
    );

    const proratedCredit =
      (Number(subscription.unitPrice) * remainingDays) / totalDays;
    const proratedCharge = (newPlanPrice * remainingDays) / totalDays;
    const proratedAmount = proratedCharge - proratedCredit;

    subscription.planId = newPlanId;
    subscription.unitPrice = newPlanPrice;
    subscription.billingCycle = newBillingCycle;

    await this.subscriptionRepository.save(subscription);

    // Record billing history for plan change
    await this.createBillingRecord(subscription, proratedAmount, 'Plan change');

    return this.findById(id);
  }

  /**
   * Cancel subscription
   */
  async cancel(
    id: string,
    cancelImmediately: boolean = false,
  ): Promise<Subscription> {
    const subscription = await this.findById(id);

    if (cancelImmediately) {
      subscription.status = SubscriptionStatus.CANCELLED;
      subscription.cancelledAt = new Date();
    } else {
      // Cancel at period end
      subscription.cancelAtPeriodEnd = true;
    }

    subscription.autoRenew = false;
    await this.subscriptionRepository.save(subscription);

    return this.findById(id);
  }

  /**
   * Reactivate cancelled subscription
   */
  async reactivate(id: string): Promise<Subscription> {
    const subscription = await this.findById(id);

    if (subscription.status === SubscriptionStatus.CANCELLED) {
      throw new BadRequestException(
        'Cannot reactivate a cancelled subscription. Create a new one.',
      );
    }

    subscription.cancelAtPeriodEnd = false;
    subscription.autoRenew = true;
    await this.subscriptionRepository.save(subscription);

    return this.findById(id);
  }

  /**
   * Renew subscription
   */
  async renew(id: string): Promise<Subscription> {
    const subscription = await this.findById(id);

    if (subscription.status === SubscriptionStatus.CANCELLED) {
      throw new BadRequestException('Cannot renew a cancelled subscription');
    }

    // Calculate new period
    const newPeriodStart = subscription.currentPeriodEnd;
    const newPeriodEnd = this.calculatePeriodEnd(
      newPeriodStart,
      subscription.billingCycle,
    );

    subscription.currentPeriodStart = newPeriodStart;
    subscription.currentPeriodEnd = newPeriodEnd;
    subscription.status = SubscriptionStatus.ACTIVE;

    await this.subscriptionRepository.save(subscription);

    // Create billing record
    const amount = Number(subscription.unitPrice) * subscription.quantity;
    await this.createBillingRecord(
      subscription,
      amount,
      'Subscription renewal',
    );

    return this.findById(id);
  }

  /**
   * Create billing record
   */
  private async createBillingRecord(
    subscription: Subscription,
    amount: number,
    description: string,
  ): Promise<BillingHistory> {
    const invoiceNumber = `INV-${Date.now()}`;

    const billing = this.billingHistoryRepository.create({
      id: uuidv4(),
      tenantId: subscription.tenantId,
      subscriptionId: subscription.id,
      invoiceNumber,
      amount,
      currency: subscription.currency,
      status: 'PENDING',
      description,
      periodStart: subscription.currentPeriodStart,
      periodEnd: subscription.currentPeriodEnd,
      invoiceDate: new Date(),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
    } as DeepPartial<BillingHistory>);

    return this.billingHistoryRepository.save(billing);
  }

  /**
   * Get billing history for a tenant
   */
  async getBillingHistory(tenantId: string): Promise<BillingHistory[]> {
    return this.billingHistoryRepository.find({
      where: { tenantId },
      order: { invoiceDate: 'DESC' },
    });
  }

  /**
   * Process expiring subscriptions
   */
  async processExpiringSubscriptions(): Promise<void> {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Find subscriptions expiring tomorrow
    const expiringSubscriptions = await this.subscriptionRepository
      .createQueryBuilder('subscription')
      .where('subscription.currentPeriodEnd <= :tomorrow', { tomorrow })
      .andWhere('subscription.status = :status', {
        status: SubscriptionStatus.ACTIVE,
      })
      .getMany();

    for (const subscription of expiringSubscriptions) {
      if (subscription.autoRenew && !subscription.cancelAtPeriodEnd) {
        await this.renew(subscription.id);
      } else {
        subscription.status = SubscriptionStatus.EXPIRED;
        await this.subscriptionRepository.save(subscription);
      }
    }
  }

  /**
   * Process trial expirations
   */
  async processTrialExpirations(): Promise<void> {
    const today = new Date();

    // Find trial subscriptions that have expired
    const expiredTrials = await this.subscriptionRepository
      .createQueryBuilder('subscription')
      .where('subscription.status = :status', {
        status: SubscriptionStatus.TRIAL,
      })
      .andWhere('subscription.trialEndDate <= :today', { today })
      .getMany();

    for (const subscription of expiredTrials) {
      subscription.status = SubscriptionStatus.EXPIRED;
      await this.subscriptionRepository.save(subscription);
    }
  }
}
