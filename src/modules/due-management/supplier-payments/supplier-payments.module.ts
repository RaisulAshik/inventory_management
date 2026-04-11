// src/modules/purchase/supplier-payments/supplier-payments.module.ts

import { Module } from '@nestjs/common';
import { SupplierPaymentsController } from './supplier-payments.controller';
import { SupplierPaymentsService } from './supplier-payments.service';
import { SupplierDuesModule } from '../supplier-dues/supplier-dues.module';
import { AccountingModule } from '@modules/accounting/accounting.module';

@Module({
  imports: [SupplierDuesModule, AccountingModule],
  controllers: [SupplierPaymentsController],
  providers: [SupplierPaymentsService],
  exports: [SupplierPaymentsService],
})
export class SupplierPaymentsModule {}
