import { Injectable, Logger } from '@nestjs/common';
import { QueryRunner } from 'typeorm';
import { TenantConnectionManager } from '@database/tenant-connection.manager';
import {
  JournalEntry,
  JournalEntryLine,
  FiscalPeriod,
  FiscalYear,
  ChartOfAccounts,
  TenantSetting,
  SalesOrder,
} from '@/entities/tenant';
import {
  JournalEntryType,
  JournalEntryStatus,
  NormalBalance,
  FiscalPeriodStatus,
} from '@common/enums';
import { PartyType } from '@/entities/tenant/accounting/journal-entry-line.entity';
import { GeneralLedgerService } from './journal-ledger.service';

interface JELine {
  accountId: string;
  debit: number;
  credit: number;
  description: string;
  customerId?: string;
}

interface PostJEParams {
  date: Date;
  type: JournalEntryType;
  referenceType: string;
  referenceId: string;
  referenceNumber: string;
  description: string;
  currency: string;
  customerId?: string;
  lines: JELine[];
}

/**
 * Automatically posts accounting journal entries when key sales events occur.
 *
 * Requires these tenant settings (category: ACCOUNTING) to be configured:
 *   acc.default_ar_account        — Accounts Receivable account ID
 *   acc.default_revenue_account   — Sales Revenue account ID
 *   acc.default_cogs_account      — Cost of Goods Sold account ID
 *   acc.default_inventory_account — Inventory asset account ID
 *   acc.default_bank_account      — Default bank/cash account ID
 *   acc.default_vat_account       — VAT Payable account ID (optional)
 *
 * All methods are safe to call without awaiting — failures are logged and
 * never bubble up to break the sales workflow.
 */
@Injectable()
export class AccountingIntegrationService {
  private readonly logger = new Logger(AccountingIntegrationService.name);

  constructor(
    private readonly tenantConnectionManager: TenantConnectionManager,
    private readonly glService: GeneralLedgerService,
  ) {}

  // ── Private helpers ───────────────────────────────────────────────────

  private async getSetting(key: string): Promise<string | null> {
    const ds = await this.tenantConnectionManager.getDataSource();
    const setting = await ds
      .getRepository(TenantSetting)
      .findOne({ where: { settingKey: key } });
    return setting?.settingValue ?? null;
  }

  private async findOpenPeriod(date: Date): Promise<FiscalPeriod | null> {
    const ds = await this.tenantConnectionManager.getDataSource();
    const dateStr = date.toISOString().split('T')[0];
    return ds
      .getRepository(FiscalPeriod)
      .createQueryBuilder('fp')
      .where('fp.startDate <= :d AND fp.endDate >= :d', { d: dateStr })
      .andWhere('fp.status != :closed', { closed: FiscalPeriodStatus.CLOSED })
      .getOne();
  }

  private async generateEntryNumber(): Promise<string> {
    const ds = await this.tenantConnectionManager.getDataSource();
    const year = new Date().getFullYear();
    const prefix = `JE-${year}-`;
    const last = await ds
      .getRepository(JournalEntry)
      .createQueryBuilder('je')
      .where('je.entryNumber LIKE :p', { p: `${prefix}%` })
      .orderBy('je.entryNumber', 'DESC')
      .getOne();
    const n = last
      ? parseInt(last.entryNumber.replace(prefix, ''), 10) + 1
      : 1;
    return `${prefix}${String(n).padStart(6, '0')}`;
  }

  private async updateAccountBalance(
    qr: QueryRunner,
    accountId: string,
    debit: number,
    credit: number,
  ): Promise<void> {
    const account = await qr.manager.findOne(ChartOfAccounts, {
      where: { id: accountId },
    });
    if (!account) return;
    const netChange =
      account.normalBalance === NormalBalance.DEBIT
        ? debit - credit
        : credit - debit;
    account.currentBalance = Number(account.currentBalance) + netChange;
    await qr.manager.save(ChartOfAccounts, account);
  }

  /**
   * Load the 5 required default account IDs from tenant settings.
   * Returns null and logs a warning when any required key is missing.
   */
  async getAccountConfig(): Promise<{
    ar: string;
    revenue: string;
    cogs: string;
    inventory: string;
    bank: string;
    vat: string | null;
  } | null> {
    const [ar, revenue, cogs, inventory, bank, vat] = await Promise.all([
      this.getSetting('acc.default_ar_account'),
      this.getSetting('acc.default_revenue_account'),
      this.getSetting('acc.default_cogs_account'),
      this.getSetting('acc.default_inventory_account'),
      this.getSetting('acc.default_bank_account'),
      this.getSetting('acc.default_vat_account'),
    ]);

    if (!ar || !revenue || !cogs || !inventory || !bank) {
      this.logger.warn(
        'Auto-accounting skipped — configure these tenant settings: ' +
          'acc.default_ar_account, acc.default_revenue_account, ' +
          'acc.default_cogs_account, acc.default_inventory_account, ' +
          'acc.default_bank_account',
      );
      return null;
    }
    return { ar, revenue, cogs, inventory, bank, vat };
  }

  // ── Core posting engine ───────────────────────────────────────────────

  private async postEntry(params: PostJEParams): Promise<void> {
    const ds = await this.tenantConnectionManager.getDataSource();

    const period = await this.findOpenPeriod(params.date);
    if (!period) {
      this.logger.warn(
        `Auto-accounting skipped for ${params.referenceNumber}: ` +
          `no open fiscal period covers ${params.date.toISOString().split('T')[0]}.`,
      );
      return;
    }

    const fy = await ds
      .getRepository(FiscalYear)
      .findOne({ where: { id: period.fiscalYearId } });
    if (!fy) return;

    const entryNumber = await this.generateEntryNumber();
    const totalDebit = params.lines.reduce((s, l) => s + l.debit, 0);
    const totalCredit = params.lines.reduce((s, l) => s + l.credit, 0);

    const qr = ds.createQueryRunner();
    await qr.connect();
    await qr.startTransaction();

    try {
      // Save JournalEntry
      const entry = qr.manager.create(JournalEntry, {
        entryNumber,
        entryDate: params.date,
        fiscalYearId: fy.id,
        fiscalPeriodId: period.id,
        entryType: params.type,
        referenceType: params.referenceType,
        referenceId: params.referenceId,
        referenceNumber: params.referenceNumber,
        description: params.description,
        totalDebit,
        totalCredit,
        currency: params.currency || 'USD',
        exchangeRate: 1,
        status: JournalEntryStatus.POSTED,
        isAutoGenerated: true,
        postedAt: new Date(),
      });
      const savedEntry = await qr.manager.save(JournalEntry, entry);

      // Save lines + GL entries + update account balances
      for (let i = 0; i < params.lines.length; i++) {
        const l = params.lines[i];

        const line = qr.manager.create(JournalEntryLine, {
          journalEntryId: savedEntry.id,
          lineNumber: i + 1,
          accountId: l.accountId,
          description: l.description,
          debitAmount: l.debit,
          creditAmount: l.credit,
          baseDebitAmount: l.debit,
          baseCreditAmount: l.credit,
          currency: params.currency || 'USD',
          exchangeRate: 1,
          partyType: params.customerId ? PartyType.CUSTOMER : undefined,
          partyId: params.customerId,
        });
        const savedLine = await qr.manager.save(JournalEntryLine, line);

        await this.glService.postEntry(
          {
            accountId: l.accountId,
            fiscalYearId: fy.id,
            fiscalPeriodId: period.id,
            transactionDate: params.date,
            journalEntryId: savedEntry.id,
            journalEntryLineId: savedLine.id,
            description: l.description,
            debitAmount: l.debit,
            creditAmount: l.credit,
            baseDebitAmount: l.debit,
            baseCreditAmount: l.credit,
            currency: params.currency || 'USD',
            exchangeRate: 1,
            referenceType: params.referenceType,
            referenceId: params.referenceId,
            referenceNumber: params.referenceNumber,
            partyType: params.customerId ? 'CUSTOMER' : undefined,
            partyId: params.customerId,
          },
          qr,
        );

        await this.updateAccountBalance(qr, l.accountId, l.debit, l.credit);
      }

      await qr.commitTransaction();
      this.logger.log(
        `Auto-posted ${entryNumber} (${params.type}) for ${params.referenceNumber}`,
      );
    } catch (err) {
      await qr.rollbackTransaction();
      throw err;
    } finally {
      await qr.release();
    }
  }

  // ── Public integration points ─────────────────────────────────────────

  /**
   * Call after deliver() commits.
   * DR Accounts Receivable  /  CR Sales Revenue  +  CR VAT Payable
   */
  async postSaleDelivery(order: SalesOrder): Promise<void> {
    try {
      const cfg = await this.getAccountConfig();
      if (!cfg) return;

      const totalAmount = Number(order.totalAmount);
      const taxAmount = Number(order.taxAmount) || 0;
      const netRevenue = totalAmount - taxAmount;

      const lines: JELine[] = [
        {
          accountId: cfg.ar,
          debit: totalAmount,
          credit: 0,
          description: `Receivable – ${order.orderNumber}`,
        },
      ];

      if (taxAmount > 0 && cfg.vat) {
        lines.push({
          accountId: cfg.revenue,
          debit: 0,
          credit: netRevenue,
          description: `Sales revenue – ${order.orderNumber}`,
        });
        lines.push({
          accountId: cfg.vat,
          debit: 0,
          credit: taxAmount,
          description: `VAT collected – ${order.orderNumber}`,
        });
      } else {
        // No VAT account — credit full amount to revenue
        lines.push({
          accountId: cfg.revenue,
          debit: 0,
          credit: totalAmount,
          description: `Sales revenue – ${order.orderNumber}`,
        });
        if (taxAmount > 0) {
          this.logger.warn(
            `acc.default_vat_account not set; tax of ${taxAmount} folded into revenue for ${order.orderNumber}`,
          );
        }
      }

      await this.postEntry({
        date: order.deliveredAt || new Date(),
        type: JournalEntryType.SALES,
        referenceType: 'SALES_ORDER',
        referenceId: order.id,
        referenceNumber: order.orderNumber,
        description: `Sale – ${order.billingName || order.customerId} – ${order.orderNumber}`,
        currency: order.currency || 'USD',
        customerId: order.customerId,
        lines,
      });
    } catch (err) {
      this.logger.error(
        `Failed to post sale delivery JE for ${order.orderNumber}: ${(err as Error).message}`,
      );
    }
  }

  /**
   * Call after ship() commits.
   * DR Cost of Goods Sold  /  CR Inventory
   */
  async postCOGS(order: SalesOrder): Promise<void> {
    try {
      const cfg = await this.getAccountConfig();
      if (!cfg) return;

      const cogsAmount = (order.items ?? []).reduce(
        (sum, item) =>
          sum +
          Number(item.costPrice || 0) * Number(item.quantityOrdered || 0),
        0,
      );

      if (cogsAmount <= 0) {
        this.logger.warn(
          `COGS skipped for ${order.orderNumber}: cogsAmount=${cogsAmount}. ` +
            `Items: ${JSON.stringify((order.items ?? []).map((i) => ({ costPrice: i.costPrice, qty: i.quantityOrdered })))}`,
        );
        return;
      }

      await this.postEntry({
        date: order.shippedAt || new Date(),
        type: JournalEntryType.SALES,
        referenceType: 'SALES_ORDER',
        referenceId: order.id,
        referenceNumber: order.orderNumber,
        description: `COGS – ${order.orderNumber}`,
        currency: order.currency || 'USD',
        lines: [
          {
            accountId: cfg.cogs,
            debit: cogsAmount,
            credit: 0,
            description: `Cost of goods sold – ${order.orderNumber}`,
          },
          {
            accountId: cfg.inventory,
            debit: 0,
            credit: cogsAmount,
            description: `Inventory reduction – ${order.orderNumber}`,
          },
        ],
      });
    } catch (err) {
      this.logger.error(
        `Failed to post COGS JE for ${order.orderNumber}: ${(err as Error).message}`,
      );
    }
  }

  /**
   * Call after addPayment() commits.
   * DR Bank/Cash  /  CR Accounts Receivable
   */
  async postPaymentCollection(
    order: SalesOrder,
    paymentAmount: number,
    paymentDate: Date,
  ): Promise<void> {
    try {
      const cfg = await this.getAccountConfig();
      if (!cfg) return;

      await this.postEntry({
        date: paymentDate,
        type: JournalEntryType.RECEIPT,
        referenceType: 'SALES_ORDER',
        referenceId: order.id,
        referenceNumber: order.orderNumber,
        description: `Payment received – ${order.orderNumber}`,
        currency: order.currency || 'USD',
        customerId: order.customerId,
        lines: [
          {
            accountId: cfg.bank,
            debit: paymentAmount,
            credit: 0,
            description: `Payment received – ${order.orderNumber}`,
          },
          {
            accountId: cfg.ar,
            debit: 0,
            credit: paymentAmount,
            description: `AR cleared – ${order.orderNumber}`,
          },
        ],
      });
    } catch (err) {
      this.logger.error(
        `Failed to post payment JE for ${order.orderNumber}: ${(err as Error).message}`,
      );
    }
  }
}
