"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InventoryModule = void 0;
const common_1 = require("@nestjs/common");
const products_controller_1 = require("./products/products.controller");
const products_service_1 = require("./products/products.service");
const categories_controller_1 = require("./categories/categories.controller");
const categories_service_1 = require("./categories/categories.service");
const brands_controller_1 = require("./brands/brands.controller");
const brands_service_1 = require("./brands/brands.service");
const suppliers_controller_1 = require("./suppliers/suppliers.controller");
const suppliers_service_1 = require("./suppliers/suppliers.service");
const database_module_1 = require("../../database/database.module");
const price_lists_controller_1 = require("./price-lists/price-lists.controller");
const price_lists_service_1 = require("./price-lists/price-lists.service");
const units_controller_1 = require("./units/units.controller");
const units_service_1 = require("./units/units.service");
const tax_controller_1 = require("./tax/tax.controller");
const tax_service_1 = require("./tax/tax.service");
let InventoryModule = class InventoryModule {
};
exports.InventoryModule = InventoryModule;
exports.InventoryModule = InventoryModule = __decorate([
    (0, common_1.Module)({
        imports: [database_module_1.DatabaseModule],
        controllers: [
            products_controller_1.ProductsController,
            categories_controller_1.CategoriesController,
            brands_controller_1.BrandsController,
            suppliers_controller_1.SuppliersController,
            units_controller_1.UnitsController,
            price_lists_controller_1.PriceListsController,
            tax_controller_1.TaxController,
        ],
        providers: [
            products_service_1.ProductsService,
            categories_service_1.CategoriesService,
            brands_service_1.BrandsService,
            suppliers_service_1.SuppliersService,
            units_service_1.UnitsService,
            price_lists_service_1.PriceListsService,
            tax_service_1.TaxService,
        ],
        exports: [
            products_service_1.ProductsService,
            categories_service_1.CategoriesService,
            brands_service_1.BrandsService,
            suppliers_service_1.SuppliersService,
            units_service_1.UnitsService,
            price_lists_service_1.PriceListsService,
            tax_service_1.TaxService,
        ],
    })
], InventoryModule);
//# sourceMappingURL=inventory.module.js.map