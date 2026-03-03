import * as Joi from 'joi';

export const validationSchema = Joi.object({
  // Server
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test', 'staging')
    .default('development'),
  PORT: Joi.number().default(3000),

  // JWT
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().default('1d'),
  JWT_REFRESH_EXPIRES_IN: Joi.string().default('7d'),

  // Master Database
  MASTER_DB_HOST: Joi.string().default('localhost'),
  MASTER_DB_PORT: Joi.number().default(3306),
  MASTER_DB_USERNAME: Joi.string().required(),
  MASTER_DB_PASSWORD: Joi.string().allow('').default(''),
  MASTER_DB_NAME: Joi.string().default('erp_master'),

  // Tenant Database
  TENANT_DB_HOST: Joi.string().default('localhost'),
  TENANT_DB_PORT: Joi.number().default(3306),
  TENANT_DB_USERNAME: Joi.string().required(),
  TENANT_DB_PASSWORD: Joi.string().allow('').default(''),

  // Redis
  REDIS_HOST: Joi.string().default('localhost'),
  REDIS_PORT: Joi.number().default(6379),
  REDIS_PASSWORD: Joi.string().allow('').optional(),

  // Email
  SMTP_HOST: Joi.string().optional(),
  SMTP_PORT: Joi.number().default(587),
  SMTP_USER: Joi.string().optional(),
  SMTP_PASSWORD: Joi.string().optional(),
  EMAIL_FROM: Joi.string().email().default('noreply@erp.com'),

  // Storage
  STORAGE_TYPE: Joi.string().valid('local', 's3', 'azure').default('local'),
  STORAGE_LOCAL_PATH: Joi.string().default('./uploads'),
  AWS_S3_BUCKET: Joi.string().optional(),
  AWS_REGION: Joi.string().default('ap-south-1'),
  AWS_ACCESS_KEY_ID: Joi.string().optional(),
  AWS_SECRET_ACCESS_KEY: Joi.string().optional(),

  // CORS
  CORS_ORIGIN: Joi.string().default('*'),

  // Logging
  LOG_LEVEL: Joi.string()
    .valid('error', 'warn', 'info', 'debug', 'verbose')
    .default('info'),
});
