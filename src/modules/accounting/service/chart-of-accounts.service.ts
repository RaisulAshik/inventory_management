import { ChartOfAccounts } from '@/entities/tenant';
import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { Repository, IsNull } from 'typeorm';
import {
  CreateChartOfAccountDto,
  QueryChartOfAccountDto,
  UpdateChartOfAccountDto,
} from '../dto/chat-of-accounts.dto';
import { NormalBalance } from '@/common/enums';
import { TenantConnectionManager } from '@database/tenant-connection.manager';

@Injectable()
export class ChartOfAccountsService {
  constructor(
    private readonly tenantConnectionManager: TenantConnectionManager,
  ) {}

  private async getRepo(): Promise<Repository<ChartOfAccounts>> {
    return this.tenantConnectionManager.getRepository(ChartOfAccounts);
  }

  async create(
    dto: CreateChartOfAccountDto,
    userId?: string,
  ): Promise<ChartOfAccounts> {
    const repo = await this.getRepo();
    const existing = await repo.findOne({
      where: { accountCode: dto.accountCode },
    });
    if (existing)
      throw new ConflictException(
        `Account code ${dto.accountCode} already exists`,
      );

    const account = repo.create(dto);
    if (dto.parentId) {
      const parent = await repo.findOne({ where: { id: dto.parentId } });
      if (!parent)
        throw new NotFoundException(`Parent account ${dto.parentId} not found`);
      account.level = parent.level + 1;
      account.path = parent.path
        ? `${parent.path}/${account.accountCode}`
        : `${parent.accountCode}/${account.accountCode}`;
    } else {
      account.level = 0;
      account.path = account.accountCode;
    }
    return repo.save(account);
  }

  async findAll(query: QueryChartOfAccountDto) {
    const repo = await this.getRepo();
    const {
      accountType,
      parentId,
      isActive,
      isHeader,
      isBankAccount,
      search,
      page = 1,
      limit = 50,
    } = query;
    const qb = repo.createQueryBuilder('coa');
    if (accountType)
      qb.andWhere('coa.accountType = :accountType', { accountType });
    if (parentId) qb.andWhere('coa.parentId = :parentId', { parentId });
    if (parentId === null) qb.andWhere('coa.parentId IS NULL');
    if (isActive !== undefined)
      qb.andWhere('coa.isActive = :isActive', { isActive });
    if (isHeader !== undefined)
      qb.andWhere('coa.isHeader = :isHeader', { isHeader });
    if (isBankAccount !== undefined)
      qb.andWhere('coa.isBankAccount = :isBankAccount', { isBankAccount });
    if (search)
      qb.andWhere(
        '(coa.accountCode LIKE :search OR coa.accountName LIKE :search)',
        { search: `%${search}%` },
      );
    qb.orderBy('coa.accountCode', 'ASC')
      .skip((page - 1) * limit)
      .take(limit);
    const [data, total] = await qb.getManyAndCount();
    return { data, total, page, limit };
  }

  async findOne(id: string): Promise<ChartOfAccounts> {
    const repo = await this.getRepo();
    const account = await repo.findOne({
      where: { id },
      relations: ['parent', 'children'],
    });
    if (!account) throw new NotFoundException(`Account ${id} not found`);
    return account;
  }

  async findByCode(code: string): Promise<ChartOfAccounts> {
    const repo = await this.getRepo();
    const account = await repo.findOne({ where: { accountCode: code } });
    if (!account)
      throw new NotFoundException(`Account with code ${code} not found`);
    return account;
  }

  async update(
    id: string,
    dto: UpdateChartOfAccountDto,
  ): Promise<ChartOfAccounts> {
    const repo = await this.getRepo();
    const account = await this.findOne(id);
    if (dto.accountCode && dto.accountCode !== account.accountCode) {
      const existing = await repo.findOne({
        where: { accountCode: dto.accountCode },
      });
      if (existing)
        throw new ConflictException(`Code ${dto.accountCode} exists`);
    }
    if (dto.parentId !== undefined && dto.parentId !== account.parentId) {
      if (dto.parentId === id)
        throw new BadRequestException('Self-parenting not allowed');
      if (dto.parentId === null) {
        account.level = 0;
        account.path = dto.accountCode || account.accountCode;
      } else {
        const parent = await repo.findOne({ where: { id: dto.parentId } });
        if (!parent)
          throw new NotFoundException(`Parent ${dto.parentId} not found`);
        await this.validateNoCircularReference(id, dto.parentId);
        account.level = parent.level + 1;
        account.path = `${parent.path}/${dto.accountCode || account.accountCode}`;
      }
    }
    Object.assign(account, dto);
    return repo.save(account);
  }

  private async validateNoCircularReference(
    currentId: string,
    newParentId: string,
  ) {
    const repo = await this.getRepo();
    let parent = await repo.findOne({ where: { id: newParentId } });
    while (parent) {
      if (parent.id === currentId)
        throw new BadRequestException('Circular reference');
      if (!parent.parentId) break;
      parent = await repo.findOne({ where: { id: parent.parentId } });
    }
  }

  async remove(id: string): Promise<void> {
    const repo = await this.getRepo();
    const account = await this.findOne(id);
    if (account.isSystem)
      throw new BadRequestException('Cannot delete system account');
    const hasChildren = await repo.count({ where: { parentId: id } });
    if (hasChildren > 0)
      throw new BadRequestException(
        'Cannot delete account with child accounts',
      );
    if (account.currentBalance !== 0)
      throw new BadRequestException(
        'Cannot delete account with non-zero balance',
      );
    await repo.remove(account);
  }

  async getTree(): Promise<ChartOfAccounts[]> {
    const repo = await this.getRepo();
    return repo.find({
      where: { parentId: IsNull() },
      relations: [
        'children',
        'children.children',
        'children.children.children',
      ],
      order: { accountCode: 'ASC' },
    });
  }

  async updateBalance(
    accountId: string,
    debitAmount: number,
    creditAmount: number,
  ): Promise<void> {
    const repo = await this.getRepo();
    const account = await this.findOne(accountId);
    const netChange =
      account.normalBalance === NormalBalance.DEBIT
        ? debitAmount - creditAmount
        : creditAmount - debitAmount;
    account.currentBalance = Number(account.currentBalance) + netChange;
    await repo.save(account);
  }
}
