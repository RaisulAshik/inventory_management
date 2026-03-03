import { Module } from '@nestjs/common';
import { PurchaseOrdersController } from './purchase-orders/purchase-orders.controller';
import { PurchaseOrdersService } from './purchase-orders/purchase-orders.service';
import { GrnController } from './grn/grn.controller';
import { GrnService } from './grn/grn.service';
import { PurchaseReturnsController } from './purchase-returns/purchase-returns.controller';
import { PurchaseReturnsService } from './purchase-returns/purchase-returns.service';
import { DatabaseModule } from '@database/database.module';
import { InventoryModule } from '@modules/inventory/inventory.module';
import { WarehouseModule } from '@modules/warehouse/warehouse.module';
import { SupplierDuesModule } from '../due-management';

@Module({
  imports: [
    DatabaseModule,
    InventoryModule,
    WarehouseModule,
    SupplierDuesModule,
  ],
  controllers: [
    PurchaseOrdersController,
    GrnController,
    PurchaseReturnsController,
  ],
  providers: [PurchaseOrdersService, GrnService, PurchaseReturnsService],
  exports: [PurchaseOrdersService, GrnService, PurchaseReturnsService],
})
export class PurchasingModule {}
