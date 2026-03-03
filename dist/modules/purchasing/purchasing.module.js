"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PurchasingModule = void 0;
const common_1 = require("@nestjs/common");
const purchase_orders_controller_1 = require("./purchase-orders/purchase-orders.controller");
const purchase_orders_service_1 = require("./purchase-orders/purchase-orders.service");
const grn_controller_1 = require("./grn/grn.controller");
const grn_service_1 = require("./grn/grn.service");
const purchase_returns_controller_1 = require("./purchase-returns/purchase-returns.controller");
const purchase_returns_service_1 = require("./purchase-returns/purchase-returns.service");
const database_module_1 = require("../../database/database.module");
const inventory_module_1 = require("../inventory/inventory.module");
const warehouse_module_1 = require("../warehouse/warehouse.module");
const due_management_1 = require("../due-management");
let PurchasingModule = class PurchasingModule {
};
exports.PurchasingModule = PurchasingModule;
exports.PurchasingModule = PurchasingModule = __decorate([
    (0, common_1.Module)({
        imports: [
            database_module_1.DatabaseModule,
            inventory_module_1.InventoryModule,
            warehouse_module_1.WarehouseModule,
            due_management_1.SupplierDuesModule,
        ],
        controllers: [
            purchase_orders_controller_1.PurchaseOrdersController,
            grn_controller_1.GrnController,
            purchase_returns_controller_1.PurchaseReturnsController,
        ],
        providers: [purchase_orders_service_1.PurchaseOrdersService, grn_service_1.GrnService, purchase_returns_service_1.PurchaseReturnsService],
        exports: [purchase_orders_service_1.PurchaseOrdersService, grn_service_1.GrnService, purchase_returns_service_1.PurchaseReturnsService],
    })
], PurchasingModule);
//# sourceMappingURL=purchasing.module.js.map