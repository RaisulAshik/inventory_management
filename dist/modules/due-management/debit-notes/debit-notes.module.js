"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DebitNotesModule = void 0;
const common_1 = require("@nestjs/common");
const debit_notes_controller_1 = require("./debit-notes.controller");
const debit_notes_service_1 = require("./debit-notes.service");
const supplier_dues_module_1 = require("../supplier-dues/supplier-dues.module");
let DebitNotesModule = class DebitNotesModule {
};
exports.DebitNotesModule = DebitNotesModule;
exports.DebitNotesModule = DebitNotesModule = __decorate([
    (0, common_1.Module)({
        imports: [supplier_dues_module_1.SupplierDuesModule],
        controllers: [debit_notes_controller_1.DebitNotesController],
        providers: [debit_notes_service_1.DebitNotesService],
        exports: [debit_notes_service_1.DebitNotesService],
    })
], DebitNotesModule);
//# sourceMappingURL=debit-notes.module.js.map