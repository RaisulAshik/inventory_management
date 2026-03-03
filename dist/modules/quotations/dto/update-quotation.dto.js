"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateQuotationDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const create_quotation_dto_1 = require("./create-quotation.dto");
class UpdateQuotationDto extends (0, swagger_1.PartialType)(create_quotation_dto_1.CreateQuotationDto) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateQuotationDto = UpdateQuotationDto;
//# sourceMappingURL=update-quotation.dto.js.map