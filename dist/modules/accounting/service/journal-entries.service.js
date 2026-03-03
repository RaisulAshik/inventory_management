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
exports.JournalEntriesService = void 0;
const common_1 = require("@nestjs/common");
const enums_1 = require("../../../common/enums");
const tenant_1 = require("../../../entities/tenant");
const journal_ledger_service_1 = require("./journal-ledger.service");
const tenant_connection_manager_1 = require("../../../database/tenant-connection.manager");
let JournalEntriesService = class JournalEntriesService {
    tenantConnectionManager;
    glService;
    constructor(tenantConnectionManager, glService) {
        this.tenantConnectionManager = tenantConnectionManager;
        this.glService = glService;
    }
    async getJeRepo() {
        return this.tenantConnectionManager.getRepository(tenant_1.JournalEntry);
    }
    async getLineRepo() {
        return this.tenantConnectionManager.getRepository(tenant_1.JournalEntryLine);
    }
    async getPeriodRepo() {
        return this.tenantConnectionManager.getRepository(tenant_1.FiscalPeriod);
    }
    async getAccountRepo() {
        return this.tenantConnectionManager.getRepository(tenant_1.ChartOfAccounts);
    }
    async create(dto, userId) {
        this.validateBalance(dto.lines);
        const periodRepo = await this.getPeriodRepo();
        const accountRepo = await this.getAccountRepo();
        const jeRepo = await this.getJeRepo();
        const lineRepo = await this.getLineRepo();
        const dataSource = await this.tenantConnectionManager.getDataSource();
        const period = await periodRepo.findOne({
            where: { id: dto.fiscalPeriodId },
        });
        if (!period)
            throw new common_1.NotFoundException('Fiscal period not found');
        if (period.status === enums_1.FiscalPeriodStatus.CLOSED)
            throw new common_1.BadRequestException('Cannot post to a closed fiscal period');
        for (const line of dto.lines) {
            const account = await accountRepo.findOne({
                where: { id: line.accountId },
            });
            if (!account)
                throw new common_1.NotFoundException(`Account ${line.accountId} not found`);
            if (account.isHeader)
                throw new common_1.BadRequestException(`Cannot post to header account ${account.accountCode}`);
        }
        const entryNumber = await this.generateEntryNumber();
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            let totalDebit = 0;
            let totalCredit = 0;
            const lines = dto.lines.map((line) => {
                const debit = Number(line.debitAmount) || 0;
                const credit = Number(line.creditAmount) || 0;
                const exchangeRate = Number(line.exchangeRate) || 1;
                totalDebit += debit;
                totalCredit += credit;
                return lineRepo.create({
                    ...line,
                    debitAmount: debit,
                    creditAmount: credit,
                    baseDebitAmount: debit * exchangeRate,
                    baseCreditAmount: credit * exchangeRate,
                    exchangeRate,
                    currency: line.currency || dto.currency || 'INR',
                });
            });
            const entry = jeRepo.create({
                entryNumber,
                entryDate: dto.entryDate,
                fiscalYearId: dto.fiscalYearId,
                fiscalPeriodId: dto.fiscalPeriodId,
                entryType: dto.entryType,
                referenceType: dto.referenceType,
                referenceId: dto.referenceId,
                referenceNumber: dto.referenceNumber,
                description: dto.description,
                totalDebit,
                totalCredit,
                currency: dto.currency || 'INR',
                exchangeRate: dto.exchangeRate || 1,
                status: enums_1.JournalEntryStatus.DRAFT,
                notes: dto.notes,
                createdBy: userId,
            });
            const savedEntry = await queryRunner.manager.save(tenant_1.JournalEntry, entry);
            for (const line of lines) {
                line.journalEntryId = savedEntry.id;
            }
            await queryRunner.manager.save(tenant_1.JournalEntryLine, lines);
            await queryRunner.commitTransaction();
            return this.findOne(savedEntry.id);
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async post(id, userId) {
        const periodRepo = await this.getPeriodRepo();
        const dataSource = await this.tenantConnectionManager.getDataSource();
        const entry = await this.findOne(id);
        if (entry.status !== enums_1.JournalEntryStatus.DRAFT)
            throw new common_1.BadRequestException('Only draft entries can be posted');
        const period = await periodRepo.findOne({
            where: { id: entry.fiscalPeriodId },
        });
        if (period?.status === enums_1.FiscalPeriodStatus.CLOSED)
            throw new common_1.BadRequestException('Cannot post to a closed fiscal period');
        const queryRunner = dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            for (const line of entry.lines) {
                await this.glService.postEntry({
                    accountId: line.accountId,
                    fiscalYearId: entry.fiscalYearId,
                    fiscalPeriodId: entry.fiscalPeriodId,
                    transactionDate: entry.entryDate,
                    journalEntryId: entry.id,
                    journalEntryLineId: line.id,
                    description: line.description || entry.description,
                    debitAmount: Number(line.debitAmount),
                    creditAmount: Number(line.creditAmount),
                    currency: line.currency,
                    exchangeRate: Number(line.exchangeRate),
                    baseDebitAmount: Number(line.baseDebitAmount),
                    baseCreditAmount: Number(line.baseCreditAmount),
                    costCenterId: line.costCenterId,
                    referenceType: entry.referenceType,
                    referenceId: entry.referenceId,
                    referenceNumber: entry.referenceNumber,
                    partyType: line.partyType,
                    partyId: line.partyId,
                }, queryRunner);
                const account = await queryRunner.manager.findOne(tenant_1.ChartOfAccounts, {
                    where: { id: line.accountId },
                });
                if (account) {
                    const netChange = account.normalBalance === enums_1.NormalBalance.DEBIT
                        ? Number(line.debitAmount) - Number(line.creditAmount)
                        : Number(line.creditAmount) - Number(line.debitAmount);
                    account.currentBalance = Number(account.currentBalance) + netChange;
                    await queryRunner.manager.save(tenant_1.ChartOfAccounts, account);
                }
            }
            entry.status = enums_1.JournalEntryStatus.POSTED;
            entry.postedBy = userId;
            entry.postedAt = new Date();
            await queryRunner.manager.save(tenant_1.JournalEntry, entry);
            await queryRunner.commitTransaction();
            return this.findOne(id);
        }
        catch (error) {
            await queryRunner.rollbackTransaction();
            throw error;
        }
        finally {
            await queryRunner.release();
        }
    }
    async reverse(id, dto, userId) {
        const periodRepo = await this.getPeriodRepo();
        const jeRepo = await this.getJeRepo();
        const original = await this.findOne(id);
        if (original.status !== enums_1.JournalEntryStatus.POSTED)
            throw new common_1.BadRequestException('Only posted entries can be reversed');
        if (original.reversedById)
            throw new common_1.BadRequestException('Entry has already been reversed');
        const reverseLines = original.lines.map((line) => ({
            lineNumber: line.lineNumber,
            accountId: line.accountId,
            costCenterId: line.costCenterId,
            description: `Reversal: ${line.description || ''}`,
            debitAmount: Number(line.creditAmount),
            creditAmount: Number(line.debitAmount),
            currency: line.currency,
            exchangeRate: Number(line.exchangeRate),
            partyType: line.partyType,
            partyId: line.partyId,
            taxCategoryId: line.taxCategoryId,
        }));
        const period = await periodRepo
            .createQueryBuilder('fp')
            .where('fp.startDate <= :date AND fp.endDate >= :date', {
            date: dto.reversalDate,
        })
            .getOne();
        if (!period)
            throw new common_1.BadRequestException('No fiscal period found for reversal date');
        const reversalEntry = await this.create({
            entryDate: dto.reversalDate,
            fiscalYearId: period.fiscalYearId,
            fiscalPeriodId: period.id,
            entryType: original.entryType,
            referenceType: 'REVERSAL',
            referenceId: original.id,
            referenceNumber: original.entryNumber,
            description: dto.description || `Reversal of ${original.entryNumber}`,
            currency: original.currency,
            exchangeRate: Number(original.exchangeRate),
            lines: reverseLines,
        }, userId);
        const posted = await this.post(reversalEntry.id, userId);
        original.reversedById = posted.id;
        original.status = enums_1.JournalEntryStatus.REVERSED;
        await jeRepo.save(original);
        return posted;
    }
    async findAll(query) {
        const jeRepo = await this.getJeRepo();
        const { entryType, status, fiscalYearId, fiscalPeriodId, startDate, endDate, accountId, isAutoGenerated, search, page = 1, limit = 20, } = query;
        const qb = jeRepo.createQueryBuilder('je');
        qb.leftJoinAndSelect('je.lines', 'lines');
        qb.leftJoinAndSelect('lines.account', 'account');
        if (entryType)
            qb.andWhere('je.entryType = :entryType', { entryType });
        if (status)
            qb.andWhere('je.status = :status', { status });
        if (fiscalYearId)
            qb.andWhere('je.fiscalYearId = :fiscalYearId', { fiscalYearId });
        if (fiscalPeriodId)
            qb.andWhere('je.fiscalPeriodId = :fiscalPeriodId', { fiscalPeriodId });
        if (startDate)
            qb.andWhere('je.entryDate >= :startDate', { startDate });
        if (endDate)
            qb.andWhere('je.entryDate <= :endDate', { endDate });
        if (accountId)
            qb.andWhere('lines.accountId = :accountId', { accountId });
        if (isAutoGenerated !== undefined)
            qb.andWhere('je.isAutoGenerated = :isAutoGenerated', { isAutoGenerated });
        if (search)
            qb.andWhere('(je.entryNumber LIKE :search OR je.description LIKE :search OR je.referenceNumber LIKE :search)', { search: `%${search}%` });
        qb.orderBy('je.entryDate', 'DESC')
            .addOrderBy('je.entryNumber', 'DESC')
            .skip((page - 1) * limit)
            .take(limit);
        const [data, total] = await qb.getManyAndCount();
        return { data, total, page, limit };
    }
    async findOne(id) {
        const jeRepo = await this.getJeRepo();
        const entry = await jeRepo.findOne({
            where: { id },
            relations: [
                'lines',
                'lines.account',
                'lines.costCenter',
                'fiscalYear',
                'fiscalPeriod',
            ],
        });
        if (!entry)
            throw new common_1.NotFoundException(`Journal entry ${id} not found`);
        return entry;
    }
    async update(id, dto) {
        const jeRepo = await this.getJeRepo();
        const lineRepo = await this.getLineRepo();
        const entry = await this.findOne(id);
        if (entry.status !== enums_1.JournalEntryStatus.DRAFT)
            throw new common_1.BadRequestException('Only draft entries can be updated');
        if (dto.lines) {
            this.validateBalance(dto.lines);
            await lineRepo.delete({ journalEntryId: id });
            let totalDebit = 0;
            let totalCredit = 0;
            const lines = dto.lines.map((line) => {
                const debit = Number(line.debitAmount) || 0;
                const credit = Number(line.creditAmount) || 0;
                totalDebit += debit;
                totalCredit += credit;
                return lineRepo.create({
                    ...line,
                    journalEntryId: id,
                    debitAmount: debit,
                    creditAmount: credit,
                    baseDebitAmount: debit * (Number(line.exchangeRate) || 1),
                    baseCreditAmount: credit * (Number(line.exchangeRate) || 1),
                    currency: line.currency || dto.currency || entry.currency,
                });
            });
            await lineRepo.save(lines);
            entry.totalDebit = totalDebit;
            entry.totalCredit = totalCredit;
        }
        if (dto.description)
            entry.description = dto.description;
        if (dto.entryDate)
            entry.entryDate = dto.entryDate;
        if (dto.notes)
            entry.notes = dto.notes;
        if (dto.referenceNumber)
            entry.referenceNumber = dto.referenceNumber;
        await jeRepo.save(entry);
        return this.findOne(id);
    }
    async remove(id) {
        const jeRepo = await this.getJeRepo();
        const lineRepo = await this.getLineRepo();
        const entry = await this.findOne(id);
        if (entry.status !== enums_1.JournalEntryStatus.DRAFT)
            throw new common_1.BadRequestException('Only draft entries can be deleted');
        await lineRepo.delete({ journalEntryId: id });
        await jeRepo.remove(entry);
    }
    validateBalance(lines) {
        if (!lines || lines.length < 2)
            throw new common_1.BadRequestException('Journal entry must have at least 2 lines');
        const totalDebit = lines.reduce((sum, l) => sum + (Number(l.debitAmount) || 0), 0);
        const totalCredit = lines.reduce((sum, l) => sum + (Number(l.creditAmount) || 0), 0);
        if (Math.abs(totalDebit - totalCredit) > 0.01) {
            throw new common_1.BadRequestException(`Entry is not balanced. Debit: ${totalDebit}, Credit: ${totalCredit}`);
        }
        for (const line of lines) {
            const debit = Number(line.debitAmount) || 0;
            const credit = Number(line.creditAmount) || 0;
            if (debit > 0 && credit > 0)
                throw new common_1.BadRequestException('A line cannot have both debit and credit amounts');
            if (debit === 0 && credit === 0)
                throw new common_1.BadRequestException('A line must have either a debit or credit amount');
        }
    }
    async generateEntryNumber() {
        const jeRepo = await this.getJeRepo();
        const year = new Date().getFullYear();
        const prefix = `JE-${year}-`;
        const last = await jeRepo
            .createQueryBuilder('je')
            .where('je.entryNumber LIKE :prefix', { prefix: `${prefix}%` })
            .orderBy('je.entryNumber', 'DESC')
            .getOne();
        if (last) {
            const lastNum = Number.parseInt(last.entryNumber.replace(prefix, ''), 10);
            return `${prefix}${String(lastNum + 1).padStart(6, '0')}`;
        }
        return `${prefix}000001`;
    }
};
exports.JournalEntriesService = JournalEntriesService;
exports.JournalEntriesService = JournalEntriesService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [tenant_connection_manager_1.TenantConnectionManager,
        journal_ledger_service_1.GeneralLedgerService])
], JournalEntriesService);
//# sourceMappingURL=journal-entries.service.js.map