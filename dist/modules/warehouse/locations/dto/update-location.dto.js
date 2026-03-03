"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateLocationDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const create_location_dto_1 = require("./create-location.dto");
class UpdateLocationDto extends (0, swagger_1.PartialType)((0, swagger_1.OmitType)(create_location_dto_1.CreateLocationDto, ['warehouseId'])) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateLocationDto = UpdateLocationDto;
//# sourceMappingURL=update-location.dto.js.map