import { Controller, Get, Param, Query, ParseUUIDPipe } from '@nestjs/common';
import { Permissions } from '@common/decorators/permissions.decorator';
import { QueryGeneralLedgerDto } from '../dto/general-ledger.dto';
import { GeneralLedgerService } from '../service/journal-ledger.service';

@Controller('accounting/general-ledger')
export class GeneralLedgerController {
  constructor(private readonly glService: GeneralLedgerService) {}

  @Get()
  @Permissions('accounting.general-ledger.read')
  findAll(@Query() query: QueryGeneralLedgerDto) {
    return this.glService.findAll(query);
  }

  @Get('account/:accountId')
  @Permissions('accounting.general-ledger.read')
  getAccountLedger(
    @Param('accountId', ParseUUIDPipe) accountId: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    return this.glService.getAccountLedger(accountId, startDate, endDate);
  }

  @Get('trial-balance/:fiscalYearId')
  @Permissions('accounting.general-ledger.read')
  getTrialBalance(
    @Param('fiscalYearId', ParseUUIDPipe) fiscalYearId: string,
    @Query('asOfDate') asOfDate?: string,
  ) {
    return this.glService.getTrialBalance(fiscalYearId, asOfDate);
  }
}
