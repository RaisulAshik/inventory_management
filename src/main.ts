// src/main.ts
import { NestFactory } from '@nestjs/core';
import { ValidationPipe, VersioningType, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import { AppModule } from './app.module';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const corsOrigin = configService.get<string>('cors.origin', '*');
  const allowedOrigins =
    corsOrigin === '*'
      ? '*'
      : corsOrigin.split(',').map((origin) => origin.trim());
  // Security middleware
  app.use(helmet());
  app.use(compression());
  app.use(cookieParser());

  // CORS Configuration
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type',
      'Authorization',
      'X-Tenant-ID',
      'X-Request-ID',
      'Accept',
      'Origin',
    ],
    exposedHeaders: ['X-Request-ID'],
  });

  // API Versioning
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // Global prefix - NOTE: This adds /api to ALL routes
  // So routes will be: /api/v1/admin/auth/login
  app.setGlobalPrefix('api', {
    exclude: ['health', 'docs', 'docs/(.*)', 'api-json'],
  });

  // Global Validation Pipe
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
      validationError: {
        target: false,
        value: false,
      },
    }),
  );

  // Swagger Documentation (disabled in production)
  if (configService.get<string>('nodeEnv') !== 'production') {
    const swaggerConfig = new DocumentBuilder()
      .setTitle('Multi-Tenant ERP API')
      .setDescription(
        `
## Multi-Tenant ERP System API Documentation

### Authentication

There are two types of authentication:

1. **Admin Authentication** (\`/api/v1/admin/auth/*\`)
   - For tenant administrators
   - Uses master database
   - Does NOT require X-Tenant-ID header
   - Returns JWT with tenant database info embedded

2. **Tenant User Authentication** (\`/api/v1/auth/*\`)
   - For regular tenant users
   - Requires X-Tenant-ID header
   - Uses tenant-specific database

### Headers

- \`Authorization: Bearer <token>\` - Required for authenticated endpoints
- \`X-Tenant-ID: <tenant-code>\` - Required for tenant-specific endpoints (NOT admin routes)
- \`X-Request-ID: <uuid>\` - Optional, for request tracing

### API Endpoints

All endpoints are prefixed with \`/api/v1/\`
        `,
      )
      .setVersion('1.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          name: 'Authorization',
          description: 'Enter JWT token',
          in: 'header',
        },
        'bearer',
      )
      .addApiKey(
        {
          type: 'apiKey',
          name: 'X-Tenant-ID',
          in: 'header',
          description: 'Tenant Code (NOT required for admin routes)',
        },
        'X-Tenant-ID',
      )
      .addTag('Admin Authentication', 'Admin user authentication (master DB)')
      .addTag('Tenant Authentication', 'Tenant user authentication')
      .addTag('Users', 'User management')
      .addTag('Products', 'Product management')
      .addTag('Categories', 'Category management')
      .addTag('Brands', 'Brand management')
      .addTag('Customers', 'Customer management')
      .addTag('Suppliers', 'Supplier management')
      .addTag('Sales Orders', 'Sales order management')
      .addTag('Purchase Orders', 'Purchase order management')
      .addTag('Inventory', 'Inventory management')
      .addTag('Warehouses', 'Warehouse management')
      .addTag('Dashboard', 'Dashboard and analytics')
      .addTag('Settings', 'System settings')
      .build();

    const document = SwaggerModule.createDocument(app, swaggerConfig);
    SwaggerModule.setup('docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true,
        docExpansion: 'none',
        filter: true,
        showRequestDuration: true,
      },
    });

    logger.log('Swagger documentation available at /docs');
  }

  // Health check endpoint
  app.getHttpAdapter().get('/health', (req, res) => {
    res.status(200).json({
      status: 'ok',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  });

  // Graceful shutdown
  app.enableShutdownHooks();

  const port = configService.get<number>('port', 3000);
  await app.listen(port);

  logger.log(`🚀 Application is running on: http://localhost:${port}`);
  logger.log(`📚 API Documentation: http://localhost:${port}/docs`);
  logger.log(`❤️  Health Check: http://localhost:${port}/health`);
  logger.log(`\n📍 API Endpoints:`);
  logger.log(
    `   - Admin Login: POST http://localhost:${port}/api/v1/admin/auth/login`,
  );
  logger.log(
    `   - Admin Register: POST http://localhost:${port}/api/v1/admin/auth/register`,
  );
}

bootstrap();
