import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { SubscriptionPlan } from '@entities/master/subscription-plan.entity';
import { PlanFeature } from '@entities/master/plan-feature.entity';
import { PaginationDto } from '@common/dto/pagination.dto';
import { PaginatedResult } from '@common/interfaces';
import { CreatePlanDto } from './dto/create-plan.dto';
import { UpdatePlanDto } from './dto/update-plan.dto';

@Injectable()
export class PlansService {
  constructor(
    @InjectRepository(SubscriptionPlan, 'master')
    private readonly planRepository: Repository<SubscriptionPlan>,
    @InjectRepository(PlanFeature, 'master')
    private readonly featureRepository: Repository<PlanFeature>,
  ) {}

  /**
   * Create a new subscription plan
   */
  async create(createDto: CreatePlanDto): Promise<SubscriptionPlan> {
    // Check if plan code already exists
    const existingCode = await this.planRepository.findOne({
      where: { planCode: createDto.planCode },
    });

    if (existingCode) {
      throw new BadRequestException(
        `Plan with code ${createDto.planCode} already exists`,
      );
    }

    const plan = this.planRepository.create({
      id: uuidv4(),
      planCode: createDto.planCode,
      planName: createDto.planName,
      description: createDto.description,
      price: createDto.price,
      currency: createDto.currency || 'INR',
      billingCycle: createDto.billingCycle,
      trialDays: createDto.trialDays || 0,
      maxUsers: createDto.maxUsers,
      maxWarehouses: createDto.maxWarehouses,
      maxProducts: createDto.maxProducts,
      maxOrders: createDto.maxOrders,
      storageGb: createDto.storageGb,
      isActive: createDto.isActive ?? true,
      displayOrder: createDto.displayOrder || 0,
    } as DeepPartial<SubscriptionPlan>);

    const savedPlan = await this.planRepository.save(plan);

    // Create features if provided
    if (createDto.features && createDto.features.length > 0) {
      await this.createFeatures(savedPlan.id, createDto.features);
    }

    return this.findById(savedPlan.id);
  }

  /**
   * Create plan features
   */
  private async createFeatures(
    planId: string,
    features: {
      featureCode: string;
      featureName: string;
      description?: string;
      isEnabled: boolean;
    }[],
  ): Promise<void> {
    for (const featureDto of features) {
      const feature = this.featureRepository.create({
        id: uuidv4(),
        planId,
        featureCode: featureDto.featureCode,
        featureName: featureDto.featureName,
        description: featureDto.description,
        isEnabled: featureDto.isEnabled,
      });

      await this.featureRepository.save(feature);
    }
  }

  /**
   * Find all plans with pagination
   */
  async findAll(
    paginationDto: PaginationDto,
  ): Promise<PaginatedResult<SubscriptionPlan>> {
    const queryBuilder = this.planRepository
      .createQueryBuilder('plan')
      .leftJoinAndSelect('plan.features', 'features');

    // Apply sorting
    queryBuilder
      .orderBy('plan.displayOrder', 'ASC')
      .addOrderBy('plan.price', 'ASC');

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
   * Get all active plans (for public display)
   */
  async findAllActive(): Promise<SubscriptionPlan[]> {
    return this.planRepository.find({
      where: { isActive: true },
      relations: ['features'],
      order: { sortOrder: 'ASC', monthlyPrice: 'ASC', yearlyPrice: 'ASC' },
    });
  }

  /**
   * Find plan by ID
   */
  async findById(id: string): Promise<SubscriptionPlan> {
    const plan = await this.planRepository.findOne({
      where: { id },
      relations: ['features'],
    });

    if (!plan) {
      throw new NotFoundException(`Plan with ID ${id} not found`);
    }

    return plan;
  }

  /**
   * Find plan by code
   */
  async findByCode(code: string): Promise<SubscriptionPlan | null> {
    return this.planRepository.findOne({
      where: { planCode: code },
      relations: ['features'],
    });
  }

  /**
   * Update plan
   */
  async update(
    id: string,
    updateDto: UpdatePlanDto,
  ): Promise<SubscriptionPlan> {
    const plan = await this.findById(id);

    // Check code uniqueness if being changed
    if (updateDto.planCode && updateDto.planCode !== plan.planCode) {
      const existingCode = await this.planRepository.findOne({
        where: { planCode: updateDto.planCode },
      });

      if (existingCode) {
        throw new BadRequestException(
          `Plan with code ${updateDto.planCode} already exists`,
        );
      }
    }

    Object.assign(plan, updateDto);
    await this.planRepository.save(plan);

    return this.findById(id);
  }

  /**
   * Add feature to plan
   */
  async addFeature(
    planId: string,
    featureDto: {
      featureCode: string;
      featureName: string;
      description?: string;
      isEnabled: boolean;
    },
  ): Promise<PlanFeature> {
    // Verify plan exists
    await this.findById(planId);

    // Check if feature already exists
    const existingFeature = await this.featureRepository.findOne({
      where: { planId, featureCode: featureDto.featureCode },
    });

    if (existingFeature) {
      throw new BadRequestException('Feature already exists for this plan');
    }

    const feature = this.featureRepository.create({
      id: uuidv4(),
      planId,
      ...featureDto,
    });

    return this.featureRepository.save(feature);
  }

  /**
   * Update feature
   */
  async updateFeature(
    featureId: string,
    isEnabled: boolean,
  ): Promise<PlanFeature> {
    const feature = await this.featureRepository.findOne({
      where: { id: featureId },
    });

    if (!feature) {
      throw new NotFoundException(`Feature with ID ${featureId} not found`);
    }

    feature.isEnabled = isEnabled;
    return this.featureRepository.save(feature);
  }

  /**
   * Remove feature
   */
  async removeFeature(featureId: string): Promise<void> {
    await this.featureRepository.delete(featureId);
  }

  /**
   * Delete plan
   */
  async remove(id: string): Promise<void> {
    //const plan = await this.findById(id);

    // Check if plan has active subscriptions
    // In production, you'd query the subscriptions table

    await this.planRepository.delete(id);
  }

  /**
   * Compare plans
   */
  async comparePlans(planIds: string[]): Promise<any> {
    const plans = await this.planRepository.find({
      where: planIds.map((id) => ({ id })),
      relations: ['features'],
    });

    // Get all unique features
    const allFeatures = new Set<string>();
    plans.forEach((plan) => {
      plan.features?.forEach((feature) => {
        allFeatures.add(feature.featureCode);
      });
    });

    // Build comparison matrix
    const comparison = {
      plans: plans.map((p) => ({
        id: p.id,
        planCode: p.planCode,
        planName: p.planName,
        monthlyPrice: Number(p.monthlyPrice), // Fixed
        yearlyPrice: Number(p.yearlyPrice), // Fixed
        maxUsers: p.maxUsers,
        maxWarehouses: p.maxWarehouses,
        maxStores: p.maxStores, // Added (was missing)
        maxProducts: p.maxProducts,
        maxOrdersPerMonth: p.maxOrdersPerMonth, // Fixed
        storageLimitGb: p.storageLimitGb, // Fixed
      })),
      features: Array.from(allFeatures).map((featureCode) => ({
        featureCode,
        featureName:
          plans
            .find((p) => p.features?.find((f) => f.featureCode === featureCode))
            ?.features?.find((f) => f.featureCode === featureCode)
            ?.featureName || featureCode,
        availability: plans.map((plan) => ({
          planId: plan.id,
          isEnabled:
            plan.features?.find((f) => f.featureCode === featureCode)
              ?.isEnabled || false,
        })),
      })),
    };

    return comparison;
  }
}
