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
exports.BankAccountsService = void 0;
const tenant_1 = require("../../../entities/tenant");
const common_1 = require("@nestjs/common");
const tenant_connection_manager_1 = require("../../../database/tenant-connection.manager");
let BankAccountsService = class BankAccountsService {
    tenantConnectionManager;
    constructor(tenantConnectionManager) {
        this.tenantConnectionManager = tenantConnectionManager;
    }
    async getRepo() {
        return this.tenantConnectionManager.getRepository(tenant_1.BankAccount);
    }
    async create(dto) {
        const repo = await this.getRepo();
        const existing = await repo.findOne({
            where: { accountCode: dto.accountCode },
        });
        if (existing)
            throw new common_1.ConflictException(`Bank account code ${dto.accountCode} already exists`);
        const account = repo.create({
            ...dto,
            currentBalance: dto.openingBalance || 0,
        });
        if (dto.isPrimary)
            await repo.update({}, { isPrimary: false });
        return repo.save(account);
    }
    async findAll(query) {
        const repo = await this.getRepo();
        const { accountType, isActive, bankName, search, page = 1, limit = 20, } = query;
        const qb = repo
            .createQueryBuilder('ba')
            .leftJoinAndSelect('ba.glAccount', 'glAccount');
        if (accountType)
            qb.andWhere('ba.accountType = :accountType', { accountType });
        if (isActive !== undefined)
            qb.andWhere('ba.isActive = :isActive', { isActive });
        if (bankName)
            qb.andWhere('ba.bankName LIKE :bankName', { bankName: `%${bankName}%` });
        if (search)
            qb.andWhere('(ba.accountCode LIKE :search OR ba.accountName LIKE :search OR ba.accountNumber LIKE :search)', { search: `%${search}%` });
        qb.orderBy('ba.accountName', 'ASC')
            .skip((page - 1) * limit)
            .take(limit);
        const [data, total] = await qb.getManyAndCount();
        return { data, total, page, limit };
    }
    async findOne(id) {
        const repo = await this.getRepo();
        const account = await repo.findOne({
            where: { id },
            relations: ['glAccount'],
        });
        if (!account)
            throw new common_1.NotFoundException(`Bank account ${id} not found`);
        return account;
    }
    async update(id, dto) {
        const repo = await this.getRepo();
        const account = await this.findOne(id);
        if (dto.isPrimary)
            await repo.update({}, { isPrimary: false });
        Object.assign(account, dto);
        return repo.save(account);
    }
    async updateBalance(id, amount, isDebit) {
        const repo = await this.getRepo();
        const account = await this.findOne(id);
        account.currentBalance =
            Number(account.currentBalance) + (isDebit ? amount : -amount);
        await repo.save(account);
    }
    async remove(id) {
        const repo = await this.getRepo();
        const account = await this.findOne(id);
        if (Number(account.currentBalance) !== 0)
            throw new common_1.BadRequestException('Cannot delete bank account with non-zero balance');
        await repo.remove(account);
    }
};
exports.BankAccountsService = BankAccountsService;
exports.BankAccountsService = BankAccountsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tenant_connection_manager_1.TenantConnectionManager])
], BankAccountsService);
//# sourceMappingURL=bank-accounts.service.js.map