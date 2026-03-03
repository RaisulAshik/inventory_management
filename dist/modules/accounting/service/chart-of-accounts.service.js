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
exports.ChartOfAccountsService = void 0;
const tenant_1 = require("../../../entities/tenant");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const enums_1 = require("../../../common/enums");
const tenant_connection_manager_1 = require("../../../database/tenant-connection.manager");
let ChartOfAccountsService = class ChartOfAccountsService {
    tenantConnectionManager;
    constructor(tenantConnectionManager) {
        this.tenantConnectionManager = tenantConnectionManager;
    }
    async getRepo() {
        return this.tenantConnectionManager.getRepository(tenant_1.ChartOfAccounts);
    }
    async create(dto, userId) {
        const repo = await this.getRepo();
        const existing = await repo.findOne({
            where: { accountCode: dto.accountCode },
        });
        if (existing)
            throw new common_1.ConflictException(`Account code ${dto.accountCode} already exists`);
        const account = repo.create(dto);
        if (dto.parentId) {
            const parent = await repo.findOne({ where: { id: dto.parentId } });
            if (!parent)
                throw new common_1.NotFoundException(`Parent account ${dto.parentId} not found`);
            account.level = parent.level + 1;
            account.path = parent.path
                ? `${parent.path}/${account.accountCode}`
                : `${parent.accountCode}/${account.accountCode}`;
        }
        else {
            account.level = 0;
            account.path = account.accountCode;
        }
        return repo.save(account);
    }
    async findAll(query) {
        const repo = await this.getRepo();
        const { accountType, parentId, isActive, isHeader, isBankAccount, search, page = 1, limit = 50, } = query;
        const qb = repo.createQueryBuilder('coa');
        if (accountType)
            qb.andWhere('coa.accountType = :accountType', { accountType });
        if (parentId)
            qb.andWhere('coa.parentId = :parentId', { parentId });
        if (parentId === null)
            qb.andWhere('coa.parentId IS NULL');
        if (isActive !== undefined)
            qb.andWhere('coa.isActive = :isActive', { isActive });
        if (isHeader !== undefined)
            qb.andWhere('coa.isHeader = :isHeader', { isHeader });
        if (isBankAccount !== undefined)
            qb.andWhere('coa.isBankAccount = :isBankAccount', { isBankAccount });
        if (search)
            qb.andWhere('(coa.accountCode LIKE :search OR coa.accountName LIKE :search)', { search: `%${search}%` });
        qb.orderBy('coa.accountCode', 'ASC')
            .skip((page - 1) * limit)
            .take(limit);
        const [data, total] = await qb.getManyAndCount();
        return { data, total, page, limit };
    }
    async findOne(id) {
        const repo = await this.getRepo();
        const account = await repo.findOne({
            where: { id },
            relations: ['parent', 'children'],
        });
        if (!account)
            throw new common_1.NotFoundException(`Account ${id} not found`);
        return account;
    }
    async findByCode(code) {
        const repo = await this.getRepo();
        const account = await repo.findOne({ where: { accountCode: code } });
        if (!account)
            throw new common_1.NotFoundException(`Account with code ${code} not found`);
        return account;
    }
    async update(id, dto) {
        const repo = await this.getRepo();
        const account = await this.findOne(id);
        if (dto.accountCode && dto.accountCode !== account.accountCode) {
            const existing = await repo.findOne({
                where: { accountCode: dto.accountCode },
            });
            if (existing)
                throw new common_1.ConflictException(`Code ${dto.accountCode} exists`);
        }
        if (dto.parentId !== undefined && dto.parentId !== account.parentId) {
            if (dto.parentId === id)
                throw new common_1.BadRequestException('Self-parenting not allowed');
            if (dto.parentId === null) {
                account.level = 0;
                account.path = dto.accountCode || account.accountCode;
            }
            else {
                const parent = await repo.findOne({ where: { id: dto.parentId } });
                if (!parent)
                    throw new common_1.NotFoundException(`Parent ${dto.parentId} not found`);
                await this.validateNoCircularReference(id, dto.parentId);
                account.level = parent.level + 1;
                account.path = `${parent.path}/${dto.accountCode || account.accountCode}`;
            }
        }
        Object.assign(account, dto);
        return repo.save(account);
    }
    async validateNoCircularReference(currentId, newParentId) {
        const repo = await this.getRepo();
        let parent = await repo.findOne({ where: { id: newParentId } });
        while (parent) {
            if (parent.id === currentId)
                throw new common_1.BadRequestException('Circular reference');
            if (!parent.parentId)
                break;
            parent = await repo.findOne({ where: { id: parent.parentId } });
        }
    }
    async remove(id) {
        const repo = await this.getRepo();
        const account = await this.findOne(id);
        if (account.isSystem)
            throw new common_1.BadRequestException('Cannot delete system account');
        const hasChildren = await repo.count({ where: { parentId: id } });
        if (hasChildren > 0)
            throw new common_1.BadRequestException('Cannot delete account with child accounts');
        if (account.currentBalance !== 0)
            throw new common_1.BadRequestException('Cannot delete account with non-zero balance');
        await repo.remove(account);
    }
    async getTree() {
        const repo = await this.getRepo();
        return repo.find({
            where: { parentId: (0, typeorm_1.IsNull)() },
            relations: [
                'children',
                'children.children',
                'children.children.children',
            ],
            order: { accountCode: 'ASC' },
        });
    }
    async updateBalance(accountId, debitAmount, creditAmount) {
        const repo = await this.getRepo();
        const account = await this.findOne(accountId);
        const netChange = account.normalBalance === enums_1.NormalBalance.DEBIT
            ? debitAmount - creditAmount
            : creditAmount - debitAmount;
        account.currentBalance = Number(account.currentBalance) + netChange;
        await repo.save(account);
    }
};
exports.ChartOfAccountsService = ChartOfAccountsService;
exports.ChartOfAccountsService = ChartOfAccountsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tenant_connection_manager_1.TenantConnectionManager])
], ChartOfAccountsService);
//# sourceMappingURL=chart-of-accounts.service.js.map