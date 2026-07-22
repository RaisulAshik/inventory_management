// src/modules/purchase/supplier-dues/supplier-dues.module.ts

import { Module } from '@nestjs/common';
import { SupplierDuesController } from './supplier-dues.controller';
import { SupplierDuesService } from './supplier-dues.service';
import { AccountingModule } from '@modules/accounting/accounting.module';

@Module({
  imports: [AccountingModule],
  controllers: [SupplierDuesController],
  providers: [SupplierDuesService],
  exports: [SupplierDuesService],
})
export class SupplierDuesModule {}
