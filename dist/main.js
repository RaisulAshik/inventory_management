"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const swagger_1 = require("@nestjs/swagger");
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app_module_1 = require("./app.module");
async function bootstrap() {
    const logger = new common_1.Logger('Bootstrap');
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    const corsOrigin = configService.get('cors.origin', '*');
    const allowedOrigins = corsOrigin === '*'
        ? '*'
        : corsOrigin.split(',').map((origin) => origin.trim());
    app.use((0, helmet_1.default)());
    app.use((0, compression_1.default)());
    app.use((0, cookie_parser_1.default)());
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
    app.enableVersioning({
        type: common_1.VersioningType.URI,
        defaultVersion: '1',
    });
    app.setGlobalPrefix('api', {
        exclude: ['health', 'docs', 'docs/(.*)', 'api-json'],
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
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
    }));
    if (configService.get('nodeEnv') !== 'production') {
        const swaggerConfig = new swagger_1.DocumentBuilder()
            .setTitle('Multi-Tenant ERP API')
            .setDescription(`
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
        `)
            .setVersion('1.0')
            .addBearerAuth({
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            name: 'Authorization',
            description: 'Enter JWT token',
            in: 'header',
        }, 'bearer')
            .addApiKey({
            type: 'apiKey',
            name: 'X-Tenant-ID',
            in: 'header',
            description: 'Tenant Code (NOT required for admin routes)',
        }, 'X-Tenant-ID')
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
        const document = swagger_1.SwaggerModule.createDocument(app, swaggerConfig);
        swagger_1.SwaggerModule.setup('docs', app, document, {
            swaggerOptions: {
                persistAuthorization: true,
                docExpansion: 'none',
                filter: true,
                showRequestDuration: true,
            },
        });
        logger.log('Swagger documentation available at /docs');
    }
    app.getHttpAdapter().get('/health', (req, res) => {
        res.status(200).json({
            status: 'ok',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
        });
    });
    app.enableShutdownHooks();
    const port = configService.get('port', 3000);
    await app.listen(port);
    logger.log(`🚀 Application is running on: http://localhost:${port}`);
    logger.log(`📚 API Documentation: http://localhost:${port}/docs`);
    logger.log(`❤️  Health Check: http://localhost:${port}/health`);
    logger.log(`\n📍 API Endpoints:`);
    logger.log(`   - Admin Login: POST http://localhost:${port}/api/v1/admin/auth/login`);
    logger.log(`   - Admin Register: POST http://localhost:${port}/api/v1/admin/auth/register`);
}
bootstrap();
//# sourceMappingURL=main.js.map