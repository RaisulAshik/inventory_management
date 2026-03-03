"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SalesModule = void 0;
const common_1 = require("@nestjs/common");
const customers_controller_1 = require("./customers/customers.controller");
const customers_service_1 = require("./customers/customers.service");
const database_module_1 = require("../../database/database.module");
const warehouse_module_1 = require("../warehouse/warehouse.module");
const inventory_module_1 = require("../inventory/inventory.module");
const orders_controller_1 = require("./orders/orders.controller");
const orders_service_1 = require("./orders/orders.service");
const returns_controller_1 = require("./returns/returns.controller");
const returns_service_1 = require("./returns/returns.service");
const due_management_1 = require("../due-management");
let SalesModule = class SalesModule {
};
exports.SalesModule = SalesModule;
exports.SalesModule = SalesModule = __decorate([
    (0, common_1.Module)({
        imports: [
            database_module_1.DatabaseModule,
            inventory_module_1.InventoryModule,
            warehouse_module_1.WarehouseModule,
            due_management_1.CustomerDuesModule,
        ],
        controllers: [customers_controller_1.CustomersController, orders_controller_1.OrdersController, returns_controller_1.ReturnsController],
        providers: [customers_service_1.CustomersService, orders_service_1.OrdersService, returns_service_1.ReturnsService],
        exports: [customers_service_1.CustomersService, orders_service_1.OrdersService, returns_service_1.ReturnsService],
    })
], SalesModule);
//# sourceMappingURL=sales.module.js.map