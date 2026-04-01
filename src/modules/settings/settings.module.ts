import { Module } from '@nestjs/common';
import { DatabaseModule } from '@database/database.module';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';
import { PaymentTermsController } from './payment-terms.controller';

@Module({
  imports: [DatabaseModule],
  controllers: [SettingsController, PaymentTermsController],
  providers: [SettingsService],
  exports: [SettingsService],
})
export class SettingsModule {}
