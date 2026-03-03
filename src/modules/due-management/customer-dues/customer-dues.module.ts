// src/modules/sales/customer-dues/customer-dues.module.ts

import { Module } from '@nestjs/common';
import { CustomerDuesController } from './customer-dues.controller';
import { CustomerDuesService } from './customer-dues.service';

@Module({
  controllers: [CustomerDuesController],
  providers: [CustomerDuesService],
  exports: [CustomerDuesService],
})
export class CustomerDuesModule {}
