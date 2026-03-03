"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTaxCategoryDto = void 0;
const openapi = require("@nestjs/swagger");
class CreateTaxCategoryDto {
    taxCode;
    taxName;
    description;
    static _OPENAPI_METADATA_FACTORY() {
        return { taxCode: { required: true, type: () => String }, taxName: { required: true, type: () => String }, description: { required: false, type: () => String } };
    }
}
exports.CreateTaxCategoryDto = CreateTaxCategoryDto;
//# sourceMappingURL=taxCategory.dto.js.map