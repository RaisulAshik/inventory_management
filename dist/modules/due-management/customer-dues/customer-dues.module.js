"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerDuesModule = void 0;
const common_1 = require("@nestjs/common");
const customer_dues_controller_1 = require("./customer-dues.controller");
const customer_dues_service_1 = require("./customer-dues.service");
let CustomerDuesModule = class CustomerDuesModule {
};
exports.CustomerDuesModule = CustomerDuesModule;
exports.CustomerDuesModule = CustomerDuesModule = __decorate([
    (0, common_1.Module)({
        controllers: [customer_dues_controller_1.CustomerDuesController],
        providers: [customer_dues_service_1.CustomerDuesService],
        exports: [customer_dues_service_1.CustomerDuesService],
    })
], CustomerDuesModule);
//# sourceMappingURL=customer-dues.module.js.map