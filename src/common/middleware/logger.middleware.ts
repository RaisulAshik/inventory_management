import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger('HTTP');

  use(req: Request, res: Response, next: NextFunction) {
    const requestId = (req.headers['x-request-id'] as string) || uuidv4();
    const { method, originalUrl, ip } = req;
    const userAgent = req.get('user-agent') || '';
    const tenantId = req.headers['x-tenant-id'] || 'N/A';

    // Add request ID to response headers
    res.setHeader('X-Request-ID', requestId);

    const startTime = Date.now();

    res.on('finish', () => {
      const { statusCode } = res;
      const contentLength = res.get('content-length') || 0;
      const duration = Date.now() - startTime;

      const logMessage = `${method} ${originalUrl} ${statusCode} ${contentLength} - ${duration}ms`;
      const logContext = {
        requestId,
        tenantId,
        ip,
        userAgent,
        duration,
      };

      if (statusCode >= 500) {
        this.logger.error(logMessage, JSON.stringify(logContext));
      } else if (statusCode >= 400) {
        this.logger.warn(logMessage, JSON.stringify(logContext));
      } else {
        this.logger.log(logMessage);
      }
    });

    next();
  }
}
