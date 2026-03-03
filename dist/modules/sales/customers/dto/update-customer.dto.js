"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCustomerDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const create_customer_dto_1 = require("./create-customer.dto");
class UpdateCustomerDto extends (0, swagger_1.PartialType)((0, swagger_1.OmitType)(create_customer_dto_1.CreateCustomerDto, ['addresses', 'password'])) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateCustomerDto = UpdateCustomerDto;
//# sourceMappingURL=update-customer.dto.js.map