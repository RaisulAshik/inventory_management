"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedMasterData1700000000002 = void 0;
const uuid_1 = require("uuid");
class SeedMasterData1700000000002 {
    name = 'SeedMasterData1700000000002';
    async up(queryRunner) {
        const starterPlanId = (0, uuid_1.v4)();
        const professionalPlanId = (0, uuid_1.v4)();
        const enterprisePlanId = (0, uuid_1.v4)();
        await queryRunner.query(`
      INSERT INTO \`subscription_plans\` 
        (\`id\`, \`plan_code\`, \`plan_name\`, \`description\`, \`price\`, \`currency\`, 
         \`billing_cycle\`, \`trial_days\`, \`max_users\`, \`max_warehouses\`, 
         \`max_products\`, \`max_orders\`, \`storage_gb\`, \`is_active\`, \`display_order\`)
      VALUES
        ('${starterPlanId}', 'STARTER', 'Starter', 
         'Perfect for small businesses getting started with inventory management', 
         999.00, 'INR', 'MONTHLY', 14, 3, 1, 500, 200, 1.00, 1, 1),
        ('${professionalPlanId}', 'PROFESSIONAL', 'Professional', 
         'Ideal for growing businesses with multiple locations', 
         2499.00, 'INR', 'MONTHLY', 14, 10, 3, 5000, 1000, 5.00, 1, 2),
        ('${enterprisePlanId}', 'ENTERPRISE', 'Enterprise', 
         'For large businesses with advanced needs and unlimited scale', 
         4999.00, 'INR', 'MONTHLY', 14, NULL, NULL, NULL, NULL, 50.00, 1, 3)
    `);
        await queryRunner.query(`
      INSERT INTO \`plan_features\` 
        (\`id\`, \`plan_id\`, \`feature_code\`, \`feature_name\`, \`description\`, \`is_enabled\`)
      VALUES
        ('${(0, uuid_1.v4)()}', '${starterPlanId}', 'INVENTORY_MGMT', 'Inventory Management', 'Basic inventory tracking', 1),
        ('${(0, uuid_1.v4)()}', '${starterPlanId}', 'SINGLE_WAREHOUSE', 'Single Warehouse', 'Manage one warehouse location', 1),
        ('${(0, uuid_1.v4)()}', '${starterPlanId}', 'SALES_ORDERS', 'Sales Orders', 'Create and manage sales orders', 1),
        ('${(0, uuid_1.v4)()}', '${starterPlanId}', 'PURCHASE_ORDERS', 'Purchase Orders', 'Create and manage purchase orders', 1),
        ('${(0, uuid_1.v4)()}', '${starterPlanId}', 'BASIC_REPORTS', 'Basic Reports', 'Standard reporting features', 1),
        ('${(0, uuid_1.v4)()}', '${starterPlanId}', 'EMAIL_SUPPORT', 'Email Support', 'Email-based customer support', 1),
        ('${(0, uuid_1.v4)()}', '${starterPlanId}', 'MULTI_WAREHOUSE', 'Multi-Warehouse', 'Multiple warehouse locations', 0),
        ('${(0, uuid_1.v4)()}', '${starterPlanId}', 'ADVANCED_REPORTS', 'Advanced Reports', 'Advanced analytics and reporting', 0),
        ('${(0, uuid_1.v4)()}', '${starterPlanId}', 'API_ACCESS', 'API Access', 'REST API access for integrations', 0)
    `);
        await queryRunner.query(`
      INSERT INTO \`plan_features\` 
        (\`id\`, \`plan_id\`, \`feature_code\`, \`feature_name\`, \`description\`, \`is_enabled\`)
      VALUES
        ('${(0, uuid_1.v4)()}', '${professionalPlanId}', 'INVENTORY_MGMT', 'Inventory Management', 'Advanced inventory tracking', 1),
        ('${(0, uuid_1.v4)()}', '${professionalPlanId}', 'MULTI_WAREHOUSE', 'Multi-Warehouse', 'Up to 3 warehouse locations', 1),
        ('${(0, uuid_1.v4)()}', '${professionalPlanId}', 'SALES_ORDERS', 'Sales Orders', 'Create and manage sales orders', 1),
        ('${(0, uuid_1.v4)()}', '${professionalPlanId}', 'PURCHASE_ORDERS', 'Purchase Orders', 'Create and manage purchase orders', 1),
        ('${(0, uuid_1.v4)()}', '${professionalPlanId}', 'BASIC_REPORTS', 'Basic Reports', 'Standard reporting features', 1),
        ('${(0, uuid_1.v4)()}', '${professionalPlanId}', 'ADVANCED_REPORTS', 'Advanced Reports', 'Advanced analytics and reporting', 1),
        ('${(0, uuid_1.v4)()}', '${professionalPlanId}', 'BATCH_TRACKING', 'Batch Tracking', 'Track inventory by batch/lot', 1),
        ('${(0, uuid_1.v4)()}', '${professionalPlanId}', 'SERIAL_TRACKING', 'Serial Tracking', 'Track inventory by serial number', 1),
        ('${(0, uuid_1.v4)()}', '${professionalPlanId}', 'EMAIL_SUPPORT', 'Email Support', 'Email-based customer support', 1),
        ('${(0, uuid_1.v4)()}', '${professionalPlanId}', 'CHAT_SUPPORT', 'Chat Support', 'Live chat support', 1),
        ('${(0, uuid_1.v4)()}', '${professionalPlanId}', 'API_ACCESS', 'API Access', 'REST API access for integrations', 0)
    `);
        await queryRunner.query(`
      INSERT INTO \`plan_features\` 
        (\`id\`, \`plan_id\`, \`feature_code\`, \`feature_name\`, \`description\`, \`is_enabled\`)
      VALUES
        ('${(0, uuid_1.v4)()}', '${enterprisePlanId}', 'INVENTORY_MGMT', 'Inventory Management', 'Enterprise inventory tracking', 1),
        ('${(0, uuid_1.v4)()}', '${enterprisePlanId}', 'MULTI_WAREHOUSE', 'Multi-Warehouse', 'Unlimited warehouse locations', 1),
        ('${(0, uuid_1.v4)()}', '${enterprisePlanId}', 'SALES_ORDERS', 'Sales Orders', 'Create and manage sales orders', 1),
        ('${(0, uuid_1.v4)()}', '${enterprisePlanId}', 'PURCHASE_ORDERS', 'Purchase Orders', 'Create and manage purchase orders', 1),
        ('${(0, uuid_1.v4)()}', '${enterprisePlanId}', 'BASIC_REPORTS', 'Basic Reports', 'Standard reporting features', 1),
        ('${(0, uuid_1.v4)()}', '${enterprisePlanId}', 'ADVANCED_REPORTS', 'Advanced Reports', 'Advanced analytics and reporting', 1),
        ('${(0, uuid_1.v4)()}', '${enterprisePlanId}', 'CUSTOM_REPORTS', 'Custom Reports', 'Build custom reports', 1),
        ('${(0, uuid_1.v4)()}', '${enterprisePlanId}', 'BATCH_TRACKING', 'Batch Tracking', 'Track inventory by batch/lot', 1),
        ('${(0, uuid_1.v4)()}', '${enterprisePlanId}', 'SERIAL_TRACKING', 'Serial Tracking', 'Track inventory by serial number', 1),
        ('${(0, uuid_1.v4)()}', '${enterprisePlanId}', 'MANUFACTURING', 'Manufacturing Module', 'Bill of materials and work orders', 1),
        ('${(0, uuid_1.v4)()}', '${enterprisePlanId}', 'API_ACCESS', 'API Access', 'Full REST API access', 1),
        ('${(0, uuid_1.v4)()}', '${enterprisePlanId}', 'WEBHOOKS', 'Webhooks', 'Real-time event notifications', 1),
        ('${(0, uuid_1.v4)()}', '${enterprisePlanId}', 'SSO', 'Single Sign-On', 'SAML/OAuth SSO integration', 1),
        ('${(0, uuid_1.v4)()}', '${enterprisePlanId}', 'AUDIT_LOGS', 'Audit Logs', 'Complete audit trail', 1),
        ('${(0, uuid_1.v4)()}', '${enterprisePlanId}', 'PRIORITY_SUPPORT', 'Priority Support', '24/7 priority support', 1),
        ('${(0, uuid_1.v4)()}', '${enterprisePlanId}', 'DEDICATED_MANAGER', 'Account Manager', 'Dedicated account manager', 1)
    `);
        await queryRunner.query(`
      INSERT INTO \`system_settings\` 
        (\`id\`, \`setting_key\`, \`setting_value\`, \`value_type\`, \`category\`, \`description\`, \`is_public\`, \`is_editable\`)
      VALUES
        ('${(0, uuid_1.v4)()}', 'app.name', 'Multi-Tenant ERP', 'string', 'general', 'Application name', 1, 1),
        ('${(0, uuid_1.v4)()}', 'app.version', '1.0.0', 'string', 'general', 'Application version', 1, 0),
        ('${(0, uuid_1.v4)()}', 'app.maintenance_mode', 'false', 'boolean', 'general', 'Maintenance mode flag', 1, 1),
        ('${(0, uuid_1.v4)()}', 'app.registration_enabled', 'true', 'boolean', 'general', 'Allow new tenant registration', 0, 1),
        ('${(0, uuid_1.v4)()}', 'trial.default_days', '14', 'number', 'subscription', 'Default trial period in days', 0, 1),
        ('${(0, uuid_1.v4)()}', 'trial.require_payment_method', 'false', 'boolean', 'subscription', 'Require payment method for trial', 0, 1),
        ('${(0, uuid_1.v4)()}', 'billing.tax_rate', '18', 'number', 'billing', 'Default GST rate percentage', 0, 1),
        ('${(0, uuid_1.v4)()}', 'billing.grace_period_days', '7', 'number', 'billing', 'Payment grace period in days', 0, 1),
        ('${(0, uuid_1.v4)()}', 'billing.currency', 'INR', 'string', 'billing', 'Default billing currency', 0, 1),
        ('${(0, uuid_1.v4)()}', 'email.from_address', 'noreply@erp.com', 'string', 'email', 'Default from email address', 0, 1),
        ('${(0, uuid_1.v4)()}', 'email.from_name', 'ERP System', 'string', 'email', 'Default from name', 0, 1),
        ('${(0, uuid_1.v4)()}', 'email.support_address', 'support@erp.com', 'string', 'email', 'Support email address', 1, 1),
        ('${(0, uuid_1.v4)()}', 'security.password_min_length', '8', 'number', 'security', 'Minimum password length', 0, 1),
        ('${(0, uuid_1.v4)()}', 'security.max_login_attempts', '5', 'number', 'security', 'Max failed login attempts before lockout', 0, 1),
        ('${(0, uuid_1.v4)()}', 'security.lockout_duration_minutes', '15', 'number', 'security', 'Account lockout duration in minutes', 0, 1),
        ('${(0, uuid_1.v4)()}', 'security.session_timeout_minutes', '60', 'number', 'security', 'Session timeout in minutes', 0, 1)
    `);
    }
    async down(queryRunner) {
        await queryRunner.query(`DELETE FROM \`system_settings\``);
        await queryRunner.query(`DELETE FROM \`plan_features\``);
        await queryRunner.query(`DELETE FROM \`subscription_plans\``);
    }
}
exports.SeedMasterData1700000000002 = SeedMasterData1700000000002;
//# sourceMappingURL=1700000000002-SeedMasterData.js.map