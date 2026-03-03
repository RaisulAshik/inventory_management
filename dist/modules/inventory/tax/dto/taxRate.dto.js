"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTaxRateDto = void 0;
const openapi = require("@nestjs/swagger");
class CreateTaxRateDto {
    id;
    taxCategoryId;
    taxType;
    rateName;
    ratePercentage;
    effectiveFrom;
    static _OPENAPI_METADATA_FACTORY() {
        return { id: { required: true, type: () => String }, taxCategoryId: { required: true, type: () => String }, taxType: { required: true, type: () => String }, rateName: { required: true, type: () => String }, ratePercentage: { required: true, type: () => Number }, effectiveFrom: { required: true, type: () => Date } };
    }
}
exports.CreateTaxRateDto = CreateTaxRateDto;
//# sourceMappingURL=taxRate.dto.js.map