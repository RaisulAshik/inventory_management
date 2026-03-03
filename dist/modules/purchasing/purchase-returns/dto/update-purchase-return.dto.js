"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePurchaseReturnDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const create_purchase_return_dto_1 = require("./create-purchase-return.dto");
class UpdatePurchaseReturnDto extends (0, swagger_1.PartialType)((0, swagger_1.OmitType)(create_purchase_return_dto_1.CreatePurchaseReturnDto, [
    'items',
    'purchaseOrderId',
    'grnId',
])) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdatePurchaseReturnDto = UpdatePurchaseReturnDto;
//# sourceMappingURL=update-purchase-return.dto.js.map