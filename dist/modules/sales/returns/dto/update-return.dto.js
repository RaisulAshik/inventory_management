"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateReturnDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const create_return_dto_1 = require("./create-return.dto");
class UpdateReturnDto extends (0, swagger_1.PartialType)((0, swagger_1.OmitType)(create_return_dto_1.CreateReturnDto, ['items', 'salesOrderId'])) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateReturnDto = UpdateReturnDto;
//# sourceMappingURL=update-return.dto.js.map