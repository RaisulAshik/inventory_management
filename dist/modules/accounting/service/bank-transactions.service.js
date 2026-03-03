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
exports.BankTransactionsService = void 0;
const tenant_1 = require("../../../entities/tenant");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const tenant_connection_manager_1 = require("../../../database/tenant-connection.manager");
let BankTransactionsService = class BankTransactionsService {
    tenantConnectionManager;
    constructor(tenantConnectionManager) {
        this.tenantConnectionManager = tenantConnectionManager;
    }
    DEBIT_TYPES = [
        tenant_1.BankTransactionType.DEPOSIT,
        tenant_1.BankTransactionType.TRANSFER_IN,
        tenant_1.BankTransactionType.INTEREST_CREDIT,
        tenant_1.BankTransactionType.CHEQUE_DEPOSIT,
        tenant_1.BankTransactionType.LOAN_DISBURSEMENT,
    ];
    async getTxnRepo() {
        return this.tenantConnectionManager.getRepository(tenant_1.BankTransaction);
    }
    async getBankRepo() {
        return this.tenantConnectionManager.getRepository(tenant_1.BankAccount);
    }
    async create(dto, userId) {
        const bankRepo = await this.getBankRepo();
        const txnRepo = await this.getTxnRepo();
        const dataSource = await this.tenantConnectionManager.getDataSource();
        const bankAccount = await bankRepo.findOne({
            where: { id: dto.bankAccountId },
        });
        if (!bankAccount)
            throw new common_1.NotFoundException('Bank account not found');
        const transactionNumber = await this.generateTransactionNumber();
        const isDebit = this.DEBIT_TYPES.includes(dto.transactionType);
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            const amount = Number(dto.amount);
            bankAccount.currentBalance =
                Number(bankAccount.currentBalance) + (isDebit ? amount : -amount);
            const txn = txnRepo.create({
                ...dto,
                transactionNumber,
                status: tenant_1.BankTransactionStatus.PENDING,
                runningBalance: bankAccount.currentBalance,
                currency: dto.currency || bankAccount.currency,
                createdBy: userId,
            });
            await queryRunner.manager.save(tenant_1.BankAccount, bankAccount);
            const saved = await queryRunner.manager.save(tenant_1.BankTransaction, txn);
            await queryRunner.commitTransaction();
            return saved;
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async findAll(query) {
        const repo = await this.getTxnRepo();
        const { bankAccountId, transactionType, status, startDate, endDate, minAmount, maxAmount, search, page = 1, limit = 20, } = query;
        const qb = repo
            .createQueryBuilder('bt')
            .leftJoinAndSelect('bt.bankAccount', 'bankAccount');
        if (bankAccountId)
            qb.andWhere('bt.bankAccountId = :bankAccountId', { bankAccountId });
        if (transactionType)
            qb.andWhere('bt.transactionType = :transactionType', { transactionType });
        if (status)
            qb.andWhere('bt.status = :status', { status });
        if (startDate)
            qb.andWhere('bt.transactionDate >= :startDate', { startDate });
        if (endDate)
            qb.andWhere('bt.transactionDate <= :endDate', { endDate });
        if (minAmount)
            qb.andWhere('bt.amount >= :minAmount', { minAmount });
        if (maxAmount)
            qb.andWhere('bt.amount <= :maxAmount', { maxAmount });
        if (search)
            qb.andWhere('(bt.transactionNumber LIKE :search OR bt.description LIKE :search OR bt.referenceNumber LIKE :search OR bt.payeePayerName LIKE :search)', { search: `%${search}%` });
        qb.orderBy('bt.transactionDate', 'DESC')
            .addOrderBy('bt.createdAt', 'DESC')
            .skip((page - 1) * limit)
            .take(limit);
        const [data, total] = await qb.getManyAndCount();
        return { data, total, page, limit };
    }
    async findOne(id) {
        const repo = await this.getTxnRepo();
        const txn = await repo.findOne({
            where: { id },
            relations: ['bankAccount', 'journalEntry'],
        });
        if (!txn)
            throw new common_1.NotFoundException(`Bank transaction ${id} not found`);
        return txn;
    }
    async update(id, dto) {
        const repo = await this.getTxnRepo();
        const txn = await this.findOne(id);
        if (txn.isReconciled)
            throw new common_1.BadRequestException('Cannot update a reconciled transaction');
        Object.assign(txn, dto);
        return repo.save(txn);
    }
    async clearTransaction(id) {
        const repo = await this.getTxnRepo();
        const txn = await this.findOne(id);
        if (txn.status !== tenant_1.BankTransactionStatus.PENDING)
            throw new common_1.BadRequestException('Only pending transactions can be cleared');
        txn.status = tenant_1.BankTransactionStatus.CLEARED;
        return repo.save(txn);
    }
    async bounceTransaction(id) {
        const txnRepo = await this.getTxnRepo();
        const bankRepo = await this.getBankRepo();
        const txn = await this.findOne(id);
        if (txn.status !== tenant_1.BankTransactionStatus.PENDING &&
            txn.status !== tenant_1.BankTransactionStatus.CLEARED) {
            throw new common_1.BadRequestException('Transaction cannot be bounced');
        }
        const bankAccount = await bankRepo.findOne({
            where: { id: txn.bankAccountId },
        });
        if (bankAccount) {
            const isDebit = this.DEBIT_TYPES.includes(txn.transactionType);
            const amount = Number(txn.amount);
            bankAccount.currentBalance =
                Number(bankAccount.currentBalance) + (isDebit ? -amount : amount);
            await bankRepo.save(bankAccount);
        }
        txn.status = tenant_1.BankTransactionStatus.BOUNCED;
        return txnRepo.save(txn);
    }
    async reconcileTransactions(dto) {
        const repo = await this.getTxnRepo();
        await repo.update({ id: (0, typeorm_1.In)(dto.transactionIds) }, {
            isReconciled: true,
            reconciledDate: new Date(),
            reconciliationId: dto.reconciliationId,
            status: tenant_1.BankTransactionStatus.RECONCILED,
        });
    }
    async getUnreconciledTransactions(bankAccountId) {
        const repo = await this.getTxnRepo();
        return repo.find({
            where: {
                bankAccountId,
                isReconciled: false,
                status: (0, typeorm_1.In)([
                    tenant_1.BankTransactionStatus.PENDING,
                    tenant_1.BankTransactionStatus.CLEARED,
                ]),
            },
            order: { transactionDate: 'ASC' },
        });
    }
    async remove(id) {
        const txnRepo = await this.getTxnRepo();
        const bankRepo = await this.getBankRepo();
        const txn = await this.findOne(id);
        if (txn.isReconciled)
            throw new common_1.BadRequestException('Cannot delete a reconciled transaction');
        if (txn.status !== tenant_1.BankTransactionStatus.PENDING)
            throw new common_1.BadRequestException('Only pending transactions can be deleted');
        const bankAccount = await bankRepo.findOne({
            where: { id: txn.bankAccountId },
        });
        if (bankAccount) {
            const isDebit = this.DEBIT_TYPES.includes(txn.transactionType);
            const amount = Number(txn.amount);
            bankAccount.currentBalance =
                Number(bankAccount.currentBalance) + (isDebit ? -amount : amount);
            await bankRepo.save(bankAccount);
        }
        await txnRepo.remove(txn);
    }
    async generateTransactionNumber() {
        const repo = await this.getTxnRepo();
        const year = new Date().getFullYear();
        const prefix = `BT-${year}-`;
        const last = await repo
            .createQueryBuilder('bt')
            .where('bt.transactionNumber LIKE :prefix', { prefix: `${prefix}%` })
            .orderBy('bt.transactionNumber', 'DESC')
            .getOne();
        if (last) {
            const lastNum = Number.parseInt(last.transactionNumber.replace(prefix, ''), 10);
            return `${prefix}${String(lastNum + 1).padStart(6, '0')}`;
        }
        return `${prefix}000001`;
    }
};
exports.BankTransactionsService = BankTransactionsService;
exports.BankTransactionsService = BankTransactionsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tenant_connection_manager_1.TenantConnectionManager])
], BankTransactionsService);
//# sourceMappingURL=bank-transactions.service.js.map