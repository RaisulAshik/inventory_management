// src/modules/sales/collections/collections.module.ts

import { Module } from '@nestjs/common';
import { CollectionsController } from './collections.controller';
import { CollectionsService } from './collections.service';
import { CustomerDuesModule } from '../customer-dues/customer-dues.module';

@Module({
  imports: [CustomerDuesModule],
  controllers: [CollectionsController],
  providers: [CollectionsService],
  exports: [CollectionsService],
})
export class CollectionsModule {}
