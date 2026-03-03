import { registerAs } from '@nestjs/config';

export default registerAs('app', () => ({
  nodeEnv: process.env.NODE_ENV || 'development',
  name: process.env.APP_NAME || 'ERP System',
  //port: parseInt(process.env.APP_PORT, 10) || 3000,
  port: parseInt(process.env.APP_PORT ?? '3000', 10),
  apiPrefix: process.env.API_PREFIX || 'api',
  apiVersion: process.env.API_VERSION || 'v1',

  // File upload
  //maxFileSize: parseInt(process.env.MAX_FILE_SIZE, 10) || 52428800, // 50MB
  maxFileSize: parseInt(process.env.MAX_FILE_SIZE ?? '52428800', 10), // 50MB
  uploadPath: process.env.UPLOAD_PATH || './uploads',

  // Pagination defaults
  defaultPageSize: 20,
  maxPageSize: 100,
}));
