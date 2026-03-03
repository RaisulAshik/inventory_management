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
exports.PlansService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const uuid_1 = require("uuid");
const subscription_plan_entity_1 = require("../../../entities/master/subscription-plan.entity");
const plan_feature_entity_1 = require("../../../entities/master/plan-feature.entity");
let PlansService = class PlansService {
    planRepository;
    featureRepository;
    constructor(planRepository, featureRepository) {
        this.planRepository = planRepository;
        this.featureRepository = featureRepository;
    }
    async create(createDto) {
        const existingCode = await this.planRepository.findOne({
            where: { planCode: createDto.planCode },
        });
        if (existingCode) {
            throw new common_1.BadRequestException(`Plan with code ${createDto.planCode} already exists`);
        }
        const plan = this.planRepository.create({
            id: (0, uuid_1.v4)(),
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
        });
        const savedPlan = await this.planRepository.save(plan);
        if (createDto.features && createDto.features.length > 0) {
            await this.createFeatures(savedPlan.id, createDto.features);
        }
        return this.findById(savedPlan.id);
    }
    async createFeatures(planId, features) {
        for (const featureDto of features) {
            const feature = this.featureRepository.create({
                id: (0, uuid_1.v4)(),
                planId,
                featureCode: featureDto.featureCode,
                featureName: featureDto.featureName,
                description: featureDto.description,
                isEnabled: featureDto.isEnabled,
            });
            await this.featureRepository.save(feature);
        }
    }
    async findAll(paginationDto) {
        const queryBuilder = this.planRepository
            .createQueryBuilder('plan')
            .leftJoinAndSelect('plan.features', 'features');
        queryBuilder
            .orderBy('plan.displayOrder', 'ASC')
            .addOrderBy('plan.price', 'ASC');
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
    async findAllActive() {
        return this.planRepository.find({
            where: { isActive: true },
            relations: ['features'],
            order: { sortOrder: 'ASC', monthlyPrice: 'ASC', yearlyPrice: 'ASC' },
        });
    }
    async findById(id) {
        const plan = await this.planRepository.findOne({
            where: { id },
            relations: ['features'],
        });
        if (!plan) {
            throw new common_1.NotFoundException(`Plan with ID ${id} not found`);
        }
        return plan;
    }
    async findByCode(code) {
        return this.planRepository.findOne({
            where: { planCode: code },
            relations: ['features'],
        });
    }
    async update(id, updateDto) {
        const plan = await this.findById(id);
        if (updateDto.planCode && updateDto.planCode !== plan.planCode) {
            const existingCode = await this.planRepository.findOne({
                where: { planCode: updateDto.planCode },
            });
            if (existingCode) {
                throw new common_1.BadRequestException(`Plan with code ${updateDto.planCode} already exists`);
            }
        }
        Object.assign(plan, updateDto);
        await this.planRepository.save(plan);
        return this.findById(id);
    }
    async addFeature(planId, featureDto) {
        await this.findById(planId);
        const existingFeature = await this.featureRepository.findOne({
            where: { planId, featureCode: featureDto.featureCode },
        });
        if (existingFeature) {
            throw new common_1.BadRequestException('Feature already exists for this plan');
        }
        const feature = this.featureRepository.create({
            id: (0, uuid_1.v4)(),
            planId,
            ...featureDto,
        });
        return this.featureRepository.save(feature);
    }
    async updateFeature(featureId, isEnabled) {
        const feature = await this.featureRepository.findOne({
            where: { id: featureId },
        });
        if (!feature) {
            throw new common_1.NotFoundException(`Feature with ID ${featureId} not found`);
        }
        feature.isEnabled = isEnabled;
        return this.featureRepository.save(feature);
    }
    async removeFeature(featureId) {
        await this.featureRepository.delete(featureId);
    }
    async remove(id) {
        await this.planRepository.delete(id);
    }
    async comparePlans(planIds) {
        const plans = await this.planRepository.find({
            where: planIds.map((id) => ({ id })),
            relations: ['features'],
        });
        const allFeatures = new Set();
        plans.forEach((plan) => {
            plan.features?.forEach((feature) => {
                allFeatures.add(feature.featureCode);
            });
        });
        const comparison = {
            plans: plans.map((p) => ({
                id: p.id,
                planCode: p.planCode,
                planName: p.planName,
                monthlyPrice: Number(p.monthlyPrice),
                yearlyPrice: Number(p.yearlyPrice),
                maxUsers: p.maxUsers,
                maxWarehouses: p.maxWarehouses,
                maxStores: p.maxStores,
                maxProducts: p.maxProducts,
                maxOrdersPerMonth: p.maxOrdersPerMonth,
                storageLimitGb: p.storageLimitGb,
            })),
            features: Array.from(allFeatures).map((featureCode) => ({
                featureCode,
                featureName: plans
                    .find((p) => p.features?.find((f) => f.featureCode === featureCode))
                    ?.features?.find((f) => f.featureCode === featureCode)
                    ?.featureName || featureCode,
                availability: plans.map((plan) => ({
                    planId: plan.id,
                    isEnabled: plan.features?.find((f) => f.featureCode === featureCode)
                        ?.isEnabled || false,
                })),
            })),
        };
        return comparison;
    }
};
exports.PlansService = PlansService;
exports.PlansService = PlansService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(subscription_plan_entity_1.SubscriptionPlan, 'master')),
    __param(1, (0, typeorm_1.InjectRepository)(plan_feature_entity_1.PlanFeature, 'master')),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], PlansService);
//# sourceMappingURL=plans.service.js.map