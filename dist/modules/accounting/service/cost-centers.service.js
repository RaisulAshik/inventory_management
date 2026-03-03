"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CostCentersService = void 0;
const tenant_1 = require("../../../entities/tenant");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const tenant_connection_manager_1 = require("../../../database/tenant-connection.manager");
let CostCentersService = class CostCentersService {
    tenantConnectionManager;
    constructor(tenantConnectionManager) {
        this.tenantConnectionManager = tenantConnectionManager;
    }
    async getRepo() {
        return this.tenantConnectionManager.getRepository(tenant_1.CostCenter);
    }
    async create(dto) {
        const repo = await this.getRepo();
        const existing = await repo.findOne({
            where: { costCenterCode: dto.costCenterCode },
        });
        if (existing)
            throw new common_1.ConflictException(`Cost center code ${dto.costCenterCode} already exists`);
        const costCenter = repo.create(dto);
        if (dto.parentId) {
            const parent = await repo.findOne({ where: { id: dto.parentId } });
            if (!parent)
                throw new common_1.NotFoundException(`Parent cost center ${dto.parentId} not found`);
            costCenter.level = parent.level + 1;
            costCenter.path = parent.path
                ? `${parent.path}/${costCenter.costCenterCode}`
                : `${parent.costCenterCode}/${costCenter.costCenterCode}`;
        }
        else {
            costCenter.level = 0;
            costCenter.path = costCenter.costCenterCode;
        }
        return repo.save(costCenter);
    }
    async findAll(query) {
        const repo = await this.getRepo();
        const { parentId, isActive, search, page = 1, limit = 50 } = query;
        const qb = repo.createQueryBuilder('cc');
        if (parentId)
            qb.andWhere('cc.parentId = :parentId', { parentId });
        if (isActive !== undefined)
            qb.andWhere('cc.isActive = :isActive', { isActive });
        if (search)
            qb.andWhere('(cc.costCenterCode LIKE :search OR cc.costCenterName LIKE :search)', { search: `%${search}%` });
        qb.orderBy('cc.costCenterCode', 'ASC')
            .skip((page - 1) * limit)
            .take(limit);
        const [data, total] = await qb.getManyAndCount();
        return { data, total, page, limit };
    }
    async findOne(id) {
        const repo = await this.getRepo();
        const cc = await repo.findOne({
            where: { id },
            relations: ['parent', 'children'],
        });
        if (!cc)
            throw new common_1.NotFoundException(`Cost center ${id} not found`);
        return cc;
    }
    async update(id, dto) {
        const repo = await this.getRepo();
        const cc = await this.findOne(id);
        if (dto.parentId && dto.parentId === id)
            throw new common_1.BadRequestException('Cost center cannot be its own parent');
        Object.assign(cc, dto);
        return repo.save(cc);
    }
    async remove(id) {
        const repo = await this.getRepo();
        const cc = await this.findOne(id);
        const hasChildren = await repo.count({ where: { parentId: id } });
        if (hasChildren > 0)
            throw new common_1.BadRequestException('Cannot delete cost center with child cost centers');
        await repo.remove(cc);
    }
    async getTree() {
        const repo = await this.getRepo();
        return repo.find({
            where: { parentId: (0, typeorm_1.IsNull)() },
            relations: ['children', 'children.children'],
            order: { costCenterCode: 'ASC' },
        });
    }
};
exports.CostCentersService = CostCentersService;
exports.CostCentersService = CostCentersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tenant_connection_manager_1.TenantConnectionManager])
], CostCentersService);
//# sourceMappingURL=cost-centers.service.js.map