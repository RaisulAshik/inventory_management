import { Module } from '@nestjs/common';
import { CustomersController } from './customers/customers.controller';
import { CustomersService } from './customers/customers.service';
import { DatabaseModule } from '@database/database.module';
import { WarehouseModule } from '@modules/warehouse/warehouse.module';
import { InventoryModule } from '@modules/inventory/inventory.module';
import { OrdersController } from './orders/orders.controller';
import { OrdersService } from './orders/orders.service';
import { ReturnsController } from './returns/returns.controller';
import { ReturnsService } from './returns/returns.service';
import { CustomerDuesModule } from '../due-management';

@Module({
  imports: [
    DatabaseModule,
    InventoryModule,
    WarehouseModule,
    CustomerDuesModule,
  ],
  controllers: [CustomersController, OrdersController, ReturnsController],
  providers: [CustomersService, OrdersService, ReturnsService],
  exports: [CustomersService, OrdersService, ReturnsService],
})
export class SalesModule {}
