import { Controller, Get, Query } from '@nestjs/common';
import { Permissions } from '@common/decorators/permissions.decorator';
import { FinancialReportQueryDto } from '../dto/financial-reports.dto';
import { FinancialReportsService } from '../service/financial-reports.service';

@Controller('accounting/reports')
export class FinancialReportsController {
  constructor(private readonly reportsService: FinancialReportsService) {}

  @Get()
  @Permissions('accounting.reports.read')
  generateReport(@Query() query: FinancialReportQueryDto) {
    return this.reportsService.generateReport(query);
  }

  @Get('balance-sheet')
  @Permissions('accounting.reports.read')
  balanceSheet(@Query() query: FinancialReportQueryDto) {
    return this.reportsService.balanceSheet(query);
  }

  @Get('income-statement')
  @Permissions('accounting.reports.read')
  incomeStatement(@Query() query: FinancialReportQueryDto) {
    return this.reportsService.incomeStatement(query);
  }

  @Get('cash-flow')
  @Permissions('accounting.reports.read')
  cashFlow(@Query() query: FinancialReportQueryDto) {
    return this.reportsService.cashFlowStatement(query);
  }

  @Get('bank-summary')
  @Permissions('accounting.reports.read')
  bankSummary(@Query() query: FinancialReportQueryDto) {
    return this.reportsService.bankSummary(query);
  }

  @Get('aged-receivables')
  @Permissions('accounting.reports.read')
  agedReceivables(@Query() query: FinancialReportQueryDto) {
    return this.reportsService.agedReceivables(query);
  }

  @Get('aged-payables')
  @Permissions('accounting.reports.read')
  agedPayables(@Query() query: FinancialReportQueryDto) {
    return this.reportsService.agedPayables(query);
  }

  @Get('trial-balance')
  @Permissions('accounting.reports.read')
  trialBalance(@Query() query: FinancialReportQueryDto) {
    return this.reportsService.trialBalance(query);
  }
}
