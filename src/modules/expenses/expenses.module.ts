import { Module } from '@nestjs/common';
import { DatabaseModule } from '@database/database.module';
import { AccountingModule } from '@modules/accounting/accounting.module';
import { ExpensesService } from './expenses.service';
import { ExpensesController } from './expenses.controller';

@Module({
  imports: [DatabaseModule, AccountingModule],
  controllers: [ExpensesController],
  providers: [ExpensesService],
  exports: [ExpensesService],
})
export class ExpensesModule {}
