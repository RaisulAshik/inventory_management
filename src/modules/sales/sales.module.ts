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
import { PaymentMethodsController } from './payment-methods/payment-methods.controller';
import { PaymentMethodsService } from './payment-methods/payment-methods.service';
import { CustomerDuesModule } from '../due-management';
import { AccountingModule } from '../accounting/accounting.module';

@Module({
  imports: [
    DatabaseModule,
    InventoryModule,
    WarehouseModule,
    CustomerDuesModule,
    AccountingModule,
  ],
  controllers: [CustomersController, OrdersController, ReturnsController, PaymentMethodsController],
  providers: [CustomersService, OrdersService, ReturnsService, PaymentMethodsService],
  exports: [CustomersService, OrdersService, ReturnsService, PaymentMethodsService],
})
export class SalesModule {}
