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
  Expense,
} from '@/entities/tenant';
import { GoodsReceivedNote } from '@entities/tenant/purchase/goods-received-note.entity';
import { StockAdjustment } from '@entities/tenant/warehouse/stock-adjustment.entity';
import { SalesReturn } from '@entities/tenant/eCommerce/sales-return.entity';
import { ReturnItemCondition } from '@entities/tenant/eCommerce/sales-return-item.entity';
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

  private async postEntry(params: PostJEParams): Promise<string | null> {
    const ds = await this.tenantConnectionManager.getDataSource();

    const period = await this.findOpenPeriod(params.date);
    if (!period) {
      this.logger.warn(
        `Auto-accounting skipped for ${params.referenceNumber}: ` +
          `no open fiscal period covers ${params.date.toISOString().split('T')[0]}.`,
      );
      return null;
    }

    const fy = await ds
      .getRepository(FiscalYear)
      .findOne({ where: { id: period.fiscalYearId } });
    if (!fy) return null;

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
      return savedEntry.id;
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
   * Call after an expense is saved.
   * DR Expense Account  /  CR Paid-From Account (Bank/Cash/Payable)
   * Returns the journal entry ID, or null if posting was skipped.
   */
  async postExpense(expense: Expense): Promise<string | null> {
    try {
      const period = await this.findOpenPeriod(new Date(expense.expenseDate));
      if (!period) {
        this.logger.warn(
          `Expense JE skipped for ${expense.expenseNumber}: no open fiscal period covers ${expense.expenseDate}.`,
        );
        return null;
      }

      const totalAmount = Number(expense.totalAmount);

      return await this.postEntry({
        date: new Date(expense.expenseDate),
        type: JournalEntryType.MANUAL,
        referenceType: 'EXPENSE',
        referenceId: expense.id,
        referenceNumber: expense.expenseNumber,
        description: expense.description,
        currency: 'INR',
        lines: [
          {
            accountId: expense.expenseAccountId,
            debit: totalAmount,
            credit: 0,
            description: expense.description,
          },
          {
            accountId: expense.paidFromAccountId,
            debit: 0,
            credit: totalAmount,
            description: `Paid – ${expense.expenseNumber}`,
          },
        ],
      });
    } catch (err) {
      this.logger.error(
        `Failed to post expense JE for ${expense.expenseNumber}: ${(err as Error).message}`,
      );
      return null;
    }
  }

  /**
   * Call after GRN approve() commits.
   * DR Inventory  /  CR Accounts Payable
   * Requires: acc.default_inventory_account, acc.default_ap_account
   */
  async postGRNApproval(grn: GoodsReceivedNote): Promise<void> {
    try {
      const [inventory, ap] = await Promise.all([
        this.getSetting('acc.default_inventory_account'),
        this.getSetting('acc.default_ap_account'),
      ]);

      if (!inventory || !ap) {
        this.logger.warn(
          `GRN auto-accounting skipped for ${grn.grnNumber}: ` +
            `configure acc.default_inventory_account and acc.default_ap_account`,
        );
        return;
      }

      const amount = Number(grn.totalValue);
      if (amount <= 0) return;

      await this.postEntry({
        date: grn.receiptDate ? new Date(grn.receiptDate) : new Date(),
        type: JournalEntryType.PURCHASE,
        referenceType: 'GRN',
        referenceId: grn.id,
        referenceNumber: grn.grnNumber,
        description: `Goods received – ${grn.grnNumber}`,
        currency: grn.currency || 'USD',
        lines: [
          {
            accountId: inventory,
            debit: amount,
            credit: 0,
            description: `Inventory received – ${grn.grnNumber}`,
          },
          {
            accountId: ap,
            debit: 0,
            credit: amount,
            description: `Payable to supplier – ${grn.grnNumber}`,
          },
        ],
      });
    } catch (err) {
      this.logger.error(
        `Failed to post GRN JE for ${grn.grnNumber}: ${(err as Error).message}`,
      );
    }
  }

  /**
   * Call after StockAdjustment approve() commits.
   * Positive adjustment:  DR Inventory  /  CR Inventory Adjustment (Gain)
   * Negative adjustment:  DR Inventory Adjustment (Loss)  /  CR Inventory
   * Requires: acc.default_inventory_account, acc.default_inventory_adjustment_account
   */
  async postInventoryAdjustment(adjustment: StockAdjustment): Promise<void> {
    try {
      const [inventory, adjAccount] = await Promise.all([
        this.getSetting('acc.default_inventory_account'),
        this.getSetting('acc.default_inventory_adjustment_account'),
      ]);

      if (!inventory || !adjAccount) {
        this.logger.warn(
          `Adjustment auto-accounting skipped for ${adjustment.adjustmentNumber}: ` +
            `configure acc.default_inventory_account and acc.default_inventory_adjustment_account`,
        );
        return;
      }

      const amount = Math.abs(Number(adjustment.totalValueImpact));
      if (amount <= 0) return;

      const isPositive = Number(adjustment.totalValueImpact) >= 0;

      await this.postEntry({
        date: adjustment.approvedAt ? new Date(adjustment.approvedAt) : new Date(),
        type: JournalEntryType.ADJUSTMENT,
        referenceType: 'STOCK_ADJUSTMENT',
        referenceId: adjustment.id,
        referenceNumber: adjustment.adjustmentNumber,
        description: `Stock adjustment – ${adjustment.adjustmentNumber}`,
        currency: 'USD',
        lines: [
          {
            accountId: isPositive ? inventory : adjAccount,
            debit: amount,
            credit: 0,
            description: isPositive
              ? `Inventory increase – ${adjustment.adjustmentNumber}`
              : `Inventory loss – ${adjustment.adjustmentNumber}`,
          },
          {
            accountId: isPositive ? adjAccount : inventory,
            debit: 0,
            credit: amount,
            description: isPositive
              ? `Adjustment gain – ${adjustment.adjustmentNumber}`
              : `Inventory decrease – ${adjustment.adjustmentNumber}`,
          },
        ],
      });
    } catch (err) {
      this.logger.error(
        `Failed to post adjustment JE for ${adjustment.adjustmentNumber}: ${(err as Error).message}`,
      );
    }
  }

  /**
   * Call after SalesReturn receive() commits.
   * 1. DR Sales Returns  /  CR Accounts Receivable  (full return amount)
   * 2. DR Inventory  /  CR COGS  (restocked items only)
   * Requires: acc.default_sales_returns_account, acc.default_ar_account,
   *           acc.default_inventory_account, acc.default_cogs_account
   */
  async postSalesReturn(salesReturn: SalesReturn): Promise<void> {
    try {
      const [returnsAccount, ar, inventory, cogs] = await Promise.all([
        this.getSetting('acc.default_sales_returns_account'),
        this.getSetting('acc.default_ar_account'),
        this.getSetting('acc.default_inventory_account'),
        this.getSetting('acc.default_cogs_account'),
      ]);

      if (!returnsAccount || !ar) {
        this.logger.warn(
          `Sales return auto-accounting skipped for ${salesReturn.returnNumber}: ` +
            `configure acc.default_sales_returns_account and acc.default_ar_account`,
        );
        return;
      }

      const returnAmount = Number(salesReturn.totalAmount);
      if (returnAmount > 0) {
        await this.postEntry({
          date: salesReturn.receivedDate ? new Date(salesReturn.receivedDate) : new Date(),
          type: JournalEntryType.SALES,
          referenceType: 'SALES_RETURN',
          referenceId: salesReturn.id,
          referenceNumber: salesReturn.returnNumber,
          description: `Sales return – ${salesReturn.returnNumber}`,
          currency: salesReturn.currency || 'USD',
          lines: [
            {
              accountId: returnsAccount,
              debit: returnAmount,
              credit: 0,
              description: `Return reversal – ${salesReturn.returnNumber}`,
            },
            {
              accountId: ar,
              debit: 0,
              credit: returnAmount,
              description: `AR reduced – ${salesReturn.returnNumber}`,
            },
          ],
        });
      }

      // Reverse COGS for restocked items
      if (inventory && cogs) {
        const restockedItems = (salesReturn.items ?? []).filter(
          (i) =>
            i.isRestocked &&
            (i.condition === ReturnItemCondition.GOOD ||
              i.condition === ReturnItemCondition.LIKE_NEW),
        );

        const restockValue = restockedItems.reduce(
          (sum, i) => sum + Number(i.unitPrice) * Number(i.quantityReturned),
          0,
        );

        if (restockValue > 0) {
          await this.postEntry({
            date: salesReturn.receivedDate ? new Date(salesReturn.receivedDate) : new Date(),
            type: JournalEntryType.SALES,
            referenceType: 'SALES_RETURN',
            referenceId: salesReturn.id,
            referenceNumber: `${salesReturn.returnNumber}-COGS`,
            description: `COGS reversal – ${salesReturn.returnNumber}`,
            currency: salesReturn.currency || 'USD',
            lines: [
              {
                accountId: inventory,
                debit: restockValue,
                credit: 0,
                description: `Inventory restocked – ${salesReturn.returnNumber}`,
              },
              {
                accountId: cogs,
                debit: 0,
                credit: restockValue,
                description: `COGS reversed – ${salesReturn.returnNumber}`,
              },
            ],
          });
        }
      }
    } catch (err) {
      this.logger.error(
        `Failed to post sales return JE for ${salesReturn.returnNumber}: ${(err as Error).message}`,
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
