"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatePriceListDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const create_price_list_dto_1 = require("./create-price-list.dto");
class UpdatePriceListDto extends (0, swagger_1.PartialType)((0, swagger_1.OmitType)(create_price_list_dto_1.CreatePriceListDto, ['items'])) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdatePriceListDto = UpdatePriceListDto;
//# sourceMappingURL=update-price-list.dto.js.map