// src/modules/sales/credit-notes/credit-notes.module.ts

import { Module } from '@nestjs/common';
import { CreditNotesController } from './credit-notes.controller';
import { CreditNotesService } from './credit-notes.service';
import { CustomerDuesModule } from '../customer-dues/customer-dues.module';

@Module({
  imports: [CustomerDuesModule],
  controllers: [CreditNotesController],
  providers: [CreditNotesService],
  exports: [CreditNotesService],
})
export class CreditNotesModule {}
