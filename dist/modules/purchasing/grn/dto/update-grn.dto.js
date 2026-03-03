"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateGrnDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const create_grn_dto_1 = require("./create-grn.dto");
class UpdateGrnDto extends (0, swagger_1.PartialType)((0, swagger_1.OmitType)(create_grn_dto_1.CreateGrnDto, ['items', 'purchaseOrderId'])) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateGrnDto = UpdateGrnDto;
//# sourceMappingURL=update-grn.dto.js.map