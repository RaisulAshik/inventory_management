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
  CreateChartOfAccountDto,
  QueryChartOfAccountDto,
  UpdateChartOfAccountDto,
} from '../dto/chat-of-accounts.dto';
import { ChartOfAccountsService } from '../service/chart-of-accounts.service';
import { JwtPayload } from '@/common/interfaces';

@Controller('accounting/chart-of-accounts')
export class ChartOfAccountsController {
  constructor(private readonly accountsService: ChartOfAccountsService) {}

  @Post()
  @Permissions('accounting.chart-of-accounts.create')
  create(
    @Body() dto: CreateChartOfAccountDto,
    @CurrentUser() currentUser: JwtPayload,
  ) {
    return this.accountsService.create(dto, currentUser.sub);
  }

  @Get()
  @Permissions('accounting.chart-of-accounts.read')
  findAll(@Query() query: QueryChartOfAccountDto) {
    return this.accountsService.findAll(query);
  }

  @Get('tree')
  @Permissions('accounting.chart-of-accounts.read')
  getTree() {
    return this.accountsService.getTree();
  }

  @Get('by-code/:code')
  @Permissions('accounting.chart-of-accounts.read')
  findByCode(@Param('code') code: string) {
    return this.accountsService.findByCode(code);
  }

  @Get(':id')
  @Permissions('accounting.chart-of-accounts.read')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.accountsService.findOne(id);
  }

  @Put(':id')
  @Permissions('accounting.chart-of-accounts.update')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateChartOfAccountDto,
  ) {
    return this.accountsService.update(id, dto);
  }

  @Delete(':id')
  @Permissions('accounting.chart-of-accounts.delete')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.accountsService.remove(id);
  }
}
