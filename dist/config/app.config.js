"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("@nestjs/config");
exports.default = (0, config_1.registerAs)('app', () => ({
    nodeEnv: process.env.NODE_ENV || 'development',
    name: process.env.APP_NAME || 'ERP System',
    port: parseInt(process.env.APP_PORT ?? '3000', 10),
    apiPrefix: process.env.API_PREFIX || 'api',
    apiVersion: process.env.API_VERSION || 'v1',
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE ?? '52428800', 10),
    uploadPath: process.env.UPLOAD_PATH || './uploads',
    defaultPageSize: 20,
    maxPageSize: 100,
}));
//# sourceMappingURL=app.config.js.map