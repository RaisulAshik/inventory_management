"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WarehouseModule = void 0;
const common_1 = require("@nestjs/common");
const warehouses_service_1 = require("./warehouses/warehouses.service");
const stock_controller_1 = require("./stock/stock.controller");
const stock_service_1 = require("./stock/stock.service");
const database_module_1 = require("../../database/database.module");
const warehouses_controller_1 = require("./warehouses/warehouses.controller");
const adjustments_controller_1 = require("./adjustments/adjustments.controller");
const adjustments_service_1 = require("./adjustments/adjustments.service");
const locations_controller_1 = require("./locations/locations.controller");
const locations_service_1 = require("./locations/locations.service");
const transfers_controller_1 = require("./transfers/transfers.controller");
const transfers_service_1 = require("./transfers/transfers.service");
let WarehouseModule = class WarehouseModule {
};
exports.WarehouseModule = WarehouseModule;
exports.WarehouseModule = WarehouseModule = __decorate([
    (0, common_1.Module)({
        imports: [database_module_1.DatabaseModule],
        controllers: [
            warehouses_controller_1.WarehousesController,
            locations_controller_1.LocationsController,
            stock_controller_1.StockController,
            transfers_controller_1.TransfersController,
            adjustments_controller_1.AdjustmentsController,
        ],
        providers: [
            warehouses_service_1.WarehousesService,
            locations_service_1.LocationsService,
            stock_service_1.StockService,
            transfers_service_1.TransfersService,
            adjustments_service_1.AdjustmentsService,
        ],
        exports: [
            warehouses_service_1.WarehousesService,
            locations_service_1.LocationsService,
            stock_service_1.StockService,
            transfers_service_1.TransfersService,
            adjustments_service_1.AdjustmentsService,
        ],
    })
], WarehouseModule);
//# sourceMappingURL=warehouse.module.js.map