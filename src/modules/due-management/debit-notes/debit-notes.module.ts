// src/modules/purchase/debit-notes/debit-notes.module.ts

import { Module } from '@nestjs/common';
import { DebitNotesController } from './debit-notes.controller';
import { DebitNotesService } from './debit-notes.service';
import { SupplierDuesModule } from '../supplier-dues/supplier-dues.module';

@Module({
  imports: [SupplierDuesModule],
  controllers: [DebitNotesController],
  providers: [DebitNotesService],
  exports: [DebitNotesService],
})
export class DebitNotesModule {}
