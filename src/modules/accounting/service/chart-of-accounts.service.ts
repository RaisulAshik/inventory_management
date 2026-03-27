import { ChartOfAccounts } from '@/entities/tenant';
import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { Repository, IsNull } from 'typeorm';
import {
  AccountingRole,
  CreateChartOfAccountDto,
  QueryChartOfAccountDto,
  UpdateChartOfAccountDto,
} from '../dto/chat-of-accounts.dto';
import { AccountType, NormalBalance } from '@/common/enums';
import { TenantConnectionManager } from '@database/tenant-connection.manager';
import { SettingsService } from '@modules/settings/settings.service';
import { SettingCategory } from '@entities/tenant/user/tenant-setting.entity';

/** Maps AccountingRole enum → tenant setting key */
const ROLE_TO_SETTING: Record<AccountingRole, string> = {
  [AccountingRole.AR]: 'acc.default_ar_account',
  [AccountingRole.REVENUE]: 'acc.default_revenue_account',
  [AccountingRole.COGS]: 'acc.default_cogs_account',
  [AccountingRole.INVENTORY]: 'acc.default_inventory_account',
  [AccountingRole.BANK]: 'acc.default_bank_account',
  [AccountingRole.VAT]: 'acc.default_vat_account',
};

/** Accounting rule: every account type has a canonical normal balance */
const NORMAL_BALANCE_MAP: Record<AccountType, NormalBalance> = {
  [AccountType.ASSET]: NormalBalance.DEBIT,
  [AccountType.EXPENSE]: NormalBalance.DEBIT,
  [AccountType.LIABILITY]: NormalBalance.CREDIT,
  [AccountType.EQUITY]: NormalBalance.CREDIT,
  [AccountType.REVENUE]: NormalBalance.CREDIT,
};

@Injectable()
export class ChartOfAccountsService {
  constructor(
    private readonly tenantConnectionManager: TenantConnectionManager,
    private readonly settingsService: SettingsService,
  ) {}

  /**
   * Determine which AccountingRole this account implicitly represents
   * based on its boolean flags (only used when defaultFor is not set).
   */
  private detectImplicitRole(
    dto: Partial<CreateChartOfAccountDto>,
  ): AccountingRole | null {
    if (dto.isReceivable) return AccountingRole.AR;
    if (dto.isBankAccount || dto.isCashAccount) return AccountingRole.BANK;
    return null;
  }

  /**
   * Save acc.default_* setting for the given role → accountId.
   * Never throws — a failed settings write must not fail the CoA save.
   */
  private async saveDefaultSetting(
    role: AccountingRole,
    accountId: string,
    userId = 'system',
  ): Promise<void> {
    try {
      const key = ROLE_TO_SETTING[role];
      await this.settingsService.upsert(
        key,
        { value: accountId, category: SettingCategory.ACCOUNTING },
        userId,
      );
    } catch {
      // silently ignore — settings failure must not break account creation
    }
  }

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

    const { defaultFor, ...accountData } = dto;
    const account = repo.create({
      ...accountData,
      normalBalance: dto.normalBalance ?? NORMAL_BALANCE_MAP[dto.accountType],
    });
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
    const saved = await repo.save(account);

    // Auto-update tenant setting
    const role = defaultFor ?? this.detectImplicitRole(dto);
    if (role) {
      await this.saveDefaultSetting(role, saved.id, userId);
    }

    return saved;
  }

  async findAll(query: QueryChartOfAccountDto) {
    const repo = await this.getRepo();
    const {
      accountType,
      parentId,
      isActive,
      isHeader,
      isBankAccount,
      rootOnly,
      search,
      page = 1,
      limit = 50,
    } = query;
    const qb = repo.createQueryBuilder('coa');
    if (accountType)
      qb.andWhere('coa.accountType = :accountType', { accountType });
    if (rootOnly) qb.andWhere('coa.parentId IS NULL');
    else if (parentId) qb.andWhere('coa.parentId = :parentId', { parentId });
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
    userId?: string,
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
    const { defaultFor, ...updateData } = dto;
    Object.assign(account, updateData);
    const saved = await repo.save(account);

    // Auto-update tenant setting if role explicitly set or flags changed
    const role = defaultFor ?? this.detectImplicitRole(dto);
    if (role) {
      await this.saveDefaultSetting(role, saved.id, userId);
    }

    return saved;
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
