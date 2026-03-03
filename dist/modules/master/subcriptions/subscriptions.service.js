"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubscriptionsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const uuid_1 = require("uuid");
const subscription_entity_1 = require("../../../entities/master/subscription.entity");
const subscription_plan_entity_1 = require("../../../entities/master/subscription-plan.entity");
const billing_history_entity_1 = require("../../../entities/master/billing-history.entity");
const tenant_entity_1 = require("../../../entities/master/tenant.entity");
const enums_1 = require("../../../common/enums");
let SubscriptionsService = class SubscriptionsService {
    subscriptionRepository;
    planRepository;
    billingHistoryRepository;
    tenantRepository;
    constructor(subscriptionRepository, planRepository, billingHistoryRepository, tenantRepository) {
        this.subscriptionRepository = subscriptionRepository;
        this.planRepository = planRepository;
        this.billingHistoryRepository = billingHistoryRepository;
        this.tenantRepository = tenantRepository;
    }
    async create(createDto) {
        const tenant = await this.tenantRepository.findOne({
            where: { id: createDto.tenantId },
        });
        if (!tenant) {
            throw new common_1.NotFoundException(`Tenant with ID ${createDto.tenantId} not found`);
        }
        const plan = await this.planRepository.findOne({
            where: { id: createDto.planId },
        });
        if (!plan) {
            throw new common_1.NotFoundException(`Plan with ID ${createDto.planId} not found`);
        }
        const existingSubscription = await this.subscriptionRepository.findOne({
            where: {
                tenantId: createDto.tenantId,
                status: enums_1.SubscriptionStatus.ACTIVE,
            },
        });
        if (existingSubscription) {
            throw new common_1.BadRequestException('Tenant already has an active subscription');
        }
        const startDate = createDto.startDate || new Date();
        const billingCycle = createDto.billingCycle || enums_1.BillingCycle.MONTHLY;
        const periodEnd = this.calculatePeriodEnd(startDate, billingCycle);
        let trialEndDate = null;
        if (createDto.includeTrip && plan.trialDays > 0) {
            trialEndDate = new Date(startDate);
            trialEndDate.setDate(trialEndDate.getDate() + plan.trialDays);
        }
        const unitPrice = billingCycle === enums_1.BillingCycle.ANNUAL
            ? plan.yearlyPrice
            : plan.monthlyPrice;
        const subscription = this.subscriptionRepository.create({
            id: (0, uuid_1.v4)(),
            tenantId: createDto.tenantId,
            planId: createDto.planId,
            status: trialEndDate
                ? enums_1.SubscriptionStatus.TRIAL
                : enums_1.SubscriptionStatus.ACTIVE,
            startDate,
            trialEndDate,
            currentPeriodStart: startDate,
            currentPeriodEnd: periodEnd,
            quantity: createDto.quantity || 1,
            unitPrice,
            billingCycle,
            autoRenew: createDto.autoRenew ?? true,
        });
        return this.subscriptionRepository.save(subscription);
    }
    calculatePeriodEnd(startDate, billingCycle) {
        const endDate = new Date(startDate);
        switch (billingCycle) {
            case enums_1.BillingCycle.MONTHLY:
                endDate.setMonth(endDate.getMonth() + 1);
                break;
            case enums_1.BillingCycle.QUARTERLY:
                endDate.setMonth(endDate.getMonth() + 3);
                break;
            case enums_1.BillingCycle.SEMI_ANNUAL:
                endDate.setMonth(endDate.getMonth() + 6);
                break;
            case enums_1.BillingCycle.ANNUAL:
                endDate.setFullYear(endDate.getFullYear() + 1);
                break;
        }
        return endDate;
    }
    async findAll(paginationDto) {
        const queryBuilder = this.subscriptionRepository
            .createQueryBuilder('subscription')
            .leftJoinAndSelect('subscription.tenant', 'tenant')
            .leftJoinAndSelect('subscription.plan', 'plan');
        const sortBy = paginationDto.sortBy || 'createdAt';
        const sortOrder = paginationDto.sortOrder?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
        queryBuilder.orderBy(`subscription.${sortBy}`, sortOrder);
        const total = await queryBuilder.getCount();
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
    async findById(id) {
        const subscription = await this.subscriptionRepository.findOne({
            where: { id },
            relations: ['tenant', 'plan', 'plan.features'],
        });
        if (!subscription) {
            throw new common_1.NotFoundException(`Subscription with ID ${id} not found`);
        }
        return subscription;
    }
    async findByTenantId(tenantId) {
        return this.subscriptionRepository.findOne({
            where: { tenantId },
            relations: ['plan', 'plan.features'],
        });
    }
    async update(id, updateDto) {
        const subscription = await this.findById(id);
        Object.assign(subscription, updateDto);
        await this.subscriptionRepository.save(subscription);
        return this.findById(id);
    }
    async changePlan(id, newPlanId, billingCycle) {
        const subscription = await this.findById(id);
        const newPlan = await this.planRepository.findOne({
            where: { id: newPlanId },
        });
        if (!newPlan) {
            throw new common_1.NotFoundException(`Plan with ID ${newPlanId} not found`);
        }
        const newBillingCycle = billingCycle || subscription.billingCycle;
        const newPlanPrice = newBillingCycle === enums_1.BillingCycle.ANNUAL
            ? Number(newPlan.yearlyPrice)
            : Number(newPlan.monthlyPrice);
        const remainingDays = Math.ceil((subscription.currentPeriodEnd.getTime() - new Date().getTime()) /
            (1000 * 60 * 60 * 24));
        const totalDays = Math.ceil((subscription.currentPeriodEnd.getTime() -
            subscription.currentPeriodStart.getTime()) /
            (1000 * 60 * 60 * 24));
        const proratedCredit = (Number(subscription.unitPrice) * remainingDays) / totalDays;
        const proratedCharge = (newPlanPrice * remainingDays) / totalDays;
        const proratedAmount = proratedCharge - proratedCredit;
        subscription.planId = newPlanId;
        subscription.unitPrice = newPlanPrice;
        subscription.billingCycle = newBillingCycle;
        await this.subscriptionRepository.save(subscription);
        await this.createBillingRecord(subscription, proratedAmount, 'Plan change');
        return this.findById(id);
    }
    async cancel(id, cancelImmediately = false) {
        const subscription = await this.findById(id);
        if (cancelImmediately) {
            subscription.status = enums_1.SubscriptionStatus.CANCELLED;
            subscription.cancelledAt = new Date();
        }
        else {
            subscription.cancelAtPeriodEnd = true;
        }
        subscription.autoRenew = false;
        await this.subscriptionRepository.save(subscription);
        return this.findById(id);
    }
    async reactivate(id) {
        const subscription = await this.findById(id);
        if (subscription.status === enums_1.SubscriptionStatus.CANCELLED) {
            throw new common_1.BadRequestException('Cannot reactivate a cancelled subscription. Create a new one.');
        }
        subscription.cancelAtPeriodEnd = false;
        subscription.autoRenew = true;
        await this.subscriptionRepository.save(subscription);
        return this.findById(id);
    }
    async renew(id) {
        const subscription = await this.findById(id);
        if (subscription.status === enums_1.SubscriptionStatus.CANCELLED) {
            throw new common_1.BadRequestException('Cannot renew a cancelled subscription');
        }
        const newPeriodStart = subscription.currentPeriodEnd;
        const newPeriodEnd = this.calculatePeriodEnd(newPeriodStart, subscription.billingCycle);
        subscription.currentPeriodStart = newPeriodStart;
        subscription.currentPeriodEnd = newPeriodEnd;
        subscription.status = enums_1.SubscriptionStatus.ACTIVE;
        await this.subscriptionRepository.save(subscription);
        const amount = Number(subscription.unitPrice) * subscription.quantity;
        await this.createBillingRecord(subscription, amount, 'Subscription renewal');
        return this.findById(id);
    }
    async createBillingRecord(subscription, amount, description) {
        const invoiceNumber = `INV-${Date.now()}`;
        const billing = this.billingHistoryRepository.create({
            id: (0, uuid_1.v4)(),
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
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        });
        return this.billingHistoryRepository.save(billing);
    }
    async getBillingHistory(tenantId) {
        return this.billingHistoryRepository.find({
            where: { tenantId },
            order: { invoiceDate: 'DESC' },
        });
    }
    async processExpiringSubscriptions() {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        const expiringSubscriptions = await this.subscriptionRepository
            .createQueryBuilder('subscription')
            .where('subscription.currentPeriodEnd <= :tomorrow', { tomorrow })
            .andWhere('subscription.status = :status', {
            status: enums_1.SubscriptionStatus.ACTIVE,
        })
            .getMany();
        for (const subscription of expiringSubscriptions) {
            if (subscription.autoRenew && !subscription.cancelAtPeriodEnd) {
                await this.renew(subscription.id);
            }
            else {
                subscription.status = enums_1.SubscriptionStatus.EXPIRED;
                await this.subscriptionRepository.save(subscription);
            }
        }
    }
    async processTrialExpirations() {
        const today = new Date();
        const expiredTrials = await this.subscriptionRepository
            .createQueryBuilder('subscription')
            .where('subscription.status = :status', {
            status: enums_1.SubscriptionStatus.TRIAL,
        })
            .andWhere('subscription.trialEndDate <= :today', { today })
            .getMany();
        for (const subscription of expiredTrials) {
            subscription.status = enums_1.SubscriptionStatus.EXPIRED;
            await this.subscriptionRepository.save(subscription);
        }
    }
};
exports.SubscriptionsService = SubscriptionsService;
exports.SubscriptionsService = SubscriptionsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(subscription_entity_1.Subscription, 'master')),
    __param(1, (0, typeorm_1.InjectRepository)(subscription_plan_entity_1.SubscriptionPlan, 'master')),
    __param(2, (0, typeorm_1.InjectRepository)(billing_history_entity_1.BillingHistory, 'master')),
    __param(3, (0, typeorm_1.InjectRepository)(tenant_entity_1.Tenant, 'master')),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], SubscriptionsService);
//# sourceMappingURL=subscriptions.service.js.map