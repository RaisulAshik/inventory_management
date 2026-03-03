"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateWarehouseDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const create_warehouse_dto_1 = require("./create-warehouse.dto");
class UpdateWarehouseDto extends (0, swagger_1.PartialType)((0, swagger_1.OmitType)(create_warehouse_dto_1.CreateWarehouseDto, ['zones'])) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateWarehouseDto = UpdateWarehouseDto;
//# sourceMappingURL=update-warehouse.dto.js.map