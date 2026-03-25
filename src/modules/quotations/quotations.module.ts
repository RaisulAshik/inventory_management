// src/modules/quotations/quotations.module.ts

import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { QuotationsController } from './quotations.controller';
import { QuotationsService } from './quotations.service';
import { DashboardModule } from '../dashboard/dashboard.module';

@Module({
  imports: [
    DashboardModule,
    MulterModule.register({ storage: memoryStorage() }),
  ],
  controllers: [QuotationsController],
  providers: [QuotationsService],
  exports: [QuotationsService],
})
export class QuotationsModule {}
