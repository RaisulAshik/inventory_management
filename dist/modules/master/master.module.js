"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MasterModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const tenants_controller_1 = require("./tenants/tenants.controller");
const tenants_service_1 = require("./tenants/tenants.service");
const tenant_entity_1 = require("../../entities/master/tenant.entity");
const subscription_plan_entity_1 = require("../../entities/master/subscription-plan.entity");
const plan_feature_entity_1 = require("../../entities/master/plan-feature.entity");
const tenant_database_entity_1 = require("../../entities/master/tenant-database.entity");
const tenant_user_entity_1 = require("../../entities/master/tenant-user.entity");
const subscription_entity_1 = require("../../entities/master/subscription.entity");
const master_1 = require("../../entities/master");
const plans_controller_1 = require("./plans/plans.controller");
const plans_service_1 = require("./plans/plans.service");
const subscriptions_controller_1 = require("./subcriptions/subscriptions.controller");
const subscriptions_service_1 = require("./subcriptions/subscriptions.service");
let MasterModule = class MasterModule {
};
exports.MasterModule = MasterModule;
exports.MasterModule = MasterModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                tenant_entity_1.Tenant,
                master_1.TenantBillingInfo,
                tenant_database_entity_1.TenantDatabase,
                subscription_entity_1.Subscription,
                subscription_plan_entity_1.SubscriptionPlan,
                plan_feature_entity_1.PlanFeature,
                tenant_user_entity_1.TenantUser,
                master_1.BillingHistory,
                master_1.SystemSetting,
            ], 'master'),
        ],
        controllers: [tenants_controller_1.TenantsController, subscriptions_controller_1.SubscriptionsController, plans_controller_1.PlansController],
        providers: [tenants_service_1.TenantsService, subscriptions_service_1.SubscriptionsService, plans_service_1.PlansService],
        exports: [tenants_service_1.TenantsService, subscriptions_service_1.SubscriptionsService, plans_service_1.PlansService, typeorm_1.TypeOrmModule],
    })
], MasterModule);
//# sourceMappingURL=master.module.js.map