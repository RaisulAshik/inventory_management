"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateTenantDto = void 0;
const openapi = require("@nestjs/swagger");
const swagger_1 = require("@nestjs/swagger");
const create_tenant_dto_1 = require("./create-tenant.dto");
class UpdateTenantDto extends (0, swagger_1.PartialType)((0, swagger_1.OmitType)(create_tenant_dto_1.CreateTenantDto, [
    'adminPassword',
    'adminEmail',
    'adminFirstName',
    'adminLastName',
    'planId',
])) {
    static _OPENAPI_METADATA_FACTORY() {
        return {};
    }
}
exports.UpdateTenantDto = UpdateTenantDto;
//# sourceMappingURL=update-tenant.dto.js.map