import { Module } from '@nestjs/common';
import { WarehousesService } from './warehouses/warehouses.service';
import { StockController } from './stock/stock.controller';
import { StockService } from './stock/stock.service';
import { DatabaseModule } from '@database/database.module';
import { WarehousesController } from './warehouses/warehouses.controller';
import { AdjustmentsController } from './adjustments/adjustments.controller';
import { AdjustmentsService } from './adjustments/adjustments.service';
import { LocationsController } from './locations/locations.controller';
import { LocationsService } from './locations/locations.service';
import { TransfersController } from './transfers/transfers.controller';
import { TransfersService } from './transfers/transfers.service';
import { AccountingModule } from '@modules/accounting/accounting.module';

@Module({
  imports: [DatabaseModule, AccountingModule],
  controllers: [
    WarehousesController,
    LocationsController,
    StockController,
    TransfersController,
    AdjustmentsController,
  ],
  providers: [
    WarehousesService,
    LocationsService,
    StockService,
    TransfersService,
    AdjustmentsService,
  ],
  exports: [
    WarehousesService,
    LocationsService,
    StockService,
    TransfersService,
    AdjustmentsService,
  ],
})
export class WarehouseModule {}
