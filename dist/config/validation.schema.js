"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationSchema = void 0;
const Joi = __importStar(require("joi"));
exports.validationSchema = Joi.object({
    NODE_ENV: Joi.string()
        .valid('development', 'production', 'test', 'staging')
        .default('development'),
    PORT: Joi.number().default(3000),
    JWT_SECRET: Joi.string().required(),
    JWT_EXPIRES_IN: Joi.string().default('1d'),
    JWT_REFRESH_EXPIRES_IN: Joi.string().default('7d'),
    MASTER_DB_HOST: Joi.string().default('localhost'),
    MASTER_DB_PORT: Joi.number().default(3306),
    MASTER_DB_USERNAME: Joi.string().required(),
    MASTER_DB_PASSWORD: Joi.string().allow('').default(''),
    MASTER_DB_NAME: Joi.string().default('erp_master'),
    TENANT_DB_HOST: Joi.string().default('localhost'),
    TENANT_DB_PORT: Joi.number().default(3306),
    TENANT_DB_USERNAME: Joi.string().required(),
    TENANT_DB_PASSWORD: Joi.string().allow('').default(''),
    REDIS_HOST: Joi.string().default('localhost'),
    REDIS_PORT: Joi.number().default(6379),
    REDIS_PASSWORD: Joi.string().allow('').optional(),
    SMTP_HOST: Joi.string().optional(),
    SMTP_PORT: Joi.number().default(587),
    SMTP_USER: Joi.string().optional(),
    SMTP_PASSWORD: Joi.string().optional(),
    EMAIL_FROM: Joi.string().email().default('noreply@erp.com'),
    STORAGE_TYPE: Joi.string().valid('local', 's3', 'azure').default('local'),
    STORAGE_LOCAL_PATH: Joi.string().default('./uploads'),
    AWS_S3_BUCKET: Joi.string().optional(),
    AWS_REGION: Joi.string().default('ap-south-1'),
    AWS_ACCESS_KEY_ID: Joi.string().optional(),
    AWS_SECRET_ACCESS_KEY: Joi.string().optional(),
    CORS_ORIGIN: Joi.string().default('*'),
    LOG_LEVEL: Joi.string()
        .valid('error', 'warn', 'info', 'debug', 'verbose')
        .default('info'),
});
//# sourceMappingURL=validation.schema.js.map