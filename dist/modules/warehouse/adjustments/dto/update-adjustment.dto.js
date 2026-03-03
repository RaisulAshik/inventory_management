"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateAdjustmentDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const create_adjustment_dto_1 = require("./create-adjustment.dto");
class UpdateAdjustmentDto extends (0, swagger_1.PartialType)((0, swagger_1.OmitType)(create_adjustment_dto_1.CreateAdjustmentDto, ['items', 'warehouseId'])) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateAdjustmentDto = UpdateAdjustmentDto;
//# sourceMappingURL=update-adjustment.dto.js.map