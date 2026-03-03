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
import {
  CreateBankAccountDto,
  QueryBankAccountDto,
  UpdateBankAccountDto,
} from '../dto/bank-accounts.dto';
import { BankAccountsService } from '../service/bank-accounts.service';

@Controller('api/v1/accounting/bank-accounts')
export class BankAccountsController {
  constructor(private readonly bankAccountsService: BankAccountsService) {}

  @Post()
  @Permissions('accounting.bank-accounts.create')
  create(@Body() dto: CreateBankAccountDto) {
    return this.bankAccountsService.create(dto);
  }

  @Get()
  @Permissions('accounting.bank-accounts.read')
  findAll(@Query() query: QueryBankAccountDto) {
    return this.bankAccountsService.findAll(query);
  }

  @Get(':id')
  @Permissions('accounting.bank-accounts.read')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.bankAccountsService.findOne(id);
  }

  @Put(':id')
  @Permissions('accounting.bank-accounts.update')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateBankAccountDto,
  ) {
    return this.bankAccountsService.update(id, dto);
  }

  @Delete(':id')
  @Permissions('accounting.bank-accounts.delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.bankAccountsService.remove(id);
  }
}
