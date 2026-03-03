import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { Permissions } from '@common/decorators/permissions.decorator';
import { CurrentUser } from '@common/decorators/current-user.decorator';
import {
  CreateBankTransactionDto,
  QueryBankTransactionDto,
  UpdateBankTransactionDto,
} from '../dto/bank-transactions.dto';
import { BankTransactionsService } from '../service/bank-transactions.service';
import { JwtPayload } from '@/common/interfaces';

@Controller('api/v1/accounting/bank-transactions')
export class BankTransactionsController {
  constructor(private readonly bankTxnService: BankTransactionsService) {}

  @Post()
  @Permissions('accounting.bank-transactions.create')
  create(
    @Body() dto: CreateBankTransactionDto,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    return this.bankTxnService.create(dto, currentUser.sub);
  }

  @Get()
  @Permissions('accounting.bank-transactions.read')
  findAll(@Query() query: QueryBankTransactionDto) {
    return this.bankTxnService.findAll(query);
  }

  @Get('unreconciled/:bankAccountId')
  @Permissions('accounting.bank-transactions.read')
  getUnreconciled(
    @Param('bankAccountId', ParseUUIDPipe) bankAccountId: string,
  ) {
    return this.bankTxnService.getUnreconciledTransactions(bankAccountId);
  }

  @Get(':id')
  @Permissions('accounting.bank-transactions.read')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.bankTxnService.findOne(id);
  }

  @Put(':id')
  @Permissions('accounting.bank-transactions.update')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateBankTransactionDto,
  ) {
    return this.bankTxnService.update(id, dto);
  }

  @Post(':id/clear')
  @Permissions('accounting.bank-transactions.update')
  clear(@Param('id', ParseUUIDPipe) id: string) {
    return this.bankTxnService.clearTransaction(id);
  }

  @Post(':id/bounce')
  @Permissions('accounting.bank-transactions.update')
  bounce(@Param('id', ParseUUIDPipe) id: string) {
    return this.bankTxnService.bounceTransaction(id);
  }

  @Delete(':id')
  @Permissions('accounting.bank-transactions.delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.bankTxnService.remove(id);
  }
}
