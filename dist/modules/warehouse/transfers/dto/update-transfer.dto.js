"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTransferDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const create_transfer_dto_1 = require("./create-transfer.dto");
class UpdateTransferDto extends (0, swagger_1.PartialType)((0, swagger_1.OmitType)(create_transfer_dto_1.CreateTransferDto, [
    'items',
    'fromWarehouseId',
    'toWarehouseId',
])) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateTransferDto = UpdateTransferDto;
//# sourceMappingURL=update-transfer.dto.js.map