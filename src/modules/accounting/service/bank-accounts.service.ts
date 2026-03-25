import { BankAccount } from '@/entities/tenant';
import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import {
  CreateBankAccountDto,
  QueryBankAccountDto,
  UpdateBankAccountDto,
} from '../dto/bank-accounts.dto';
import { TenantConnectionManager } from '@database/tenant-connection.manager';

@Injectable()
export class BankAccountsService {
  constructor(
    private readonly tenantConnectionManager: TenantConnectionManager,
  ) {}

  private async getRepo(): Promise<Repository<BankAccount>> {
    return this.tenantConnectionManager.getRepository(BankAccount);
  }

  async create(dto: CreateBankAccountDto): Promise<BankAccount> {
    const repo = await this.getRepo();

    // Auto-generate accountCode if not provided: BANK-<BANKNAME>-<last4 of accountNumber>
    const accountCode =
      dto.accountCode ??
      `BANK-${(dto.bankName ?? 'XX').replace(/\s+/g, '').toUpperCase().slice(0, 6)}-${(dto.accountNumber ?? '').slice(-4)}`;

    const existing = await repo.findOne({ where: { accountCode } });
    if (existing)
      throw new ConflictException(
        `Bank account code ${accountCode} already exists`,
      );

    const account = repo.create({
      ...dto,
      accountCode,
      currentBalance: dto.openingBalance || 0,
    });
    if (dto.isPrimary) await repo.update({}, { isPrimary: false as any });
    return repo.save(account);
  }

  async findAll(query: QueryBankAccountDto) {
    const repo = await this.getRepo();
    const {
      accountType,
      isActive,
      bankName,
      search,
      page = 1,
      limit = 20,
    } = query;
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
      qb.andWhere(
        '(ba.accountCode LIKE :search OR ba.accountName LIKE :search OR ba.accountNumber LIKE :search)',
        { search: `%${search}%` },
      );
    qb.orderBy('ba.accountName', 'ASC')
      .skip((page - 1) * limit)
      .take(limit);
    const [data, total] = await qb.getManyAndCount();
    return { data, total, page, limit };
  }

  async findOne(id: string): Promise<BankAccount> {
    const repo = await this.getRepo();
    const account = await repo.findOne({
      where: { id },
      relations: ['glAccount'],
    });
    if (!account) throw new NotFoundException(`Bank account ${id} not found`);
    return account;
  }

  async update(id: string, dto: UpdateBankAccountDto): Promise<BankAccount> {
    const repo = await this.getRepo();
    const account = await this.findOne(id);
    if (dto.isPrimary) await repo.update({}, { isPrimary: false as any });
    Object.assign(account, dto);
    return repo.save(account);
  }

  async updateBalance(
    id: string,
    amount: number,
    isDebit: boolean,
  ): Promise<void> {
    const repo = await this.getRepo();
    const account = await this.findOne(id);
    account.currentBalance =
      Number(account.currentBalance) + (isDebit ? amount : -amount);
    await repo.save(account);
  }

  async remove(id: string): Promise<void> {
    const repo = await this.getRepo();
    const account = await this.findOne(id);
    if (Number(account.currentBalance) !== 0)
      throw new BadRequestException(
        'Cannot delete bank account with non-zero balance',
      );
    await repo.remove(account);
  }
}
